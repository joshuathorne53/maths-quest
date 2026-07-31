# Connect the shared Firebase leaderboard

GitHub Pages hosts the website. Firebase Cloud Firestore stores and live-updates
the leaderboard for everyone. You can use the same Google account you use to sign
in to GitHub.

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
6. The approved student Google domains are already set to `bcc.vic.edu.au` and
   `baysidecc.vic.edu.au` in [`firebase-config.js`](firebase-config.js). If this
   ever changes, use only the part after the `@` symbol. For example:

   ```js
   export const allowedEmailDomains = ["bcc.vic.edu.au", "baysidecc.vic.edu.au"];
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
2. [`firestore.rules`](firestore.rules) is already set to allow only
   `bcc.vic.edu.au` and `baysidecc.vic.edu.au` Google accounts.
3. Replace the existing Firebase rules with the contents of
   [`firestore.rules`](firestore.rules).
4. Select **Publish**.

These rules let anyone read the game leaderboards. Only approved-domain Google
users can save their own account setting, save their own student profile, apply
for teacher approval, and add a score. Score values are limited, and existing
score entries can only keep the same score or move higher.

Leaderboard names come from the user's Google account. After signing in, users
must choose **Student** or **Teacher** in the toolbar Settings menu. Student
accounts then save one year level before playing. The chosen account type is
stored in `accountSettings` and stays attached to that Google account until it is
changed in Settings. Each Google account can have one score document per game
because the score document ID must match the signed-in user's Firebase UID.
Students can play any number of attempts, and the leaderboard keeps only their
highest score for each game.

Teacher approval uses a simple Firebase Console workflow:

1. A teacher signs in on the website, opens **Settings**, chooses **Teacher**,
   and selects **Apply for teacher account**.
2. In Firestore, open `teacherApplications` and copy the applicant document ID.
   That document ID is the teacher's Firebase UID.
3. Create a document in `teachers` with the same document ID.
4. Add these fields:

   - `uid`: the copied document ID
   - `name`: the teacher's display name
   - `email`: the teacher's school email address in lowercase
   - `approved`: `true`
   - `yearLevels`: an array, for example `["year7", "year8"]`
   - `createdAt`: a Firestore timestamp
   - `approvedAt`: a Firestore timestamp
   - `updatedAt`: a Firestore timestamp

The allowed `yearLevels` values are `prep`, `year1`, `year2`, `year3`,
`year4`, `year5`, `year6`, `year7`, `year8`, `year9`, `year10`, `year11`,
and `year12`.

After approval, the teacher can choose their teaching year levels from the
website. Year-level leaderboards include teacher filters at the bottom:

- **No teachers:** student scores only.
- **Year level teachers:** students plus teachers who teach the selected year.
- **All teachers:** students plus all approved teachers with scores.

After this update, only signed-in Google users from your chosen domain can add a
score. Personal Gmail accounts and other domains are blocked by the database
rules, even if someone edits the website code in their browser.

## 6. Upload and test

Upload all project files to the GitHub repository, including:

- `firebase-config.js`
- `firebase-leaderboard.js`
- `firebase.json`
- `firestore.rules`

Wait for GitHub Pages to deploy, then open the site. Below the leaderboard:

- A green dot means the shared leaderboard is connected.
- An orange dot means Firebase is not connected, the student is signed out, or the
  account is not from the approved domain.

Sign in with an approved school Google account, play a game, and finish it. Then
open the GitHub Pages website on another device to confirm the new score appears.

## Important limitation

This is suitable for a friendly classroom leaderboard. Because the game runs
entirely in each student's browser, a technically skilled visitor could manipulate
their submitted score. Fully cheat-resistant scoring would require trusted
server-side game validation.
