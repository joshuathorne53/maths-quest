# Bayside Maths Challenge

A bright, responsive maths-games website for Bayside Christian College, built for
GitHub Pages. Students can play three timed games, save their year level, and
appear on a shared live leaderboard.

## Games

- **Quick Fire:** addition and subtraction
- **Times Table Dash:** multiplication from 2 to 12
- **Missing Number:** reverse-operation multiplication puzzles

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
different devices. Students must sign in with an approved Google school domain,
save their year level, and then submit shared scores to that year-level
leaderboard. Their leaderboard name comes from their Google account, and each
Google account can try as many times as they like while only their highest score
per game is kept.

Teachers can apply for a teacher account. After a Firebase Console owner approves
them, they can choose the year levels they teach and appear in the teacher views:
no teachers, year-level teachers, or all teachers. Follow
[FIREBASE_SETUP.md](FIREBASE_SETUP.md) once to connect it.

Until Firebase is configured, scores automatically fall back to the browser's
`localStorage` and are visible only on that device.
