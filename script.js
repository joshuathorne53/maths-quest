const GAME_SECONDS = 60;
const STORAGE_KEY = "bayside-maths-challenge-leaderboards-v3";
const DEFAULT_YEAR_LEVEL = "year7";

const YEAR_LEVELS = [
  { id: "prep", label: "Prep" },
  { id: "year1", label: "Year 1" },
  { id: "year2", label: "Year 2" },
  { id: "year3", label: "Year 3" },
  { id: "year4", label: "Year 4" },
  { id: "year5", label: "Year 5" },
  { id: "year6", label: "Year 6" },
  { id: "year7", label: "Year 7" },
  { id: "year8", label: "Year 8" },
  { id: "year9", label: "Year 9" },
  { id: "year10", label: "Year 10" },
  { id: "year11", label: "Year 11" },
  { id: "year12", label: "Year 12" },
];

const validYearLevels = new Set(YEAR_LEVELS.map((yearLevel) => yearLevel.id));
const validTeacherFilters = new Set(["none", "year", "all"]);

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
  quick: [],
  times: [],
  missing: [],
};

const state = {
  game: "quick",
  board: "quick",
  boardYearLevel: DEFAULT_YEAR_LEVEL,
  teacherFilter: "none",
  player: "",
  score: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  questionNumber: 0,
  answer: 0,
  time: GAME_SECONDS,
  timerId: null,
  countdownId: null,
  countdownTimeoutId: null,
  running: false,
  acceptingAnswer: false,
  sound: true,
  sharedInitialized: false,
  sharedConfigured: false,
  authUid: "",
  authEmail: "",
  authName: "",
  authAllowed: false,
  allowedEmailDomain: "",
  allowedEmailDomains: [],
  accountType: "",
  settingsOpen: false,
  settingsUserOpen: false,
  studentYearLevel: "",
  teacherYearLevels: [],
  boardUnsubscribe: null,
  pendingSharedScore: null,
  savingSharedScore: false,
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
  countdownPanel: document.querySelector("#countdown-panel"),
  gamePanel: document.querySelector("#game-panel"),
  resultPanel: document.querySelector("#result-panel"),
  startTitle: document.querySelector("#start-title"),
  startDescription: document.querySelector("#start-description"),
  startPlayer: document.querySelector("#start-player"),
  startGameButton: document.querySelector("#start-game-button"),
  countdownNumber: document.querySelector("#countdown-number"),
  countdownMessage: document.querySelector("#countdown-message"),
  playMode: document.querySelector("#play-mode"),
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
  boardYearSelect: document.querySelector("#board-year-select"),
  soundToggle: document.querySelector("#sound-toggle"),
  leaderboardStatus: document.querySelector("#leaderboard-status"),
  authCard: document.querySelector("#auth-card"),
  authTitle: document.querySelector("#auth-title"),
  authMessage: document.querySelector("#auth-message"),
  signInButton: document.querySelector("#sign-in-button"),
  settingsWrap: document.querySelector("#settings-wrap"),
  settingsButton: document.querySelector("#settings-button"),
  settingsMenu: document.querySelector("#settings-menu"),
  settingsClose: document.querySelector("#settings-close"),
  signOutButton: document.querySelector("#sign-out-button"),
  resultSignIn: document.querySelector("#result-sign-in"),
  accountPanel: document.querySelector("#account-panel"),
  accountTitle: document.querySelector("#account-title"),
  accountMessage: document.querySelector("#account-message"),
  accountRoleNote: document.querySelector("#account-role-note"),
  studentProfileForm: document.querySelector("#student-profile-form"),
  studentYearSelect: document.querySelector("#student-year-select"),
  profileStatus: document.querySelector("#profile-status"),
  teacherPanel: document.querySelector("#teacher-panel"),
  teacherBadge: document.querySelector("#teacher-badge"),
  teacherStatus: document.querySelector("#teacher-status"),
  teacherYearPanel: document.querySelector("#teacher-year-panel"),
  teacherYearOptions: document.querySelector("#teacher-year-options"),
  teacherYearsSave: document.querySelector("#teacher-years-save"),
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

function getYearLabel(yearLevel) {
  return YEAR_LEVELS.find((level) => level.id === yearLevel)?.label || "No year";
}

function cleanYearLevel(yearLevel) {
  const value = String(yearLevel || "").trim().toLowerCase();
  return validYearLevels.has(value) ? value : "";
}

function cleanTeacherFilter(filter) {
  return validTeacherFilters.has(filter) ? filter : "none";
}

function cleanAccountType(accountType) {
  const value = String(accountType || "").trim().toLowerCase();
  return value === "student" || value === "teacher" ? value : "";
}

function createYearOptions({ includePlaceholder = false } = {}) {
  const options = YEAR_LEVELS.map(
    (yearLevel) => `<option value="${yearLevel.id}">${yearLevel.label}</option>`,
  ).join("");

  if (!includePlaceholder) return options;
  return `<option value="">Choose your year level</option>${options}`;
}

function setupYearControls() {
  elements.boardYearSelect.innerHTML = createYearOptions();
  elements.boardYearSelect.value = state.boardYearLevel;
  elements.studentYearSelect.innerHTML = createYearOptions({ includePlaceholder: true });
  elements.teacherYearOptions.innerHTML = YEAR_LEVELS.map(
    (yearLevel) => `
      <label class="year-check">
        <input type="checkbox" value="${yearLevel.id}" />
        <span>${yearLevel.label}</span>
      </label>
    `,
  ).join("");
}

function cloneDefaultScores() {
  return {
    quick: [],
    times: [],
    missing: [],
  };
}

function normalizeScores(scores) {
  return scores.filter((entry) => {
    if (!entry || typeof entry.name !== "string" || !Number.isInteger(entry.score)) return false;
    if (entry.role === "teacher") return Array.isArray(entry.teacherYearLevels);
    return entry.role === "student" && validYearLevels.has(entry.yearLevel);
  });
}

function getLocalScores() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && saved.quick && saved.times && saved.missing ? saved : cloneDefaultScores();
  } catch {
    return cloneDefaultScores();
  }
}

function getActiveAccountType() {
  return state.accountType;
}

function accountSetupRequired() {
  if (!state.sharedConfigured || !state.authAllowed) return false;

  const accountType = getActiveAccountType();
  if (!state.accountType) return true;
  if (accountType === "teacher") {
    return state.teacherYearLevels.length === 0;
  }

  return !state.studentYearLevel;
}

function getAccountSetupMessage() {
  const accountType = getActiveAccountType();

  if (!state.accountType) {
    return "Sign in with a school Google account before playing.";
  }

  if (accountType === "teacher") {
    if (!state.teacherYearLevels.length) {
      return "Choose your teaching year levels before playing as a teacher.";
    }
  }

  return "Choose and save your year level before playing.";
}

function getScoreContext() {
  if (getActiveAccountType() === "teacher") {
    return {
      role: "teacher",
      teacherYearLevels: state.teacherYearLevels,
    };
  }

  return {
    role: "student",
    yearLevel: state.studentYearLevel || state.boardYearLevel,
  };
}

function scoreMatchesCurrentPlayer(entry) {
  if (state.authUid) return entry.id === state.authUid || entry.uid === state.authUid;
  return entry.name === state.player;
}

function saveLocalScore() {
  const scores = getLocalScores();
  const scoreContext = getScoreContext();
  const playerName = state.player || getGooglePlayerName();
  const currentUid = state.authUid || `${scoreContext.role}:${playerName}`;
  const existingIndex = scores[state.game].findIndex(
    (entry) => (entry.uid || entry.id) === currentUid,
  );
  const previousScore = existingIndex >= 0 ? scores[state.game][existingIndex].score : null;
  const improved = previousScore === null || state.score > previousScore;
  const entry = {
    id: currentUid,
    uid: currentUid,
    name: playerName,
    score: improved ? state.score : previousScore,
    role: scoreContext.role,
    game: state.game,
  };

  if (scoreContext.role === "teacher") {
    entry.teacherYearLevels = scoreContext.teacherYearLevels;
  } else {
    entry.yearLevel = scoreContext.yearLevel;
  }

  if (existingIndex >= 0) {
    scores[state.game][existingIndex] = entry;
  } else {
    scores[state.game].push(entry);
  }

  scores[state.game] = normalizeScores(scores[state.game])
    .sort((a, b) => b.score - a.score)
    .slice(0, 300);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));

  const visibleScores = filterScoresForBoard(scores[state.game], state.boardYearLevel, state.teacherFilter);

  return {
    rank: visibleScores.findIndex(scoreMatchesCurrentPlayer) + 1,
    improved,
    previousScore,
    bestScore: improved ? state.score : previousScore,
  };
}

function filterScoresForBoard(scores, yearLevel, teacherFilter) {
  return normalizeScores(scores)
    .filter((entry) => {
      if (entry.role === "teacher") {
        if (teacherFilter === "none") return false;
        if (teacherFilter === "all") return true;
        return entry.teacherYearLevels.includes(yearLevel);
      }

      return entry.yearLevel === yearLevel;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

function getVisibleScores(game = state.board) {
  const rawScores = state.sharedScores[game] !== null ? state.sharedScores[game] : getLocalScores()[game];
  return filterScoresForBoard(rawScores, state.boardYearLevel, state.teacherFilter);
}

function setLeaderboardStatus(status, message) {
  elements.leaderboardStatus.dataset.status = status;
  elements.leaderboardStatus.lastChild.textContent = message;
}

function setProfileStatus(message) {
  elements.profileStatus.textContent = message;
}

function getAllowedDomainLabel() {
  if (state.allowedEmailDomains.length > 1) {
    return state.allowedEmailDomains.map((domain) => `@${domain}`).join(" or ");
  }

  return state.allowedEmailDomain ? `@${state.allowedEmailDomain}` : "your school Google";
}

function getGooglePlayerName() {
  return state.authName || state.authEmail.split("@")[0] || "Student";
}

function getTeacherYearLabel() {
  if (!state.teacherYearLevels.length) return "no teaching years saved";
  if (state.teacherYearLevels.length <= 2) {
    return state.teacherYearLevels.map(getYearLabel).join(" and ");
  }

  return `${state.teacherYearLevels.length} year levels`;
}

function hasPlayableProfile() {
  if (!state.sharedConfigured) return true;
  if (!state.authAllowed) return false;
  if (!state.accountType) return false;
  if (getActiveAccountType() === "teacher") {
    return state.teacherYearLevels.length > 0;
  }
  return Boolean(state.studentYearLevel);
}

function updateStartPanel() {
  if (!state.sharedConfigured) {
    elements.startPlayer.textContent = `Playing on the ${getYearLabel(state.boardYearLevel)} local leaderboard.`;
    elements.startGameButton.textContent = "Start game →";
    return;
  }

  if (!state.authAllowed) {
    elements.startPlayer.textContent = `Sign in with ${getAllowedDomainLabel()} to play and submit a score.`;
    elements.startGameButton.textContent = "Sign in to play →";
    return;
  }

  if (!state.accountType) {
    elements.startPlayer.textContent = "Sign in with a school Google account before playing.";
    elements.startGameButton.textContent = "Open settings";
    return;
  }

  if (getActiveAccountType() === "teacher") {
    if (state.teacherYearLevels.length) {
      elements.startPlayer.textContent = `Playing as ${getGooglePlayerName()}, teacher for ${getTeacherYearLabel()}.`;
      elements.startGameButton.textContent = "Start game →";
    } else {
      elements.startPlayer.textContent = "Choose your teaching year levels before playing as a teacher.";
      elements.startGameButton.textContent = "Open settings";
    }
    return;
  }

  if (state.studentYearLevel) {
    elements.startPlayer.textContent = `Playing as ${getGooglePlayerName()} in ${getYearLabel(state.studentYearLevel)}.`;
    elements.startGameButton.textContent = "Start game →";
    return;
  }

  elements.startPlayer.textContent = "Choose and save your year level before playing.";
  elements.startGameButton.textContent = "Choose year level first";
}

function renderTeacherFilterControls() {
  document.querySelectorAll("[data-teacher-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.teacherFilter === state.teacherFilter);
  });
}

function setSettingsOpen(open, { userAction = false } = {}) {
  if (userAction) {
    state.settingsUserOpen = Boolean(open);
  }

  const needsSetup = accountSetupRequired();

  if (!state.sharedConfigured || !state.authAllowed) {
    state.settingsOpen = false;
    state.settingsUserOpen = false;
  } else {
    state.settingsOpen = needsSetup || state.settingsUserOpen || Boolean(open);
  }

  elements.settingsMenu.hidden = !state.settingsOpen;
  elements.settingsButton.setAttribute("aria-expanded", String(state.settingsOpen));
  elements.settingsMenu.dataset.required = String(needsSetup);
  elements.settingsClose.hidden = needsSetup;
}

function renderAccountPanel() {
  elements.settingsWrap.hidden = !(state.sharedConfigured && state.authAllowed);
  elements.accountPanel.hidden = elements.settingsWrap.hidden;
  if (elements.accountPanel.hidden) return;

  const accountType = getActiveAccountType();
  const needsSetup = accountSetupRequired();

  elements.studentProfileForm.hidden = accountType !== "student";
  elements.teacherPanel.hidden = accountType !== "teacher";
  elements.studentYearSelect.value = state.studentYearLevel;
  elements.accountTitle.textContent = needsSetup ? "Finish account setup" : "Settings";

  if (!accountType) {
    elements.accountRoleNote.textContent = "Checking your school email domain...";
    elements.accountMessage.textContent = "@bcc.vic.edu.au accounts are students. @baysidecc.vic.edu.au accounts are teachers.";
    elements.teacherYearPanel.hidden = true;
  } else if (accountType === "teacher") {
    elements.accountRoleNote.textContent = "@baysidecc.vic.edu.au accounts are teacher accounts.";
    elements.accountMessage.textContent = "Pick the year levels you teach. Your teacher scores can appear in the teacher leaderboard views for those year levels.";
    elements.teacherBadge.textContent = "Teacher";
    elements.teacherStatus.textContent = state.teacherYearLevels.length
      ? `Teaching years saved: ${getTeacherYearLabel()}.`
      : "Choose the year level(s) you teach before playing.";
    elements.teacherYearPanel.hidden = false;
  } else {
    elements.accountRoleNote.textContent = "@bcc.vic.edu.au accounts are student accounts.";
    elements.accountMessage.textContent = "Save your student year level. It stays saved for this Google account until you change it here.";
    elements.teacherYearPanel.hidden = true;
  }

  elements.teacherYearOptions.querySelectorAll("input").forEach((checkbox) => {
    checkbox.checked = state.teacherYearLevels.includes(checkbox.value);
  });

  setSettingsOpen(false);
}

function renderAuthControls() {
  if (!state.sharedConfigured) {
    elements.authCard.hidden = true;
    elements.settingsWrap.hidden = true;
    elements.resultSignIn.hidden = true;
    setSettingsOpen(false);
    renderAccountPanel();
    updateStartPanel();
    return;
  }

  elements.authCard.hidden = false;
  elements.resultSignIn.hidden = !(state.pendingSharedScore && !state.authAllowed);

  if (state.authAllowed) {
    elements.authTitle.textContent = "Signed in for shared scores";
    const accountType = getActiveAccountType();
    const roleLabel = accountType === "teacher"
      ? "Teacher"
      : state.studentYearLevel
        ? getYearLabel(state.studentYearLevel)
        : "Choose setup";
    elements.authMessage.textContent = `${state.authEmail} • ${roleLabel}`;
    elements.signInButton.hidden = true;
    elements.settingsWrap.hidden = false;
    elements.signOutButton.hidden = false;
    renderAccountPanel();
    updateStartPanel();
    return;
  }

  if (state.authEmail) {
    elements.authTitle.textContent = "Wrong Google account";
    elements.authMessage.textContent = "Wrong account";
    elements.signInButton.hidden = false;
    elements.settingsWrap.hidden = true;
    elements.signOutButton.hidden = false;
    setSettingsOpen(false);
    renderAccountPanel();
    updateStartPanel();
    return;
  }

  elements.authTitle.textContent = "Sign in for shared scores";
  elements.authMessage.textContent = "Sign in for leaderboards";
  elements.signInButton.hidden = false;
  elements.settingsWrap.hidden = true;
  elements.signOutButton.hidden = true;
  setSettingsOpen(false);
  renderAccountPanel();
  updateStartPanel();
}

function getFirebaseMessage(error, fallback) {
  const code = error?.code || "";

  if (code.includes("unauthorized-domain")) {
    return "This GitHub Pages domain is not authorized in Firebase Authentication settings.";
  }

  if (code.includes("operation-not-supported-in-this-environment")) {
    return "Google sign-in only works from the deployed GitHub Pages site, not from the local file preview.";
  }

  if (code.includes("network-request-failed")) {
    return "Firebase could not be reached. Check the internet connection and try again.";
  }

  if (code.includes("popup-blocked")) {
    return "The Google sign-in popup was blocked. Allow popups for this site and try again.";
  }

  if (code.includes("popup-closed-by-user")) {
    return "Google sign-in was closed before it finished.";
  }

  if (code.includes("profile/year-level-needed")) {
    return "Choose and save your year level before submitting a score.";
  }

  if (code.includes("profile/student-domain-required")) {
    return "Use an @bcc.vic.edu.au account for student leaderboards.";
  }

  if (code.includes("profile/account-type-needed")) {
    return "Use the correct school Google domain before submitting a score.";
  }

  if (code.includes("teacher/domain-required")) {
    return "Use an @baysidecc.vic.edu.au account for teacher leaderboards.";
  }

  if (code.includes("teacher/year-levels-needed")) {
    return "Choose at least one teaching year level before playing as a teacher.";
  }

  if (code.includes("permission-denied")) {
    return "Firebase blocked the score. Check that Firestore rules are published and your account setup is saved.";
  }

  if (code.includes("not-found") || code.includes("failed-precondition")) {
    return "Firestore is not ready yet. Create the Firestore database in Firebase Console and publish the rules.";
  }

  return error?.message || fallback;
}

function setBoardYearLevel(yearLevel) {
  const cleanLevel = cleanYearLevel(yearLevel) || DEFAULT_YEAR_LEVEL;
  state.boardYearLevel = cleanLevel;
  elements.boardYearSelect.value = cleanLevel;
  renderLeaderboard();
  updateSharedResultRank();
}

function applyAuthState(authState) {
  const oldAccountType = state.accountType;
  const oldStudentYearLevel = state.studentYearLevel;
  const oldTeacherYears = state.teacherYearLevels.join(",");

  state.authUid = authState?.uid || "";
  state.authEmail = authState?.email || "";
  state.authName = authState?.name || "";
  state.authAllowed = Boolean(authState?.allowed);
  state.allowedEmailDomain = authState?.allowedEmailDomain || state.allowedEmailDomain;
  state.allowedEmailDomains = authState?.allowedEmailDomains || state.allowedEmailDomains;
  state.accountType = cleanAccountType(authState?.accountType);
  state.studentYearLevel = cleanYearLevel(authState?.studentYearLevel);
  state.teacherYearLevels = Array.isArray(authState?.teacherYearLevels)
    ? authState.teacherYearLevels.map(cleanYearLevel).filter(Boolean)
    : [];

  if (state.authAllowed) {
    state.player = getGooglePlayerName();
    if (getActiveAccountType() === "student" && state.studentYearLevel) {
      setBoardYearLevel(state.studentYearLevel);
    }
  } else {
    state.settingsOpen = false;
    state.settingsUserOpen = false;
  }

  renderAuthControls();
  renderLeaderboard();

  if (state.authAllowed) {
    if (!oldAccountType && state.accountType) {
      setProfileStatus(`Account type saved as ${state.accountType}.`);
    }

    if (!oldStudentYearLevel && state.studentYearLevel) {
      setProfileStatus(`Year level saved as ${getYearLabel(state.studentYearLevel)}.`);
    }

    if (oldAccountType !== "teacher" && state.accountType === "teacher" && !state.teacherYearLevels.length) {
      setProfileStatus("Teacher account detected. Pick the year levels you teach.");
    } else if (oldTeacherYears !== state.teacherYearLevels.join(",") && state.accountType === "teacher") {
      setProfileStatus(`Teaching years saved: ${getTeacherYearLabel()}.`);
    }

    if (state.pendingSharedScore) saveSharedScore();
    return;
  }

  if (state.authEmail) {
    setLeaderboardStatus(
      "local",
      `Use a ${getAllowedDomainLabel()} Google account to submit leaderboard scores.`,
    );
  }
}

function updateSharedResultRank() {
  if (!state.latestSharedScoreId) return;

  const rank = getVisibleScores(state.game).findIndex(
    (entry) => entry.id === state.latestSharedScoreId || entry.uid === state.latestSharedScoreId,
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
      state.sharedScores[game] = normalizeScores(scores);
      if (state.board === game) renderLeaderboard();
      updateSharedResultRank();
      setLeaderboardStatus(
        "shared",
        `Showing ${getYearLabel(state.boardYearLevel)} ${gameInfo[state.board].name}. Scores update live for everyone.`,
      );
    },
    () => {
      state.sharedScores[game] = null;
      if (state.board === game) renderLeaderboard();
      setLeaderboardStatus("local", "Shared leaderboard unavailable. Check Firestore database setup and rules.");
    },
  );
}

function connectSharedLeaderboard() {
  if (state.sharedInitialized) return;
  state.sharedInitialized = true;
  state.sharedConfigured = Boolean(window.sharedLeaderboard?.isConfigured);
  state.allowedEmailDomain = window.sharedLeaderboard?.allowedEmailDomain || "";
  state.allowedEmailDomains = window.sharedLeaderboard?.allowedEmailDomains || [];

  if (!state.sharedConfigured) {
    setLeaderboardStatus(
      "local",
      "Firebase setup needed. Until then, scores save only on this device.",
    );
    renderAuthControls();
    return;
  }

  renderAuthControls();
  applyAuthState(window.sharedLeaderboard.getAuthState?.());
  listenToSharedBoard(state.board);
}

async function saveSharedScore() {
  if (!state.sharedConfigured || state.savingSharedScore) return;

  if (!state.authAllowed) {
    state.pendingSharedScore = {
      game: state.game,
      score: state.score,
      context: getScoreContext(),
    };
    elements.resultRank.textContent = "Sign in needed";
    renderAuthControls();
    setLeaderboardStatus(
      "local",
      `Sign in with a ${getAllowedDomainLabel()} account to add this score to the shared leaderboard.`,
    );
    return;
  }

  if (!hasPlayableProfile()) {
    state.pendingSharedScore = {
      game: state.game,
      score: state.score,
      context: getScoreContext(),
    };
    elements.resultRank.textContent = "Setup needed";
    renderAuthControls();
    setSettingsOpen(true, { userAction: true });
    setLeaderboardStatus("local", getAccountSetupMessage());
    return;
  }

  const scoreToSave = state.pendingSharedScore
    ? {
        ...state.pendingSharedScore,
        context: getScoreContext(),
      }
    : {
        game: state.game,
        score: state.score,
        context: getScoreContext(),
      };

  try {
    state.savingSharedScore = true;
    const savedScore = await window.sharedLeaderboard.addScore(
      scoreToSave.game,
      scoreToSave.score,
      scoreToSave.context,
    );
    state.latestSharedScoreId = savedScore.id;
    state.pendingSharedScore = null;

    if (savedScore.role === "teacher" && state.teacherFilter === "none") {
      state.teacherFilter = state.teacherYearLevels.includes(state.boardYearLevel) ? "year" : "all";
      renderTeacherFilterControls();
      renderLeaderboard();
    }

    renderAuthControls();
    updateSharedResultRank();

    if (savedScore.improved) {
      const previous = savedScore.previousScore;
      const message = previous === null
        ? "Score added to the shared leaderboard."
        : `New best score saved. Previous best was ${previous.toLocaleString()} points.`;
      setLeaderboardStatus("shared", message);
    } else {
      setLeaderboardStatus(
        "shared",
        `Your best score is still ${savedScore.score.toLocaleString()} points. This attempt was not higher.`,
      );
    }
  } catch (error) {
    console.error(error);
    setLeaderboardStatus(
      "local",
      getFirebaseMessage(error, "Could not share this score. It is saved on this device."),
    );
  } finally {
    state.savingSharedScore = false;
  }
}

async function signInForLeaderboard() {
  if (!state.sharedConfigured) return false;

  setLeaderboardStatus("connecting", `Waiting for ${getAllowedDomainLabel()} Google sign-in...`);

  try {
    applyAuthState(await window.sharedLeaderboard.signIn());
    return state.authAllowed;
  } catch (error) {
    console.error(error);
    setLeaderboardStatus(
      "local",
      getFirebaseMessage(error, `Sign in with a ${getAllowedDomainLabel()} account to submit scores.`),
    );
    return false;
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

async function saveStudentProfile(event) {
  event.preventDefault();
  if (!state.sharedConfigured) return;

  if (!state.authAllowed) {
    const signedIn = await signInForLeaderboard();
    if (!signedIn) return;
  }

  const yearLevel = cleanYearLevel(elements.studentYearSelect.value);
  if (!yearLevel) {
    setProfileStatus("Choose a year level first.");
    return;
  }

  try {
    setProfileStatus("Saving year level...");
    applyAuthState(await window.sharedLeaderboard.saveStudentYearLevel(yearLevel));
    setBoardYearLevel(yearLevel);
    setLeaderboardStatus("shared", `Scores will now submit to ${getYearLabel(yearLevel)}.`);
    setSettingsOpen(false, { userAction: true });
  } catch (error) {
    console.error(error);
    setProfileStatus(getFirebaseMessage(error, "Could not save your year level."));
  }
}

async function saveTeacherYears() {
  const yearLevels = [...elements.teacherYearOptions.querySelectorAll("input:checked")]
    .map((checkbox) => checkbox.value);

  if (!yearLevels.length) {
    setProfileStatus("Choose at least one teaching year level.");
    return;
  }

  try {
    setProfileStatus("Saving teaching year levels...");
    applyAuthState(await window.sharedLeaderboard.saveTeacherYearLevels(yearLevels));
    setLeaderboardStatus("shared", `Teacher scores can now appear for ${getTeacherYearLabel()}.`);
    setSettingsOpen(false, { userAction: true });
  } catch (error) {
    console.error(error);
    setProfileStatus(getFirebaseMessage(error, "Could not save teaching year levels."));
  }
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
  elements.countdownPanel.hidden = true;
  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = true;
  elements.playSection.hidden = false;
  updateStartPanel();
  elements.playSection.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => elements.startGameButton.focus(), 500);
}

function resetGame() {
  window.clearInterval(state.timerId);
  window.clearInterval(state.countdownId);
  window.clearTimeout(state.countdownTimeoutId);
  Object.assign(state, {
    score: 0,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    questionNumber: 0,
    answer: 0,
    time: GAME_SECONDS,
    timerId: null,
    countdownId: null,
    countdownTimeoutId: null,
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

function beginGame() {
  resetGame();
  state.running = true;
  elements.startPanel.hidden = true;
  elements.countdownPanel.hidden = true;
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

function startCountdown() {
  resetGame();
  let count = 3;
  elements.startPanel.hidden = true;
  elements.resultPanel.hidden = true;
  elements.gamePanel.hidden = true;
  elements.countdownPanel.hidden = false;
  elements.countdownMessage.textContent = `Starting ${gameInfo[state.game].name} as ${state.player}...`;
  elements.countdownNumber.textContent = String(count);

  state.countdownId = window.setInterval(() => {
    count -= 1;

    if (count > 0) {
      elements.countdownNumber.textContent = String(count);
      return;
    }

    window.clearInterval(state.countdownId);
    state.countdownId = null;
    elements.countdownNumber.textContent = "Go!";
    state.countdownTimeoutId = window.setTimeout(beginGame, 500);
  }, 1000);
}

async function requestStartGame() {
  if (state.sharedConfigured && !state.authAllowed) {
    const signedIn = await signInForLeaderboard();
    if (!signedIn) return;
  }

  if (!hasPlayableProfile()) {
    renderAuthControls();
    setSettingsOpen(true, { userAction: true });
    setLeaderboardStatus("local", getAccountSetupMessage());
    return;
  }

  const scoreContext = getScoreContext();
  state.player = getGooglePlayerName();

  if (scoreContext.role === "student") {
    setBoardYearLevel(scoreContext.yearLevel);
  } else if (scoreContext.teacherYearLevels.includes(state.boardYearLevel)) {
    state.teacherFilter = "year";
    renderTeacherFilterControls();
  } else {
    state.teacherFilter = "all";
    renderTeacherFilterControls();
  }

  startCountdown();
}

function finishGame() {
  if (!state.running) return;

  state.running = false;
  window.clearInterval(state.timerId);
  const scoreContext = getScoreContext();

  if (scoreContext.role === "student") {
    setBoardYearLevel(scoreContext.yearLevel);
  } else if (state.teacherFilter === "none") {
    state.teacherFilter = scoreContext.teacherYearLevels.includes(state.boardYearLevel) ? "year" : "all";
    renderTeacherFilterControls();
  }

  const localScore = saveLocalScore();
  state.latestSharedScoreId = null;

  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = false;
  elements.resultName.textContent = state.player;
  elements.finalScore.textContent = state.score.toLocaleString();
  elements.correctTotal.textContent = String(state.correct);
  elements.bestStreak.textContent = String(state.bestStreak);
  elements.resultRank.textContent = localScore.rank > 0 ? `#${localScore.rank}` : "Top 20+";
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
  window.clearInterval(state.countdownId);
  window.clearTimeout(state.countdownTimeoutId);
  state.countdownId = null;
  state.countdownTimeoutId = null;
  state.running = false;
  elements.countdownPanel.hidden = true;
  elements.playSection.hidden = true;
  document.querySelector("#games").scrollIntoView({ behavior: "smooth" });
}

function quitGame() {
  if (state.running) {
    finishGame();
    return;
  }

  endAndHideGame();
}

function getScoreMeta(entry) {
  if (entry.role === "teacher") {
    const teachesCurrentYear = entry.teacherYearLevels.includes(state.boardYearLevel);
    return teachesCurrentYear ? `${getYearLabel(state.boardYearLevel)} teacher` : "Teacher";
  }

  return getYearLabel(entry.yearLevel);
}

function renderLeaderboard() {
  renderTeacherFilterControls();
  const scores = getVisibleScores(state.board);
  const topThree = [scores[1], scores[0], scores[2]];
  const places = [2, 1, 3];

  elements.podium.innerHTML = topThree
    .map((entry, index) => {
      const fallback = { name: "No score yet", score: 0, role: "student", yearLevel: state.boardYearLevel };
      const player = entry || fallback;
      return `
        <div class="podium-place ${player.role === "teacher" ? "teacher-score" : ""}">
          <div class="podium-player">
            <span class="podium-avatar">${escapeHtml(initials(player.name))}</span>
            <strong>${escapeHtml(player.name)}</strong>
            <span>${player.score.toLocaleString()} pts</span>
            <em>${escapeHtml(getScoreMeta(player))}</em>
          </div>
          <div class="podium-block">${places[index]}</div>
        </div>
      `;
    })
    .join("");

  if (!scores.length) {
    elements.scoreList.innerHTML = `<li class="empty-scores">No ${getYearLabel(state.boardYearLevel)} scores yet for this view.</li>`;
    return;
  }

  elements.scoreList.innerHTML = scores
    .slice(0, 7)
    .map(
      (entry, index) => `
        <li class="score-row ${scoreMatchesCurrentPlayer(entry) ? "current-player" : ""} ${entry.role === "teacher" ? "teacher-score" : ""}">
          <span class="score-rank">${index + 1}</span>
          <span class="list-avatar">${escapeHtml(initials(entry.name))}</span>
          <span class="score-name">
            ${escapeHtml(entry.name)}
            <small>${escapeHtml(getScoreMeta(entry))}</small>
          </span>
          <span class="score-points">${entry.score.toLocaleString()}</span>
        </li>
      `,
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
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

setupYearControls();
renderTeacherFilterControls();

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

document.querySelectorAll("[data-teacher-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.teacherFilter = cleanTeacherFilter(button.dataset.teacherFilter);
    renderTeacherFilterControls();
    renderLeaderboard();
    updateSharedResultRank();
  });
});

elements.boardYearSelect.addEventListener("change", () => {
  setBoardYearLevel(elements.boardYearSelect.value);
  setLeaderboardStatus(
    state.sharedScores[state.board] === null ? "local" : "shared",
    `Showing ${getYearLabel(state.boardYearLevel)} ${gameInfo[state.board].name}.`,
  );
});
elements.studentProfileForm.addEventListener("submit", saveStudentProfile);
elements.teacherYearsSave.addEventListener("click", saveTeacherYears);
elements.settingsButton.addEventListener("click", () => setSettingsOpen(!state.settingsOpen, { userAction: true }));
elements.settingsClose.addEventListener("click", () => setSettingsOpen(false, { userAction: true }));
elements.startGameButton.addEventListener("click", requestStartGame);
elements.answerForm.addEventListener("submit", submitAnswer);
document.querySelector("#back-button").addEventListener("click", endAndHideGame);
document.querySelector("#quit-button").addEventListener("click", quitGame);
document.querySelector("#play-again").addEventListener("click", requestStartGame);
elements.signInButton.addEventListener("click", signInForLeaderboard);
elements.signOutButton.addEventListener("click", signOutOfLeaderboard);
elements.resultSignIn.addEventListener("click", signInForLeaderboard);

elements.soundToggle.addEventListener("click", () => {
  state.sound = !state.sound;
  elements.soundToggle.setAttribute("aria-pressed", String(state.sound));
  elements.soundToggle.querySelector(".sound-label").textContent = state.sound ? "Sound on" : "Sound off";
  elements.soundToggle.firstElementChild.textContent = state.sound ? "♪" : "×";
});

window.addEventListener("leaderboard-auth-changed", (event) => applyAuthState(event.detail));

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
