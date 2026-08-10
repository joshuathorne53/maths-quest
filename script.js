const GAME_SECONDS = 60;
const PAPER_GAME_SECONDS = 300;
const STORAGE_KEY = "bayside-maths-challenge-leaderboards-v5";
const PROGRESS_KEY = "bayside-maths-challenge-progress-v1";
const DEFAULT_YEAR_LEVEL = "year7";
const TEST_STUDENT_ADMIN_EMAIL = "joshua.thorne@baysidecc.vic.edu.au";
const MR_THORNE_NAMES = new Set(["joshua thorne", "mr thorne"]);
const MEDAL_GOALS = [
  { id: "bronze", label: "Bronze", score: 1000 },
  { id: "silver", label: "Silver", score: 2000 },
  { id: "gold", label: "Gold", score: 3000 },
  { id: "thorne", label: "Mr Thorne", score: 4000 },
];

const YEAR_LEVELS = [
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
    shortName: "Quick",
    description: "Solve as many addition and subtraction questions as you can in 60 seconds.",
    cardDescription: "Add and subtract at speed. A friendly place to warm up your brain.",
    bullets: ["Integers and mental methods", "All high school years"],
    icon: "+",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  times: {
    name: "Times Table Dash",
    shortName: "Times",
    description: "Race through multiplication facts from the 2 to 12 times tables.",
    cardDescription: "Race through multiplication facts and keep your winning streak alive.",
    bullets: ["Tables from 2 to 12", "Streak bonuses"],
    icon: "×",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  missing: {
    name: "Missing Number",
    shortName: "Missing",
    description: "Find the mystery number hiding inside each equation.",
    cardDescription: "Find the mystery number inside each equation before time runs out.",
    bullets: ["Reverse operations", "Algebra thinking"],
    icon: "?",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "y7-integers": {
    name: "Integers",
    shortName: "Integers",
    description: "Practise adding, subtracting, and multiplying positive and negative integers.",
    cardDescription: "Get confident with positive and negative numbers in quick mental questions.",
    bullets: ["Integer operations", "Positive and negative numbers"],
    icon: "±",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "y7-fractions": {
    name: "Fractions",
    shortName: "Fractions",
    description: "Find fractions of quantities using common denominators.",
    cardDescription: "Practise fraction-of-a-quantity questions built for fast recall.",
    bullets: ["Fractions of amounts", "Common denominators"],
    icon: "a/b",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "y7-simplifying-fractions": {
    name: "Simplifying Fractions",
    shortName: "Simplify Fractions",
    description: "Simplify fractions by dividing the numerator and denominator by their highest common factor.",
    cardDescription: "Reduce fractions to their simplest form.",
    bullets: ["Highest common factor", "Simplest form"],
    icon: "↓/",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "y7-add-subtract-fractions": {
    name: "Adding & Subtracting Fractions",
    shortName: "Add/Sub Fractions",
    description: "Add and subtract fractions, including questions with different denominators.",
    cardDescription: "Build speed with fraction addition and subtraction.",
    bullets: ["Common denominators", "Equivalent fractions"],
    icon: "±/",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "y7-multiplying-fractions": {
    name: "Multiplying Fractions",
    shortName: "Multiply Fractions",
    description: "Multiply fractions and simplify the result.",
    cardDescription: "Practise multiplying fractions and whole numbers with fractions.",
    bullets: ["Fraction products", "Simplifying answers"],
    icon: "×/",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "y7-percentages": {
    name: "Percentages",
    shortName: "Percentages",
    description: "Calculate friendly percentages of whole numbers.",
    cardDescription: "Work with 10%, 20%, 25%, 50%, and 75% of useful quantities.",
    bullets: ["Percentage of amounts", "Mental strategies"],
    icon: "%",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "y7-bidmas": {
    name: "BIDMAS",
    shortName: "BIDMAS",
    description: "Use the order of operations with brackets, indices, division, multiplication, addition, and subtraction.",
    cardDescription: "Practise choosing the correct operation order before calculating.",
    bullets: ["Order of operations", "Brackets and indices"],
    icon: "()",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "y7-one-step-equations": {
    name: "One-Step Equations",
    shortName: "One-Step",
    description: "Solve simple one-step equations using addition, subtraction, multiplication, and division.",
    cardDescription: "Build algebra confidence by finding x with all four operations.",
    bullets: ["One-step algebra", "Four operations"],
    icon: "x",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "y8-square-powers": {
    name: "Squares & Powers",
    shortName: "Squares",
    description: "Practise square numbers, simple powers, and square roots.",
    cardDescription: "Strengthen square number and power facts for quick skill recall.",
    bullets: ["Square numbers", "Simple powers"],
    icon: "□",
    cardClass: "game-card-sun",
    accessYear: "year8",
  },
  "y8-ratios": {
    name: "Ratios",
    shortName: "Ratios",
    description: "Share quantities in a ratio and identify the larger share.",
    cardDescription: "Split totals using ratios and keep the arithmetic sharp.",
    bullets: ["Ratio sharing", "Proportional thinking"],
    icon: ":",
    cardClass: "game-card-coral",
    accessYear: "year8",
  },
  "y8-percentage-change": {
    name: "Percentage Change",
    shortName: "Percent Change",
    description: "Calculate percentage increases and decreases.",
    cardDescription: "Practise friendly percentage changes on whole-number amounts.",
    bullets: ["Increase and decrease", "Percent strategies"],
    icon: "%",
    cardClass: "game-card-sky",
    accessYear: "year8",
  },
  "y8-linear-equations": {
    name: "Linear Equations",
    shortName: "Linear Eq.",
    description: "Solve simple multiplication and division equations.",
    cardDescription: "Solve equations like 6x = 42 and x ÷ 4 = 9 at speed.",
    bullets: ["Linear equations", "Inverse operations"],
    icon: "x",
    cardClass: "game-card-sun",
    accessYear: "year8",
  },
  "y9-index-laws": {
    name: "Index Laws",
    shortName: "Index Laws",
    description: "Use index laws with multiplication and division of powers.",
    cardDescription: "Practise exponent rules using matching bases.",
    bullets: ["Index laws", "Same-base powers"],
    icon: "aⁿ",
    cardClass: "game-card-coral",
    accessYear: "year9",
  },
  "y9-gradients": {
    name: "Gradients",
    shortName: "Gradients",
    description: "Find gradients between points on a straight line.",
    cardDescription: "Read rise over run from simple coordinate pairs.",
    bullets: ["Linear graphs", "Rise over run"],
    icon: "m",
    cardClass: "game-card-sky",
    accessYear: "year9",
  },
  "y9-expanding-brackets": {
    name: "Expanding Brackets",
    shortName: "Expand",
    description: "Expand single brackets and identify coefficients or constants.",
    cardDescription: "Practise distributive multiplication with algebraic terms.",
    bullets: ["Expanding brackets", "Coefficients"],
    icon: "(",
    cardClass: "game-card-sun",
    accessYear: "year9",
  },
  "y9-two-step-equations": {
    name: "Two-Step Equations",
    shortName: "Two-Step",
    description: "Solve two-step linear equations.",
    cardDescription: "Find x in equations with a coefficient and a constant.",
    bullets: ["Two-step algebra", "Linear equations"],
    icon: "x",
    cardClass: "game-card-coral",
    accessYear: "year9",
  },
  "y10-quadratics": {
    name: "Quadratics",
    shortName: "Quadratics",
    description: "Solve factorised quadratic equations by finding a root.",
    cardDescription: "Use simple quadratic patterns to identify roots quickly.",
    bullets: ["Quadratic roots", "Factorising patterns"],
    icon: "∪",
    cardClass: "game-card-sky",
    accessYear: "year10",
  },
  "y10-pythagoras": {
    name: "Pythagoras",
    shortName: "Pythagoras",
    description: "Find missing side lengths using Pythagorean triples.",
    cardDescription: "Practise right-triangle side lengths with classic triples.",
    bullets: ["Pythagorean triples", "Right triangles"],
    icon: "△",
    cardClass: "game-card-sun",
    accessYear: "year10",
  },
  "y10-simultaneous-equations": {
    name: "Simultaneous Equations",
    shortName: "Simult.",
    description: "Solve simple simultaneous equations for x or y.",
    cardDescription: "Use paired sum and difference equations to solve quickly.",
    bullets: ["Simultaneous equations", "Elimination thinking"],
    icon: "{",
    cardClass: "game-card-coral",
    accessYear: "year10",
  },
  "y10-functions": {
    name: "Functions",
    shortName: "Functions",
    description: "Substitute values into linear and quadratic functions.",
    cardDescription: "Evaluate f(x) expressions with careful arithmetic.",
    bullets: ["Function notation", "Substitution"],
    icon: "f",
    cardClass: "game-card-sky",
    accessYear: "year10",
  },
  "y11-derivatives": {
    name: "Derivatives",
    shortName: "Derivatives",
    description: "Find derivative coefficients using the power rule.",
    cardDescription: "Practise the power rule for introductory calculus.",
    bullets: ["Power rule", "Derivative coefficients"],
    icon: "dy/dx",
    cardClass: "game-card-sun",
    accessYear: "year11",
  },
  "y11-logarithms": {
    name: "Logarithms",
    shortName: "Logs",
    description: "Evaluate simple logarithms with exact powers.",
    cardDescription: "Match bases and powers to answer logarithm questions.",
    bullets: ["Logarithms", "Exact powers"],
    icon: "log",
    cardClass: "game-card-coral",
    accessYear: "year11",
  },
  "y11-arithmetic-sequences": {
    name: "Arithmetic Sequences",
    shortName: "Sequences",
    description: "Find terms in arithmetic sequences.",
    cardDescription: "Use first term and common difference to calculate Tn.",
    bullets: ["Arithmetic sequences", "nth term"],
    icon: "Tn",
    cardClass: "game-card-sky",
    accessYear: "year11",
  },
  "y11-surds": {
    name: "Simplifying Surds",
    shortName: "Simplify Surds",
    description: "Simplify square roots into a whole-number coefficient and a surd.",
    cardDescription: "Break square roots into a whole-number coefficient and surd part.",
    bullets: ["Surd simplification", "Exact values"],
    icon: "√",
    cardClass: "game-card-sun",
    accessYear: "year11",
  },
  "y12-calculus-derivatives": {
    name: "Derivative Values",
    shortName: "Deriv. Values",
    description: "Evaluate derivatives at specific x-values.",
    cardDescription: "Build calculus speed by finding derivative values.",
    bullets: ["Derivative values", "Power functions"],
    icon: "f′",
    cardClass: "game-card-coral",
    accessYear: "year12",
  },
  "y12-integrals": {
    name: "Integrals",
    shortName: "Integrals",
    description: "Find missing coefficients in simple antiderivatives.",
    cardDescription: "Practise reverse power-rule thinking for integrals.",
    bullets: ["Antiderivatives", "Power rule"],
    icon: "∫",
    cardClass: "game-card-sky",
    accessYear: "year12",
  },
  "y12-complex-numbers": {
    name: "Complex Numbers",
    shortName: "Complex",
    description: "Find moduli of simple complex numbers.",
    cardDescription: "Use exact right-triangle pairs to calculate complex moduli.",
    bullets: ["Complex modulus", "Exact values"],
    icon: "i",
    cardClass: "game-card-sun",
    accessYear: "year12",
  },
  "y12-series": {
    name: "Series",
    shortName: "Series",
    description: "Calculate sums of arithmetic series.",
    cardDescription: "Find simple series totals using efficient formulas.",
    bullets: ["Series sums", "Arithmetic patterns"],
    icon: "Σ",
    cardClass: "game-card-coral",
    accessYear: "year12",
  },
};

const GAME_IDS = Object.keys(gameInfo);
const PEN_AND_PAPER_GAME_IDS = new Set([
  "y10-quadratics",
  "y10-pythagoras",
  "y10-simultaneous-equations",
  "y10-functions",
  "y11-derivatives",
  "y11-logarithms",
  "y11-arithmetic-sequences",
  "y11-surds",
  "y12-calculus-derivatives",
  "y12-integrals",
  "y12-complex-numbers",
  "y12-series",
]);

const state = {
  page: "home",
  game: "quick",
  board: "quick",
  boardYearLevel: DEFAULT_YEAR_LEVEL,
  teacherFilter: "none",
  homeLeaderboardView: "students",
  homeFeaturedGame: "quick",
  player: "",
  score: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  questionNumber: 0,
  answer: 0,
  time: GAME_SECONDS,
  duration: GAME_SECONDS,
  timerId: null,
  countdownId: null,
  countdownTimeoutId: null,
  running: false,
  acceptingAnswer: false,
  sound: false,
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
  testStudentMode: false,
  testStudentYearLevel: DEFAULT_YEAR_LEVEL,
  boardUnsubscribes: new Map(),
  pendingSharedScore: null,
  savingSharedScore: false,
  latestSharedScoreId: null,
  sharedScores: cloneSharedScores(),
  boardListenerContexts: new Map(),
};

const elements = {
  heroSection: document.querySelector("#home"),
  gamesSection: document.querySelector("#games"),
  playSection: document.querySelector("#play"),
  gamePageSection: document.querySelector("#game-page"),
  gamePageIcon: document.querySelector("#game-page-icon"),
  gamePageTitle: document.querySelector("#game-page-title"),
  gamePageDescription: document.querySelector("#game-page-description"),
  gamePageBullets: document.querySelector("#game-page-bullets"),
  gamePageDuration: document.querySelector("#game-page-duration"),
  gamePageGoal: document.querySelector("#game-page-goal"),
  gamePagePrep: document.querySelector("#game-page-prep"),
  gameGoalStatus: document.querySelector("#game-goal-status"),
  gamePageStart: document.querySelector("#game-page-start"),
  gamePageLeaderboard: document.querySelector(".game-page-leaderboard"),
  gamePageLeaderboardTitle: document.querySelector("#game-page-leaderboard-title"),
  gameBoardYearSelect: document.querySelector("#game-board-year-select"),
  gameBoardList: document.querySelector("#game-board-list"),
  gameBoardStatus: document.querySelector("#game-board-status"),
  progressSection: document.querySelector("#progress"),
  progressGrid: document.querySelector("#progress-game-grid"),
  progressSummary: document.querySelector("#progress-summary"),
  progressStreakCount: document.querySelector("#progress-streak-count"),
  progressStreakStatus: document.querySelector("#progress-streak-status"),
  progressStatus: document.querySelector("#progress-status"),
  allLeaderboardsSection: document.querySelector("#leaderboards"),
  leaderboardsGrid: document.querySelector("#leaderboards-grid"),
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
  standardAnswerField: document.querySelector("#standard-answer-field"),
  answerInput: document.querySelector("#answer-input"),
  surdAnswerFields: document.querySelector("#surd-answer-fields"),
  surdCoefficientInput: document.querySelector("#surd-coefficient-input"),
  surdRadicandInput: document.querySelector("#surd-radicand-input"),
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
  resultGoalStatus: document.querySelector("#result-goal-status"),
  resultLeaderboardLink: document.querySelector("#result-leaderboard-link"),
  gameGrid: document.querySelector("#game-grid"),
  homeGameStrip: document.querySelector("#home-game-strip"),
  featuredGameIcon: document.querySelector("#featured-game-icon"),
  featuredGameHeading: document.querySelector("#featured-game-heading"),
  featuredGameDescription: document.querySelector("#featured-game-description"),
  featuredGameMeta: document.querySelector("#featured-game-meta"),
  featuredGameBullets: document.querySelector("#featured-game-bullets"),
  featuredGamePlay: document.querySelector("#featured-game-play"),
  featuredGameLeaderboard: document.querySelector("#featured-game-leaderboard"),
  featuredGameGoal: document.querySelector("#featured-game-goal"),
  featuredGameGoalLabel: document.querySelector("#featured-game-goal-label"),
  homeLeaderboardList: document.querySelector("#home-leaderboard-list"),
  homeLeaderboardStatus: document.querySelector("#home-leaderboard-status"),
  homeAuthTitle: document.querySelector("#home-auth-title"),
  homeAuthSummary: document.querySelector("#home-auth-summary"),
  homeSignInButton: document.querySelector("#home-sign-in-button"),
  homeSettingsButton: document.querySelector("#home-settings-button"),
  homeGamesPlayed: document.querySelector("#home-games-played"),
  homeBestScore: document.querySelector("#home-best-score"),
  homeCurrentGoal: document.querySelector("#home-current-goal"),
  boardYearSelect: document.querySelector("#board-year-select"),
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
  testStudentPanel: document.querySelector("#teacher-test-panel"),
  testStudentBadge: document.querySelector("#test-student-badge"),
  testStudentToggle: document.querySelector("#test-student-toggle"),
  testStudentYearSelect: document.querySelector("#test-student-year-select"),
  testStudentStatus: document.querySelector("#test-student-status"),
};

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(items) {
  return items[randomNumber(0, items.length - 1)];
}

function formatSigned(value) {
  return value < 0 ? `(${value})` : String(value);
}

function createQuestion(mode) {
  const skillGenerator = skillQuestionGenerators[mode];
  if (skillGenerator) return skillGenerator();

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

function greatestCommonDivisor(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }

  return x || 1;
}

function createFractionAnswer(numerator, denominator) {
  if (denominator === 0) return null;

  const sign = denominator < 0 ? -1 : 1;
  const divisor = greatestCommonDivisor(numerator, denominator);

  return {
    type: "fraction",
    numerator: (numerator / divisor) * sign,
    denominator: Math.abs(denominator / divisor),
  };
}

function createSimplifiedFractionAnswer(numerator, denominator) {
  const answer = createFractionAnswer(numerator, denominator);
  return answer ? { ...answer, requireSimplified: true } : null;
}

function isSurdAnswer(answer) {
  return answer?.type === "surd";
}

function isFractionAnswer(answer) {
  return answer?.type === "fraction";
}

function getFormattedAnswer(answer) {
  if (isSurdAnswer(answer)) {
    return `${answer.coefficient}√${answer.radicand}`;
  }

  if (isFractionAnswer(answer)) {
    return answer.denominator === 1
      ? String(answer.numerator)
      : `${answer.numerator}/${answer.denominator}`;
  }

  return String(answer);
}

function parseFractionInput(value) {
  const cleanValue = String(value || "").trim();
  const fractionMatch = cleanValue.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (fractionMatch) {
    const enteredNumerator = Number(fractionMatch[1]);
    const enteredDenominator = Number(fractionMatch[2]);
    const answer = createFractionAnswer(enteredNumerator, enteredDenominator);

    return answer
      ? {
          ...answer,
          enteredNumerator,
          enteredDenominator,
        }
      : null;
  }

  const wholeNumberMatch = cleanValue.match(/^-?\d+$/);
  if (wholeNumberMatch) {
    return {
      ...createFractionAnswer(Number(cleanValue), 1),
      enteredNumerator: Number(cleanValue),
      enteredDenominator: 1,
    };
  }

  return null;
}

function fractionsMatch(guess, answer) {
  return guess.numerator * answer.denominator === answer.numerator * guess.denominator;
}

function isSimplifiedFractionGuess(guess) {
  return guess.enteredDenominator > 0
    && greatestCommonDivisor(guess.enteredNumerator, guess.enteredDenominator) === 1;
}

function setSurdAnswerMode(enabled) {
  elements.answerForm.classList.toggle("surd-answer-mode", enabled);
  elements.standardAnswerField.hidden = enabled;
  elements.answerInput.disabled = enabled;
  elements.answerInput.required = !enabled;
  elements.surdAnswerFields.hidden = !enabled;
  elements.surdCoefficientInput.disabled = !enabled;
  elements.surdCoefficientInput.required = enabled;
  elements.surdRadicandInput.disabled = !enabled;
  elements.surdRadicandInput.required = enabled;
}

const skillQuestionGenerators = {
  "y7-integers": () => sample([
    () => {
      const a = randomNumber(-18, 35);
      const b = randomNumber(-15, 20);
      return { text: `${a} + ${formatSigned(b)} = ?`, answer: a + b };
    },
    () => {
      const a = randomNumber(-10, 30);
      const b = randomNumber(-12, 18);
      return { text: `${a} − ${formatSigned(b)} = ?`, answer: a - b };
    },
    () => {
      const a = randomNumber(-9, 9) || 3;
      const b = randomNumber(-9, 9) || -4;
      return { text: `${a} × ${formatSigned(b)} = ?`, answer: a * b };
    },
  ])(),
  "y7-fractions": () => sample([
    () => {
      const denominator = sample([4, 5, 8, 10]);
      const numerator = randomNumber(1, denominator - 1);
      const multiplier = randomNumber(3, 12);
      return {
        text: `${numerator}/${denominator} of ${denominator * multiplier} = ?`,
        answer: numerator * multiplier,
      };
    },
    () => {
      const denominator = sample([3, 4, 6, 8]);
      const multiplier = randomNumber(4, 14);
      return {
        text: `1/${denominator} of ${denominator * multiplier} = ?`,
        answer: multiplier,
      };
    },
  ])(),
  "y7-simplifying-fractions": () => {
    const [simplifiedNumerator, simplifiedDenominator] = sample([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 6],
      [5, 6],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [3, 8],
      [5, 8],
    ]);
    const factor = sample([2, 3, 4]);
    const numerator = simplifiedNumerator * factor;
    const denominator = simplifiedDenominator * factor;

    return {
      text: `Simplify ${numerator}/${denominator}`,
      answer: createSimplifiedFractionAnswer(numerator, denominator),
    };
  },
  "y7-add-subtract-fractions": () => sample([
    () => {
      const denominator = sample([4, 5, 6, 8, 10, 12]);
      const left = randomNumber(1, denominator - 2);
      const right = randomNumber(1, denominator - left - 1);
      return {
        text: `${left}/${denominator} + ${right}/${denominator} = ?`,
        answer: createFractionAnswer(left + right, denominator),
      };
    },
    () => {
      const denominator = sample([4, 5, 6, 8, 10, 12]);
      const left = randomNumber(2, denominator - 1);
      const right = randomNumber(1, left - 1);
      return {
        text: `${left}/${denominator} − ${right}/${denominator} = ?`,
        answer: createFractionAnswer(left - right, denominator),
      };
    },
    () => {
      const smallerDenominator = sample([3, 4, 5, 6]);
      const largerDenominator = smallerDenominator * sample([2, 3]);
      const left = randomNumber(1, smallerDenominator - 1);
      const right = randomNumber(1, largerDenominator - 1);
      return {
        text: `${left}/${smallerDenominator} + ${right}/${largerDenominator} = ?`,
        answer: createFractionAnswer(left * (largerDenominator / smallerDenominator) + right, largerDenominator),
      };
    },
    () => {
      const smallerDenominator = sample([3, 4, 5, 6]);
      const largerDenominator = smallerDenominator * sample([2, 3]);
      const left = randomNumber(2, smallerDenominator - 1);
      const scaledLeft = left * (largerDenominator / smallerDenominator);
      const right = randomNumber(1, scaledLeft - 1);
      return {
        text: `${left}/${smallerDenominator} − ${right}/${largerDenominator} = ?`,
        answer: createFractionAnswer(scaledLeft - right, largerDenominator),
      };
    },
  ])(),
  "y7-multiplying-fractions": () => sample([
    () => {
      const leftDenominator = sample([3, 4, 5, 6, 8]);
      const rightDenominator = sample([3, 4, 5, 6, 8]);
      const left = randomNumber(1, leftDenominator - 1);
      const right = randomNumber(1, rightDenominator - 1);
      return {
        text: `${left}/${leftDenominator} × ${right}/${rightDenominator} = ?`,
        answer: createFractionAnswer(left * right, leftDenominator * rightDenominator),
      };
    },
    () => {
      const denominator = sample([3, 4, 5, 6, 8, 10]);
      const numerator = randomNumber(1, denominator - 1);
      const wholeNumber = randomNumber(2, 9);
      return {
        text: `${wholeNumber} × ${numerator}/${denominator} = ?`,
        answer: createFractionAnswer(wholeNumber * numerator, denominator),
      };
    },
    () => {
      const denominator = sample([3, 4, 5, 6, 8, 10]);
      const numerator = randomNumber(1, denominator - 1);
      const wholeNumber = randomNumber(2, 9);
      return {
        text: `${numerator}/${denominator} of ${wholeNumber} = ?`,
        answer: createFractionAnswer(numerator * wholeNumber, denominator),
      };
    },
  ])(),
  "y7-percentages": () => sample([
    () => {
      const percent = sample([10, 20, 25, 50, 75]);
      const base = sample([40, 60, 80, 100, 120, 160]);
      return { text: `${percent}% of ${base} = ?`, answer: (percent * base) / 100 };
    },
    () => {
      const percent = sample([5, 10, 20]);
      const base = sample([100, 200, 300, 400, 500]);
      return { text: `${percent}% of ${base} = ?`, answer: (percent * base) / 100 };
    },
  ])(),
  "y7-bidmas": () => sample([
    () => {
      const a = randomNumber(2, 20);
      const b = randomNumber(2, 12);
      const c = randomNumber(2, 10);
      return { text: `${a} + ${b} × ${c} = ?`, answer: a + b * c };
    },
    () => {
      const a = randomNumber(2, 10);
      const b = randomNumber(2, 10);
      const c = randomNumber(2, 8);
      return { text: `(${a} + ${b}) × ${c} = ?`, answer: (a + b) * c };
    },
    () => {
      const base = randomNumber(2, 8);
      const multiplier = randomNumber(2, 9);
      const addend = randomNumber(2, 20);
      return { text: `${base}² + ${multiplier} × ${addend} = ?`, answer: base ** 2 + multiplier * addend };
    },
    () => {
      const start = randomNumber(2, 20);
      const divisor = randomNumber(2, 6);
      const quotient = randomNumber(3, 12);
      return { text: `${start} + ${quotient * divisor} ÷ ${divisor} = ?`, answer: start + quotient };
    },
    () => {
      const multiplier = randomNumber(2, 6);
      const a = randomNumber(2, 8);
      const b = randomNumber(2, 8);
      const subtract = randomNumber(1, 15);
      return { text: `${multiplier} × (${a} + ${b}) − ${subtract} = ?`, answer: multiplier * (a + b) - subtract };
    },
  ])(),
  "y7-one-step-equations": () => sample([
    () => {
      const answer = randomNumber(4, 24);
      const offset = randomNumber(5, 30);
      return { text: `Solve x + ${offset} = ${answer + offset}`, answer };
    },
    () => {
      const answer = randomNumber(6, 30);
      const offset = randomNumber(2, 12);
      return { text: `Solve x − ${offset} = ${answer - offset}`, answer };
    },
    () => {
      const answer = randomNumber(3, 12);
      const factor = randomNumber(2, 12);
      return { text: `Solve ${factor}x = ${answer * factor}`, answer };
    },
    () => {
      const answer = randomNumber(3, 12);
      const divisor = randomNumber(2, 12);
      return { text: `Solve x ÷ ${divisor} = ${answer}`, answer: answer * divisor };
    },
  ])(),
  "y8-square-powers": () => sample([
    () => {
      const a = randomNumber(2, 5);
      const b = randomNumber(2, 5);
      return { text: `${a}² + ${b}² = ?`, answer: a ** 2 + b ** 2 };
    },
    () => {
      const value = randomNumber(6, 15);
      return { text: `${value}² = ?`, answer: value ** 2 };
    },
    () => {
      const value = randomNumber(4, 14);
      return { text: `√${value ** 2} = ?`, answer: value };
    },
  ])(),
  "y8-ratios": () => sample([
    () => {
      const left = randomNumber(2, 5);
      const right = randomNumber(3, 8);
      const total = (left + right) * randomNumber(4, 9);
      return {
        text: `Share ${total} in the ratio ${left}:${right}. Larger share = ?`,
        answer: Math.max(left, right) * (total / (left + right)),
      };
    },
    () => {
      const left = randomNumber(2, 6);
      const right = randomNumber(2, 6);
      const multiplier = randomNumber(5, 12);
      return {
        text: `Ratio ${left}:${right}, multiplier ${multiplier}. Total = ?`,
        answer: (left + right) * multiplier,
      };
    },
  ])(),
  "y8-percentage-change": () => sample([
    () => {
      const percent = sample([10, 20, 25]);
      const base = sample([40, 60, 80, 100, 120]);
      return { text: `${base} increased by ${percent}% = ?`, answer: base + (base * percent) / 100 };
    },
    () => {
      const percent = sample([10, 20, 25, 50]);
      const base = sample([40, 60, 80, 100, 120, 160]);
      return { text: `${base} decreased by ${percent}% = ?`, answer: base - (base * percent) / 100 };
    },
  ])(),
  "y8-linear-equations": () => sample([
    () => {
      const answer = randomNumber(3, 16);
      const coefficient = randomNumber(2, 9);
      return { text: `Solve ${coefficient}x = ${coefficient * answer}`, answer };
    },
    () => {
      const answer = randomNumber(3, 16);
      const divisor = randomNumber(2, 8);
      return { text: `Solve x ÷ ${divisor} = ${answer}`, answer: answer * divisor };
    },
  ])(),
  "y9-index-laws": () => sample([
    () => {
      const base = randomNumber(2, 5);
      const leftPower = randomNumber(2, 5);
      const rightPower = randomNumber(2, 5);
      return { text: `${base}^${leftPower} × ${base}^${rightPower} = ${base}^?`, answer: leftPower + rightPower };
    },
    () => {
      const base = randomNumber(2, 5);
      const topPower = randomNumber(6, 10);
      const bottomPower = randomNumber(2, topPower - 2);
      return { text: `${base}^${topPower} ÷ ${base}^${bottomPower} = ${base}^?`, answer: topPower - bottomPower };
    },
  ])(),
  "y9-gradients": () => sample([
    () => {
      const gradient = randomNumber(2, 6);
      const x = randomNumber(3, 8);
      const y = gradient * x;
      return { text: `Gradient from (0, 0) to (${x}, ${y}) = ?`, answer: gradient };
    },
    () => {
      const gradient = randomNumber(-5, 5) || 2;
      const run = randomNumber(2, 8);
      return { text: `Line rises ${gradient * run} for run ${run}. Gradient = ?`, answer: gradient };
    },
  ])(),
  "y9-expanding-brackets": () => sample([
    () => {
      const coefficient = randomNumber(2, 6);
      const inner = randomNumber(2, 8);
      return { text: `Find the coefficient of x in ${coefficient}(${inner}x + 3)`, answer: coefficient * inner };
    },
    () => {
      const coefficient = randomNumber(2, 7);
      const constant = randomNumber(2, 8);
      return { text: `Expand ${coefficient}(x + ${constant}). Constant term = ?`, answer: coefficient * constant };
    },
  ])(),
  "y9-two-step-equations": () => sample([
    () => {
      const answer = randomNumber(4, 18);
      const coefficient = randomNumber(2, 6);
      const offset = randomNumber(5, 20);
      return { text: `Solve ${coefficient}x − ${offset} = ${coefficient * answer - offset}`, answer };
    },
    () => {
      const answer = randomNumber(4, 18);
      const coefficient = randomNumber(2, 6);
      const offset = randomNumber(5, 20);
      return { text: `Solve ${coefficient}x + ${offset} = ${coefficient * answer + offset}`, answer };
    },
  ])(),
  "y10-quadratics": () => sample([
    () => {
      const rootA = randomNumber(2, 7);
      const rootB = randomNumber(rootA + 1, 10);
      return { text: `Find the smaller solution: x² − ${rootA + rootB}x + ${rootA * rootB} = 0`, answer: rootA };
    },
    () => {
      const rootA = randomNumber(2, 7);
      const rootB = randomNumber(rootA + 1, 10);
      return { text: `Find the larger solution: x² − ${rootA + rootB}x + ${rootA * rootB} = 0`, answer: rootB };
    },
  ])(),
  "y10-pythagoras": () => sample([
    () => {
      const triples = [
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25],
      ];
      const [a, b, c] = sample(triples);
      return { text: `Right triangle legs ${a} and ${b}. Hypotenuse = ?`, answer: c };
    },
    () => {
      const triples = [
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25],
      ];
      const [a, b, c] = sample(triples);
      return { text: `Hypotenuse ${c}, one leg ${a}. Other leg = ?`, answer: b };
    },
  ])(),
  "y10-simultaneous-equations": () => sample([
    () => {
      const x = randomNumber(3, 12);
      const y = randomNumber(1, x - 1);
      return { text: `Find x: x + y = ${x + y}, x − y = ${x - y}`, answer: x };
    },
    () => {
      const x = randomNumber(3, 12);
      const y = randomNumber(1, x - 1);
      return { text: `Find y: x + y = ${x + y}, x − y = ${x - y}`, answer: y };
    },
  ])(),
  "y10-functions": () => sample([
    () => {
      const x = randomNumber(3, 8);
      const a = randomNumber(2, 5);
      const b = randomNumber(1, 8);
      return { text: `f(x) = ${a}x² − ${b}x. f(${x}) = ?`, answer: a * x ** 2 - b * x };
    },
    () => {
      const x = randomNumber(3, 12);
      const a = randomNumber(2, 6);
      const b = randomNumber(4, 20);
      return { text: `f(x) = ${a}x + ${b}. f(${x}) = ?`, answer: a * x + b };
    },
  ])(),
  "y11-derivatives": () => sample([
    () => {
      const coefficient = randomNumber(2, 8);
      const power = randomNumber(2, 4);
      return { text: `d/dx (${coefficient}x^${power}) = ?x^${power - 1}`, answer: coefficient * power };
    },
    () => {
      const coefficient = randomNumber(2, 8);
      return { text: `d/dx (${coefficient}x²) = ?x`, answer: coefficient * 2 };
    },
  ])(),
  "y11-logarithms": () => sample([
    () => {
      const base = sample([2, 3, 5]);
      const power = randomNumber(2, 5);
      return { text: `log_${base}(${base ** power}) = ?`, answer: power };
    },
    () => {
      const base = sample([2, 3, 4]);
      return { text: `log_${base}(${base}) = ?`, answer: 1 };
    },
  ])(),
  "y11-arithmetic-sequences": () => sample([
    () => {
      const a = randomNumber(2, 7);
      const d = randomNumber(2, 8);
      const n = randomNumber(6, 12);
      return { text: `Arithmetic sequence a=${a}, d=${d}. T${n} = ?`, answer: a + (n - 1) * d };
    },
    () => {
      const a = randomNumber(3, 12);
      const d = randomNumber(2, 9);
      const n = randomNumber(4, 9);
      return { text: `${a}, ${a + d}, ${a + 2 * d}, ... T${n} = ?`, answer: a + (n - 1) * d };
    },
  ])(),
  "y11-surds": () => sample([
    () => {
      const coefficient = randomNumber(2, 9);
      const radicand = sample([2, 3, 5, 6, 7, 10, 11, 13]);
      return {
        text: `Simplify √${coefficient ** 2 * radicand} = ?√?`,
        answer: { type: "surd", coefficient, radicand },
      };
    },
    () => {
      const coefficient = randomNumber(2, 8);
      const radicand = sample([2, 3, 5, 6, 7, 10, 11, 15]);
      return {
        text: `Write √${coefficient ** 2 * radicand} as a√b`,
        answer: { type: "surd", coefficient, radicand },
      };
    },
  ])(),
  "y12-calculus-derivatives": () => sample([
    () => {
      const power = randomNumber(3, 5);
      const x = randomNumber(2, 4);
      return { text: `If f(x)=x^${power}, f′(${x}) = ?`, answer: power * x ** (power - 1) };
    },
    () => {
      const coefficient = randomNumber(2, 5);
      const x = randomNumber(2, 4);
      return { text: `If f(x)=${coefficient}x², f′(${x}) = ?`, answer: 2 * coefficient * x };
    },
  ])(),
  "y12-integrals": () => sample([
    () => {
      const coefficient = randomNumber(2, 9);
      const power = randomNumber(1, 3);
      return { text: `Find k: ∫ ${coefficient * (power + 1)}x^${power} dx = kx^${power + 1} + C`, answer: coefficient };
    },
    () => {
      const coefficient = randomNumber(2, 8);
      return { text: `Find k: ∫ ${coefficient} dx = kx + C`, answer: coefficient };
    },
  ])(),
  "y12-complex-numbers": () => sample([
    () => {
      const triples = [
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
      ];
      const [real, imaginary, magnitude] = sample(triples);
      return { text: `|${real} + ${imaginary}i| = ?`, answer: magnitude };
    },
    () => {
      const triples = [
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
      ];
      const [real, imaginary, magnitude] = sample(triples);
      return { text: `|${real} − ${imaginary}i| = ?`, answer: magnitude };
    },
  ])(),
  "y12-series": () => sample([
    () => {
      const n = randomNumber(8, 18);
      return { text: `1 + 2 + ... + ${n} = ?`, answer: (n * (n + 1)) / 2 };
    },
    () => {
      const n = randomNumber(5, 12);
      return { text: `2 + 4 + ... + ${2 * n} = ?`, answer: n * (n + 1) };
    },
  ])(),
};

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

function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function canUseTestStudentMode() {
  return cleanEmail(state.authEmail) === TEST_STUDENT_ADMIN_EMAIL;
}

function getYearRank(yearLevel) {
  return YEAR_LEVELS.findIndex((level) => level.id === yearLevel);
}

function getGameRequiredYear(gameId) {
  return cleanYearLevel(gameInfo[gameId]?.accessYear) || DEFAULT_YEAR_LEVEL;
}

function getGameDuration(gameId) {
  return PEN_AND_PAPER_GAME_IDS.has(gameId) ? PAPER_GAME_SECONDS : GAME_SECONDS;
}

function getGameDurationLabel(gameId) {
  const minutes = getGameDuration(gameId) / 60;
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

function getPenAndPaperNote(gameId) {
  return PEN_AND_PAPER_GAME_IDS.has(gameId)
    ? "Pen and paper recommended. This challenge gives 5 minutes so you can write working out."
    : "";
}

function getGameHash(gameId, { view = "" } = {}) {
  const suffix = view === "leaderboard" ? "/leaderboard" : "";
  return `#game/${encodeURIComponent(gameId)}${suffix}`;
}

function canYearAccessGame(yearLevel, gameId) {
  const yearRank = getYearRank(yearLevel);
  const requiredRank = getYearRank(getGameRequiredYear(gameId));
  return yearRank >= 0 && requiredRank >= 0 && yearRank >= requiredRank;
}

function canAccessGame(gameId) {
  if (!gameInfo[gameId]) return false;
  if (!state.sharedConfigured || !state.authAllowed) return true;
  if (isTeacherTestingAsStudent()) {
    return canYearAccessGame(state.testStudentYearLevel, gameId);
  }
  if (getActiveAccountType() === "teacher") return true;

  return canYearAccessGame(state.studentYearLevel, gameId);
}

function getForcedLeaderboardYearLevel() {
  if (!state.sharedConfigured || !state.authAllowed) return "";
  if (isTeacherTestingAsStudent()) return cleanYearLevel(state.testStudentYearLevel);
  if (getActiveAccountType() === "student") return cleanYearLevel(state.studentYearLevel);
  return "";
}

function canChangeLeaderboardYear() {
  if (!state.sharedConfigured) return true;
  if (getForcedLeaderboardYearLevel()) return false;
  return getActiveAccountType() === "teacher";
}

function canReadSharedLeaderboards() {
  if (!state.sharedConfigured) return true;
  if (!state.authAllowed || !state.accountType) return false;
  if (isTeacherTestingAsStudent()) return Boolean(cleanYearLevel(state.testStudentYearLevel));
  if (getActiveAccountType() === "teacher") return state.teacherYearLevels.length > 0;
  return Boolean(state.studentYearLevel);
}

function canReadGameLeaderboard(gameId) {
  if (!canReadSharedLeaderboards()) return false;
  const forcedYearLevel = getForcedLeaderboardYearLevel();
  return !forcedYearLevel || canYearAccessGame(forcedYearLevel, gameId);
}

function getLeaderboardAccessMessage() {
  if (!state.sharedConfigured) {
    return "Firebase setup needed. Until then, this leaderboard uses scores saved on this device.";
  }

  if (!state.authAllowed) {
    return `Sign in with a ${getAllowedDomainLabel()} account to view shared leaderboards.`;
  }

  if (getActiveAccountType() === "teacher" && !state.teacherYearLevels.length) {
    return "Choose your teaching year levels before viewing shared leaderboards.";
  }

  if (getActiveAccountType() === "student" && !state.studentYearLevel) {
    return "Choose and save your year level before viewing shared leaderboards.";
  }

  const forcedYearLevel = getForcedLeaderboardYearLevel();
  if (forcedYearLevel && !canYearAccessGame(forcedYearLevel, state.game)) {
    return `This skill leaderboard is locked for ${getYearLabel(forcedYearLevel)} students.`;
  }

  return "Leaderboards are locked to your account setup.";
}

function getProgressAccessMessage() {
  if (!state.sharedConfigured) {
    return "Firebase setup needed. Until then, medal progress uses scores saved on this device.";
  }

  if (!state.authAllowed) {
    return `Sign in with a ${getAllowedDomainLabel()} account to load synced medal progress.`;
  }

  if (getActiveAccountType() === "teacher" && !state.teacherYearLevels.length) {
    return "Choose your teaching year levels before loading synced medal progress.";
  }

  if (getActiveAccountType() === "student" && !state.studentYearLevel) {
    return "Choose and save your year level before loading synced medal progress.";
  }

  return "Progress is locked to your account setup.";
}

function canUseAllTeacherFilter() {
  if (isTeacherTestingAsStudent()) return false;
  return state.sharedConfigured
    && state.authAllowed
    && (getActiveAccountType() === "teacher" || getActiveAccountType() === "student");
}

function cleanAllowedTeacherFilter(filter) {
  const cleanFilter = cleanTeacherFilter(filter);
  return cleanFilter === "all" && !canUseAllTeacherFilter() ? "year" : cleanFilter;
}

function shouldHideInaccessibleGames() {
  if (!state.sharedConfigured || !state.authAllowed) return false;
  if (isTeacherTestingAsStudent()) return true;
  return getActiveAccountType() === "student" && Boolean(state.studentYearLevel);
}

function getVisibleGameIds() {
  return shouldHideInaccessibleGames()
    ? GAME_IDS.filter(canAccessGame)
    : GAME_IDS;
}

function getVisibleBoardGameIds() {
  const boardGameIds = GAME_IDS.filter((gameId) => canYearAccessGame(state.boardYearLevel, gameId));
  return shouldHideInaccessibleGames()
    ? boardGameIds.filter(canAccessGame)
    : boardGameIds;
}

function ensureVisibleBoard() {
  const visibleGameIds = getVisibleBoardGameIds();
  if (visibleGameIds.length && !visibleGameIds.includes(state.board)) {
    state.board = visibleGameIds[0];
  }
}

function getGameAccessMessage(gameId) {
  if (!state.sharedConfigured || !state.authAllowed) {
    return "Sign in to see the games available to you.";
  }

  if (isTeacherTestingAsStudent()) {
    if (canAccessGame(gameId)) {
      return `Available to ${getYearLabel(state.testStudentYearLevel)} test student.`;
    }

    return "Pick a higher test year to play this challenge.";
  }

  if (getActiveAccountType() === "teacher") {
    return "Available for teacher accounts.";
  }

  if (!state.studentYearLevel) {
    return "Save your year level to see available challenges.";
  }

  if (canAccessGame(gameId)) {
    return `Available to ${getYearLabel(state.studentYearLevel)} students.`;
  }

  return "This challenge is not available for your year level.";
}

function createYearOptions({ includePlaceholder = false } = {}) {
  const options = YEAR_LEVELS.map(
    (yearLevel) => `<option value="${yearLevel.id}">${yearLevel.label}</option>`,
  ).join("");

  if (!includePlaceholder) return options;
  return `<option value="">Choose your year level</option>${options}`;
}

function createLeaderboardYearOptions() {
  const forcedYearLevel = getForcedLeaderboardYearLevel();
  const yearLevels = forcedYearLevel
    ? YEAR_LEVELS.filter((yearLevel) => yearLevel.id === forcedYearLevel)
    : YEAR_LEVELS;

  return yearLevels.map(
    (yearLevel) => `<option value="${yearLevel.id}">${yearLevel.label}</option>`,
  ).join("");
}

function setupYearControls() {
  elements.boardYearSelect.innerHTML = createLeaderboardYearOptions();
  elements.boardYearSelect.value = state.boardYearLevel;
  elements.gameBoardYearSelect.innerHTML = createLeaderboardYearOptions();
  elements.gameBoardYearSelect.value = state.boardYearLevel;
  elements.studentYearSelect.innerHTML = createYearOptions({ includePlaceholder: true });
  elements.testStudentYearSelect.innerHTML = createYearOptions();
  elements.testStudentYearSelect.value = state.testStudentYearLevel;
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
  return Object.fromEntries(GAME_IDS.map((gameId) => [gameId, []]));
}

function cloneSharedScores() {
  return Object.fromEntries(GAME_IDS.map((gameId) => [gameId, null]));
}

function normalizeScores(scores) {
  return scores.filter((entry) => {
    if (!entry || typeof entry.name !== "string" || !Number.isInteger(entry.score)) return false;
    if (entry.bestStreak !== undefined && !Number.isInteger(entry.bestStreak)) return false;
    if (entry.role === "teacher") return Array.isArray(entry.teacherYearLevels);
    return entry.role === "student" && validYearLevels.has(entry.yearLevel);
  });
}

function getLocalScores() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const scores = cloneDefaultScores();
    if (!saved || typeof saved !== "object") return scores;

    GAME_IDS.forEach((gameId) => {
      if (Array.isArray(saved[gameId])) {
        scores[gameId] = saved[gameId];
      }
    });
    return scores;
  } catch {
    return cloneDefaultScores();
  }
}

function getActiveAccountType() {
  return state.accountType;
}

function isTeacherTestingAsStudent() {
  return state.accountType === "teacher"
    && canUseTestStudentMode()
    && state.testStudentMode
    && Boolean(cleanYearLevel(state.testStudentYearLevel));
}

function getTestStudentLabel() {
  return `${getYearLabel(state.testStudentYearLevel)} Test Student`;
}

function shouldSaveScore(scoreContext = getScoreContext()) {
  return scoreContext.role !== "test";
}

function accountSetupRequired() {
  if (!state.sharedConfigured || !state.authAllowed) return false;

  const accountType = getActiveAccountType();
  if (!state.accountType) return true;
  if (accountType === "teacher") {
    if (isTeacherTestingAsStudent()) return !cleanYearLevel(state.testStudentYearLevel);
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
    if (isTeacherTestingAsStudent() && !cleanYearLevel(state.testStudentYearLevel)) {
      return "Choose a test student year level before playing.";
    }

    if (!state.teacherYearLevels.length) {
      return "Choose your teaching year levels before playing as a teacher.";
    }
  }

  return "Choose and save your year level before playing.";
}

function getScoreContext() {
  if (isTeacherTestingAsStudent()) {
    return {
      role: "test",
      yearLevel: state.testStudentYearLevel,
    };
  }

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
  if (isTeacherTestingAsStudent()) return false;
  if (state.authUid) return entry.id === state.authUid || entry.uid === state.authUid;
  return entry.name === state.player;
}

function saveLocalScore() {
  const scoreContext = getScoreContext();
  if (!shouldSaveScore(scoreContext)) {
    return {
      rank: 0,
      improved: false,
      previousScore: null,
      bestScore: null,
      saved: false,
    };
  }

  const scores = getLocalScores();
  const playerName = state.player || getGooglePlayerName();
  const currentUid = state.authUid || `${scoreContext.role}:${playerName}`;
  const existingIndex = scores[state.game].findIndex(
    (entry) => (entry.uid || entry.id) === currentUid,
  );
  const previousScore = existingIndex >= 0 ? scores[state.game][existingIndex].score : null;
  const previousBestStreak = existingIndex >= 0 && Number.isInteger(scores[state.game][existingIndex].bestStreak)
    ? scores[state.game][existingIndex].bestStreak
    : 0;
  const improved = previousScore === null || state.score > previousScore;
  const bestStreak = Math.max(previousBestStreak, state.bestStreak);
  const entry = {
    id: currentUid,
    uid: currentUid,
    name: playerName,
    score: improved ? state.score : previousScore,
    bestStreak,
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

  const visibleScores = filterScoresForBoard(scores[state.game], state.boardYearLevel, state.teacherFilter, { scoreLimit: null });

  return {
    rank: visibleScores.findIndex(scoreMatchesCurrentPlayer) + 1,
    improved,
    previousScore,
    bestScore: improved ? state.score : previousScore,
    saved: true,
  };
}

function filterScoresForBoard(scores, yearLevel, teacherFilter, { scoreLimit = 20 } = {}) {
  const filteredScores = normalizeScores(scores)
    .filter((entry) => {
      if (entry.role === "teacher") {
        if (teacherFilter === "none") return false;
        if (teacherFilter === "all") return true;
        return entry.teacherYearLevels.includes(yearLevel);
      }

      return entry.yearLevel === yearLevel;
    })
    .sort((a, b) => b.score - a.score);

  return scoreLimit === null ? filteredScores : filteredScores.slice(0, scoreLimit);
}

function getRawScores(game) {
  return state.sharedScores[game] !== null ? state.sharedScores[game] : getLocalScores()[game];
}

function getVisibleScores(game = state.board, options = {}) {
  const rawScores = state.sharedScores[game] !== null ? state.sharedScores[game] : getLocalScores()[game];
  return filterScoresForBoard(rawScores, state.boardYearLevel, state.teacherFilter, options);
}

function stopSharedBoardListeners({ clearScores = false } = {}) {
  state.boardUnsubscribes.forEach((unsubscribe) => unsubscribe());
  state.boardUnsubscribes.clear();
  state.boardListenerContexts.clear();

  if (clearScores) {
    state.sharedScores = cloneSharedScores();
  }
}

function getScoreKey(entry) {
  return entry.uid || entry.id || `${entry.role}:${entry.name}:${entry.yearLevel || entry.teacherYearLevels?.join("-") || "teacher"}`;
}

function getTotalScores(gameIds) {
  const totals = new Map();

  gameIds.forEach((gameId) => {
    filterScoresForBoard(getRawScores(gameId), state.boardYearLevel, state.teacherFilter, { scoreLimit: null })
      .forEach((entry) => {
        const key = getScoreKey(entry);
        const existing = totals.get(key) || {
          id: key,
          uid: key,
          name: entry.name,
          score: 0,
          role: entry.role,
          yearLevel: entry.yearLevel,
          teacherYearLevels: entry.teacherYearLevels,
          games: 0,
        };

        existing.score += entry.score;
        existing.games += 1;
        totals.set(key, existing);
      });
  });

  return [...totals.values()]
    .sort((a, b) => b.score - a.score || b.games - a.games)
    .slice(0, 20);
}

function getHighestStreakScores(gameIds) {
  const totals = new Map();

  gameIds.forEach((gameId) => {
    filterScoresForBoard(getRawScores(gameId), state.boardYearLevel, state.teacherFilter, { scoreLimit: null })
      .forEach((entry) => {
        const key = getScoreKey(entry);
        const streak = Number.isInteger(entry.bestStreak) ? entry.bestStreak : 0;
        const existing = totals.get(key) || {
          id: key,
          uid: key,
          name: entry.name,
          score: 0,
          totalScore: 0,
          role: entry.role,
          yearLevel: entry.yearLevel,
          teacherYearLevels: entry.teacherYearLevels,
          games: 0,
          streakGame: "",
        };

        existing.totalScore += entry.score;
        existing.games += 1;
        if (streak > existing.score) {
          existing.score = streak;
          existing.streakGame = gameInfo[gameId]?.name || "";
        }
        totals.set(key, existing);
      });
  });

  return [...totals.values()]
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.totalScore - a.totalScore || b.games - a.games)
    .slice(0, 20);
}

function getCurrentPlayerBestScore(gameId) {
  const score = normalizeScores(getRawScores(gameId)).find(scoreMatchesCurrentPlayer);
  return Number.isInteger(score?.score) ? score.score : 0;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function offsetDateKey(dateKey, offsetDays) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + offsetDays);
  return getLocalDateKey(date);
}

function getProgressStore() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

function saveProgressStore(store) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
  } catch {
    // Progress history is helpful, but the game should keep working if storage is blocked.
  }
}

function getProgressPlayerKey(scoreContext = getScoreContext()) {
  if (state.authUid) return `uid:${state.authUid}`;
  const playerName = getGooglePlayerName().toLowerCase();
  const contextKey = scoreContext.role === "teacher"
    ? scoreContext.teacherYearLevels.join("-")
    : scoreContext.yearLevel || state.boardYearLevel;
  return `local:${scoreContext.role}:${contextKey}:${playerName}`;
}

function getProgressRecord(scoreContext = getScoreContext()) {
  const store = getProgressStore();
  const key = getProgressPlayerKey(scoreContext);
  const record = store[key] && typeof store[key] === "object" ? store[key] : {};

  return {
    bronzeDays: Array.isArray(record.bronzeDays) ? record.bronzeDays : [],
    attempts: Array.isArray(record.attempts) ? record.attempts : [],
  };
}

function saveProgressRecord(record, scoreContext = getScoreContext()) {
  const store = getProgressStore();
  store[getProgressPlayerKey(scoreContext)] = record;
  saveProgressStore(store);
}

function isMrThorneScore(entry) {
  const cleanName = String(entry?.name || "").trim().toLowerCase();
  return entry?.role === "teacher" && MR_THORNE_NAMES.has(cleanName);
}

function getMrThorneBestScore(gameId) {
  return normalizeScores(getRawScores(gameId))
    .filter(isMrThorneScore)
    .reduce((highest, entry) => Math.max(highest, entry.score), 0);
}

function getMedalGoalsForGame(gameId) {
  const mrThorneScore = getMrThorneBestScore(gameId);
  return MEDAL_GOALS.map((goal) => ({
    ...goal,
    score: goal.id === "thorne" ? Math.max(goal.score, mrThorneScore) : goal.score,
  }));
}

function getBestMedalForScore(score, goals) {
  return goals.reduce((best, goal) => (score >= goal.score ? goal : best), null);
}

function recordProgressAttempt(gameId, score, scoreContext = getScoreContext()) {
  if (!shouldSaveScore(scoreContext)) return;

  const goals = getMedalGoalsForGame(gameId);
  const bronzeGoal = goals.find((goal) => goal.id === "bronze");
  if (!bronzeGoal || score < bronzeGoal.score) return;

  const record = getProgressRecord(scoreContext);
  const today = getLocalDateKey();
  const bronzeDays = new Set(record.bronzeDays);
  bronzeDays.add(today);
  record.bronzeDays = [...bronzeDays].sort();
  record.attempts = [
    ...record.attempts,
    {
      date: today,
      game: gameId,
      score,
      medal: getBestMedalForScore(score, goals)?.id || "bronze",
      savedAt: new Date().toISOString(),
    },
  ].slice(-400);
  saveProgressRecord(record, scoreContext);
}

function getBronzeStreak() {
  const record = getProgressRecord();
  const bronzeDays = new Set(record.bronzeDays);
  const today = getLocalDateKey();
  const yesterday = offsetDateKey(today, -1);
  let cursor = bronzeDays.has(today) ? today : yesterday;
  let streak = 0;

  while (bronzeDays.has(cursor)) {
    streak += 1;
    cursor = offsetDateKey(cursor, -1);
  }

  return {
    streak,
    completedToday: bronzeDays.has(today),
    lastBronzeDay: record.bronzeDays.at(-1) || "",
  };
}

function setProgressStatus(status, message) {
  elements.progressStatus.dataset.status = status;
  elements.progressStatus.lastChild.textContent = message;
}

function renderProgressPage() {
  const gameIds = getVisibleGameIds();
  if (state.sharedConfigured && canReadSharedLeaderboards()) {
    listenToSharedBoards(gameIds, { teacherFilterOverride: "all" });
  }

  const rows = gameIds.map((gameId) => {
    const info = gameInfo[gameId];
    const bestScore = getCurrentPlayerBestScore(gameId);
    const goals = getMedalGoalsForGame(gameId);
    const bestMedal = getBestMedalForScore(bestScore, goals);

    return {
      gameId,
      info,
      bestScore,
      goals,
      bestMedal,
    };
  });

  const bronzeCount = rows.filter((row) => row.bestScore >= row.goals[0].score).length;
  const goldCount = rows.filter((row) => row.bestScore >= row.goals[2].score).length;
  const thorneCount = rows.filter((row) => row.bestScore >= row.goals[3].score).length;
  const streak = getBronzeStreak();

  elements.progressStreakCount.textContent = `${streak.streak} ${streak.streak === 1 ? "day" : "days"}`;
  elements.progressStreakStatus.textContent = streak.completedToday
    ? "Bronze or better is banked for today."
    : streak.streak
      ? "Get bronze or better today to keep this streak going."
      : "Get bronze or better today to start a streak.";
  elements.progressSummary.textContent = `${bronzeCount}/${gameIds.length} bronze, ${goldCount} gold, ${thorneCount} Mr Thorne targets reached.`;

  elements.progressGrid.innerHTML = rows.length
    ? rows.map(({ gameId, info, bestScore, goals, bestMedal }) => `
        <article class="progress-game-card ${bestMedal ? `medal-${bestMedal.id}` : ""}">
          <div class="progress-game-head">
            <span class="mini-game-icon" aria-hidden="true">${escapeHtml(info.icon)}</span>
            <div>
              <p>${escapeHtml(getGameDurationLabel(gameId))}</p>
              <h3>${escapeHtml(info.name)}</h3>
            </div>
          </div>
          <div class="progress-best-score">
            <span>Best score</span>
            <strong>${bestScore.toLocaleString()}</strong>
            <small>${bestMedal ? `${escapeHtml(bestMedal.label)} reached` : "No medal yet"}</small>
          </div>
          <div class="medal-track" aria-label="${escapeHtml(info.name)} medal targets">
            ${goals.map((goal) => `
              <div class="medal-step ${bestScore >= goal.score ? "achieved" : ""}">
                <span>${escapeHtml(goal.label)}</span>
                <strong>${goal.score.toLocaleString()}</strong>
              </div>
            `).join("")}
          </div>
          <a class="home-full-link" href="${getGameHash(gameId)}">Play ${escapeHtml(info.shortName)}</a>
        </article>
      `).join("")
    : `<article class="progress-game-card"><p>No available games yet. Sign in and save your profile to see your games.</p></article>`;

  if (!state.sharedConfigured) {
    setProgressStatus("local", "Firebase setup needed. Progress uses scores saved on this device.");
  } else if (!canReadSharedLeaderboards()) {
    setProgressStatus("local", getProgressAccessMessage());
  } else if (gameIds.some((gameId) => state.sharedScores[gameId] === null)) {
    setProgressStatus("connecting", "Loading your medal progress and Mr Thorne targets...");
  } else {
    setProgressStatus("shared", "Progress is using your saved best scores. Daily streaks are kept on this device from new bronze-or-better attempts.");
  }
}

function getCurrentPlayerGameRank(gameId) {
  const rankIndex = filterScoresForBoard(
    getRawScores(gameId),
    state.boardYearLevel,
    state.teacherFilter,
    { scoreLimit: null },
  ).findIndex(scoreMatchesCurrentPlayer);
  return rankIndex >= 0 ? rankIndex + 1 : 0;
}

function formatGameRank(rank) {
  return rank > 0 ? `#${rank}` : "No rank";
}

function getGameRankLabel(gameId) {
  return formatGameRank(getCurrentPlayerGameRank(gameId));
}

function getGameRankStatusMessage(gameId) {
  if (!canReadGameLeaderboard(gameId) && state.sharedConfigured) {
    return getLeaderboardAccessMessage();
  }

  const rank = getCurrentPlayerGameRank(gameId);
  const bestScore = getCurrentPlayerBestScore(gameId);

  if (rank > 0) {
    return `You are ranked #${rank} for ${gameInfo[gameId].name} with ${bestScore.toLocaleString()} pts.`;
  }

  if (bestScore > 0) {
    return `Your best score is ${bestScore.toLocaleString()} pts. Check the leaderboard once it updates to see your rank.`;
  }

  return "Play this game to earn a leaderboard rank.";
}

function setLeaderboardStatus(status, message) {
  elements.leaderboardStatus.dataset.status = status;
  elements.leaderboardStatus.lastChild.textContent = message;
}

function setGameBoardStatus(status, message) {
  elements.gameBoardStatus.dataset.status = status;
  elements.gameBoardStatus.lastChild.textContent = message;
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
    if (state.testStudentMode) return Boolean(cleanYearLevel(state.testStudentYearLevel));
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
    if (isTeacherTestingAsStudent()) {
      elements.startPlayer.textContent = `Playing as ${getTestStudentLabel()}. Test scores will not save.`;
      elements.startGameButton.textContent = "Start test game →";
      return;
    }

    if (state.teacherYearLevels.length) {
      elements.startPlayer.textContent = `Playing as ${getGooglePlayerName()}, teacher.`;
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
  state.teacherFilter = cleanAllowedTeacherFilter(state.teacherFilter);
  document.querySelectorAll("[data-teacher-filter]").forEach((button) => {
    const filter = cleanTeacherFilter(button.dataset.teacherFilter);
    button.hidden = filter === "all" && !canUseAllTeacherFilter();
    button.classList.toggle("active", filter === state.teacherFilter);
  });
}

function renderGameCards() {
  const visibleGameIds = getVisibleGameIds();
  elements.gameGrid.innerHTML = visibleGameIds.map((gameId) => {
    const info = gameInfo[gameId];
    const locked = !canAccessGame(gameId);
    const buttonLabel = locked ? "Locked for now" : `Open ${info.shortName}`;

    return `
      <article class="game-card ${info.cardClass} ${locked ? "game-card-locked" : ""}">
        <div class="game-icon" aria-hidden="true">${escapeHtml(info.icon)}</div>
        <h3>${escapeHtml(info.name)}</h3>
        <p>${escapeHtml(info.cardDescription)}</p>
        <div class="game-card-meta">
          <span>${escapeHtml(getGameDurationLabel(gameId))}</span>
          <span>Rank ${escapeHtml(getGameRankLabel(gameId))}</span>
        </div>
        <ul>
          ${info.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
        </ul>
        <a class="play-button ${locked ? "disabled" : ""}" href="${locked ? "#games" : getGameHash(gameId)}" data-game="${escapeHtml(gameId)}" aria-disabled="${locked}">
          ${escapeHtml(buttonLabel)} <span aria-hidden="true">→</span>
        </a>
      </article>
    `;
  }).join("");
}

function renderScoreRows(
  scores,
  emptyMessage,
  {
    scoreLimit = 7,
    showGameCount = false,
    showStreakGame = false,
    valueFormatter = (entry) => entry.score.toLocaleString(),
  } = {},
) {
  if (!scores.length) {
    return `<li class="empty-scores">${escapeHtml(emptyMessage)}</li>`;
  }

  return scores
    .slice(0, scoreLimit)
    .map((entry, index) => {
      const gameCountLabel = showGameCount
        ? ` • ${entry.games} ${entry.games === 1 ? "game" : "games"}`
        : "";
      const streakGameLabel = showStreakGame && entry.streakGame
        ? ` • ${entry.streakGame}`
        : "";

      return `
        <li class="score-row ${scoreMatchesCurrentPlayer(entry) ? "current-player" : ""} ${entry.role === "teacher" ? "teacher-score" : ""}">
          <span class="score-rank">${index + 1}</span>
          <span class="list-avatar">${escapeHtml(initials(entry.name))}</span>
          <span class="score-name">
            ${escapeHtml(entry.name)}
            <small>${escapeHtml(`${getScoreMeta(entry)}${gameCountLabel}${streakGameLabel}`)}</small>
          </span>
          <span class="score-points">${escapeHtml(valueFormatter(entry))}</span>
        </li>
      `;
    })
    .join("");
}

function getHomeLeaderboardScores(view = state.homeLeaderboardView) {
  const totals = new Map();
  const gameIds = getVisibleBoardGameIds();

  gameIds.forEach((gameId) => {
    normalizeScores(getRawScores(gameId)).forEach((entry) => {
      if (view === "teachers") {
        if (entry.role !== "teacher" || !entry.teacherYearLevels.includes(state.boardYearLevel)) return;
      } else if (entry.role !== "student" || entry.yearLevel !== state.boardYearLevel) {
        return;
      }

      const key = getScoreKey(entry);
      const existing = totals.get(key) || {
        id: key,
        uid: key,
        name: entry.name,
        score: 0,
        role: entry.role,
        yearLevel: entry.yearLevel,
        teacherYearLevels: entry.teacherYearLevels,
        games: 0,
      };

      existing.score += entry.score;
      existing.games += 1;
      totals.set(key, existing);
    });
  });

  return [...totals.values()]
    .sort((a, b) => b.score - a.score || b.games - a.games)
    .slice(0, 5);
}

function ensureHomeFeaturedGame() {
  const gameIds = getVisibleGameIds();
  if (!gameIds.length) {
    state.homeFeaturedGame = "";
    return;
  }

  if (!state.homeFeaturedGame || !gameIds.includes(state.homeFeaturedGame)) {
    state.homeFeaturedGame = gameIds[0];
  }
}

function renderHomeGameStrip() {
  const gameIds = getVisibleGameIds().slice(0, 5);
  elements.homeGameStrip.innerHTML = gameIds.map((gameId) => {
    const info = gameInfo[gameId];
    const locked = !canAccessGame(gameId);
    return `
      <button class="home-game-tile ${gameId === state.homeFeaturedGame ? "active" : ""} ${locked ? "locked" : ""}" type="button" data-game="${escapeHtml(gameId)}" ${locked ? "disabled" : ""} aria-pressed="${gameId === state.homeFeaturedGame}">
        <span aria-hidden="true">${escapeHtml(info.icon)}</span>
        <strong>${escapeHtml(info.shortName)}</strong>
      </button>
    `;
  }).join("");
}

function renderHomeFeaturedGame() {
  ensureHomeFeaturedGame();

  if (!state.homeFeaturedGame) {
    elements.featuredGameHeading.textContent = "No games available yet";
    elements.featuredGameDescription.textContent = "Sign in and save your profile to see the games available for your year level.";
    elements.featuredGameIcon.textContent = "?";
    elements.featuredGameMeta.innerHTML = "";
    elements.featuredGameBullets.innerHTML = "";
    elements.featuredGamePlay.href = "#home";
    elements.featuredGamePlay.textContent = "Choose a game";
    elements.featuredGamePlay.classList.add("disabled");
    elements.featuredGamePlay.setAttribute("aria-disabled", "true");
    elements.featuredGameLeaderboard.href = "#leaderboards";
    elements.featuredGameGoal.textContent = "No rank";
    elements.featuredGameGoalLabel.textContent = "Pick a game to see your rank.";
    return;
  }

  const gameId = state.homeFeaturedGame;
  const info = gameInfo[gameId];
  const locked = !canAccessGame(gameId);
  const playLabel = locked ? "Locked for now" : `Play ${info.name}`;

  elements.featuredGameIcon.textContent = info.icon;
  elements.featuredGameHeading.textContent = info.name;
  elements.featuredGameDescription.textContent = info.description;
  elements.featuredGameMeta.innerHTML = `
    <span>${escapeHtml(getGameDurationLabel(gameId))}</span>
    <span>Rank ${escapeHtml(getGameRankLabel(gameId))}</span>
  `;
  elements.featuredGameBullets.innerHTML = info.bullets
    .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
    .join("");
  elements.featuredGamePlay.href = locked ? "#home" : getGameHash(gameId);
  elements.featuredGamePlay.textContent = playLabel;
  elements.featuredGamePlay.classList.toggle("disabled", locked);
  elements.featuredGamePlay.setAttribute("aria-disabled", String(locked));
  elements.featuredGameLeaderboard.href = getGameHash(gameId, { view: "leaderboard" });
  elements.featuredGameGoal.textContent = getGameRankLabel(gameId);
  elements.featuredGameGoalLabel.textContent = getGameRankStatusMessage(gameId);
}

function renderHomeLeaderboard() {
  const canRead = canReadSharedLeaderboards();
  document.querySelectorAll("[data-home-leaderboard]").forEach((button) => {
    button.classList.toggle("active", button.dataset.homeLeaderboard === state.homeLeaderboardView);
  });

  if (!canRead) {
    elements.homeLeaderboardList.innerHTML = `<li class="home-empty-row">${escapeHtml(getLeaderboardAccessMessage())}</li>`;
    elements.homeLeaderboardStatus.textContent = "Sign in and save your profile to see your year-level leaderboard.";
    return;
  }

  const scores = getHomeLeaderboardScores();
  const viewLabel = state.homeLeaderboardView === "teachers" ? "teachers" : "students";
  const emptyMessage = state.homeLeaderboardView === "teachers"
    ? `No teacher scores yet for ${getYearLabel(state.boardYearLevel)}.`
    : `No ${getYearLabel(state.boardYearLevel)} student scores yet.`;

  elements.homeLeaderboardList.innerHTML = scores.length
    ? scores.map((entry, index) => `
        <li class="home-leaderboard-row ${entry.role === "teacher" ? "teacher-score" : ""}">
          <span class="home-rank">${index + 1}</span>
          <span class="list-avatar">${escapeHtml(initials(entry.name))}</span>
          <span>
            <strong>${escapeHtml(entry.name)}</strong>
            <small>${escapeHtml(`${getScoreMeta(entry)} • ${entry.games} ${entry.games === 1 ? "game" : "games"}`)}</small>
          </span>
          <b>${entry.score.toLocaleString()}</b>
        </li>
      `).join("")
    : `<li class="home-empty-row">${escapeHtml(emptyMessage)}</li>`;

  elements.homeLeaderboardStatus.textContent = state.homeLeaderboardView === "teachers"
    ? `Showing ${getYearLabel(state.boardYearLevel)} teachers separately.`
    : `Showing ${getYearLabel(state.boardYearLevel)} students only.`;

  if (!state.sharedConfigured) {
    elements.homeLeaderboardStatus.textContent += " Local scores are shown until Firebase is connected.";
  } else if (getVisibleBoardGameIds().some((gameId) => state.sharedScores[gameId] === null)) {
    elements.homeLeaderboardStatus.textContent += " Shared scores are still loading.";
  }
}

function renderHomeProgress() {
  const visibleGameIds = getVisibleBoardGameIds();
  const bestScores = visibleGameIds
    .map(getCurrentPlayerBestScore)
    .filter((score) => score > 0);
  const bestScore = bestScores.length ? Math.max(...bestScores) : 0;
  const gamesPlayed = bestScores.length;

  elements.homeGamesPlayed.textContent = String(gamesPlayed);
  elements.homeBestScore.textContent = bestScore.toLocaleString();
  elements.homeCurrentGoal.textContent = getGameRankLabel(state.homeFeaturedGame || "quick");
}

function renderHomeAuthCard() {
  if (state.authAllowed) {
    const roleLabel = getActiveAccountType() === "teacher"
      ? `Teacher • ${getTeacherYearLabel()}`
      : state.studentYearLevel
        ? `Student • ${getYearLabel(state.studentYearLevel)}`
        : "Student profile needed";
    elements.homeAuthTitle.textContent = "Signed in to BMC";
    elements.homeAuthSummary.textContent = `${getGooglePlayerName()} • ${roleLabel}`;
    elements.homeSignInButton.hidden = true;
    elements.homeSettingsButton.hidden = false;
    return;
  }

  elements.homeAuthTitle.textContent = "Sign in to BMC";
  elements.homeAuthSummary.textContent = "Save your progress, compete on leaderboards, and track your rankings.";
  elements.homeSignInButton.hidden = false;
  elements.homeSettingsButton.hidden = true;
}

function renderHomeDashboard() {
  ensureHomeFeaturedGame();
  renderHomeGameStrip();
  renderHomeFeaturedGame();
  renderHomeLeaderboard();
  renderHomeProgress();
  renderHomeAuthCard();
}

function renderGamePage() {
  const info = gameInfo[state.game] || gameInfo.quick;
  const penNote = getPenAndPaperNote(state.game);

  elements.gamePageSection.className = `game-page-section app-dashboard-page ${info.cardClass}`;
  elements.gamePageIcon.textContent = info.icon;
  elements.gamePageTitle.textContent = info.name;
  elements.gamePageDescription.textContent = info.description;
  elements.gamePageBullets.innerHTML = info.bullets
    .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
    .join("");
  elements.gamePageDuration.textContent = getGameDurationLabel(state.game);
  elements.gamePageGoal.textContent = getGameRankLabel(state.game);
  elements.gamePagePrep.hidden = !penNote;
  elements.gamePagePrep.textContent = penNote;
  elements.gameGoalStatus.textContent = getGameRankStatusMessage(state.game);
  elements.gamePageStart.disabled = !canAccessGame(state.game);
  elements.gamePageStart.textContent = canAccessGame(state.game) ? "Start challenge →" : "Locked for now";
  elements.gamePageLeaderboardTitle.textContent = `${info.name} leaderboard`;
  elements.resultLeaderboardLink.href = getGameHash(state.game, { view: "leaderboard" });
  renderGameLeaderboard();
}

function renderGameLeaderboard() {
  if (!canReadGameLeaderboard(state.game)) {
    elements.gameBoardList.innerHTML = renderScoreRows([], getLeaderboardAccessMessage(), { scoreLimit: 10 });
    setGameBoardStatus("local", getLeaderboardAccessMessage());
    return;
  }

  const scores = getVisibleScores(state.game, { scoreLimit: 10 });
  elements.gameBoardList.innerHTML = renderScoreRows(
    scores,
    `No ${getYearLabel(state.boardYearLevel)} scores yet for ${gameInfo[state.game].name}.`,
    { scoreLimit: 10 },
  );
  elements.gameGoalStatus.textContent = getGameRankStatusMessage(state.game);

  if (!state.sharedConfigured) {
    setGameBoardStatus("local", "Firebase setup needed. Until then, this leaderboard uses scores saved on this device.");
  } else if (state.sharedScores[state.game] === null) {
    setGameBoardStatus("connecting", "Connecting to this shared leaderboard...");
  } else {
    setGameBoardStatus(
      "shared",
      `Showing ${getYearLabel(state.boardYearLevel)} ${gameInfo[state.game].name}. Scores update live for everyone.`,
    );
  }
}

function renderLeaderboardGridCard({
  gameId,
  title,
  description,
  scores,
  total = false,
  streak = false,
}) {
  const info = gameInfo[gameId] || {};
  const classes = total || streak
    ? `leaderboard-grid-card summary-leaderboard-card ${total ? "total-leaderboard-card" : "streak-leaderboard-card"}`
    : "leaderboard-grid-card";
  const meta = streak
    ? `${scores.length ? "Highest saved streaks" : "Waiting for streaks"} • ${getVisibleBoardGameIds().length} games`
    : total
    ? `${scores.length ? "Combined best scores" : "Waiting for scores"} • ${getVisibleBoardGameIds().length} games`
    : `${getGameDurationLabel(gameId)} • Rank ${getGameRankLabel(gameId)}`;

  return `
    <article class="${classes}">
      <div class="leaderboard-grid-card-head">
        <div>
          <p>${escapeHtml(meta)}</p>
          <h3>${escapeHtml(title)}</h3>
        </div>
        <span class="mini-game-icon" aria-hidden="true">${escapeHtml(total ? "Σ" : streak ? "↯" : info.icon)}</span>
      </div>
      <p class="leaderboard-grid-description">${escapeHtml(description)}</p>
      <ol class="compact-score-list">
        ${renderScoreRows(
          scores,
          streak
            ? `No ${getYearLabel(state.boardYearLevel)} streaks saved yet.`
            : `No ${getYearLabel(state.boardYearLevel)} scores yet.`,
          {
            scoreLimit: total || streak ? 10 : 5,
            showGameCount: total,
            showStreakGame: streak,
            valueFormatter: streak ? (entry) => `${entry.score.toLocaleString()} streak` : undefined,
          },
        )}
      </ol>
    </article>
  `;
}

function renderAllLeaderboards() {
  if (!canReadSharedLeaderboards()) {
    elements.leaderboardsGrid.innerHTML = "";
    setLeaderboardStatus("local", getLeaderboardAccessMessage());
    return;
  }

  const gameIds = getVisibleBoardGameIds();
  if (state.sharedConfigured) listenToSharedBoards(gameIds);

  const totalScores = getTotalScores(gameIds);
  const totalCard = renderLeaderboardGridCard({
    title: `${getYearLabel(state.boardYearLevel)} Total Leaderboard`,
    description: "Adds each student's best score from every available game in this year level.",
    scores: totalScores,
    total: true,
  });
  const streakCard = renderLeaderboardGridCard({
    title: `${getYearLabel(state.boardYearLevel)} Highest Streak`,
    description: "Ranks each player by their best saved answer streak from any visible game.",
    scores: getHighestStreakScores(gameIds),
    streak: true,
  });

  const gameCards = gameIds.map((gameId) => renderLeaderboardGridCard({
    gameId,
    title: gameInfo[gameId].name,
    description: gameInfo[gameId].cardDescription,
    scores: getVisibleScores(gameId, { scoreLimit: 5 }),
  })).join("");

  elements.leaderboardsGrid.innerHTML = `${totalCard}${streakCard}${gameCards}`;

  if (!state.sharedConfigured) {
    setLeaderboardStatus("local", "Firebase setup needed. Until then, the grid uses scores saved on this device.");
  } else {
    setLeaderboardStatus(
      "shared",
      `Showing all ${getYearLabel(state.boardYearLevel)} leaderboards. Total is calculated from best scores across the games shown.`,
    );
  }
}

function renderBoardTabs() {
  const forcedYearLevel = getForcedLeaderboardYearLevel();
  if (forcedYearLevel) {
    state.boardYearLevel = forcedYearLevel;
  }

  ensureVisibleBoard();
  const boardOptions = createLeaderboardYearOptions();
  if (elements.gameBoardYearSelect.innerHTML !== boardOptions) {
    elements.gameBoardYearSelect.innerHTML = boardOptions;
  }
  if (elements.boardYearSelect.innerHTML !== boardOptions) {
    elements.boardYearSelect.innerHTML = boardOptions;
  }

  elements.gameBoardYearSelect.value = state.boardYearLevel;
  elements.boardYearSelect.value = state.boardYearLevel;
  const canChangeYear = canChangeLeaderboardYear();
  elements.gameBoardYearSelect.disabled = !canChangeYear;
  elements.boardYearSelect.disabled = !canChangeYear;
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

function renderTestStudentControls() {
  const isTeacherAccount = state.accountType === "teacher";
  const canUseTestStudent = isTeacherAccount && canUseTestStudentMode();
  elements.testStudentPanel.hidden = !canUseTestStudent;
  if (!canUseTestStudent) {
    state.testStudentMode = false;
    elements.testStudentToggle.checked = false;
    elements.testStudentYearSelect.disabled = true;
    return;
  }

  elements.testStudentToggle.checked = state.testStudentMode;
  elements.testStudentYearSelect.value = cleanYearLevel(state.testStudentYearLevel) || DEFAULT_YEAR_LEVEL;
  elements.testStudentYearSelect.disabled = !state.testStudentMode;
  elements.testStudentBadge.textContent = state.testStudentMode ? "On" : "Off";
  elements.testStudentStatus.textContent = state.testStudentMode
    ? `${getTestStudentLabel()} is active. Scores from this mode will not save to any leaderboard.`
    : "Test student mode is off. Teacher scores save normally.";
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
  renderTestStudentControls();

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
    const roleLabel = isTeacherTestingAsStudent()
      ? getTestStudentLabel()
      : accountType === "teacher"
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

  if (code.includes("profile/game-locked")) {
    return "This challenge is locked for your year level. Higher year levels can play lower challenges.";
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
  const cleanLevel = getForcedLeaderboardYearLevel() || cleanYearLevel(yearLevel) || DEFAULT_YEAR_LEVEL;
  const yearChanged = state.boardYearLevel !== cleanLevel;
  if (yearChanged) {
    stopSharedBoardListeners({ clearScores: true });
  }

  state.boardYearLevel = cleanLevel;
  elements.boardYearSelect.value = cleanLevel;
  elements.gameBoardYearSelect.value = cleanLevel;
  renderBoardTabs();
  if (state.page === "game") {
    renderGamePage();
    listenToSharedBoard(state.game);
  }
  if (state.page === "home") {
    renderHomeDashboard();
  }
  if (state.page === "progress") {
    renderProgressPage();
  }
  if (state.page === "leaderboards") {
    renderAllLeaderboards();
  }
  updateSharedResultRank();
}

function applyAuthState(authState) {
  const oldAuthUid = state.authUid;
  const oldAuthAllowed = state.authAllowed;
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
  if (state.accountType !== "teacher" || !canUseTestStudentMode()) {
    state.testStudentMode = false;
  }

  if (
    oldAuthUid !== state.authUid
    || oldAuthAllowed !== state.authAllowed
    || oldAccountType !== state.accountType
    || oldStudentYearLevel !== state.studentYearLevel
    || oldTeacherYears !== state.teacherYearLevels.join(",")
  ) {
    stopSharedBoardListeners({ clearScores: true });
  }

  state.teacherFilter = cleanAllowedTeacherFilter(state.teacherFilter);

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
  renderCurrentDataViews();

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

  const rank = getVisibleScores(state.game, { scoreLimit: null }).findIndex(
    (entry) => entry.id === state.latestSharedScoreId || entry.uid === state.latestSharedScoreId,
  );

  if (rank >= 0) {
    elements.resultRank.textContent = `#${rank + 1}`;
    elements.resultGoalStatus.textContent = `You achieved #${rank + 1} for ${gameInfo[state.game].name}.`;
  } else if (state.sharedScores[state.game]) {
    elements.resultRank.textContent = "No rank";
    elements.resultGoalStatus.textContent = "Your score has not appeared on this leaderboard yet.";
  }
}

function listenToSharedBoard(game, { teacherFilterOverride = state.teacherFilter } = {}) {
  if (!state.sharedConfigured) return;
  if (!canReadGameLeaderboard(game)) return;
  const teacherFilter = cleanAllowedTeacherFilter(teacherFilterOverride);
  const listenerContext = `${state.boardYearLevel}:${teacherFilter}`;
  if (state.boardUnsubscribes.has(game) && state.boardListenerContexts.get(game) === listenerContext) return;
  if (state.boardUnsubscribes.has(game)) {
    state.boardUnsubscribes.get(game)();
    state.boardUnsubscribes.delete(game);
    state.boardListenerContexts.delete(game);
    state.sharedScores[game] = null;
  }

  state.boardUnsubscribes.set(game, window.sharedLeaderboard.listen(
    game,
    (scores) => {
      state.sharedScores[game] = normalizeScores(scores);
      if (state.page === "home") renderHomeDashboard();
      if (state.game === game) renderGameLeaderboard();
      if (state.page === "progress") renderProgressPage();
      if (state.page === "leaderboards") renderAllLeaderboards();
      updateSharedResultRank();
    },
    () => {
      state.sharedScores[game] = null;
      if (state.page === "home") renderHomeDashboard();
      if (state.game === game) renderGameLeaderboard();
      if (state.page === "progress") renderProgressPage();
      if (state.page === "leaderboards") renderAllLeaderboards();
      setLeaderboardStatus("local", "Shared leaderboard unavailable. Check Firestore database setup and rules.");
    },
    {
      yearLevel: state.boardYearLevel,
      teacherFilter,
    },
  ));
  state.boardListenerContexts.set(game, listenerContext);
}

function listenToSharedBoards(games, options = {}) {
  games.forEach((game) => listenToSharedBoard(game, options));
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
    renderCurrentDataViews();
    return;
  }

  renderAuthControls();
  applyAuthState(window.sharedLeaderboard.getAuthState?.());
  renderBoardTabs();
  listenToSharedBoard(state.board);
}

async function saveSharedScore() {
  if (!state.sharedConfigured || state.savingSharedScore) return;

  const currentScoreContext = getScoreContext();
  if (!shouldSaveScore(currentScoreContext)) {
    state.pendingSharedScore = null;
    return;
  }

  if (!state.authAllowed) {
    state.pendingSharedScore = {
      game: state.game,
      score: state.score,
      bestStreak: state.bestStreak,
      context: currentScoreContext,
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
      bestStreak: state.bestStreak,
      context: currentScoreContext,
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
        context: {
          ...currentScoreContext,
          bestStreak: state.pendingSharedScore.bestStreak || 0,
        },
      }
    : {
        game: state.game,
        score: state.score,
        context: {
          ...currentScoreContext,
          bestStreak: state.bestStreak,
        },
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
    renderCurrentDataViews();
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
  if (!gameInfo[mode]) return;

  if (!canAccessGame(mode)) {
    setLeaderboardStatus("local", getGameAccessMessage(mode));
    renderGameCards();
    return;
  }

  state.game = mode;
  state.board = mode;
  const info = gameInfo[mode];
  const penNote = getPenAndPaperNote(mode);
  elements.startTitle.textContent = info.name;
  elements.startDescription.textContent = [
    info.description,
    `Time limit: ${getGameDurationLabel(mode)}.`,
    penNote,
  ].filter(Boolean).join(" ");
  elements.playMode.textContent = info.name;
  elements.startPanel.hidden = false;
  elements.countdownPanel.hidden = true;
  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = true;
  elements.playSection.hidden = false;
  renderGamePage();
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
    time: getGameDuration(state.game),
    duration: getGameDuration(state.game),
    timerId: null,
    countdownId: null,
    countdownTimeoutId: null,
    running: false,
    acceptingAnswer: false,
  });

  elements.score.textContent = "0";
  elements.streak.textContent = "0";
  elements.timer.textContent = String(state.duration);
  elements.timerProgress.style.strokeDashoffset = "0";
  elements.timerProgress.style.stroke = "var(--blue)";
  elements.feedback.textContent = "You’ve got this.";
  elements.feedback.className = "feedback";
  elements.answerInput.placeholder = "?";
  elements.answerInput.inputMode = "decimal";
  setSurdAnswerMode(false);
}

function nextQuestion() {
  if (!state.running) return;

  const question = createQuestion(state.game);
  state.answer = question.answer;
  state.questionNumber += 1;
  state.acceptingAnswer = true;
  const surdMode = isSurdAnswer(state.answer);
  const fractionMode = isFractionAnswer(state.answer);
  setSurdAnswerMode(surdMode);
  elements.answerInput.placeholder = fractionMode ? "e.g. 3/4" : "?";
  elements.answerInput.inputMode = fractionMode ? "text" : "decimal";
  elements.question.classList.toggle("surd-question", surdMode);
  elements.question.textContent = question.text;
  elements.questionCount.textContent = `Question ${state.questionNumber}`;
  elements.answerInput.value = "";
  elements.surdCoefficientInput.value = "";
  elements.surdRadicandInput.value = "";
  (surdMode ? elements.surdCoefficientInput : elements.answerInput).focus();
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
    elements.timerProgress.style.strokeDashoffset = String(113 * (1 - state.time / state.duration));

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
  elements.countdownMessage.textContent = `Starting ${gameInfo[state.game].name} as ${state.player}. You have ${getGameDurationLabel(state.game)}.`;
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

  if (!canAccessGame(state.game)) {
    setLeaderboardStatus("local", getGameAccessMessage(state.game));
    renderGameCards();
    return;
  }

  const scoreContext = getScoreContext();
  state.player = scoreContext.role === "test" ? getTestStudentLabel() : getGooglePlayerName();

  if (scoreContext.role === "student" || scoreContext.role === "test") {
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
  const saveScore = shouldSaveScore(scoreContext);

  if (scoreContext.role === "student" || scoreContext.role === "test") {
    setBoardYearLevel(scoreContext.yearLevel);
  } else if (state.teacherFilter === "none") {
    state.teacherFilter = scoreContext.teacherYearLevels.includes(state.boardYearLevel) ? "year" : "all";
    renderTeacherFilterControls();
  }

  const localScore = saveScore ? saveLocalScore() : { rank: 0, saved: false };
  if (saveScore) {
    recordProgressAttempt(state.game, state.score, scoreContext);
  }
  state.latestSharedScoreId = null;

  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = false;
  elements.resultName.textContent = state.player;
  elements.finalScore.textContent = state.score.toLocaleString();
  elements.correctTotal.textContent = String(state.correct);
  elements.bestStreak.textContent = String(state.bestStreak);
  elements.resultRank.textContent = saveScore
    ? (localScore.rank > 0 ? `#${localScore.rank}` : "No rank")
    : "Test only";
  elements.resultGoalStatus.textContent = saveScore
    ? (localScore.rank > 0
      ? `You achieved #${localScore.rank} for ${gameInfo[state.game].name}.`
      : "Your score has not appeared on this leaderboard yet.")
    : "Test score only. It did not count towards a leaderboard rank.";
  state.board = state.game;
  setActiveBoardTab();
  renderGamePage();
  renderLeaderboard();
  listenToSharedBoard(state.board);

  if (saveScore) {
    saveSharedScore();
  } else {
    state.pendingSharedScore = null;
    setLeaderboardStatus("local", `${getTestStudentLabel()} score was not saved to any leaderboard.`);
  }
}

function submitAnswer(event) {
  event.preventDefault();
  if (!state.running || !state.acceptingAnswer) return;

  const surdMode = isSurdAnswer(state.answer);
  const fractionMode = isFractionAnswer(state.answer);
  const guess = surdMode
    ? {
        coefficient: Number(elements.surdCoefficientInput.value),
        radicand: Number(elements.surdRadicandInput.value),
      }
    : fractionMode
      ? parseFractionInput(elements.answerInput.value)
      : Number(elements.answerInput.value);

  if (surdMode) {
    if (!Number.isFinite(guess.coefficient) || !Number.isFinite(guess.radicand)) return;
  } else if (fractionMode) {
    if (!guess) return;
  } else if (!Number.isFinite(guess)) {
    return;
  }

  state.acceptingAnswer = false;

  const isCorrect = surdMode
    ? guess.coefficient === state.answer.coefficient && guess.radicand === state.answer.radicand
    : fractionMode
      ? fractionsMatch(guess, state.answer) && (!state.answer.requireSimplified || isSimplifiedFractionGuess(guess))
      : guess === state.answer;

  if (isCorrect) {
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
    elements.feedback.textContent = `Not quite. The answer was ${getFormattedAnswer(state.answer)}.`;
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
  elements.gamePageSection.scrollIntoView({ behavior: "smooth" });
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
    return "Teacher";
  }

  return getYearLabel(entry.yearLevel);
}

function renderLeaderboard() {
  ensureVisibleBoard();
  renderTeacherFilterControls();
  if (state.page === "home") renderHomeDashboard();
  if (state.page === "game") renderGameLeaderboard();
  if (state.page === "progress") renderProgressPage();
  if (state.page === "leaderboards") renderAllLeaderboards();
  if (state.sharedConfigured && canReadSharedLeaderboards()) {
    if (state.page === "home") listenToSharedBoards(getVisibleBoardGameIds());
    if (state.page === "game") listenToSharedBoard(state.game);
    if (state.page === "progress") listenToSharedBoards(getVisibleGameIds(), { teacherFilterOverride: "all" });
    if (state.page === "leaderboards") listenToSharedBoards(getVisibleBoardGameIds());
  }
}

function renderCurrentDataViews() {
  renderGameCards();
  renderBoardTabs();
  if (state.page === "home") renderHomeDashboard();
  if (state.page === "game") renderGamePage();
  if (state.page === "progress") renderProgressPage();
  if (state.page === "leaderboards") renderAllLeaderboards();
  renderLeaderboard();
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

function parsePageHash() {
  const rawHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));

  if (rawHash.startsWith("game/")) {
    const match = rawHash.match(/^game\/([^/]+)(?:\/(leaderboard))?$/);
    const gameId = match?.[1] || "";
    if (gameInfo[gameId]) {
      return { page: "game", gameId, view: match[2] || "" };
    }
  }

  if (rawHash === "leaderboards" || rawHash === "leaderboard") {
    return { page: "leaderboards" };
  }

  if (rawHash === "progress") {
    return { page: "progress" };
  }

  if (rawHash === "games") {
    return { page: "games" };
  }

  return { page: "home" };
}

function openResultLeaderboard(event) {
  event.preventDefault();
  const leaderboardHash = getGameHash(state.game, { view: "leaderboard" });

  if (window.location.hash === leaderboardHash) {
    renderCurrentPage({ scroll: true });
    return;
  }

  window.location.hash = leaderboardHash;
}

function cancelActiveGame() {
  window.clearInterval(state.timerId);
  window.clearInterval(state.countdownId);
  window.clearTimeout(state.countdownTimeoutId);
  state.timerId = null;
  state.countdownId = null;
  state.countdownTimeoutId = null;
  state.running = false;
  state.acceptingAnswer = false;
  elements.countdownPanel.hidden = true;
  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = true;
  elements.startPanel.hidden = false;
}

function renderCurrentPage({ scroll = false } = {}) {
  const route = parsePageHash();
  const previousPage = state.page;
  const previousGame = state.game;
  const leavingGamePage = previousPage === "game" && route.page !== "game";
  const switchingGamePage = previousPage === "game" && route.page === "game" && route.gameId !== previousGame;
  const showingGameLeaderboard = route.page === "game" && route.view === "leaderboard";
  state.page = route.page;
  document.body.classList.toggle("app-page-active", ["home", "games", "game", "progress", "leaderboards"].includes(route.page));
  document.body.classList.toggle("dashboard-page-active", route.page === "home");
  document.body.classList.toggle("leaderboards-page-active", route.page === "leaderboards");

  if (leavingGamePage || switchingGamePage || showingGameLeaderboard) {
    cancelActiveGame();
    elements.playSection.hidden = true;
  }

  elements.heroSection.hidden = route.page !== "home";
  elements.gamesSection.hidden = route.page !== "games";
  elements.gamePageSection.hidden = route.page !== "game";
  elements.progressSection.hidden = route.page !== "progress";
  elements.allLeaderboardsSection.hidden = route.page !== "leaderboards";

  if (route.page !== "game") {
    elements.playSection.hidden = true;
  }

  if (route.page === "game") {
    state.game = route.gameId;
    state.board = route.gameId;
    renderGamePage();
    listenToSharedBoard(state.game);
  } else if (route.page === "progress") {
    renderProgressPage();
  } else if (route.page === "leaderboards") {
    renderAllLeaderboards();
  } else {
    renderGameCards();
    if (route.page === "home") {
      renderHomeDashboard();
      if (state.sharedConfigured && canReadSharedLeaderboards()) {
        listenToSharedBoards(getVisibleBoardGameIds());
      }
    }
  }

  if (scroll) {
    const target = route.page === "game" && route.view === "leaderboard"
      ? elements.gamePageLeaderboard
      : route.page === "game"
        ? elements.gamePageSection
        : route.page === "leaderboards"
          ? elements.allLeaderboardsSection
          : route.page === "progress"
            ? elements.progressSection
            : route.page === "games"
              ? elements.gamesSection
              : elements.heroSection;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

setupYearControls();
renderGameCards();
renderBoardTabs();
renderTeacherFilterControls();

elements.gameGrid.addEventListener("click", (event) => {
  const link = event.target.closest("[data-game]");
  if (!link) return;
  const gameId = link.dataset.game;
  if (!canAccessGame(gameId)) {
    event.preventDefault();
    setLeaderboardStatus("local", getGameAccessMessage(gameId));
    renderGameCards();
  }
});

elements.homeGameStrip.addEventListener("click", (event) => {
  const link = event.target.closest("[data-game]");
  if (!link) return;
  event.preventDefault();
  const gameId = link.dataset.game;
  if (!canAccessGame(gameId)) {
    setLeaderboardStatus("local", getGameAccessMessage(gameId));
    renderHomeDashboard();
    return;
  }
  state.homeFeaturedGame = gameId;
  renderHomeDashboard();
});

document.querySelectorAll("[data-home-leaderboard]").forEach((button) => {
  button.addEventListener("click", () => {
    state.homeLeaderboardView = button.dataset.homeLeaderboard === "teachers" ? "teachers" : "students";
    renderHomeDashboard();
  });
});

document.querySelectorAll("[data-teacher-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextFilter = cleanAllowedTeacherFilter(button.dataset.teacherFilter);
    if (state.teacherFilter !== nextFilter) {
      stopSharedBoardListeners({ clearScores: true });
    }
    state.teacherFilter = nextFilter;
    renderTeacherFilterControls();
    renderLeaderboard();
    updateSharedResultRank();
  });
});

elements.boardYearSelect.addEventListener("change", () => {
  setBoardYearLevel(elements.boardYearSelect.value);
  setLeaderboardStatus(
    state.sharedConfigured ? "shared" : "local",
    `Showing ${getYearLabel(state.boardYearLevel)} leaderboards.`,
  );
});
elements.gameBoardYearSelect.addEventListener("change", () => {
  setBoardYearLevel(elements.gameBoardYearSelect.value);
});
elements.studentProfileForm.addEventListener("submit", saveStudentProfile);
elements.teacherYearsSave.addEventListener("click", saveTeacherYears);
elements.testStudentToggle.addEventListener("change", () => {
  if (!canUseTestStudentMode()) {
    state.testStudentMode = false;
    elements.testStudentToggle.checked = false;
    renderAuthControls();
    renderCurrentDataViews();
    return;
  }

  state.testStudentMode = elements.testStudentToggle.checked;
  state.testStudentYearLevel = cleanYearLevel(elements.testStudentYearSelect.value) || DEFAULT_YEAR_LEVEL;
  state.pendingSharedScore = null;
  if (state.testStudentMode) setBoardYearLevel(state.testStudentYearLevel);
  renderAuthControls();
  renderCurrentDataViews();
  setLeaderboardStatus(
    "local",
    state.testStudentMode
      ? `${getTestStudentLabel()} is active. Test scores will not save.`
      : "Test student mode is off. Teacher scores save normally.",
  );
});
elements.testStudentYearSelect.addEventListener("change", () => {
  state.testStudentYearLevel = cleanYearLevel(elements.testStudentYearSelect.value) || DEFAULT_YEAR_LEVEL;
  if (state.testStudentMode) {
    state.pendingSharedScore = null;
    setBoardYearLevel(state.testStudentYearLevel);
    renderAuthControls();
    renderCurrentDataViews();
    setLeaderboardStatus("local", `${getTestStudentLabel()} is active. Test scores will not save.`);
  } else {
    renderTestStudentControls();
  }
});
elements.settingsButton.addEventListener("click", () => setSettingsOpen(!state.settingsOpen, { userAction: true }));
elements.settingsClose.addEventListener("click", () => setSettingsOpen(false, { userAction: true }));
elements.gamePageStart.addEventListener("click", () => selectGame(state.game));
elements.startGameButton.addEventListener("click", requestStartGame);
elements.answerForm.addEventListener("submit", submitAnswer);
document.querySelector("#back-button").addEventListener("click", endAndHideGame);
document.querySelector("#quit-button").addEventListener("click", quitGame);
document.querySelector("#play-again").addEventListener("click", requestStartGame);
elements.resultLeaderboardLink.addEventListener("click", openResultLeaderboard);
elements.signInButton.addEventListener("click", signInForLeaderboard);
elements.homeSignInButton.addEventListener("click", signInForLeaderboard);
elements.homeSettingsButton.addEventListener("click", () => setSettingsOpen(true, { userAction: true }));
elements.signOutButton.addEventListener("click", signOutOfLeaderboard);
elements.resultSignIn.addEventListener("click", signInForLeaderboard);

window.addEventListener("leaderboard-auth-changed", (event) => applyAuthState(event.detail));

window.addEventListener("shared-leaderboard-ready", connectSharedLeaderboard);
window.addEventListener("hashchange", () => renderCurrentPage({ scroll: true }));
renderCurrentPage();
if (window.sharedLeaderboard) connectSharedLeaderboard();
window.setTimeout(() => {
  if (!state.sharedInitialized) {
    setLeaderboardStatus(
      "local",
      "Shared leaderboard is not connected. Open the site through GitHub Pages or a local server.",
    );
  }
}, 3000);
