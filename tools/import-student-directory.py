#!/usr/bin/env python3
"""Import student email/year mappings from an XLSX file into Firestore.

This script intentionally avoids committing private student data to the repo.
It reads the spreadsheet locally and writes documents to:

  studentDirectory/{lowercase-email}

Authentication uses the existing Firebase CLI login stored on this machine.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zipfile


FIREBASE_CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com"
FIREBASE_CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi"
TOKEN_URL = "https://oauth2.googleapis.com/token"
FIRESTORE_COMMIT_URL = (
    "https://firestore.googleapis.com/v1/projects/{project}/databases/(default)/documents:commit"
)
CONFIGSTORE_PATH = "~/.config/configstore/firebase-tools.json"
CAFILE_CANDIDATES = (
    "/opt/homebrew/etc/ca-certificates/cert.pem",
    "/usr/local/etc/openssl@3/cert.pem",
    "/usr/local/etc/openssl/cert.pem",
)
NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def get_ssl_context() -> ssl.SSLContext:
    cafile = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
    if cafile and os.path.exists(cafile):
        return ssl.create_default_context(cafile=cafile)

    for candidate in CAFILE_CANDIDATES:
        if os.path.exists(candidate):
            return ssl.create_default_context(cafile=candidate)

    return ssl.create_default_context()


def clean_email(value: object) -> str:
    return str(value or "").strip().lower()


def clean_year_level(value: object) -> str:
    text = str(value or "").strip().lower()
    match = re.search(r"(7|8|9|10|11|12)", text)
    return f"year{match.group(1)}" if match else ""


def column_number(cell_ref: str) -> int:
    match = re.match(r"([A-Z]+)", cell_ref)
    if not match:
        return 1
    number = 0
    for char in match.group(1):
        number = number * 26 + ord(char) - 64
    return number


def read_xlsx_rows(path: str) -> list[list[str]]:
    with zipfile.ZipFile(path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in root.findall("a:si", NS):
                shared_strings.append(
                    "".join(
                        text.text or ""
                        for text in item.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                    )
                )

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        relmap = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}
        first_sheet = workbook.find("a:sheets/a:sheet", NS)
        if first_sheet is None:
            raise ValueError("Workbook has no worksheets.")

        rel_id = first_sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
        target = relmap[rel_id]
        sheet_path = "xl/" + target.lstrip("/") if not target.startswith("xl/") else target
        sheet = ET.fromstring(archive.read(sheet_path))

        rows: list[list[str]] = []
        for row in sheet.findall(".//a:sheetData/a:row", NS):
            cells: dict[int, str] = {}
            max_column = 0
            for cell in row.findall("a:c", NS):
                cell_ref = cell.attrib.get("r", "A1")
                column = column_number(cell_ref)
                max_column = max(max_column, column)
                cell_type = cell.attrib.get("t")
                value_node = cell.find("a:v", NS)
                value = ""

                if value_node is not None:
                    raw_value = value_node.text or ""
                    if cell_type == "s" and raw_value.isdigit():
                        index = int(raw_value)
                        value = shared_strings[index] if index < len(shared_strings) else raw_value
                    else:
                        value = raw_value

                inline_string = cell.find("a:is", NS)
                if inline_string is not None:
                    value = "".join(
                        text.text or ""
                        for text in inline_string.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                    )

                cells[column] = value

            if cells:
                rows.append([cells.get(index, "") for index in range(1, max_column + 1)])

        return rows


def extract_students(path: str) -> tuple[list[dict[str, str]], list[str]]:
    rows = read_xlsx_rows(path)
    if not rows:
        raise ValueError("Spreadsheet is empty.")

    headers = [str(header).strip().lower() for header in rows[0]]
    try:
        email_index = headers.index("email")
    except ValueError as exc:
        raise ValueError("Could not find an Email column.") from exc

    year_index = -1
    for candidate in ("year", "year level", "yearlevel"):
      if candidate in headers:
        year_index = headers.index(candidate)
        break
    if year_index < 0:
        raise ValueError("Could not find a Year column.")

    students_by_email: dict[str, dict[str, str]] = {}
    warnings: list[str] = []
    for row_number, row in enumerate(rows[1:], start=2):
        email = clean_email(row[email_index] if email_index < len(row) else "")
        year_level = clean_year_level(row[year_index] if year_index < len(row) else "")
        if not email and not year_level:
            continue
        if "@" not in email:
            warnings.append(f"Row {row_number}: skipped invalid email {email!r}.")
            continue
        if not year_level:
            warnings.append(f"Row {row_number}: skipped {email}; invalid year.")
            continue
        if email in students_by_email and students_by_email[email]["yearLevel"] != year_level:
            warnings.append(
                f"Row {row_number}: {email} appeared more than once; using latest year {year_level}."
            )
        students_by_email[email] = {"email": email, "yearLevel": year_level}

    return sorted(students_by_email.values(), key=lambda student: student["email"]), warnings


def read_firebase_tokens() -> dict[str, object]:
    path = os.path.expanduser(CONFIGSTORE_PATH)
    with open(path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    tokens = data.get("tokens")
    if not isinstance(tokens, dict):
        raise ValueError("Firebase CLI is not logged in. Run `firebase login` first.")
    return tokens


def refresh_access_token(refresh_token: str) -> str:
    payload = urllib.parse.urlencode(
        {
            "client_id": FIREBASE_CLIENT_ID,
            "client_secret": FIREBASE_CLIENT_SECRET,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        TOKEN_URL,
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30, context=get_ssl_context()) as response:
        data = json.loads(response.read().decode("utf-8"))
    access_token = data.get("access_token")
    if not access_token:
        raise ValueError("Could not refresh Firebase access token.")
    return access_token


def get_access_token() -> str:
    tokens = read_firebase_tokens()
    access_token = str(tokens.get("access_token") or "")
    expires_at = int(tokens.get("expires_at") or 0)
    if access_token and expires_at > int(time.time() * 1000) + 60_000:
        return access_token

    refresh_token = str(tokens.get("refresh_token") or "")
    if not refresh_token:
        raise ValueError("Firebase CLI token expired and no refresh token was found. Run `firebase login`.")
    return refresh_access_token(refresh_token)


def firestore_value(value: str) -> dict[str, str]:
    return {"stringValue": value}


def timestamp_now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")


def make_write(project: str, student: dict[str, str], source: str, now: str) -> dict[str, object]:
    document_name = (
        f"projects/{project}/databases/(default)/documents/studentDirectory/{student['email']}"
    )
    return {
        "update": {
            "name": document_name,
            "fields": {
                "email": firestore_value(student["email"]),
                "yearLevel": firestore_value(student["yearLevel"]),
                "source": firestore_value(source),
                "updatedAt": {"timestampValue": now},
                "importedAt": {"timestampValue": now},
            },
        }
    }


def post_commit(project: str, writes: list[dict[str, object]], access_token: str) -> None:
    body = json.dumps({"writes": writes}).encode("utf-8")
    request = urllib.request.Request(
        FIRESTORE_COMMIT_URL.format(project=project),
        data=body,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=60, context=get_ssl_context()) as response:
            response.read()
    except urllib.error.HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Firestore commit failed: {error.code} {details}") from error


def import_students(project: str, spreadsheet: str, dry_run: bool) -> int:
    students, warnings = extract_students(spreadsheet)
    for warning in warnings:
        print(f"Warning: {warning}")

    if not students:
        raise ValueError("No valid student rows found.")

    print(f"Prepared {len(students)} student directory entries from {spreadsheet}.")
    preview = ", ".join(f"{student['email']}={student['yearLevel']}" for student in students[:5])
    print(f"Preview: {preview}")

    if dry_run:
        print("Dry run only; no Firestore documents were written.")
        return len(students)

    access_token = get_access_token()
    now = timestamp_now()
    source = os.path.basename(spreadsheet)
    writes = [make_write(project, student, source, now) for student in students]

    batch_size = 450
    for start in range(0, len(writes), batch_size):
        batch = writes[start:start + batch_size]
        post_commit(project, batch, access_token)
        print(f"Uploaded {min(start + len(batch), len(writes))}/{len(writes)} entries.")

    return len(students)


def main() -> int:
    parser = argparse.ArgumentParser(description="Import student year levels into Firestore.")
    parser.add_argument("spreadsheet", help="Path to the Student Emails.xlsx file.")
    parser.add_argument("--project", default="bayside-maths-challenge", help="Firebase project ID.")
    parser.add_argument("--dry-run", action="store_true", help="Parse and preview without uploading.")
    args = parser.parse_args()

    try:
        import_students(args.project, args.spreadsheet, args.dry_run)
    except Exception as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
