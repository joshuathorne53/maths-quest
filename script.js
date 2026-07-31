const GAME_SECONDS = 60;
const STORAGE_KEY = "bayside-maths-challenge-leaderboards-v1";

const gameInfo = {
  quick: {
    name: "Quick Fire",
    description: "Solve as many addition and subtraction questions as you can in 60 seconds.",
  },
  times: {
    name: "Times Table Dash",
    description: "Race through multiplication facts from the 2 to 12 times tables.",
  },
  missing: {
    name: "Missing Number",
    description: "Find the mystery number hiding inside each equation.",
  },
};

const defaultScores = {
  quick: [
    { name: "Mia", score: 740 },
    { name: "Noah", score: 680 },
    { name: "Ava", score: 610 },
    { name: "Leo", score: 570 },
    { name: "Ivy", score: 520 },
  ],
  times: [
    { name: "Arlo", score: 820 },
    { name: "Zoe", score: 760 },
    { name: "Sam", score: 690 },
    { name: "Evie", score: 650 },
    { name: "Kai", score: 590 },
  ],
  missing: [
    { name: "Ruby", score: 780 },
    { name: "Max", score: 710 },
    { name: "Luca", score: 650 },
    { name: "Ella", score: 600 },
    { name: "Finn", score: 550 },
  ],
};

const state = {
  game: "quick",
  board: "quick",
  player: "",
  score: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  questionNumber: 0,
  answer: 0,
  time: GAME_SECONDS,
  timerId: null,
  running: false,
  acceptingAnswer: false,
  sound: true,
  sharedInitialized: false,
  sharedConfigured: false,
  authEmail: "",
  authAllowed: false,
  allowedEmailDomain: "",
  boardUnsubscribe: null,
  pendingSharedScore: null,
  latestSharedScoreId: null,
  sharedScores: {
    quick: null,
    times: null,
    missing: null,
  },
};

const elements = {
  playSection: document.querySelector("#play"),
  startPanel: document.querySelector("#start-panel"),
  gamePanel: document.querySelector("#game-panel"),
  resultPanel: document.querySelector("#result-panel"),
  startTitle: document.querySelector("#start-title"),
  startDescription: document.querySelector("#start-description"),
  playMode: document.querySelector("#play-mode"),
  nameForm: document.querySelector("#name-form"),
  nameInput: document.querySelector("#player-name"),
  answerForm: document.querySelector("#answer-form"),
  answerInput: document.querySelector("#answer-input"),
  question: document.querySelector("#question"),
  questionCount: document.querySelector("#question-count"),
  score: document.querySelector("#score"),
  streak: document.querySelector("#streak"),
  timer: document.querySelector("#timer"),
  timerProgress: document.querySelector("#timer-progress"),
  feedback: document.querySelector("#feedback"),
  resultName: document.querySelector("#result-name"),
  finalScore: document.querySelector("#final-score"),
  correctTotal: document.querySelector("#correct-total"),
  bestStreak: document.querySelector("#best-streak"),
  resultRank: document.querySelector("#result-rank"),
  podium: document.querySelector("#podium"),
  scoreList: document.querySelector("#score-list"),
  soundToggle: document.querySelector("#sound-toggle"),
  leaderboardStatus: document.querySelector("#leaderboard-status"),
  authCard: document.querySelector("#auth-card"),
  authTitle: document.querySelector("#auth-title"),
  authMessage: document.querySelector("#auth-message"),
  signInButton: document.querySelector("#sign-in-button"),
  signOutButton: document.querySelector("#sign-out-button"),
  resultSignIn: document.querySelector("#result-sign-in"),
};

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createQuestion(mode) {
  if (mode === "times") {
    const a = randomNumber(2, 12);
    const b = randomNumber(2, 12);
    return { text: `${a} × ${b} = ?`, answer: a * b };
  }

  if (mode === "missing") {
    const hidden = randomNumber(2, 12);
    const multiplier = randomNumber(2, 12);
    const product = hidden * multiplier;
    return { text: `? × ${multiplier} = ${product}`, answer: hidden };
  }

  const useAddition = Math.random() > 0.45;
  if (useAddition) {
    const a = randomNumber(5, 45);
    const b = randomNumber(2, 35);
    return { text: `${a} + ${b} = ?`, answer: a + b };
  }

  const a = randomNumber(15, 60);
  const b = randomNumber(2, a);
  return { text: `${a} − ${b} = ?`, answer: a - b };
}

function getLocalScores() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && saved.quick && saved.times && saved.missing ? saved : structuredClone(defaultScores);
  } catch {
    return structuredClone(defaultScores);
  }
}

function saveLocalScore() {
  const scores = getLocalScores();
  scores[state.game].push({ name: state.player, score: state.score });
  scores[state.game] = scores[state.game]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  return scores[state.game].findIndex(
    (entry) => entry.name === state.player && entry.score === state.score,
  ) + 1;
}

function getVisibleScores(game) {
  return state.sharedScores[game] !== null ? state.sharedScores[game] : getLocalScores()[game];
}

function setLeaderboardStatus(status, message) {
  elements.leaderboardStatus.dataset.status = status;
  elements.leaderboardStatus.lastChild.textContent = message;
}

function getAllowedDomainLabel() {
  return state.allowedEmailDomain ? `@${state.allowedEmailDomain}` : "your school Google";
}

function renderAuthControls() {
  if (!state.sharedConfigured) {
    elements.authCard.hidden = true;
    elements.resultSignIn.hidden = true;
    return;
  }

  elements.authCard.hidden = false;
  elements.resultSignIn.hidden = !(state.pendingSharedScore && !state.authAllowed);

  if (state.authAllowed) {
    elements.authTitle.textContent = "Signed in for shared scores";
    elements.authMessage.textContent = `Using ${state.authEmail}. Your scores can be added to the class leaderboard.`;
    elements.signInButton.hidden = true;
    elements.signOutButton.hidden = false;
    return;
  }

  if (state.authEmail) {
    elements.authTitle.textContent = "Wrong Google account";
    elements.authMessage.textContent = `Signed in as ${state.authEmail}. Use a ${getAllowedDomainLabel()} account to submit scores.`;
    elements.signInButton.hidden = false;
    elements.signOutButton.hidden = false;
    return;
  }

  elements.authTitle.textContent = "Sign in for shared scores";
  elements.authMessage.textContent = `Only ${getAllowedDomainLabel()} accounts can submit leaderboard scores.`;
  elements.signInButton.hidden = false;
  elements.signOutButton.hidden = true;
}

function updateSharedResultRank() {
  if (!state.latestSharedScoreId) return;

  const rank = state.sharedScores[state.game]?.findIndex(
    (entry) => entry.id === state.latestSharedScoreId,
  );

  if (rank >= 0) {
    elements.resultRank.textContent = `#${rank + 1}`;
  } else if (state.sharedScores[state.game]) {
    elements.resultRank.textContent = "Top 20+";
  }
}

function listenToSharedBoard(game) {
  if (!state.sharedConfigured) return;
  if (state.boardUnsubscribe) state.boardUnsubscribe();

  setLeaderboardStatus("connecting", "Connecting to the shared leaderboard...");
  state.boardUnsubscribe = window.sharedLeaderboard.listen(
    game,
    (scores) => {
      state.sharedScores[game] = scores.filter(
        (entry) => typeof entry.name === "string" && Number.isInteger(entry.score),
      );
      if (state.board === game) renderLeaderboard();
      updateSharedResultRank();
      setLeaderboardStatus("shared", "Shared leaderboard connected. Scores update live for everyone.");
    },
    () => {
      state.sharedScores[game] = null;
      if (state.board === game) renderLeaderboard();
      setLeaderboardStatus("local", "Shared leaderboard unavailable. Scores are saving on this device.");
    },
  );
}

function connectSharedLeaderboard() {
  if (state.sharedInitialized) return;
  state.sharedInitialized = true;
  state.sharedConfigured = Boolean(window.sharedLeaderboard?.isConfigured);
  state.allowedEmailDomain = window.sharedLeaderboard?.allowedEmailDomain || "";

  if (!state.sharedConfigured) {
    setLeaderboardStatus(
      "local",
      "Firebase setup needed. Until then, scores save only on this device.",
    );
    renderAuthControls();
    return;
  }

  renderAuthControls();
  listenToSharedBoard(state.board);
}

async function saveSharedScore() {
  if (!state.sharedConfigured) return;

  if (!state.authAllowed) {
    state.pendingSharedScore = {
      game: state.game,
      name: state.player,
      score: state.score,
    };
    elements.resultRank.textContent = "Sign in needed";
    renderAuthControls();
    setLeaderboardStatus(
      "local",
      `Sign in with a ${getAllowedDomainLabel()} account to add this score to the shared leaderboard.`,
    );
    return;
  }

  const scoreToSave = state.pendingSharedScore || {
    game: state.game,
    name: state.player,
    score: state.score,
  };

  try {
    state.latestSharedScoreId = await window.sharedLeaderboard.addScore(
      scoreToSave.game,
      scoreToSave.name,
      scoreToSave.score,
    );
    state.pendingSharedScore = null;
    renderAuthControls();
    updateSharedResultRank();
  } catch {
    setLeaderboardStatus("local", "Could not share this score. It is saved on this device.");
  }
}

async function signInForLeaderboard() {
  if (!state.sharedConfigured) return;

  setLeaderboardStatus("connecting", `Waiting for ${getAllowedDomainLabel()} Google sign-in...`);

  try {
    await window.sharedLeaderboard.signIn();
  } catch (error) {
    setLeaderboardStatus(
      "local",
      error?.message || `Sign in with a ${getAllowedDomainLabel()} account to submit scores.`,
    );
  }
}

async function signOutOfLeaderboard() {
  if (!state.sharedConfigured) return;

  try {
    await window.sharedLeaderboard.signOut();
  } catch {
    setLeaderboardStatus("local", "Could not sign out. Please refresh the page and try again.");
  }
}

function cleanName(value) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 18);
}

function initials(name) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2) || "?"
  );
}

function playTone(success) {
  if (!state.sound) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.type = "sine";
  oscillator.frequency.value = success ? 620 : 190;
  gain.gain.setValueAtTime(0.06, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
}

function selectGame(mode) {
  state.game = mode;
  const info = gameInfo[mode];
  elements.startTitle.textContent = info.name;
  elements.startDescription.textContent = info.description;
  elements.playMode.textContent = info.name;
  elements.startPanel.hidden = false;
  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = true;
  elements.playSection.hidden = false;
  elements.playSection.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => elements.nameInput.focus(), 500);
}

function resetGame() {
  window.clearInterval(state.timerId);
  Object.assign(state, {
    score: 0,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    questionNumber: 0,
    answer: 0,
    time: GAME_SECONDS,
    timerId: null,
    running: false,
    acceptingAnswer: false,
  });

  elements.score.textContent = "0";
  elements.streak.textContent = "0";
  elements.timer.textContent = String(GAME_SECONDS);
  elements.timerProgress.style.strokeDashoffset = "0";
  elements.timerProgress.style.stroke = "var(--blue)";
  elements.feedback.textContent = "You’ve got this.";
  elements.feedback.className = "feedback";
}

function nextQuestion() {
  if (!state.running) return;

  const question = createQuestion(state.game);
  state.answer = question.answer;
  state.questionNumber += 1;
  state.acceptingAnswer = true;
  elements.question.textContent = question.text;
  elements.questionCount.textContent = `Question ${state.questionNumber}`;
  elements.answerInput.value = "";
  elements.answerInput.focus();
  elements.question.classList.remove("bump");
  void elements.question.offsetWidth;
  elements.question.classList.add("bump");
}

function startGame() {
  resetGame();
  state.running = true;
  elements.startPanel.hidden = true;
  elements.resultPanel.hidden = true;
  elements.gamePanel.hidden = false;
  nextQuestion();

  state.timerId = window.setInterval(() => {
    state.time -= 1;
    elements.timer.textContent = String(state.time);
    elements.timerProgress.style.strokeDashoffset = String(113 * (1 - state.time / GAME_SECONDS));

    if (state.time <= 10) {
      elements.timerProgress.style.stroke = "var(--coral)";
    }

    if (state.time <= 0) {
      finishGame();
    }
  }, 1000);
}

function finishGame() {
  if (!state.running) return;

  state.running = false;
  window.clearInterval(state.timerId);
  const rank = saveLocalScore();
  state.latestSharedScoreId = null;

  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = false;
  elements.resultName.textContent = state.player;
  elements.finalScore.textContent = state.score.toLocaleString();
  elements.correctTotal.textContent = String(state.correct);
  elements.bestStreak.textContent = String(state.bestStreak);
  elements.resultRank.textContent = rank > 0 ? `#${rank}` : "Top 20+";
  state.board = state.game;
  setActiveBoardTab();
  renderLeaderboard();
  listenToSharedBoard(state.board);
  saveSharedScore();
}

function submitAnswer(event) {
  event.preventDefault();
  if (!state.running || !state.acceptingAnswer) return;

  const guess = Number(elements.answerInput.value);
  if (!Number.isFinite(guess)) return;
  state.acceptingAnswer = false;

  if (guess === state.answer) {
    state.streak += 1;
    state.correct += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const points = 100 + Math.min(state.streak - 1, 5) * 20;
    state.score += points;
    elements.feedback.textContent = state.streak > 2 ? `Correct! ${state.streak} answer streak!` : "Correct! Keep going.";
    elements.feedback.className = "feedback correct";
    playTone(true);
  } else {
    state.streak = 0;
    elements.feedback.textContent = `Not quite. The answer was ${state.answer}.`;
    elements.feedback.className = "feedback incorrect";
    playTone(false);
  }

  elements.score.textContent = state.score.toLocaleString();
  elements.streak.textContent = String(state.streak);
  window.setTimeout(() => {
    if (state.running) nextQuestion();
  }, 220);
}

function endAndHideGame() {
  window.clearInterval(state.timerId);
  state.running = false;
  elements.playSection.hidden = true;
  document.querySelector("#games").scrollIntoView({ behavior: "smooth" });
}

function renderLeaderboard() {
  const scores = getVisibleScores(state.board);
  const topThree = [scores[1], scores[0], scores[2]];
  const places = [2, 1, 3];

  elements.podium.innerHTML = topThree
    .map((entry, index) => {
      const fallback = { name: "Your turn", score: 0 };
      const player = entry || fallback;
      return `
        <div class="podium-place">
          <div class="podium-player">
            <span class="podium-avatar">${escapeHtml(initials(player.name))}</span>
            <strong>${escapeHtml(player.name)}</strong>
            <span>${player.score.toLocaleString()} pts</span>
          </div>
          <div class="podium-block">${places[index]}</div>
        </div>
      `;
    })
    .join("");

  if (!scores.length) {
    elements.scoreList.innerHTML = '<li class="empty-scores">No scores yet. Be the first to play!</li>';
    return;
  }

  elements.scoreList.innerHTML = scores
    .slice(0, 7)
    .map(
      (entry, index) => `
        <li class="score-row ${entry.name === state.player ? "current-player" : ""}">
          <span class="score-rank">${index + 1}</span>
          <span class="list-avatar">${escapeHtml(initials(entry.name))}</span>
          <span class="score-name">${escapeHtml(entry.name)}</span>
          <span class="score-points">${entry.score.toLocaleString()}</span>
        </li>
      `,
    )
    .join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setActiveBoardTab() {
  document.querySelectorAll("[data-board]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.board === state.board);
  });
}

document.querySelectorAll("[data-game]").forEach((button) => {
  button.addEventListener("click", () => selectGame(button.dataset.game));
});

document.querySelectorAll("[data-board]").forEach((button) => {
  button.addEventListener("click", () => {
    state.board = button.dataset.board;
    setActiveBoardTab();
    renderLeaderboard();
    listenToSharedBoard(state.board);
  });
});

elements.nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = cleanName(elements.nameInput.value);
  if (!name) {
    elements.nameInput.focus();
    return;
  }
  state.player = name;
  elements.nameInput.value = name;
  startGame();
});

elements.answerForm.addEventListener("submit", submitAnswer);
document.querySelector("#back-button").addEventListener("click", endAndHideGame);
document.querySelector("#quit-button").addEventListener("click", finishGame);
document.querySelector("#play-again").addEventListener("click", startGame);
elements.signInButton.addEventListener("click", signInForLeaderboard);
elements.signOutButton.addEventListener("click", signOutOfLeaderboard);
elements.resultSignIn.addEventListener("click", signInForLeaderboard);

elements.soundToggle.addEventListener("click", () => {
  state.sound = !state.sound;
  elements.soundToggle.setAttribute("aria-pressed", String(state.sound));
  elements.soundToggle.querySelector(".sound-label").textContent = state.sound ? "Sound on" : "Sound off";
  elements.soundToggle.firstElementChild.textContent = state.sound ? "♪" : "×";
});

window.addEventListener("leaderboard-auth-changed", (event) => {
  state.authEmail = event.detail.email || "";
  state.authAllowed = Boolean(event.detail.allowed);
  state.allowedEmailDomain = event.detail.allowedEmailDomain || state.allowedEmailDomain;
  renderAuthControls();

  if (state.authAllowed) {
    setLeaderboardStatus("shared", "Signed in. Shared leaderboard scores can now be submitted.");
    if (state.pendingSharedScore) saveSharedScore();
  } else if (state.authEmail) {
    setLeaderboardStatus(
      "local",
      `Use a ${getAllowedDomainLabel()} Google account to submit leaderboard scores.`,
    );
  }
});

window.addEventListener("shared-leaderboard-ready", connectSharedLeaderboard);
renderLeaderboard();
if (window.sharedLeaderboard) connectSharedLeaderboard();
window.setTimeout(() => {
  if (!state.sharedInitialized) {
    setLeaderboardStatus(
      "local",
      "Shared leaderboard is not connected. Open the site through GitHub Pages or a local server.",
    );
  }
}, 3000);
