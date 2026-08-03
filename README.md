# Bayside Maths Challenge

A bright, responsive maths-games website for Bayside Christian College, built for
GitHub Pages. Students in Years 7-12 can play timed skill challenges, save their
year level, and appear on a shared live leaderboard.

## Games

- **Quick Fire:** addition and subtraction
- **Times Table Dash:** multiplication from 2 to 12
- **Missing Number:** reverse-operation multiplication puzzles
- **Year 7-12 skill challenges:** individual leaderboards for skills such as
  integers, fractions, ratios, gradients, quadratics, functions, calculus,
  complex numbers, and series

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

The site is ready to use Firebase Cloud Firestore for leaderboards shared between
different devices. `@bcc.vic.edu.au` Google accounts are treated as students:
they save one year level in the toolbar Settings menu, then submit shared scores
to that year-level leaderboard. Their leaderboard name comes from their Google
account, and each Google account can try as many times as they like while only
their highest score per game is kept.

The site is high-school only: Year 7 to Year 12. Students can access skill
challenges at their saved year level and every lower year level. For example, a
Year 10 student can play Year 7, Year 8, Year 9, and Year 10 skills, but not
Year 11 or Year 12 skills.

`@baysidecc.vic.edu.au` Google accounts are treated as teachers automatically.
Teachers choose the year levels they teach in Settings and can appear in the
teacher views: no teachers, year-level teachers, or all teachers. Follow
[FIREBASE_SETUP.md](FIREBASE_SETUP.md) once to connect it.

Until Firebase is configured, scores automatically fall back to the browser's
`localStorage` and are visible only on that device.
