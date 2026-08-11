# Connect the shared Firebase leaderboard

GitHub Pages hosts the website. Firebase Cloud Firestore stores and live-updates
the topic-area leaderboards for everyone. You can use the same Google account you
use to sign in to GitHub.

## 1. Create a Firebase project

1. Open [Firebase Console](https://console.firebase.google.com/) and select
   **Create a project**.
2. Name it something like `bayside-maths-challenge`.
3. Google Analytics is optional and can be disabled for this project.

## 2. Register the website

1. From **Project overview**, select the Web icon (`</>`).
2. Enter an app nickname such as `Bayside Maths Challenge Website`.
3. Do not enable Firebase Hosting. GitHub Pages is already the host.
4. Select **Register app**.
5. Firebase displays a `firebaseConfig` object. The current project config has
   already been copied into [`firebase-config.js`](firebase-config.js).
6. The school Google domains are already set in [`firebase-config.js`](firebase-config.js):
   `baysidecc.vic.edu.au` accounts are teachers. Student year levels and score
   access come from the Firestore `studentDirectory` collection. If the teacher
   domain ever changes, use only the part after the `@` symbol.
   For example:

   ```js
   export const studentEmailDomain = "bcc.vic.edu.au";
   export const teacherEmailDomain = "baysidecc.vic.edu.au";
   export const allowedEmailDomains = [studentEmailDomain, teacherEmailDomain];
   ```

It is safe for `firebase-config.js` to be public. Access is controlled by Firebase
Authentication and Firestore Security Rules, not by hiding these identifiers.

## 3. Enable Google sign-in

1. In Firebase Console, open **Build → Authentication**.
2. Select **Get started**, then open **Sign-in method**.
3. Enable **Google** and save.
4. Open **Authentication → Settings → Authorized domains**.
5. Add `YOUR-GITHUB-USERNAME.github.io`.

## 4. Create the database

1. Open **Build → Firestore Database**.
2. Select **Create database**.
3. Choose **Production mode**.
4. Select a database location near your students.

## 5. Publish the security rules

1. In **Firestore Database**, open the **Rules** tab.
2. [`firestore.rules`](firestore.rules) is already set to lock student scores to
   imported `studentDirectory` entries and teacher scores to
   `baysidecc.vic.edu.au` accounts.
3. Replace the existing Firebase rules with the contents of
   [`firestore.rules`](firestore.rules).
4. Select **Publish**.

These rules let signed-in users read only the topic-area leaderboards they are
allowed to see. Students must have their email in `studentDirectory` before they
can submit scores. Teachers must use `@baysidecc.vic.edu.au` Google accounts.
Score values are limited, and existing score entries can only keep the same
score or move higher.

Student leaderboard names come from the user's Google account. Teacher accounts
can customise their leaderboard name in Settings. Students can have one score
document per topic area per assigned year level, using document IDs such as
`{uid}_year7`; older `{uid}` student score documents remain valid so existing
scores keep showing. Teacher accounts keep one score document per topic area.
Students can play any number of attempts. The leaderboard keeps their highest
score for each topic area in their assigned year level. Topic score documents can
also store `bestBronzeStreak`, the player's longest streak of days earning at
least Bronze in a topic-area game.

The site is high-school only: `year7`, `year8`, `year9`, `year10`, `year11`,
and `year12`. Students can submit scores for topic areas at their assigned year
level and lower. Topic areas can include extra skills at higher year levels; for
example, a `year10` student can practise topic skills such as `y7-integers`,
`y8-ratios`, `y9-gradients`, and `y10-quadratics`, but not Year 11 or Year 12
skills.

Teacher accounts are automatic for `@baysidecc.vic.edu.au` Google accounts.
Teachers open **Settings**, choose the year levels they teach, and the website
creates or updates their `teachers/{uid}` profile automatically with:

- `uid`: the teacher's Firebase UID
- `name`: the teacher's chosen leaderboard name
- `email`: the teacher's school email address in lowercase
- `approved`: `true`
- `yearLevels`: an array, for example `["year7", "year8"]`
- `createdAt`: a Firestore timestamp
- `approvedAt`: a Firestore timestamp
- `updatedAt`: a Firestore timestamp

The allowed `yearLevels` values are `year7`, `year8`, `year9`, `year10`,
`year11`, and `year12`.

Year-level topic leaderboards include teacher filters:

- **No teachers:** the top 10 student scores only.
- **Year level teachers:** for students, the signed-in student plus teachers who
  teach that year; for teachers, the year-level student board plus matching
  teachers.
- **All teachers:** for students, the signed-in student plus all teachers with
  scores; for teachers, the year-level student board plus all teachers.

After this update, only signed-in Google users with a matching student directory
entry can add student scores. Teacher scores require a
`@baysidecc.vic.edu.au` account. Accounts attempting the wrong score type are
blocked by the database rules, even if someone edits the website code in their
browser.

## 6. Import student year levels

The private spreadsheet is not committed to GitHub. Import it from this machine
with the Firebase CLI logged in:

```bash
python3 tools/import-student-directory.py "/Users/joshua.thorne/Downloads/Student Emails.xlsx" --project bayside-maths-challenge
```

Use `--dry-run` first to preview the number of rows without uploading. The import
creates or updates `studentDirectory/{lowercase-email}` documents and does not
delete any existing manual assignments.

If a student signs in with an email that is not in `studentDirectory`, the site
creates `yearLevelRequests/{uid}` with their name and email. The Requests page
appears in the sidebar only for `joshua.thorne@baysidecc.vic.edu.au`, where the
admin can assign the missing student to Year 7-12. Because this is a static
GitHub Pages site, it does not send a real email by itself; the request is stored
in Firestore for the admin page.

## 7. Upload and test

Upload all project files to the GitHub repository, including:

- `firebase-config.js`
- `firebase-leaderboard.js`
- `firebase.json`
- `firestore.rules`

Wait for GitHub Pages to deploy, then open the site. Below the leaderboard:

- A green dot means the shared leaderboard is connected.
- An orange dot means Firebase is not connected, the user is signed out, or the
  account is not from the approved domain.

Sign in with an approved school Google account, play a topic-area game, and
finish it. Then open the GitHub Pages website on another device to confirm the
new score appears.

## Important limitation

This is suitable for a friendly classroom leaderboard. Because the game runs
entirely in each student's browser, a technically skilled visitor could manipulate
their submitted score. Fully cheat-resistant scoring would require trusted
server-side game validation.
