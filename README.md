# Bayside Maths Challenge

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
current topic content is still configured to unlock from Year 7, and topic areas
can gain extra skills for higher or lower year levels over time.

Teachers use `@baysidecc.vic.edu.au` Google accounts. They choose the leaderboard
name and year levels they teach in Settings, then can appear in the teacher
views: no teachers, year-level teachers, or all teachers. The Requests page is
visible only to the configured admin account. Follow
[FIREBASE_SETUP.md](FIREBASE_SETUP.md) once to connect it.

Until Firebase is configured, scores automatically fall back to the browser's
`localStorage` and are visible only on that device.
