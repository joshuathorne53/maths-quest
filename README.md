# Bayside Maths Challenge

A bright, responsive maths website for Bayside Christian College, built for
GitHub Pages. Students in Years 7-12 can play timed topic-area games, practise
individual skills, use their school-assigned year level, and appear on shared
live topic leaderboards.

## Topic Areas

- **Number Fluency:** arithmetic, integers, powers, indices, logarithms, and
  complex-number fluency as year levels unlock them
- **Fractions, Ratios & Percentages:** fraction skills first, then ratios and
  percentage change in higher years
- **Order of Operations:** BIDMAS and operation-order fluency
- **Algebra:** equations, brackets, quadratics, simultaneous equations, and
  sequences as they unlock
- **Graphs & Functions:** gradients and function notation
- **Geometry & Measurement:** geometry skills starting with Pythagoras
- **Surds, Calculus & Series:** senior exact-form and calculus skills

Each topic area has one combined game that mixes the unlocked skills in that
area. Skills can also be played individually for medal progress, but shared
leaderboards are only for topic areas.

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
teachers, not every other student.

The site is high-school only: Year 7 to Year 12. Students can access skill
challenges at their assigned year level and every lower year level. For example, a
Year 10 student can play Year 7, Year 8, Year 9, and Year 10 skills, but not
Year 11 or Year 12 skills. Topic areas can stay available while gaining extra
skills for higher year levels.

Teachers use `@baysidecc.vic.edu.au` Google accounts. They choose the leaderboard
name and year levels they teach in Settings, then can appear in the teacher
views: no teachers, year-level teachers, or all teachers. The Requests page is
visible only to the configured admin account. Follow
[FIREBASE_SETUP.md](FIREBASE_SETUP.md) once to connect it.

Until Firebase is configured, scores automatically fall back to the browser's
`localStorage` and are visible only on that device.
