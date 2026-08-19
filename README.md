# Bayside Maths Challenge

## Quick Purpose

Bayside Maths Challenge is a classroom maths fluency website for Prep to Year 12.
Students practise focused skills, play timed topic-area challenges, earn medals
for their best scores, build a daily Streak, and compare their results on live
leaderboards for their own year level.

It is designed as a static GitHub Pages site with Firebase handling sign-in,
student year-level locking, teacher profiles, progress, and shared
leaderboards.

## Quick Usage

### Students

1. Open the website and sign in with a school Google account.
2. The student year level is locked from the imported student email list.
3. Choose a topic area or a sub-skill.
4. Practise as many times as needed. Only the highest score is kept.
5. Check Progress for medals and Streak, or Leaderboards for year-level topic
   scores.

Students only see leaderboard content for their assigned year level.

### Teachers

1. Sign in with an approved teacher Google account.
2. Open Settings, choose a leaderboard display name, and select the year levels
   taught.
3. Play topic areas as a teacher, or view student leaderboards for saved teaching
   years.
4. Use the teacher filters on leaderboards to show no teachers, year-level
   teachers, or all teachers.

Speed Operations uses the same teacher score across every year level and does
not ask teachers to choose a year before playing. Teacher Streak is account-wide
and is not split by year level.

### Site Admins

1. Publish the files with GitHub Pages.
2. Create a Firebase project, enable Google sign-in, create Firestore, and
   publish `firestore.rules`.
3. Copy the Firebase web config into `firebase-config.js`.
4. Import the student email/year-level spreadsheet with
   `tools/import-student-directory.py`.
5. Use the Requests page to assign students whose emails are missing from the
   imported list.

Full setup details are in [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

A bright, responsive maths website for Bayside Christian College, built for
GitHub Pages. Students from Prep to Year 12 use school-assigned year levels,
play timed topic-area games when content is unlocked for them, practise
individual skills, and appear on shared live topic leaderboards.

## Topic Areas

- **Speed Operations:** single-digit addition, subtraction, multiplication, and
  division
- **Number:** factors, multiples, primes, HCF, LCM, squares, square roots, and
  integer operations
- **Fractions:** simplifying, equivalent fractions, improper and mixed numbers,
  comparing, ordering, fraction operations, and mixed-number operations

Each topic area has one combined game that mixes only the sub-skills unlocked
for the player's year level. Combined topic-area games run for 5 minutes. Each
sub-skill is one focused question type and can also be played individually for
medal progress, but shared leaderboards are only for topic areas.

## Run locally

Open `index.html` in a browser, or serve the directory:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Push these files to a GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder.

## Leaderboard storage

The site uses Firebase Cloud Firestore for leaderboards shared between different
devices. Student year levels are locked from the private Firestore
`studentDirectory` collection, imported from a local spreadsheet. Students cannot
choose their own year level in the website. If a signed-in student is missing
from the directory, the site creates a year-level request for the admin to review
inside the Requests page.

Student leaderboard names come from the user's Google account. Each Google
account can try as many times as they like while only their highest score per
topic area for their assigned year level is kept. Student leaderboard views show
the top 10 students only. When a student switches to the year-level teachers or
all-teachers view, the board shows that signed-in student plus the relevant
teachers, not every other student. The leaderboard page also includes combined
topic scores and a longest Streak board.

The site supports Prep to Year 12. Students can access skill challenges at their
assigned year level and every lower year level once those skills exist. The
topic areas can gain extra skills for higher or lower year levels over time.

Teachers use `@baysidecc.vic.edu.au` Google accounts. They choose the leaderboard
name and year levels they teach in Settings, then can appear in the teacher
views: no teachers, year-level teachers, or all teachers. The Requests page is
visible only to the configured admin account. Follow
[FIREBASE_SETUP.md](FIREBASE_SETUP.md) once to connect it.

Until Firebase is configured, scores automatically fall back to the browser's
`localStorage` and are visible only on that device.
