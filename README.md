# Maths Quest

A bright, responsive maths-games website built for GitHub Pages. Students can play
three timed games, enter a classroom-friendly name, and appear on the leaderboard.

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

The leaderboard uses the browser's `localStorage`, so scores persist on the same
browser and device. A leaderboard shared between different student devices would
require an online database or backend service.
