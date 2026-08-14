const GAME_SECONDS = 60;
const TOPIC_GAME_SECONDS = 300;
const PAPER_GAME_SECONDS = 300;
const STORAGE_KEY = "bayside-maths-challenge-leaderboards-v5";
const PROGRESS_KEY = "bayside-maths-challenge-progress-v1";
const TEACHER_NAME_KEY = "bayside-maths-challenge-teacher-names-v1";
const DEFAULT_YEAR_LEVEL = "year7";
const TEST_STUDENT_ADMIN_EMAIL = "joshua.thorne@baysidecc.vic.edu.au";
const STUDENT_REQUEST_ADMIN_EMAIL = "joshua.thorne@baysidecc.vic.edu.au";
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

const gameInfo = {};

Object.assign(gameInfo, {
  "speed-single-digit-addition": {
    name: "Single-Digit Addition",
    shortName: "Addition",
    description: "Answer single-digit addition facts quickly.",
    cardDescription: "Add two single-digit numbers.",
    bullets: ["Single-digit facts", "Speed operations"],
    icon: "+",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "speed-single-digit-subtraction": {
    name: "Single-Digit Subtraction",
    shortName: "Subtraction",
    description: "Answer subtraction facts made from single-digit parts.",
    cardDescription: "Subtract to find a single-digit answer.",
    bullets: ["Subtraction facts", "Speed operations"],
    icon: "-",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "speed-single-digit-multiplication": {
    name: "Single-Digit Multiplication",
    shortName: "Multiply",
    description: "Multiply two single-digit numbers.",
    cardDescription: "Build speed with single-digit multiplication facts.",
    bullets: ["Single-digit factors", "Times tables"],
    icon: "x",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "speed-single-digit-division": {
    name: "Single-Digit Division",
    shortName: "Division",
    description: "Divide numbers using single-digit facts.",
    cardDescription: "Use multiplication facts to divide quickly.",
    bullets: ["Division facts", "Related multiplication"],
    icon: "/",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "number-identify-factors": {
    name: "Identify Factors",
    shortName: "Factors",
    description: "List every factor of a number.",
    cardDescription: "Find all the factors, with 1 and the number already filled in.",
    bullets: ["Factor pairs", "Complete factor lists"],
    icon: "[]",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "number-identify-multiples": {
    name: "Identify Multiples",
    shortName: "Multiples",
    description: "Choose every number in the list that is a multiple.",
    cardDescription: "Select all matching multiples from four choices.",
    bullets: ["Multiples", "Multi-select"],
    icon: "✓",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "number-identify-primes": {
    name: "Identify Prime Numbers",
    shortName: "Prime or Composite",
    description: "Decide whether a number is prime or composite.",
    cardDescription: "Classify numbers from 2 to 100.",
    bullets: ["Prime numbers", "Composite numbers"],
    icon: "?",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "number-hcf": {
    name: "Highest Common Factor",
    shortName: "HCF",
    description: "Find the highest common factor of two numbers.",
    cardDescription: "Find the greatest factor shared by both numbers.",
    bullets: ["Common factors", "Highest common factor"],
    icon: "H",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "number-lcm": {
    name: "Lowest Common Multiple",
    shortName: "LCM",
    description: "Find the lowest common multiple of two numbers.",
    cardDescription: "Find the first multiple shared by both numbers.",
    bullets: ["Common multiples", "Lowest common multiple"],
    icon: "L",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "number-evaluate-squares": {
    name: "Evaluate Squares",
    shortName: "Squares",
    description: "Evaluate square numbers from 1 to 10.",
    cardDescription: "Practise square-number facts with superscripts.",
    bullets: ["Square numbers", "1 to 10"],
    icon: "□",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "number-square-roots": {
    name: "Square Roots of Perfect Squares",
    shortName: "Square Roots",
    description: "Find square roots of perfect squares.",
    cardDescription: "Use the square-root sign to practise perfect squares.",
    bullets: ["Square roots", "Perfect squares"],
    icon: "√",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "number-add-integers": {
    name: "Add Integers",
    shortName: "Add Integers",
    description: "Add positive and negative integers.",
    cardDescription: "Practise integer addition.",
    bullets: ["Positive integers", "Negative integers"],
    icon: "+-",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "number-subtract-integers": {
    name: "Subtract Integers",
    shortName: "Subtract Integers",
    description: "Subtract positive and negative integers.",
    cardDescription: "Practise subtracting integers, including negatives.",
    bullets: ["Integer subtraction", "Negative numbers"],
    icon: "--",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "number-multiply-integers": {
    name: "Multiply Integers",
    shortName: "Multiply Integers",
    description: "Multiply positive and negative integers.",
    cardDescription: "Practise sign rules for multiplication.",
    bullets: ["Integer multiplication", "Sign rules"],
    icon: "x-",
    cardClass: "game-card-sky",
    accessYear: "year8",
  },
  "number-divide-integers": {
    name: "Divide Integers",
    shortName: "Divide Integers",
    description: "Divide positive and negative integers.",
    cardDescription: "Practise sign rules for division.",
    bullets: ["Integer division", "Sign rules"],
    icon: "/-",
    cardClass: "game-card-coral",
    accessYear: "year8",
  },
  "fractions-simplify-fractions": {
    name: "Simplify Fractions",
    shortName: "Simplify",
    description: "Reduce fractions to their simplest form.",
    cardDescription: "Simplify proper fractions with smaller numerators.",
    bullets: ["Common factors", "Simplest form"],
    icon: "≡",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "fractions-equivalent-fractions": {
    name: "Equivalent Fractions",
    shortName: "Equivalent",
    description: "Complete equivalent fractions by finding the missing numerator or denominator.",
    cardDescription: "Scale fractions up and down.",
    bullets: ["Equivalent fractions", "Missing values"],
    icon: "=",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "fractions-improper-to-mixed": {
    name: "Improper Fraction → Mixed Number",
    shortName: "Improper to Mixed",
    description: "Convert improper fractions into mixed numbers.",
    cardDescription: "Write improper fractions as mixed numbers.",
    bullets: ["Improper fractions", "Mixed numbers"],
    icon: "↘",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "fractions-mixed-to-improper": {
    name: "Mixed Number → Improper Fraction",
    shortName: "Mixed to Improper",
    description: "Convert mixed numbers into improper fractions.",
    cardDescription: "Write mixed numbers as improper fractions.",
    bullets: ["Mixed numbers", "Improper fractions"],
    icon: "↗",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "fractions-compare-fractions": {
    name: "Compare Fractions",
    shortName: "Compare",
    description: "Choose which fraction is larger.",
    cardDescription: "Compare two fractions quickly.",
    bullets: ["Fraction size", "Equivalent thinking"],
    icon: ">",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "fractions-order-fractions": {
    name: "Order Fractions",
    shortName: "Order",
    description: "Put fractions in order from smallest to largest.",
    cardDescription: "Choose the correct order for three fractions.",
    bullets: ["Smallest to largest", "Common denominators"],
    icon: "↕",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "fractions-add-same-denominator": {
    name: "Add Fractions with Same Denominator",
    shortName: "Add Same",
    description: "Add fractions that already have the same denominator.",
    cardDescription: "Add numerators and keep the denominator.",
    bullets: ["Same denominator", "Fraction addition"],
    icon: "+",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "fractions-subtract-same-denominator": {
    name: "Subtract Fractions with Same Denominator",
    shortName: "Subtract Same",
    description: "Subtract fractions that already have the same denominator.",
    cardDescription: "Subtract numerators and keep the denominator.",
    bullets: ["Same denominator", "Fraction subtraction"],
    icon: "−",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "fractions-add-different-denominators": {
    name: "Add Fractions with Different Denominators",
    shortName: "Add Different",
    description: "Add fractions by finding a common denominator.",
    cardDescription: "Add fractions with unlike denominators.",
    bullets: ["Common denominators", "Fraction addition"],
    icon: "⊕",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "fractions-subtract-different-denominators": {
    name: "Subtract Fractions with Different Denominators",
    shortName: "Subtract Different",
    description: "Subtract fractions by finding a common denominator.",
    cardDescription: "Subtract fractions with unlike denominators.",
    bullets: ["Common denominators", "Fraction subtraction"],
    icon: "⊖",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "fractions-multiply-fractions": {
    name: "Multiply Fractions",
    shortName: "Multiply",
    description: "Multiply fractions and give an equivalent answer.",
    cardDescription: "Multiply numerators and denominators.",
    bullets: ["Fraction multiplication", "Equivalent answers"],
    icon: "×",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
  "fractions-divide-fractions": {
    name: "Divide Fractions",
    shortName: "Divide",
    description: "Divide fractions using reciprocal thinking.",
    cardDescription: "Divide by multiplying by the reciprocal.",
    bullets: ["Reciprocals", "Fraction division"],
    icon: "÷",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "fractions-add-mixed-numbers": {
    name: "Add Mixed Numbers",
    shortName: "Add Mixed",
    description: "Add mixed numbers and give an equivalent answer.",
    cardDescription: "Combine whole numbers and fractions.",
    bullets: ["Mixed numbers", "Fraction addition"],
    icon: "⊞",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "fractions-subtract-mixed-numbers": {
    name: "Subtract Mixed Numbers",
    shortName: "Subtract Mixed",
    description: "Subtract mixed numbers and give an equivalent answer.",
    cardDescription: "Subtract whole numbers and fractions.",
    bullets: ["Mixed numbers", "Fraction subtraction"],
    icon: "⊟",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
});

const skillTopicMap = {
  "speed-single-digit-addition": "topic-speed-operations",
  "speed-single-digit-subtraction": "topic-speed-operations",
  "speed-single-digit-multiplication": "topic-speed-operations",
  "speed-single-digit-division": "topic-speed-operations",
  "number-identify-factors": "topic-number",
  "number-identify-multiples": "topic-number",
  "number-identify-primes": "topic-number",
  "number-hcf": "topic-number",
  "number-lcm": "topic-number",
  "number-evaluate-squares": "topic-number",
  "number-square-roots": "topic-number",
  "number-add-integers": "topic-number",
  "number-subtract-integers": "topic-number",
  "number-multiply-integers": "topic-number",
  "number-divide-integers": "topic-number",
  "fractions-simplify-fractions": "topic-fractions",
  "fractions-equivalent-fractions": "topic-fractions",
  "fractions-improper-to-mixed": "topic-fractions",
  "fractions-mixed-to-improper": "topic-fractions",
  "fractions-compare-fractions": "topic-fractions",
  "fractions-order-fractions": "topic-fractions",
  "fractions-add-same-denominator": "topic-fractions",
  "fractions-subtract-same-denominator": "topic-fractions",
  "fractions-add-different-denominators": "topic-fractions",
  "fractions-subtract-different-denominators": "topic-fractions",
  "fractions-multiply-fractions": "topic-fractions",
  "fractions-divide-fractions": "topic-fractions",
  "fractions-add-mixed-numbers": "topic-fractions",
  "fractions-subtract-mixed-numbers": "topic-fractions",
};

const topicAreaInfo = {
  "topic-speed-operations": {
    name: "Speed Operations",
    shortName: "Speed Ops",
    description: "A combined speed game for single-digit addition, subtraction, multiplication, and division.",
    cardDescription: "Fast mental arithmetic using single-digit facts.",
    bullets: ["Addition and subtraction", "Multiplication and division"],
    icon: "⚡",
    cardClass: "game-card-sky",
    accessYear: "year7",
  },
  "topic-number": {
    name: "Number",
    shortName: "Number",
    description: "A combined number game for factors, multiples, primes, HCF, LCM, squares, square roots, and integers.",
    cardDescription: "Build fluency with factors, multiples, powers, roots, and integers.",
    bullets: ["Factors, multiples, primes", "Squares, roots, and integers"],
    icon: "∑",
    cardClass: "game-card-sun",
    accessYear: "year7",
  },
  "topic-fractions": {
    name: "Fractions",
    shortName: "Fractions",
    description: "A combined fractions game for simplifying, equivalents, mixed numbers, comparing, ordering, and operations.",
    cardDescription: "Build fluency with fraction forms and operations.",
    bullets: ["Equivalent forms and mixed numbers", "Compare, order, and operate"],
    icon: "⅟",
    cardClass: "game-card-coral",
    accessYear: "year7",
  },
};

Object.entries(skillTopicMap).forEach(([skillId, topicId]) => {
  if (!gameInfo[skillId]) return;
  gameInfo[skillId] = {
    ...gameInfo[skillId],
    type: "skill",
    topicId,
  };
});

Object.entries(topicAreaInfo).forEach(([topicId, info]) => {
  gameInfo[topicId] = {
    ...info,
    type: "topic",
  };
});

const TOPIC_AREA_IDS = Object.keys(topicAreaInfo);
const SKILL_IDS = Object.keys(skillTopicMap).filter((skillId) => gameInfo[skillId]);
const GAME_IDS = [...TOPIC_AREA_IDS, ...SKILL_IDS];
const FIVE_MINUTE_SKILL_GAME_IDS = new Set(["number-identify-factors"]);
const ONE_MINUTE_TOPIC_GAME_IDS = new Set(["topic-speed-operations"]);
const PEN_AND_PAPER_GAME_IDS = new Set();

const state = {
  page: "home",
  game: "topic-speed-operations",
  board: "topic-speed-operations",
  boardYearLevel: DEFAULT_YEAR_LEVEL,
  teacherFilter: "none",
  homeLeaderboardView: "students",
  homeFeaturedGame: "topic-speed-operations",
  player: "",
  score: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  questionNumber: 0,
  answer: 0,
  currentQuestionSkillId: "",
  topicSkillScores: {},
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
  teacherLeaderboardName: "",
  authAllowed: false,
  isAdmin: false,
  allowedEmailDomain: "",
  allowedEmailDomains: [],
  accountType: "",
  studentDirectoryStatus: "",
  studentYearLevelLocked: false,
  studentYearLevelRequest: null,
  settingsOpen: false,
  settingsUserOpen: false,
  studentYearLevel: "",
  teacherYearLevels: [],
  teacherChallengeYearLevel: DEFAULT_YEAR_LEVEL,
  testStudentMode: false,
  testStudentYearLevel: DEFAULT_YEAR_LEVEL,
  boardUnsubscribes: new Map(),
  pendingSharedScore: null,
  savingSharedScore: false,
  requestingYearLevel: false,
  sharedScores: cloneSharedScores(),
  boardListenerContexts: new Map(),
  adminRequests: [],
  adminRequestsUnsubscribe: null,
  expandedProgressTopics: new Set(),
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
  topicPageSkills: document.querySelector("#topic-page-skills"),
  topicPageSkillsTitle: document.querySelector("#topic-page-skills-title"),
  topicPageSkillsSummary: document.querySelector("#topic-page-skills-summary"),
  topicPageSkillGrid: document.querySelector("#topic-page-skill-grid"),
  gamePageLeaderboard: document.querySelector(".game-page-leaderboard"),
  gamePageLeaderboardTitle: document.querySelector("#game-page-leaderboard-title"),
  gameBoardYearSelect: document.querySelector("#game-board-year-select"),
  gameBoardList: document.querySelector("#game-board-list"),
  gameBoardStatus: document.querySelector("#game-board-status"),
  progressSection: document.querySelector("#progress"),
  progressGrid: document.querySelector("#progress-game-grid"),
  progressSummary: document.querySelector("#progress-summary"),
  progressStreakCount: document.querySelector("#progress-streak-count"),
  progressHighestStreakCount: document.querySelector("#progress-highest-streak-count"),
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
  startNote: document.querySelector("#start-note"),
  teacherChallengeYearWrap: document.querySelector("#teacher-challenge-year-wrap"),
  teacherChallengeYearSelect: document.querySelector("#teacher-challenge-year-select"),
  teacherChallengeYearNote: document.querySelector("#teacher-challenge-year-note"),
  startGameButton: document.querySelector("#start-game-button"),
  countdownNumber: document.querySelector("#countdown-number"),
  countdownMessage: document.querySelector("#countdown-message"),
  playMode: document.querySelector("#play-mode"),
  answerForm: document.querySelector("#answer-form"),
  answerSubmitButton: document.querySelector("#answer-form button[type='submit']"),
  standardAnswerField: document.querySelector("#standard-answer-field"),
  answerInput: document.querySelector("#answer-input"),
  surdAnswerFields: document.querySelector("#surd-answer-fields"),
  surdCoefficientInput: document.querySelector("#surd-coefficient-input"),
  surdRadicandInput: document.querySelector("#surd-radicand-input"),
  fractionAnswerFields: document.querySelector("#fraction-answer-fields"),
  fractionOnlyAnswer: document.querySelector("#fraction-only-answer"),
  mixedFractionAnswer: document.querySelector("#mixed-fraction-answer"),
  fractionNumeratorInput: document.querySelector("#fraction-numerator-input"),
  fractionDenominatorInput: document.querySelector("#fraction-denominator-input"),
  mixedWholeInput: document.querySelector("#mixed-whole-input"),
  mixedNumeratorInput: document.querySelector("#mixed-numerator-input"),
  mixedDenominatorInput: document.querySelector("#mixed-denominator-input"),
  choiceAnswerFields: document.querySelector("#choice-answer-fields"),
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
  resultMedal: document.querySelector("#result-medal"),
  resultMedalCallout: document.querySelector("#result-medal-callout"),
  resultMedalCalloutValue: document.querySelector("#result-medal-callout-value"),
  resultMedalCalloutDetail: document.querySelector("#result-medal-callout-detail"),
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
  heroSkillCount: document.querySelector("#hero-skill-count"),
  homeSkillCount: document.querySelector("#home-skill-count"),
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
  studentDirectoryBadge: document.querySelector("#student-directory-badge"),
  studentDirectoryStatus: document.querySelector("#student-directory-status"),
  studentYearSelectWrap: document.querySelector("#student-year-select-wrap"),
  studentYearSelect: document.querySelector("#student-year-select"),
  studentYearSave: document.querySelector("#student-year-save"),
  studentRequestButton: document.querySelector("#student-request-button"),
  profileStatus: document.querySelector("#profile-status"),
  teacherPanel: document.querySelector("#teacher-panel"),
  teacherBadge: document.querySelector("#teacher-badge"),
  teacherStatus: document.querySelector("#teacher-status"),
  teacherYearPanel: document.querySelector("#teacher-year-panel"),
  teacherNameInput: document.querySelector("#teacher-name-input"),
  teacherYearOptions: document.querySelector("#teacher-year-options"),
  teacherYearsSave: document.querySelector("#teacher-years-save"),
  testStudentPanel: document.querySelector("#teacher-test-panel"),
  testStudentBadge: document.querySelector("#test-student-badge"),
  testStudentToggle: document.querySelector("#test-student-toggle"),
  testStudentYearSelect: document.querySelector("#test-student-year-select"),
  testStudentStatus: document.querySelector("#test-student-status"),
  adminSection: document.querySelector("#admin"),
  adminRequestCount: document.querySelector("#admin-request-count"),
  adminAssignedCount: document.querySelector("#admin-assigned-count"),
  adminRequestList: document.querySelector("#admin-request-list"),
  adminRefreshButton: document.querySelector("#admin-refresh-button"),
  adminStatus: document.querySelector("#admin-status"),
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
  if (isTopicArea(mode)) {
    const skillIds = getPlayableTopicSkillIds(mode, getEffectiveChallengeYearLevel());
    if (!skillIds.length) {
      return {
        text: "No sub skills are unlocked for this topic yet.",
        answer: 0,
        skillId: "",
      };
    }

    const skillId = sample(skillIds);
    const question = createQuestion(skillId);
    return {
      ...question,
      skillId,
    };
  }

  const skillGenerator = skillQuestionGenerators[mode];
  if (skillGenerator) return skillGenerator();

  const a = randomNumber(5, 45);
  const b = randomNumber(2, 35);
  return { text: `${a} + ${b} = ?`, answer: a + b };
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

function leastCommonMultiple(a, b) {
  return Math.abs(a * b) / greatestCommonDivisor(a, b);
}

function getFactors(number) {
  const factors = [];
  for (let factor = 1; factor <= number; factor += 1) {
    if (number % factor === 0) factors.push(factor);
  }
  return factors;
}

function isPrimeNumber(number) {
  if (number < 2) return false;
  for (let factor = 2; factor * factor <= number; factor += 1) {
    if (number % factor === 0) return false;
  }
  return true;
}

function arraysMatch(left = [], right = []) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
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

function withFractionOptions(answer, options = {}) {
  return answer ? { ...answer, ...options } : null;
}

function formatFractionParts(fraction) {
  return `${fraction.numerator}/${fraction.denominator}`;
}

function formatMixedNumberParts(mixed) {
  return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`;
}

function formatMixedFractionAnswer(answer) {
  const sign = answer.numerator < 0 ? "-" : "";
  const absoluteNumerator = Math.abs(answer.numerator);
  const whole = Math.floor(absoluteNumerator / answer.denominator);
  const numerator = absoluteNumerator % answer.denominator;

  if (!numerator) return `${sign}${whole}`;
  if (!whole) return `${sign}${numerator}/${answer.denominator}`;
  return `${sign}${whole} ${numerator}/${answer.denominator}`;
}

function getMixedNumberTotalNumerator(mixed) {
  return (mixed.whole * mixed.denominator) + mixed.numerator;
}

function createMixedNumberAnswer(mixed, options = {}) {
  return withFractionOptions(
    createFractionAnswer(getMixedNumberTotalNumerator(mixed), mixed.denominator),
    options,
  );
}

function randomReducedProperFraction({
  minDenominator = 3,
  maxDenominator = 12,
  maxNumerator = 9,
} = {}) {
  for (let attempts = 0; attempts < 80; attempts += 1) {
    const denominator = randomNumber(minDenominator, maxDenominator);
    const numerator = randomNumber(1, Math.min(maxNumerator, denominator - 1));
    if (greatestCommonDivisor(numerator, denominator) === 1) {
      return { numerator, denominator };
    }
  }

  return { numerator: 1, denominator: 2 };
}

function randomMixedNumber() {
  const denominator = randomNumber(3, 9);
  const numerator = randomNumber(1, denominator - 1);
  return {
    whole: randomNumber(1, 5),
    numerator,
    denominator,
  };
}

function compareFractions(left, right) {
  return (left.numerator * right.denominator) - (right.numerator * left.denominator);
}

function getDistinctFractions(count) {
  const fractions = [];
  while (fractions.length < count) {
    const fraction = randomReducedProperFraction();
    const key = `${fraction.numerator}/${fraction.denominator}`;
    if (!fractions.some((item) => `${item.numerator}/${item.denominator}` === key)) {
      fractions.push(fraction);
    }
  }
  return fractions;
}

function shuffleItems(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function isSurdAnswer(answer) {
  return answer?.type === "surd";
}

function isFractionAnswer(answer) {
  return answer?.type === "fraction";
}

function isChoiceAnswer(answer) {
  return answer?.type === "factors" || answer?.type === "multiChoice" || answer?.type === "singleChoice";
}

function getFormattedAnswer(answer) {
  if (isSurdAnswer(answer)) {
    return `${answer.coefficient}√${answer.radicand}`;
  }

  if (isFractionAnswer(answer)) {
    if (answer.displayAsMixed || answer.requireMixed) return formatMixedFractionAnswer(answer);
    return answer.denominator === 1
      ? String(answer.numerator)
      : `${answer.numerator}/${answer.denominator}`;
  }

  if (answer?.type === "factors" || answer?.type === "multiChoice") {
    return answer.values.join(", ");
  }

  if (answer?.type === "singleChoice") {
    return answer.value;
  }

  return String(answer);
}

function renderStackedFractionHtml(numerator, denominator) {
  return `
    <span class="math-fraction">
      <span class="math-numerator">${escapeHtml(numerator)}</span>
      <span class="math-denominator">${escapeHtml(denominator)}</span>
    </span>
  `;
}

function renderMixedNumberHtml(whole, numerator, denominator) {
  return `
    <span class="math-mixed">
      <span class="math-whole">${escapeHtml(whole)}</span>
      ${renderStackedFractionHtml(numerator, denominator)}
    </span>
  `;
}

function renderMathText(value) {
  const text = String(value);
  const fractionPattern = /(-?\d+)\s+(\d+)\/(\d+)|(-?\d+|\?)\/(-?\d+|\?)/g;
  let html = "";
  let lastIndex = 0;
  let match = fractionPattern.exec(text);

  while (match) {
    html += escapeHtml(text.slice(lastIndex, match.index));
    html += match[1] !== undefined
      ? renderMixedNumberHtml(match[1], match[2], match[3])
      : renderStackedFractionHtml(match[4], match[5]);
    lastIndex = fractionPattern.lastIndex;
    match = fractionPattern.exec(text);
  }

  html += escapeHtml(text.slice(lastIndex));
  return `<span class="math-expression">${html}</span>`;
}

function hasMathFraction(value) {
  return /(?:-?\d+|\?)\/(?:-?\d+|\?)/.test(String(value));
}

function usesMixedFractionInput(answer) {
  return isFractionAnswer(answer) && (answer.requireMixed || answer.displayAsMixed);
}

function getIntegerInputValue(input) {
  const rawValue = String(input.value || "").trim();
  if (rawValue === "") return null;

  const value = Number(rawValue);
  return Number.isInteger(value) ? value : null;
}

function clearFractionAnswerFields() {
  [
    elements.fractionNumeratorInput,
    elements.fractionDenominatorInput,
    elements.mixedWholeInput,
    elements.mixedNumeratorInput,
    elements.mixedDenominatorInput,
  ].forEach((input) => {
    input.value = "";
  });
}

function setFractionInputState(input, enabled, required) {
  input.disabled = !enabled;
  input.required = enabled && required;
}

function parseFractionBoxInput(answer) {
  if (!isFractionAnswer(answer)) return null;

  if (usesMixedFractionInput(answer)) {
    const enteredWhole = getIntegerInputValue(elements.mixedWholeInput);
    const enteredMixedNumerator = getIntegerInputValue(elements.mixedNumeratorInput);
    const enteredDenominator = getIntegerInputValue(elements.mixedDenominatorInput);
    if (
      enteredWhole === null
      || enteredMixedNumerator === null
      || enteredDenominator === null
      || enteredMixedNumerator < 0
      || enteredDenominator <= 0
    ) {
      return null;
    }

    const sign = enteredWhole < 0 ? -1 : 1;
    const enteredNumerator = sign * ((Math.abs(enteredWhole) * enteredDenominator) + enteredMixedNumerator);
    const parsedAnswer = createFractionAnswer(enteredNumerator, enteredDenominator);
    return parsedAnswer
      ? {
          ...parsedAnswer,
          enteredNumerator,
          enteredDenominator,
          enteredKind: "mixed",
          enteredWhole,
          enteredMixedNumerator,
        }
      : null;
  }

  const enteredNumerator = getIntegerInputValue(elements.fractionNumeratorInput);
  const enteredDenominator = getIntegerInputValue(elements.fractionDenominatorInput);
  if (enteredNumerator === null || enteredDenominator === null || enteredDenominator <= 0) return null;

  const parsedAnswer = createFractionAnswer(enteredNumerator, enteredDenominator);
  return parsedAnswer
    ? {
        ...parsedAnswer,
        enteredNumerator,
        enteredDenominator,
        enteredKind: "fraction",
      }
    : null;
}

function parseFractionInput(value) {
  const cleanValue = String(value || "").trim();
  const mixedNumberMatch = cleanValue.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixedNumberMatch) {
    const enteredWhole = Number(mixedNumberMatch[1]);
    const enteredMixedNumerator = Number(mixedNumberMatch[2]);
    const enteredDenominator = Number(mixedNumberMatch[3]);
    const sign = enteredWhole < 0 ? -1 : 1;
    const enteredNumerator = sign * ((Math.abs(enteredWhole) * enteredDenominator) + enteredMixedNumerator);
    const answer = createFractionAnswer(enteredNumerator, enteredDenominator);

    return answer
      ? {
          ...answer,
          enteredNumerator,
          enteredDenominator,
          enteredKind: "mixed",
          enteredWhole,
          enteredMixedNumerator,
        }
      : null;
  }

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
          enteredKind: "fraction",
        }
      : null;
  }

  const wholeNumberMatch = cleanValue.match(/^-?\d+$/);
  if (wholeNumberMatch) {
    return {
      ...createFractionAnswer(Number(cleanValue), 1),
      enteredNumerator: Number(cleanValue),
      enteredDenominator: 1,
      enteredKind: "whole",
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

function isMixedNumberGuess(guess) {
  return guess.enteredKind === "mixed"
    && Math.abs(guess.enteredWhole) > 0
    && guess.enteredMixedNumerator > 0
    && guess.enteredMixedNumerator < guess.enteredDenominator;
}

function isImproperFractionGuess(guess) {
  return guess.enteredKind === "fraction"
    && Math.abs(guess.enteredNumerator) > Math.abs(guess.enteredDenominator);
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

function setFractionAnswerMode(answer) {
  const enabled = isFractionAnswer(answer);
  const mixed = usesMixedFractionInput(answer);
  elements.answerForm.classList.toggle("fraction-answer-mode", enabled);
  elements.answerForm.classList.toggle("mixed-fraction-answer-mode", enabled && mixed);
  elements.fractionAnswerFields.hidden = !enabled;
  elements.fractionOnlyAnswer.hidden = !enabled || mixed;
  elements.mixedFractionAnswer.hidden = !enabled || !mixed;

  setFractionInputState(elements.fractionNumeratorInput, enabled && !mixed, enabled && !mixed);
  setFractionInputState(elements.fractionDenominatorInput, enabled && !mixed, enabled && !mixed);
  setFractionInputState(elements.mixedWholeInput, enabled && mixed, enabled && mixed);
  setFractionInputState(elements.mixedNumeratorInput, enabled && mixed, enabled && mixed);
  setFractionInputState(elements.mixedDenominatorInput, enabled && mixed, enabled && mixed);
}

function setChoiceAnswerMode(answer) {
  const enabled = isChoiceAnswer(answer);
  const autoSubmit = enabled && answer.autoSubmit === true && answer.type === "singleChoice";
  elements.answerForm.classList.toggle("choice-answer-mode", enabled);
  elements.answerForm.classList.toggle("choice-auto-submit-mode", autoSubmit);
  elements.answerSubmitButton.hidden = autoSubmit;
  elements.choiceAnswerFields.hidden = !enabled;
  elements.choiceAnswerFields.innerHTML = "";

  if (!enabled) return;

  if (answer.type === "factors") {
    elements.choiceAnswerFields.innerHTML = `
      <div class="factor-answer-grid">
        ${answer.values.map((value, index) => {
          const prefilled = index === 0 || index === answer.values.length - 1;
          return `
            <label class="${prefilled ? "prefilled" : ""}">
              <span>Factor ${index + 1}</span>
              <input
                type="number"
                inputmode="numeric"
                data-factor-input
                value="${prefilled ? value : ""}"
                ${prefilled ? "readonly" : ""}
                required
              />
            </label>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  const inputType = answer.type === "multiChoice" ? "checkbox" : "radio";
  elements.choiceAnswerFields.innerHTML = `
    <div class="choice-option-grid">
      ${answer.options.map((option) => `
        <label class="choice-toggle">
          <input type="${inputType}" name="choice-answer" value="${escapeHtml(option)}" />
          ${renderMathText(option)}
        </label>
      `).join("")}
    </div>
  `;
}

function getChoiceGuess(answer) {
  if (answer?.type === "factors") {
    return [...elements.choiceAnswerFields.querySelectorAll("[data-factor-input]")]
      .map((input) => Number(input.value))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
  }

  if (answer?.type === "multiChoice") {
    return [...elements.choiceAnswerFields.querySelectorAll("input:checked")]
      .map((input) => Number(input.value))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
  }

  if (answer?.type === "singleChoice") {
    return elements.choiceAnswerFields.querySelector("input:checked")?.value || "";
  }

  return null;
}

const skillQuestionGenerators = {
  "speed-single-digit-addition": () => {
    const a = randomNumber(1, 9);
    const b = randomNumber(1, 9);
    return { text: `${a} + ${b} = ?`, answer: a + b };
  },
  "speed-single-digit-subtraction": () => {
    const answer = randomNumber(0, 9);
    const b = randomNumber(1, 9);
    const a = answer + b;
    return { text: `${a} - ${b} = ?`, answer };
  },
  "speed-single-digit-multiplication": () => {
    const a = randomNumber(1, 9);
    const b = randomNumber(1, 9);
    return { text: `${a} × ${b} = ?`, answer: a * b };
  },
  "speed-single-digit-division": () => {
    const divisor = randomNumber(2, 9);
    const quotient = randomNumber(2, 9);
    return { text: `${divisor * quotient} ÷ ${divisor} = ?`, answer: quotient };
  },
  "number-identify-factors": () => {
    const number = sample([12, 16, 18, 20, 24, 28, 30, 36, 40, 42, 48, 56, 60, 72]);
    const values = getFactors(number);
    return {
      text: `List all factors of ${number}`,
      answer: { type: "factors", values },
    };
  },
  "number-identify-multiples": () => {
    const base = randomNumber(3, 9);
    const correctOne = base * randomNumber(2, 6);
    const correctTwo = base * randomNumber(7, 10);
    const distractors = [];
    while (distractors.length < 2) {
      const candidate = randomNumber(12, 72);
      if (candidate % base !== 0 && !distractors.includes(candidate)) distractors.push(candidate);
    }
    const options = [correctOne, correctTwo, ...distractors].sort(() => Math.random() - 0.5);
    return {
      text: `Which are multiples of ${base}?`,
      answer: {
        type: "multiChoice",
        values: [correctOne, correctTwo].sort((a, b) => a - b),
        options,
      },
    };
  },
  "number-identify-primes": () => {
    const number = randomNumber(2, 100);
    return {
      text: `Is ${number} prime or composite?`,
      answer: {
        type: "singleChoice",
        value: isPrimeNumber(number) ? "Prime" : "Composite",
        options: ["Prime", "Composite"],
        autoSubmit: true,
      },
    };
  },
  "number-hcf": () => {
    const a = sample([18, 24, 30, 36, 42, 48, 54, 60, 72]);
    const b = sample([24, 30, 36, 48, 54, 60, 72, 84]);
    return { text: `Find the HCF of ${a} and ${b}`, answer: greatestCommonDivisor(a, b) };
  },
  "number-lcm": () => {
    const a = randomNumber(4, 12);
    const b = randomNumber(4, 15);
    return { text: `Find the LCM of ${a} and ${b}`, answer: leastCommonMultiple(a, b) };
  },
  "number-evaluate-squares": () => {
    const number = randomNumber(1, 10);
    return { text: `${number}² = ?`, answer: number ** 2 };
  },
  "number-square-roots": () => {
    const root = randomNumber(1, 12);
    return { text: `√${root ** 2} = ?`, answer: root };
  },
  "number-add-integers": () => {
    const a = randomNumber(-20, 20);
    const b = randomNumber(-20, 20);
    return { text: `${a} + ${formatSigned(b)} = ?`, answer: a + b };
  },
  "number-subtract-integers": () => {
    const a = randomNumber(-20, 20);
    const b = randomNumber(-20, 20);
    return { text: `${a} - ${formatSigned(b)} = ?`, answer: a - b };
  },
  "number-multiply-integers": () => {
    const a = randomNumber(-9, 9) || -6;
    const b = randomNumber(-9, 9) || 8;
    return { text: `${a} × ${formatSigned(b)} = ?`, answer: a * b };
  },
  "number-divide-integers": () => {
    const divisor = sample([-9, -8, -7, -6, -5, -4, -3, 3, 4, 5, 6, 7, 8, 9]);
    const quotient = randomNumber(-9, 9) || 6;
    return { text: `${divisor * quotient} ÷ ${divisor} = ?`, answer: quotient };
  },
  "fractions-simplify-fractions": () => {
    const base = randomReducedProperFraction({ minDenominator: 4, maxDenominator: 12, maxNumerator: 8 });
    const multiplier = randomNumber(2, 6);
    return {
      text: `Simplify ${base.numerator * multiplier}/${base.denominator * multiplier}`,
      answer: createSimplifiedFractionAnswer(base.numerator, base.denominator),
    };
  },
  "fractions-equivalent-fractions": () => {
    const fraction = randomReducedProperFraction();
    const multiplier = randomNumber(2, 8);
    const missingNumerator = Math.random() > 0.5;
    return missingNumerator
      ? {
          text: `Complete ${fraction.numerator}/${fraction.denominator} = ?/${fraction.denominator * multiplier}`,
          answer: fraction.numerator * multiplier,
        }
      : {
          text: `Complete ${fraction.numerator}/${fraction.denominator} = ${fraction.numerator * multiplier}/?`,
          answer: fraction.denominator * multiplier,
        };
  },
  "fractions-improper-to-mixed": () => {
    const mixed = randomMixedNumber();
    const numerator = getMixedNumberTotalNumerator(mixed);
    return {
      text: `Convert ${numerator}/${mixed.denominator} to a mixed number`,
      answer: createMixedNumberAnswer(mixed, { requireMixed: true, displayAsMixed: true }),
    };
  },
  "fractions-mixed-to-improper": () => {
    const mixed = randomMixedNumber();
    return {
      text: `Convert ${formatMixedNumberParts(mixed)} to an improper fraction`,
      answer: createMixedNumberAnswer(mixed, { requireImproper: true }),
    };
  },
  "fractions-compare-fractions": () => {
    const [left, right] = getDistinctFractions(2);
    const larger = compareFractions(left, right) > 0 ? left : right;
    return {
      text: `Which is larger: ${formatFractionParts(left)} or ${formatFractionParts(right)}?`,
      answer: {
        type: "singleChoice",
        value: formatFractionParts(larger),
        options: shuffleItems([formatFractionParts(left), formatFractionParts(right)]),
        autoSubmit: true,
      },
    };
  },
  "fractions-order-fractions": () => {
    const ordered = getDistinctFractions(3).sort(compareFractions);
    const options = shuffleItems([
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [2, 1, 0],
    ].map((indexes) => indexes.map((index) => formatFractionParts(ordered[index])).join(", ")));
    const value = ordered.map(formatFractionParts).join(", ");
    return {
      text: `Order from smallest to largest: ${shuffleItems(ordered).map(formatFractionParts).join(", ")}`,
      answer: { type: "singleChoice", value, options },
    };
  },
  "fractions-add-same-denominator": () => {
    const denominator = randomNumber(5, 14);
    const leftNumerator = randomNumber(1, denominator - 2);
    const rightNumerator = randomNumber(1, denominator - leftNumerator - 1);
    return {
      text: `${leftNumerator}/${denominator} + ${rightNumerator}/${denominator} = ?`,
      answer: createFractionAnswer(leftNumerator + rightNumerator, denominator),
    };
  },
  "fractions-subtract-same-denominator": () => {
    const denominator = randomNumber(5, 14);
    const leftNumerator = randomNumber(2, denominator - 1);
    const rightNumerator = randomNumber(1, leftNumerator - 1);
    return {
      text: `${leftNumerator}/${denominator} − ${rightNumerator}/${denominator} = ?`,
      answer: createFractionAnswer(leftNumerator - rightNumerator, denominator),
    };
  },
  "fractions-add-different-denominators": () => {
    const left = randomReducedProperFraction();
    let right = randomReducedProperFraction();
    while (right.denominator === left.denominator) {
      right = randomReducedProperFraction();
    }
    return {
      text: `${formatFractionParts(left)} + ${formatFractionParts(right)} = ?`,
      answer: createFractionAnswer(
        (left.numerator * right.denominator) + (right.numerator * left.denominator),
        left.denominator * right.denominator,
      ),
    };
  },
  "fractions-subtract-different-denominators": () => {
    let left = randomReducedProperFraction();
    let right = randomReducedProperFraction();
    while (right.denominator === left.denominator || compareFractions(left, right) <= 0) {
      left = randomReducedProperFraction();
      right = randomReducedProperFraction();
    }
    return {
      text: `${formatFractionParts(left)} − ${formatFractionParts(right)} = ?`,
      answer: createFractionAnswer(
        (left.numerator * right.denominator) - (right.numerator * left.denominator),
        left.denominator * right.denominator,
      ),
    };
  },
  "fractions-multiply-fractions": () => {
    const left = randomReducedProperFraction();
    const right = randomReducedProperFraction();
    return {
      text: `${formatFractionParts(left)} × ${formatFractionParts(right)} = ?`,
      answer: createFractionAnswer(left.numerator * right.numerator, left.denominator * right.denominator),
    };
  },
  "fractions-divide-fractions": () => {
    const left = randomReducedProperFraction();
    const right = randomReducedProperFraction();
    return {
      text: `${formatFractionParts(left)} ÷ ${formatFractionParts(right)} = ?`,
      answer: createFractionAnswer(left.numerator * right.denominator, left.denominator * right.numerator),
    };
  },
  "fractions-add-mixed-numbers": () => {
    const left = randomMixedNumber();
    const right = randomMixedNumber();
    return {
      text: `${formatMixedNumberParts(left)} + ${formatMixedNumberParts(right)} = ?`,
      answer: withFractionOptions(
        createFractionAnswer(
          (getMixedNumberTotalNumerator(left) * right.denominator)
            + (getMixedNumberTotalNumerator(right) * left.denominator),
          left.denominator * right.denominator,
        ),
        { displayAsMixed: true },
      ),
    };
  },
  "fractions-subtract-mixed-numbers": () => {
    let left = randomMixedNumber();
    let right = randomMixedNumber();
    while (compareFractions(
      { numerator: getMixedNumberTotalNumerator(left), denominator: left.denominator },
      { numerator: getMixedNumberTotalNumerator(right), denominator: right.denominator },
    ) <= 0) {
      left = randomMixedNumber();
      right = randomMixedNumber();
    }
    return {
      text: `${formatMixedNumberParts(left)} − ${formatMixedNumberParts(right)} = ?`,
      answer: withFractionOptions(
        createFractionAnswer(
          (getMixedNumberTotalNumerator(left) * right.denominator)
            - (getMixedNumberTotalNumerator(right) * left.denominator),
          left.denominator * right.denominator,
        ),
        { displayAsMixed: true },
      ),
    };
  },
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

function canManageStudentRequests() {
  return state.isAdmin && cleanEmail(state.authEmail) === STUDENT_REQUEST_ADMIN_EMAIL;
}

function getStudentRequestStatusLabel() {
  const status = state.studentYearLevelRequest?.status || "";
  if (status === "assigned") return "Assigned";
  if (status === "new") return "Request sent";
  return "Not requested";
}

function getFirestoreTimestampMillis(timestamp) {
  if (typeof timestamp?.toMillis === "function") return timestamp.toMillis();
  if (Number.isFinite(timestamp?.seconds)) return timestamp.seconds * 1000;
  if (typeof timestamp === "string") return Date.parse(timestamp) || 0;
  return 0;
}

function isTopicArea(gameId) {
  return gameInfo[gameId]?.type === "topic";
}

function isSkillGame(gameId) {
  return gameInfo[gameId]?.type === "skill";
}

function getSkillTopicId(skillId) {
  return gameInfo[skillId]?.topicId || "";
}

function getLeaderboardGameId(gameId) {
  return isSkillGame(gameId) ? getSkillTopicId(gameId) : gameId;
}

function getGameTypeLabel(gameId) {
  return isTopicArea(gameId) ? "topic area" : "skill";
}

function getEffectiveChallengeYearLevel() {
  if (isTeacherTestingAsStudent()) return cleanYearLevel(state.testStudentYearLevel) || DEFAULT_YEAR_LEVEL;
  if (getActiveAccountType() === "student") {
    return cleanYearLevel(state.studentYearLevel) || cleanYearLevel(state.boardYearLevel) || DEFAULT_YEAR_LEVEL;
  }
  if (getActiveAccountType() === "teacher") {
    return getTeacherChallengeYearLevel(state.game);
  }
  return cleanYearLevel(state.boardYearLevel) || DEFAULT_YEAR_LEVEL;
}

function getYearRank(yearLevel) {
  return YEAR_LEVELS.findIndex((level) => level.id === yearLevel);
}

function getGameRequiredYear(gameId) {
  return cleanYearLevel(gameInfo[gameId]?.accessYear) || DEFAULT_YEAR_LEVEL;
}

function getTeacherPlayableChallengeYearLevels(gameId = state.game) {
  return state.teacherYearLevels
    .map(cleanYearLevel)
    .filter((yearLevel, index, levels) => yearLevel && levels.indexOf(yearLevel) === index)
    .filter((yearLevel) => !gameInfo[gameId] || canYearAccessGame(yearLevel, gameId));
}

function getTeacherChallengeYearLevel(gameId = state.game) {
  const playableYearLevels = getTeacherPlayableChallengeYearLevels(gameId);
  const selectedYearLevel = cleanYearLevel(state.teacherChallengeYearLevel);
  if (selectedYearLevel && playableYearLevels.includes(selectedYearLevel)) return selectedYearLevel;

  const boardYearLevel = cleanYearLevel(state.boardYearLevel);
  if (boardYearLevel && playableYearLevels.includes(boardYearLevel)) return boardYearLevel;

  return playableYearLevels[0] || selectedYearLevel || boardYearLevel || DEFAULT_YEAR_LEVEL;
}

function syncTeacherChallengeYearLevel(gameId = state.game) {
  const yearLevel = getTeacherChallengeYearLevel(gameId);
  state.teacherChallengeYearLevel = yearLevel;
  return yearLevel;
}

function getTopicSkillIds(topicId, yearLevel = "") {
  const cleanLevel = cleanYearLevel(yearLevel);
  return SKILL_IDS.filter((skillId) => {
    if (getSkillTopicId(skillId) !== topicId) return false;
    return !cleanLevel || canYearAccessGame(cleanLevel, skillId);
  });
}

function hasQuestionGenerator(gameId) {
  return typeof skillQuestionGenerators[gameId] === "function";
}

function getPlayableTopicSkillIds(topicId, yearLevel = getEffectiveChallengeYearLevel()) {
  return getTopicSkillIds(topicId, yearLevel).filter(hasQuestionGenerator);
}

function hasUnlockedTopicSkills(topicId, yearLevel = getEffectiveChallengeYearLevel()) {
  return isTopicArea(topicId) && getPlayableTopicSkillIds(topicId, yearLevel).length > 0;
}

function getTopicSkillSummary(topicId, yearLevel = getEffectiveChallengeYearLevel()) {
  const skillCount = getPlayableTopicSkillIds(topicId, yearLevel).length;
  return `${skillCount} ${skillCount === 1 ? "skill" : "skills"} unlocked`;
}

function hasPenAndPaperSkill(gameId, yearLevel = getEffectiveChallengeYearLevel()) {
  if (PEN_AND_PAPER_GAME_IDS.has(gameId)) return true;
  if (!isTopicArea(gameId)) return false;
  return getPlayableTopicSkillIds(gameId, yearLevel).some((skillId) => PEN_AND_PAPER_GAME_IDS.has(skillId));
}

function getGameDuration(gameId, yearLevel = getEffectiveChallengeYearLevel()) {
  if (isTopicArea(gameId)) {
    return ONE_MINUTE_TOPIC_GAME_IDS.has(gameId) ? GAME_SECONDS : TOPIC_GAME_SECONDS;
  }
  if (FIVE_MINUTE_SKILL_GAME_IDS.has(gameId)) return PAPER_GAME_SECONDS;
  return hasPenAndPaperSkill(gameId, yearLevel) ? PAPER_GAME_SECONDS : GAME_SECONDS;
}

function getGameDurationLabel(gameId, yearLevel = getEffectiveChallengeYearLevel()) {
  const minutes = getGameDuration(gameId, yearLevel) / 60;
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

function getPenAndPaperNote(gameId, yearLevel = getEffectiveChallengeYearLevel()) {
  return hasPenAndPaperSkill(gameId, yearLevel)
    ? "Pen and paper recommended. This challenge gives 5 minutes so you can write working out."
    : "";
}

function getGameHash(gameId, { view = "" } = {}) {
  const suffix = view === "leaderboard" ? "/leaderboard" : "";
  return `#game/${encodeURIComponent(gameId)}${suffix}`;
}

function getLeaderboardHash(gameId) {
  return getGameHash(getLeaderboardGameId(gameId), { view: "leaderboard" });
}

function canYearAccessGame(yearLevel, gameId) {
  const yearRank = getYearRank(yearLevel);
  const requiredRank = getYearRank(getGameRequiredYear(gameId));
  const yearCanAccess = yearRank >= 0 && requiredRank >= 0 && yearRank >= requiredRank;
  if (!yearCanAccess) return false;
  if (isTopicArea(gameId)) return hasUnlockedTopicSkills(gameId, yearLevel);
  return true;
}

function canAccessGame(gameId) {
  if (!gameInfo[gameId]) return false;
  if (!state.sharedConfigured || !state.authAllowed) return true;
  if (isTeacherTestingAsStudent()) {
    return canYearAccessGame(state.testStudentYearLevel, gameId);
  }
  if (getActiveAccountType() === "teacher") {
    if (!state.teacherYearLevels.length) return false;
    return canYearAccessGame(getTeacherChallengeYearLevel(gameId), gameId);
  }

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
  if (!isTopicArea(gameId)) return false;
  const forcedYearLevel = getForcedLeaderboardYearLevel();
  return !forcedYearLevel || canYearAccessGame(forcedYearLevel, gameId);
}

function getLeaderboardAccessMessage() {
  if (!state.sharedConfigured) {
    return "Firebase setup needed. Until then, this leaderboard uses scores saved on this device.";
  }

  if (!state.authAllowed) {
    return "Sign in with your Google account to view shared leaderboards.";
  }

  if (getActiveAccountType() === "teacher" && !state.teacherYearLevels.length) {
    return "Choose your teaching year levels before viewing shared leaderboards.";
  }

  if (getActiveAccountType() === "student" && !state.studentYearLevel) {
    return getAccountSetupMessage();
  }

  const forcedYearLevel = getForcedLeaderboardYearLevel();
  if (forcedYearLevel && !canYearAccessGame(forcedYearLevel, state.game)) {
    return `This topic leaderboard is locked for ${getYearLabel(forcedYearLevel)} students.`;
  }

  return "Leaderboards are locked to your account setup.";
}

function getProgressAccessMessage() {
  if (!state.sharedConfigured) {
    return "Firebase setup needed. Until then, medal progress uses scores saved on this device.";
  }

  if (!state.authAllowed) {
    return "Sign in with your Google account to load your medal progress.";
  }

  if (getActiveAccountType() === "teacher" && !state.teacherYearLevels.length) {
    return "Choose your teaching year levels before loading synced medal progress.";
  }

  if (getActiveAccountType() === "student" && !state.studentYearLevel) {
    return getAccountSetupMessage();
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
  return getVisibleTopicAreaIds();
}

function getVisibleTopicAreaIds() {
  if (getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent()) {
    return TOPIC_AREA_IDS.filter((topicId) => getTeacherPlayableChallengeYearLevels(topicId).length > 0);
  }

  const topicIds = TOPIC_AREA_IDS.filter((topicId) => (
    hasUnlockedTopicSkills(topicId, getEffectiveChallengeYearLevel())
  ));

  return shouldHideInaccessibleGames()
    ? topicIds.filter(canAccessGame)
    : topicIds;
}

function getVisibleProgressGameIds() {
  return shouldHideInaccessibleGames()
    ? GAME_IDS.filter(canAccessGame)
    : GAME_IDS;
}

function getVisibleBoardGameIds() {
  const boardGameIds = TOPIC_AREA_IDS.filter((gameId) => canYearAccessGame(state.boardYearLevel, gameId));
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
    const playableYearLevels = getTeacherPlayableChallengeYearLevels(gameId);
    return playableYearLevels.length
      ? `Available for teacher accounts. Choose ${getYearLabel(getTeacherChallengeYearLevel(gameId))} or another saved teaching year before playing.`
      : "No saved teaching year has skills unlocked for this topic yet.";
  }

  if (!state.studentYearLevel) {
    return "Get your year level assigned to see available challenges.";
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
  elements.teacherChallengeYearSelect.innerHTML = createYearOptions();
  elements.teacherChallengeYearSelect.value = state.teacherChallengeYearLevel;
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
    if (entry.bestTopicBronzeStreak !== undefined && !Number.isInteger(entry.bestTopicBronzeStreak)) return false;
    if (entry.role === "teacher") {
      return Array.isArray(entry.teacherYearLevels) && validYearLevels.has(entry.yearLevel);
    }
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

  return !state.studentYearLevel && state.studentYearLevelRequest?.status !== "new";
}

function getAccountSetupMessage() {
  const accountType = getActiveAccountType();

  if (!state.accountType) {
    return "Sign in with your Google account before playing.";
  }

  if (accountType === "teacher") {
    if (isTeacherTestingAsStudent() && !cleanYearLevel(state.testStudentYearLevel)) {
      return "Choose a test student year level before playing.";
    }

    if (!state.teacherYearLevels.length) {
      return "Choose your teaching year levels before playing as a teacher.";
    }
  }

  if (state.studentDirectoryStatus === "missing") {
    return state.studentYearLevelRequest?.status === "new"
      ? "Your year level request has been sent. You can play once it has been assigned."
      : "Your email is not in the student year-level list yet. Send a request before playing.";
  }

  return "Your year level needs to be assigned before playing.";
}

function getScoreContext() {
  if (isTeacherTestingAsStudent()) {
    return {
      role: "test",
      yearLevel: state.testStudentYearLevel,
    };
  }

  if (getActiveAccountType() === "teacher") {
    const teacherYearLevel = isTopicArea(state.game) && (state.page === "game" || !elements.playSection.hidden)
      ? getTeacherChallengeYearLevel(state.game)
      : cleanYearLevel(state.boardYearLevel) || getTeacherChallengeYearLevel(state.game);
    return {
      role: "teacher",
      yearLevel: teacherYearLevel,
      teacherYearLevels: state.teacherYearLevels,
    };
  }

  return {
    role: "student",
    yearLevel: state.studentYearLevel || state.boardYearLevel,
  };
}

function getStudentScoreId(uid, yearLevel) {
  const cleanLevel = cleanYearLevel(yearLevel);
  return uid && cleanLevel ? `${uid}_${cleanLevel}` : uid;
}

function getScoreIdentity(scoreContext, playerName) {
  if (state.authUid) {
    if (scoreContext.role === "student") {
      return {
        id: getStudentScoreId(state.authUid, scoreContext.yearLevel),
        uid: state.authUid,
      };
    }

    if (scoreContext.role === "teacher") {
      return {
        id: getStudentScoreId(state.authUid, scoreContext.yearLevel),
        uid: state.authUid,
      };
    }

    return {
      id: state.authUid,
      uid: state.authUid,
    };
  }

  const cleanName = cleanLeaderboardName(playerName) || "Student";
  const contextKey = scoreContext.role === "teacher"
    ? `teacher:${scoreContext.yearLevel || state.boardYearLevel}`
    : `${scoreContext.role}:${scoreContext.yearLevel || state.boardYearLevel}`;
  const id = `${contextKey}:${cleanName}`;
  return { id, uid: id };
}

function scoreMatchesIdentity(entry, scoreContext, scoreIdentity) {
  if (!entry || entry.role !== scoreContext.role) return false;

  if (scoreContext.role === "student") {
    if (entry.yearLevel !== cleanYearLevel(scoreContext.yearLevel)) return false;
    return entry.id === scoreIdentity.id || entry.uid === scoreIdentity.uid;
  }

  if (scoreContext.role === "teacher") {
    if (entry.yearLevel !== cleanYearLevel(scoreContext.yearLevel)) return false;
    return entry.id === scoreIdentity.id || entry.uid === scoreIdentity.uid;
  }

  return entry.id === scoreIdentity.id || entry.uid === scoreIdentity.uid;
}

function scoreMatchesCurrentPlayer(entry, scoreContext = getScoreContext()) {
  if (isTeacherTestingAsStudent()) return false;
  const scoreIdentity = getScoreIdentity(scoreContext, state.player || getGooglePlayerName());
  if (scoreMatchesIdentity(entry, scoreContext, scoreIdentity)) return true;
  return !state.authUid && entry.name === state.player;
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
  const scoreIdentity = getScoreIdentity(scoreContext, playerName);
  const existingIndex = scores[state.game].findIndex(
    (entry) => scoreMatchesIdentity(entry, scoreContext, scoreIdentity),
  );
  const previousScore = existingIndex >= 0 ? scores[state.game][existingIndex].score : null;
  const previousBestStreak = existingIndex >= 0 && Number.isInteger(scores[state.game][existingIndex].bestStreak)
    ? scores[state.game][existingIndex].bestStreak
    : 0;
  const previousBestTopicBronzeStreak = existingIndex >= 0 && Number.isInteger(scores[state.game][existingIndex].bestTopicBronzeStreak)
    ? scores[state.game][existingIndex].bestTopicBronzeStreak
    : 0;
  const improved = previousScore === null || state.score > previousScore;
  const bestStreak = Math.max(previousBestStreak, state.bestStreak);
  const bestTopicBronzeStreak = isTopicArea(state.game)
    ? Math.max(previousBestTopicBronzeStreak, getBronzeStreak(scoreContext).highestStreak)
    : previousBestTopicBronzeStreak;
  const entry = {
    id: scoreIdentity.id,
    uid: scoreIdentity.uid,
    name: playerName,
    score: improved ? state.score : previousScore,
    bestStreak,
    bestTopicBronzeStreak,
    role: scoreContext.role,
    game: state.game,
  };

  if (scoreContext.role === "teacher") {
    entry.teacherYearLevels = scoreContext.teacherYearLevels;
    entry.yearLevel = scoreContext.yearLevel;
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

function updateLocalTeacherScoreMetadata(name, teacherYearLevels) {
  if (!state.authUid) return;

  const cleanName = cleanLeaderboardName(name);
  const cleanLevels = teacherYearLevels.map(cleanYearLevel).filter(Boolean);
  if (!cleanName || !cleanLevels.length) return;
  const updateEntry = (entry) => {
    if (entry.role !== "teacher" || (entry.uid || entry.id) !== state.authUid) {
      return entry;
    }

    return {
      ...entry,
      name: cleanName,
      teacherYearLevels: cleanLevels,
    };
  };

  const scores = getLocalScores();
  let changed = false;

  GAME_IDS.forEach((gameId) => {
    scores[gameId] = normalizeScores(scores[gameId])
      .map((entry) => {
        const updatedEntry = updateEntry(entry);
        if (updatedEntry !== entry) changed = true;
        return updatedEntry;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 300);
  });

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  }

  Object.entries(state.sharedScores).forEach(([gameId, scoreRows]) => {
    if (!Array.isArray(scoreRows)) return;
    state.sharedScores[gameId] = normalizeScores(scoreRows)
      .map(updateEntry)
      .sort((a, b) => b.score - a.score)
      .slice(0, 300);
  });
}

function applyCurrentTeacherScoreName(scores) {
  const normalizedScores = normalizeScores(scores);
  if (getActiveAccountType() !== "teacher" || !state.authUid) return normalizedScores;

  const cleanName = cleanLeaderboardName(getGooglePlayerName());
  const cleanLevels = state.teacherYearLevels.map(cleanYearLevel).filter(Boolean);
  if (!cleanName || !cleanLevels.length) return normalizedScores;

  return normalizedScores.map((entry) => {
    if (entry.role !== "teacher" || (entry.uid || entry.id) !== state.authUid) {
      return entry;
    }

    return {
      ...entry,
      name: cleanName,
      teacherYearLevels: cleanLevels,
    };
  });
}

function getLeaderboardDedupeKey(entry) {
  const identity = entry.uid || entry.id || entry.name;
  if (entry.role === "teacher") return `teacher:${identity}:${entry.yearLevel}`;
  return `student:${identity}:${entry.yearLevel}`;
}

function dedupeLeaderboardScores(scores) {
  const bestScores = new Map();

  scores.forEach((entry) => {
    const key = getLeaderboardDedupeKey(entry);
    const existing = bestScores.get(key);
    if (!existing) {
      bestScores.set(key, entry);
      return;
    }

    const existingBestStreak = Number.isInteger(existing.bestStreak) ? existing.bestStreak : 0;
    const entryBestStreak = Number.isInteger(entry.bestStreak) ? entry.bestStreak : 0;
    const existingBestTopicBronzeStreak = Number.isInteger(existing.bestTopicBronzeStreak) ? existing.bestTopicBronzeStreak : 0;
    const entryBestTopicBronzeStreak = Number.isInteger(entry.bestTopicBronzeStreak) ? entry.bestTopicBronzeStreak : 0;
    const bestEntry = entry.score > existing.score ? entry : existing;
    bestScores.set(key, {
      ...bestEntry,
      bestStreak: Math.max(existingBestStreak, entryBestStreak),
      bestTopicBronzeStreak: Math.max(existingBestTopicBronzeStreak, entryBestTopicBronzeStreak),
    });
  });

  return [...bestScores.values()];
}

function filterScoresForBoard(scores, yearLevel, teacherFilter, { scoreLimit = 10 } = {}) {
  const currentViewerIsStudent = getActiveAccountType() === "student" && !isTeacherTestingAsStudent();
  const matchingScores = applyCurrentTeacherScoreName(scores).filter((entry) => {
    if (entry.role === "teacher") {
      const teacherScoreYearLevel = cleanYearLevel(entry.yearLevel);
      if (teacherScoreYearLevel !== yearLevel) return false;
      if (teacherFilter === "none") return false;
      if (teacherFilter === "all") return true;
      return Array.isArray(entry.teacherYearLevels) && entry.teacherYearLevels.includes(yearLevel);
    }

    if (currentViewerIsStudent && teacherFilter !== "none") {
      return entry.yearLevel === yearLevel && scoreMatchesCurrentPlayer(entry, { role: "student", yearLevel });
    }

    return entry.yearLevel === yearLevel;
  });
  const filteredScores = dedupeLeaderboardScores(matchingScores)
    .sort((a, b) => b.score - a.score);

  if (currentViewerIsStudent && teacherFilter !== "none" && scoreLimit !== null) {
    const currentStudentIndex = filteredScores.findIndex(
      (entry) => entry.role === "student" && scoreMatchesCurrentPlayer(entry, { role: "student", yearLevel }),
    );
    if (currentStudentIndex >= scoreLimit) {
      const currentStudentScore = filteredScores[currentStudentIndex];
      const visibleWithoutCurrentStudent = filteredScores
        .filter((_, index) => index !== currentStudentIndex)
        .slice(0, Math.max(scoreLimit - 1, 0));
      return [...visibleWithoutCurrentStudent, currentStudentScore];
    }
  }

  return scoreLimit === null ? filteredScores : filteredScores.slice(0, scoreLimit);
}

function getRawScores(game) {
  const rawScores = Array.isArray(state.sharedScores[game]) ? state.sharedScores[game] : getLocalScores()[game];
  return applyCurrentTeacherScoreName(rawScores);
}

function getVisibleScores(game = state.board, options = {}) {
  const rawScores = Array.isArray(state.sharedScores[game]) ? state.sharedScores[game] : getLocalScores()[game];
  return filterScoresForBoard(rawScores, state.boardYearLevel, state.teacherFilter, options)
    .filter((entry) => entry.score > 0);
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
  const contextYearLevel = entry.yearLevel || entry.teacherYearLevels?.join("-") || "teacher";
  return `${entry.uid || entry.id || `${entry.role}:${entry.name}`}:${contextYearLevel}`;
}

function shouldKeepCurrentPlayerInTeacherView() {
  return getActiveAccountType() === "student"
    && !isTeacherTestingAsStudent()
    && state.teacherFilter !== "none";
}

function limitScoreRows(scores, scoreLimit = 10, { keepCurrentPlayer = false } = {}) {
  if (scoreLimit === null) return scores;
  if (!keepCurrentPlayer) return scores.slice(0, scoreLimit);

  const currentPlayerIndex = scores.findIndex(scoreMatchesCurrentPlayer);
  if (currentPlayerIndex < scoreLimit) return scores.slice(0, scoreLimit);
  if (currentPlayerIndex < 0) return scores.slice(0, scoreLimit);

  return [
    ...scores.slice(0, Math.max(scoreLimit - 1, 0)),
    scores[currentPlayerIndex],
  ];
}

function aggregateTopicScoreRows(gameIds) {
  const totals = new Map();

  gameIds.forEach((gameId) => {
    filterScoresForBoard(getRawScores(gameId), state.boardYearLevel, state.teacherFilter, { scoreLimit: null })
      .forEach((entry) => {
        const key = getScoreKey(entry);
        const existing = totals.get(key) || {
          id: key,
          uid: entry.uid || entry.id || key,
          name: entry.name,
          score: 0,
          bestTopicBronzeStreak: 0,
          role: entry.role,
          yearLevel: entry.yearLevel,
          teacherYearLevels: entry.teacherYearLevels,
          games: 0,
        };

        existing.score += entry.score;
        existing.bestTopicBronzeStreak = Math.max(
          existing.bestTopicBronzeStreak,
          Number.isInteger(entry.bestTopicBronzeStreak) ? entry.bestTopicBronzeStreak : 0,
        );
        existing.games += 1;
        totals.set(key, existing);
      });
  });

  return [...totals.values()];
}

function getCombinedTopicScores(gameIds, scoreLimit = 10) {
  const scores = aggregateTopicScoreRows(gameIds)
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.games - a.games);

  return limitScoreRows(scores, scoreLimit, { keepCurrentPlayer: shouldKeepCurrentPlayerInTeacherView() });
}

function getTopicBronzeStreakScores(gameIds, scoreLimit = 10) {
  const scores = aggregateTopicScoreRows(gameIds)
    .filter((entry) => entry.bestTopicBronzeStreak > 0)
    .map((entry) => ({
      ...entry,
      score: entry.bestTopicBronzeStreak,
      totalScore: entry.score,
    }))
    .sort((a, b) => b.score - a.score || b.totalScore - a.totalScore || b.games - a.games);

  return limitScoreRows(scores, scoreLimit, { keepCurrentPlayer: shouldKeepCurrentPlayerInTeacherView() });
}

function getCurrentPlayerBestScore(gameId) {
  const currentScores = [
    ...normalizeScores(getRawScores(gameId)),
    ...normalizeScores(getLocalScores()[gameId] || []),
  ].filter(scoreMatchesCurrentPlayer);
  const progressBestScore = getProgressBestScore(gameId);

  return Math.max(
    progressBestScore,
    currentScores.reduce((best, entry) => Math.max(best, entry.score), 0),
  );
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

function normalizeProgressBestScores(bestScores, attempts = []) {
  const savedBestScores = bestScores && typeof bestScores === "object" && !Array.isArray(bestScores)
    ? bestScores
    : {};
  const scores = {};
  GAME_IDS.forEach((gameId) => {
    const score = savedBestScores[gameId];
    if (Number.isInteger(score) && score >= 0) {
      scores[gameId] = score;
    }
  });
  attempts.forEach((attempt) => {
    if (!GAME_IDS.includes(attempt?.game) || !Number.isInteger(attempt?.score) || attempt.score < 0) return;
    scores[attempt.game] = Math.max(scores[attempt.game] || 0, attempt.score);
  });
  return scores;
}

function getProgressPlayerKey(scoreContext = getScoreContext()) {
  if (state.authUid) {
    const contextKey = scoreContext.role === "student"
      ? scoreContext.yearLevel || state.boardYearLevel
      : scoreContext.role === "teacher"
        ? `teacher:${scoreContext.yearLevel || state.boardYearLevel}`
        : scoreContext.role;
    return `uid:${state.authUid}:${contextKey}`;
  }

  const playerName = getGooglePlayerName().toLowerCase();
  const contextKey = scoreContext.role === "teacher"
    ? scoreContext.yearLevel || state.boardYearLevel
    : scoreContext.yearLevel || state.boardYearLevel;
  return `local:${scoreContext.role}:${contextKey}:${playerName}`;
}

function getProgressRecord(scoreContext = getScoreContext()) {
  const store = getProgressStore();
  const key = getProgressPlayerKey(scoreContext);
  const record = store[key] && typeof store[key] === "object" ? store[key] : {};

  return {
    bronzeDays: Array.isArray(record.bronzeDays) ? record.bronzeDays : [],
    topicBronzeDays: Array.isArray(record.topicBronzeDays) ? record.topicBronzeDays : [],
    attempts: Array.isArray(record.attempts) ? record.attempts : [],
    bestScores: normalizeProgressBestScores(record.bestScores, record.attempts),
  };
}

function saveProgressRecord(record, scoreContext = getScoreContext()) {
  const store = getProgressStore();
  store[getProgressPlayerKey(scoreContext)] = record;
  saveProgressStore(store);
}

function getProgressBestScore(gameId, scoreContext = getScoreContext()) {
  const record = getProgressRecord(scoreContext);
  const bestScore = record.bestScores[gameId];
  return Number.isInteger(bestScore) && bestScore >= 0 ? bestScore : 0;
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

function scoreReachesBronze(gameId, score) {
  const bronzeGoal = getMedalGoalsForGame(gameId).find((goal) => goal.id === "bronze");
  return Boolean(bronzeGoal) && score >= bronzeGoal.score;
}

function recordProgressAttempt(gameId, score, scoreContext = getScoreContext()) {
  if (!shouldSaveScore(scoreContext)) return;

  const record = getProgressRecord(scoreContext);
  const previousBestScore = record.bestScores[gameId] || 0;
  record.bestScores = {
    ...record.bestScores,
    [gameId]: Math.max(previousBestScore, score),
  };

  const goals = getMedalGoalsForGame(gameId);
  if (!scoreReachesBronze(gameId, score)) {
    saveProgressRecord(record, scoreContext);
    return;
  }

  const today = getLocalDateKey();
  const bronzeDays = new Set(record.bronzeDays);
  bronzeDays.add(today);
  record.bronzeDays = [...bronzeDays].sort();
  if (isTopicArea(gameId)) {
    const topicBronzeDays = new Set(getTopicBronzeDays(record));
    topicBronzeDays.add(today);
    record.topicBronzeDays = [...topicBronzeDays].sort();
  }
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

function recordTopicSkillScore(skillId, points) {
  if (!isTopicArea(state.game) || !isSkillGame(skillId) || !Number.isInteger(points) || points <= 0) return;
  if (getSkillTopicId(skillId) !== state.game) return;

  state.topicSkillScores[skillId] = (state.topicSkillScores[skillId] || 0) + points;
}

function recordTopicSkillProgress(scoreContext) {
  if (!isTopicArea(state.game) || !shouldSaveScore(scoreContext)) return;

  Object.entries(state.topicSkillScores).forEach(([skillId, skillScore]) => {
    if (!isSkillGame(skillId) || getSkillTopicId(skillId) !== state.game) return;
    if (!Number.isInteger(skillScore) || skillScore <= 0) return;
    recordProgressAttempt(skillId, skillScore, scoreContext);
  });
}

function getTopicBronzeDays(record = getProgressRecord()) {
  const topicBronzeDays = new Set(record.topicBronzeDays);
  record.attempts
    .filter((attempt) => isTopicArea(attempt.game))
    .forEach((attempt) => {
      if (attempt.date) topicBronzeDays.add(attempt.date);
    });
  return [...topicBronzeDays].sort();
}

function getBronzeDays(record = getProgressRecord()) {
  const bronzeDays = new Set(record.bronzeDays);
  getTopicBronzeDays(record).forEach((dateKey) => bronzeDays.add(dateKey));
  record.attempts.forEach((attempt) => {
    if (attempt.date) bronzeDays.add(attempt.date);
  });
  return [...bronzeDays].sort();
}

function getLongestStreakFromDays(days) {
  const daySet = new Set(days);
  let longestStreak = 0;

  days.forEach((dateKey) => {
    if (daySet.has(offsetDateKey(dateKey, -1))) return;
    let cursor = dateKey;
    let streak = 0;

    while (daySet.has(cursor)) {
      streak += 1;
      cursor = offsetDateKey(cursor, 1);
    }

    longestStreak = Math.max(longestStreak, streak);
  });

  return longestStreak;
}

function getBronzeStreak(scoreContext = getScoreContext()) {
  const record = getProgressRecord(scoreContext);
  const bronzeDayList = getBronzeDays(record);
  const bronzeDays = new Set(bronzeDayList);
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
    highestStreak: getLongestStreakFromDays(bronzeDayList),
    completedToday: bronzeDays.has(today),
    lastBronzeDay: bronzeDayList.at(-1) || "",
  };
}

function setProgressStatus(status, message) {
  elements.progressStatus.dataset.status = status;
  elements.progressStatus.lastChild.textContent = message;
}

function getProgressMedalData(gameId) {
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
}

function renderProgressSkillMedals(topicId) {
  const progressYearLevel = getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent()
    ? state.boardYearLevel
    : getEffectiveChallengeYearLevel();
  const skillIds = getPlayableTopicSkillIds(topicId, progressYearLevel).filter((skillId) => (
    getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent()
      ? canYearAccessGame(progressYearLevel, skillId)
      : canAccessGame(skillId)
  ));
  if (!skillIds.length) {
    return `<p class="progress-skill-empty">No sub skills are unlocked for this topic yet.</p>`;
  }

  return skillIds.map((skillId) => {
    const { info, bestScore, bestMedal } = getProgressMedalData(skillId);
    return `
      <article class="progress-skill-medal-row ${bestMedal ? `medal-${bestMedal.id}` : ""}">
        <span class="mini-game-icon" aria-hidden="true">${escapeHtml(info.icon)}</span>
        <div>
          <strong>${escapeHtml(info.name)}</strong>
          <small>${escapeHtml(bestMedal ? `${bestMedal.label} reached` : "No medal yet")} • ${bestScore.toLocaleString()} best</small>
        </div>
        <a class="text-link" href="${getGameHash(skillId)}">Practise →</a>
      </article>
    `;
  }).join("");
}

function renderProgressPage() {
  const progressGameIds = getVisibleProgressGameIds();
  const topicIds = getVisibleTopicAreaIds();
  if (state.sharedConfigured && canReadSharedLeaderboards()) {
    listenToSharedBoards(getVisibleBoardGameIds(), { teacherFilterOverride: "all" });
  }

  const allRows = progressGameIds.map(getProgressMedalData);
  const topicRows = topicIds.map(getProgressMedalData);

  const bronzeCount = allRows.filter((row) => row.bestScore >= row.goals[0].score).length;
  const goldCount = allRows.filter((row) => row.bestScore >= row.goals[2].score).length;
  const thorneCount = allRows.filter((row) => row.bestScore >= row.goals[3].score).length;
  const streak = getBronzeStreak();

  elements.progressStreakCount.textContent = `${streak.streak} ${streak.streak === 1 ? "day" : "days"}`;
  elements.progressHighestStreakCount.textContent = `${streak.highestStreak} ${streak.highestStreak === 1 ? "day" : "days"}`;
  elements.progressStreakStatus.textContent = streak.completedToday
    ? "A Bronze or better is banked for today."
    : streak.streak
      ? "Get Bronze or better in any skill or topic today to keep this streak going."
      : "Get Bronze or better in any skill or topic today to start a streak.";
  elements.progressSummary.textContent = `${bronzeCount}/${progressGameIds.length} bronze, ${goldCount} gold, ${thorneCount} Mr Thorne targets reached.`;

  elements.progressGrid.innerHTML = topicRows.length
    ? topicRows.map(({ gameId, info, bestScore, goals, bestMedal }) => {
        const expanded = state.expandedProgressTopics.has(gameId);
        const progressYearLevel = getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent()
          ? state.boardYearLevel
          : getEffectiveChallengeYearLevel();
        return `
        <article class="progress-game-card ${bestMedal ? `medal-${bestMedal.id}` : ""}">
          <div class="progress-game-head">
            <span class="mini-game-icon" aria-hidden="true">${escapeHtml(info.icon)}</span>
            <div>
              <p>${escapeHtml(getGameDurationLabel(gameId, progressYearLevel))}</p>
              <h3>${escapeHtml(info.name)}</h3>
              <small>${escapeHtml(getTopicSkillSummary(gameId, progressYearLevel))}</small>
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
          <button class="progress-expand-button" type="button" data-progress-topic="${escapeHtml(gameId)}" aria-expanded="${expanded}">
            ${expanded ? "Hide skill medals" : "Show skill medals"}
          </button>
          <div class="progress-skill-medals" ${expanded ? "" : "hidden"}>
            ${renderProgressSkillMedals(gameId)}
          </div>
          <a class="home-full-link" href="${getGameHash(gameId)}">Play ${escapeHtml(info.shortName)}</a>
        </article>
      `;
      }).join("")
    : `<article class="progress-game-card"><p>No available games yet. Sign in and get your year level assigned to see your games.</p></article>`;

  if (!state.sharedConfigured) {
    setProgressStatus("local", "Firebase setup needed. Progress uses scores saved on this device.");
  } else if (!canReadSharedLeaderboards()) {
    setProgressStatus("local", getProgressAccessMessage());
  } else if (getVisibleBoardGameIds().some((gameId) => state.sharedScores[gameId] === null)) {
    setProgressStatus("connecting", "Loading your medal progress and Mr Thorne targets...");
  } else {
    setProgressStatus("shared", "Topic medals use leaderboard best scores. Skill medals use your saved practice bests inside each topic. Streaks count any Bronze-or-better skill or topic day.");
  }
}

function getCurrentPlayerGameRank(gameId) {
  if (!isTopicArea(gameId)) return 0;
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
  if (!isTopicArea(gameId)) {
    const bestScore = getCurrentPlayerBestScore(gameId);
    const medal = getBestMedalForScore(bestScore, getMedalGoalsForGame(gameId));
    return medal ? medal.label : "No medal";
  }

  return formatGameRank(getCurrentPlayerGameRank(gameId));
}

function getGameRankStatusMessage(gameId) {
  if (!isTopicArea(gameId)) {
    const topicId = getLeaderboardGameId(gameId);
    const topicName = gameInfo[topicId]?.name || "the topic area";
    const bestScore = getCurrentPlayerBestScore(gameId);
    const medal = getBestMedalForScore(bestScore, getMedalGoalsForGame(gameId));
    if (medal) {
      return `You have earned ${medal.label} for this skill. Play ${topicName} for the shared leaderboard.`;
    }
    return `This skill earns medals only. Play ${topicName} for the shared leaderboard.`;
  }

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

  return "Play this topic area to earn medals and a leaderboard place.";
}

function getMedalResultForScore(gameId, score) {
  const goals = getMedalGoalsForGame(gameId);
  return {
    goals,
    medal: getBestMedalForScore(score, goals),
    nextGoal: goals.find((goal) => score < goal.score) || null,
  };
}

function getResultMedalDetail(gameId, score, extraDetail = "") {
  const { goals, medal, nextGoal } = getMedalResultForScore(gameId, score);
  const gameName = gameInfo[gameId]?.name || "this game";
  let detail = "";

  if (medal) {
    detail = nextGoal
      ? `You earned ${medal.label} for ${gameName}. Next medal: ${nextGoal.label} at ${nextGoal.score.toLocaleString()} pts.`
      : `You earned ${medal.label} for ${gameName}. You have reached the top medal target.`;
  } else {
    const bronzeGoal = goals.find((goal) => goal.id === "bronze") || goals[0];
    detail = bronzeGoal
      ? `Reach ${bronzeGoal.score.toLocaleString()} pts to earn Bronze for ${gameName}.`
      : `Play ${gameName} again to earn a medal.`;
  }

  return extraDetail ? `${detail} ${extraDetail}` : detail;
}

function setResultMedalDisplay(score = state.score, gameId = state.game, { extraDetail = "", statusOverride = "" } = {}) {
  const { medal } = getMedalResultForScore(gameId, score);
  const medalText = medal?.label || "No medal yet";
  const status = statusOverride || medal?.id || "none";
  const detailText = getResultMedalDetail(gameId, score, extraDetail);

  elements.resultMedal.textContent = medalText;
  elements.resultGoalStatus.textContent = detailText;

  if (elements.resultMedalCallout) {
    elements.resultMedalCallout.dataset.status = status;
  }

  if (elements.resultMedalCalloutValue) {
    elements.resultMedalCalloutValue.textContent = medalText;
  }

  if (elements.resultMedalCalloutDetail) {
    elements.resultMedalCalloutDetail.textContent = detailText;
  }
}

function setLeaderboardStatus(status, message) {
  elements.leaderboardStatus.dataset.status = status;
  elements.leaderboardStatus.lastChild.textContent = message;
}

function setGameBoardStatus(status, message) {
  elements.gameBoardStatus.dataset.status = status;
  elements.gameBoardStatus.lastChild.textContent = message;
}

function setAdminStatus(status, message) {
  elements.adminStatus.dataset.status = status;
  elements.adminStatus.lastChild.textContent = message;
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

function cleanLeaderboardName(name) {
  return String(name || "").replace(/\s+/g, " ").trim();
}

function getTeacherNameCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(TEACHER_NAME_KEY));
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

function getTeacherNameCacheKeys(uid = state.authUid, email = state.authEmail) {
  return [
    uid ? `uid:${uid}` : "",
    cleanEmail(email) ? `email:${cleanEmail(email)}` : "",
  ].filter(Boolean);
}

function getCachedTeacherLeaderboardName(uid = state.authUid, email = state.authEmail) {
  const cache = getTeacherNameCache();
  const key = getTeacherNameCacheKeys(uid, email).find((cacheKey) => cleanLeaderboardName(cache[cacheKey]));
  return key ? cleanLeaderboardName(cache[key]) : "";
}

function cacheTeacherLeaderboardName(name, uid = state.authUid, email = state.authEmail) {
  const cleanName = cleanLeaderboardName(name);
  if (!cleanName) return;

  const cache = getTeacherNameCache();
  getTeacherNameCacheKeys(uid, email).forEach((key) => {
    cache[key] = cleanName;
  });
  try {
    localStorage.setItem(TEACHER_NAME_KEY, JSON.stringify(cache));
  } catch {
    // The live Firebase profile remains the source of truth if local storage is unavailable.
  }
}

function getGooglePlayerName() {
  const teacherName = getActiveAccountType() === "teacher"
    ? cleanLeaderboardName(state.teacherLeaderboardName)
    : "";
  return teacherName || state.authName || state.authEmail.split("@")[0] || "Student";
}

function validateLeaderboardName(name) {
  const cleanName = cleanLeaderboardName(name);
  if (!cleanName) return "Enter a leaderboard name.";
  if (cleanName.length > 80) return "Keep the leaderboard name to 80 characters or fewer.";
  return "";
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

function renderTeacherChallengeYearControl() {
  const showControl = state.sharedConfigured
    && state.authAllowed
    && getActiveAccountType() === "teacher"
    && !isTeacherTestingAsStudent()
    && isTopicArea(state.game);
  const playableYearLevels = showControl ? getTeacherPlayableChallengeYearLevels(state.game) : [];
  elements.teacherChallengeYearWrap.hidden = !showControl || !playableYearLevels.length;

  if (!showControl || !playableYearLevels.length) {
    return "";
  }

  const selectedYearLevel = syncTeacherChallengeYearLevel(state.game);
  const options = playableYearLevels.map(
    (yearLevel) => `<option value="${yearLevel}">${getYearLabel(yearLevel)}</option>`,
  ).join("");
  if (elements.teacherChallengeYearSelect.innerHTML !== options) {
    elements.teacherChallengeYearSelect.innerHTML = options;
  }
  elements.teacherChallengeYearSelect.value = selectedYearLevel;
  elements.teacherChallengeYearNote.textContent = `Questions and leaderboard score will use ${getYearLabel(selectedYearLevel)}.`;
  return selectedYearLevel;
}

function updateStartPanel() {
  elements.startGameButton.disabled = false;
  elements.startNote.textContent = "Your name and year level come from your signed-in account setup.";
  const teacherChallengeYearLevel = renderTeacherChallengeYearControl();

  if (!state.sharedConfigured) {
    elements.startPlayer.textContent = `Playing on the ${getYearLabel(state.boardYearLevel)} local leaderboard.`;
    elements.startGameButton.textContent = "Start game →";
    elements.startNote.textContent = "Local scores only save on this device until Firebase is connected.";
    return;
  }

  if (!state.authAllowed) {
    elements.startPlayer.textContent = "Sign in with your Google account to play and submit a score.";
    elements.startGameButton.textContent = "Sign in to play →";
    elements.startNote.textContent = "Use your school Google account to save progress and leaderboard scores.";
    return;
  }

  if (!state.accountType) {
    elements.startPlayer.textContent = "Sign in with your Google account before playing.";
    elements.startGameButton.textContent = "Open settings";
    elements.startNote.textContent = "Your school email decides whether you are a student or teacher.";
    return;
  }

  if (getActiveAccountType() === "teacher") {
    if (isTeacherTestingAsStudent()) {
      elements.startPlayer.textContent = `Playing as ${getTestStudentLabel()}. Test scores will not save.`;
      elements.startGameButton.textContent = "Start test game →";
      elements.startNote.textContent = "Test student attempts never appear on shared leaderboards.";
      return;
    }

    if (state.teacherYearLevels.length) {
      const playableYearLevels = getTeacherPlayableChallengeYearLevels(state.game);
      if (isTopicArea(state.game) && !playableYearLevels.length) {
        elements.startPlayer.textContent = `No saved teaching year has ${gameInfo[state.game].name} skills unlocked.`;
        elements.startGameButton.textContent = "Locked for now";
        elements.startGameButton.disabled = true;
        elements.startNote.textContent = "Choose a different topic or update your teaching years in settings.";
      } else {
        const yearLabel = teacherChallengeYearLevel ? ` for ${getYearLabel(teacherChallengeYearLevel)}` : "";
        elements.startPlayer.textContent = `Playing as ${getGooglePlayerName()}, teacher${yearLabel}.`;
        elements.startGameButton.textContent = "Start game →";
        elements.startNote.textContent = teacherChallengeYearLevel
          ? `${gameInfo[state.game].name} questions and leaderboard score will use ${getYearLabel(teacherChallengeYearLevel)}.`
          : "Teacher skill practice saves to your progress but not shared leaderboards.";
      }
    } else {
      elements.startPlayer.textContent = "Choose your teaching year levels before playing as a teacher.";
      elements.startGameButton.textContent = "Open settings";
      elements.startNote.textContent = "Your teacher profile controls which topic year levels you can play for.";
    }
    return;
  }

  if (state.studentYearLevel) {
    elements.startPlayer.textContent = `Playing as ${getGooglePlayerName()} in ${getYearLabel(state.studentYearLevel)}.`;
    elements.startGameButton.textContent = "Start game →";
    elements.startNote.textContent = "Your account year level controls your questions and leaderboard.";
    return;
  }

  elements.startPlayer.textContent = getAccountSetupMessage();
  elements.startGameButton.textContent = state.studentYearLevelRequest?.status === "new"
    ? "Waiting for assignment"
    : "Request year level";
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
  const visibleTopicIds = getVisibleTopicAreaIds();
  elements.gameGrid.innerHTML = visibleTopicIds.map((topicId) => {
    const info = gameInfo[topicId];
    const topicYearLevel = getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent()
      ? getTeacherChallengeYearLevel(topicId)
      : getEffectiveChallengeYearLevel();
    const locked = !canAccessGame(topicId);
    const buttonLabel = locked ? "Locked for now" : `Open ${info.shortName}`;
    const availableSkillIds = getPlayableTopicSkillIds(topicId, topicYearLevel).filter((skillId) => (
      getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent()
        ? canYearAccessGame(topicYearLevel, skillId)
        : canAccessGame(skillId)
    ));
    const skillLinks = availableSkillIds.map((skillId) => {
      const skill = gameInfo[skillId];
      return `
        <a class="topic-skill-link" href="${getGameHash(skillId)}" data-game="${escapeHtml(skillId)}">
          <span>${escapeHtml(skill.icon)}</span>
          ${escapeHtml(skill.shortName)}
        </a>
      `;
    }).join("");

    return `
      <article class="game-card ${info.cardClass} ${locked ? "game-card-locked" : ""}">
        <div class="game-icon" aria-hidden="true">${escapeHtml(info.icon)}</div>
        <h3>${escapeHtml(info.name)}</h3>
        <p>${escapeHtml(info.cardDescription)}</p>
        <div class="game-card-meta">
          <span>${escapeHtml(getGameDurationLabel(topicId, topicYearLevel))}</span>
          <span>${escapeHtml(getTopicSkillSummary(topicId, topicYearLevel))}</span>
        </div>
        <ul>
          ${info.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
        </ul>
        <div class="topic-skill-list" aria-label="${escapeHtml(info.name)} skills">
          ${skillLinks || `<span class="topic-skill-empty">No skills unlocked yet.</span>`}
        </div>
        <a class="play-button ${locked ? "disabled" : ""}" href="${locked ? "#games" : getGameHash(topicId)}" data-game="${escapeHtml(topicId)}" aria-disabled="${locked}">
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
    scoreLimit = 10,
    valueFormatter = (entry) => entry.score.toLocaleString(),
    metaFormatter = getScoreMeta,
  } = {},
) {
  if (!scores.length) {
    return `<li class="empty-scores">${escapeHtml(emptyMessage)}</li>`;
  }

  return scores
    .slice(0, scoreLimit)
    .map((entry, index) => {
      return `
        <li class="score-row ${scoreMatchesCurrentPlayer(entry) ? "current-player" : ""} ${entry.role === "teacher" ? "teacher-score" : ""}">
          <span class="score-rank">${index + 1}</span>
          <span class="list-avatar">${escapeHtml(initials(entry.name))}</span>
          <span class="score-name">
            ${escapeHtml(entry.name)}
            <small>${escapeHtml(metaFormatter(entry))}</small>
          </span>
          <span class="score-points">${escapeHtml(valueFormatter(entry))}</span>
        </li>
      `;
    })
    .join("");
}

function getHomeLeaderboardScores(view = state.homeLeaderboardView) {
  const topicId = isTopicArea(state.homeFeaturedGame)
    ? state.homeFeaturedGame
    : getVisibleBoardGameIds()[0];
  if (!topicId) return [];

  const matchingScores = normalizeScores(getRawScores(topicId)).filter((entry) => {
    if (view === "teachers") {
      return entry.role === "teacher"
        && entry.yearLevel === state.boardYearLevel
        && entry.teacherYearLevels.includes(state.boardYearLevel);
    }

    return entry.role === "student" && entry.yearLevel === state.boardYearLevel;
  });

  return dedupeLeaderboardScores(matchingScores)
    .sort((a, b) => b.score - a.score)
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
    elements.featuredGameHeading.textContent = "No topic areas available yet";
    elements.featuredGameDescription.textContent = "Sign in and get your year level assigned to see your available topic areas.";
    elements.featuredGameIcon.textContent = "?";
    elements.featuredGameMeta.innerHTML = "";
    elements.featuredGameBullets.innerHTML = "";
    elements.featuredGamePlay.href = "#home";
    elements.featuredGamePlay.textContent = "Choose a topic";
    elements.featuredGamePlay.classList.add("disabled");
    elements.featuredGamePlay.setAttribute("aria-disabled", "true");
    elements.featuredGameLeaderboard.href = "#leaderboards";
    elements.featuredGameGoal.textContent = "No rank";
    elements.featuredGameGoalLabel.textContent = "Pick a topic area to see your rank.";
    return;
  }

  const gameId = state.homeFeaturedGame;
  const info = gameInfo[gameId];
  const featuredYearLevel = getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent()
    ? getTeacherChallengeYearLevel(gameId)
    : getEffectiveChallengeYearLevel();
  const locked = !canAccessGame(gameId);
  const playLabel = locked ? "Locked for now" : `Play ${info.name}`;

  elements.featuredGameIcon.textContent = info.icon;
  elements.featuredGameHeading.textContent = info.name;
  elements.featuredGameDescription.textContent = info.description;
  elements.featuredGameMeta.innerHTML = `
    <span>${escapeHtml(getGameDurationLabel(gameId, featuredYearLevel))}</span>
    <span>${escapeHtml(getTopicSkillSummary(gameId, featuredYearLevel))}</span>
  `;
  elements.featuredGameBullets.innerHTML = info.bullets
    .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
    .join("");
  elements.featuredGamePlay.href = locked ? "#home" : getGameHash(gameId);
  elements.featuredGamePlay.textContent = playLabel;
  elements.featuredGamePlay.classList.toggle("disabled", locked);
  elements.featuredGamePlay.setAttribute("aria-disabled", String(locked));
  elements.featuredGameLeaderboard.href = getLeaderboardHash(gameId);
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
    elements.homeLeaderboardStatus.textContent = "Sign in and get your year level assigned to see your year-level leaderboard.";
    return;
  }

  const scores = getHomeLeaderboardScores();
  const topicName = gameInfo[state.homeFeaturedGame]?.name || "selected topic";
  const emptyMessage = state.homeLeaderboardView === "teachers"
    ? `No teacher scores yet for ${topicName}.`
    : `No ${getYearLabel(state.boardYearLevel)} student scores yet for ${topicName}.`;

  elements.homeLeaderboardList.innerHTML = scores.length
    ? scores.map((entry, index) => `
        <li class="home-leaderboard-row ${entry.role === "teacher" ? "teacher-score" : ""}">
          <span class="home-rank">${index + 1}</span>
          <span class="list-avatar">${escapeHtml(initials(entry.name))}</span>
          <span>
            <strong>${escapeHtml(entry.name)}</strong>
            <small>${escapeHtml(getScoreMeta(entry))}</small>
          </span>
          <b>${entry.score.toLocaleString()}</b>
        </li>
      `).join("")
    : `<li class="home-empty-row">${escapeHtml(emptyMessage)}</li>`;

  elements.homeLeaderboardStatus.textContent = state.homeLeaderboardView === "teachers"
    ? `Showing ${getYearLabel(state.boardYearLevel)} teachers for ${topicName}.`
    : `Showing top ${getYearLabel(state.boardYearLevel)} students for ${topicName}.`;

  if (!state.sharedConfigured) {
    elements.homeLeaderboardStatus.textContent += " Local scores are shown until Firebase is connected.";
  } else if (state.sharedScores[state.homeFeaturedGame] === null) {
    elements.homeLeaderboardStatus.textContent += " Shared scores are still loading.";
  }
}

function renderHomeProgress() {
  const visibleGameIds = getVisibleProgressGameIds();
  const bestScores = visibleGameIds
    .map(getCurrentPlayerBestScore)
    .filter((score) => score > 0);
  const bestScore = bestScores.length ? Math.max(...bestScores) : 0;
  const gamesPlayed = bestScores.length;

  elements.homeGamesPlayed.textContent = String(gamesPlayed);
  elements.homeBestScore.textContent = bestScore.toLocaleString();
  elements.homeCurrentGoal.textContent = getGameRankLabel(state.homeFeaturedGame || "topic-speed-operations");
  elements.heroSkillCount.textContent = String(SKILL_IDS.length);
  elements.homeSkillCount.textContent = String(SKILL_IDS.length);
}

function renderHomeAuthCard() {
  if (state.authAllowed) {
    const roleLabel = getActiveAccountType() === "teacher"
      ? `Teacher • ${getTeacherYearLabel()}`
      : state.studentYearLevel
        ? `Student • ${getYearLabel(state.studentYearLevel)}`
        : state.studentYearLevelRequest?.status === "new"
          ? "Student • year request sent"
          : "Student • year level needed";
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
  const info = gameInfo[state.game] || gameInfo["topic-speed-operations"];
  const topicId = getLeaderboardGameId(state.game);
  const hasTopicLeaderboard = isTopicArea(state.game);
  if (getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent() && hasTopicLeaderboard) {
    syncTeacherChallengeYearLevel(state.game);
  }
  const challengeYearLevel = getEffectiveChallengeYearLevel();
  const penNote = getPenAndPaperNote(state.game, challengeYearLevel);

  elements.gamePageSection.className = `game-page-section app-dashboard-page ${info.cardClass}`;
  elements.gamePageIcon.textContent = info.icon;
  elements.gamePageTitle.textContent = info.name;
  elements.gamePageDescription.textContent = info.description;
  elements.gamePageBullets.innerHTML = info.bullets
    .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
    .join("");
  elements.gamePageDuration.textContent = getGameDurationLabel(state.game, challengeYearLevel);
  elements.gamePageGoal.textContent = getGameRankLabel(state.game);
  elements.gamePagePrep.hidden = !penNote;
  elements.gamePagePrep.textContent = penNote;
  elements.gameGoalStatus.textContent = getGameRankStatusMessage(state.game);
  elements.gamePageStart.disabled = !canAccessGame(state.game);
  elements.gamePageStart.textContent = canAccessGame(state.game) ? "Start challenge →" : "Locked for now";
  elements.gamePageLeaderboard.hidden = !hasTopicLeaderboard;
  elements.gamePageLeaderboardTitle.textContent = `${info.name} leaderboard`;
  elements.resultLeaderboardLink.href = getLeaderboardHash(state.game);
  elements.resultLeaderboardLink.textContent = hasTopicLeaderboard
    ? "See leaderboard"
    : `See ${gameInfo[topicId]?.shortName || "topic"} leaderboard`;
  renderTopicPageSkills();
  renderGameLeaderboard();
}

function renderTopicPageSkills() {
  const isTopicPage = isTopicArea(state.game);
  elements.topicPageSkills.hidden = !isTopicPage;
  if (!isTopicPage) {
    elements.topicPageSkillGrid.innerHTML = "";
    return;
  }

  const topicYearLevel = getEffectiveChallengeYearLevel();
  const availableSkillIds = getPlayableTopicSkillIds(state.game, topicYearLevel).filter((skillId) => (
    getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent()
      ? canYearAccessGame(topicYearLevel, skillId)
      : canAccessGame(skillId)
  ));
  const yearLabel = getYearLabel(topicYearLevel);
  elements.topicPageSkillsTitle.textContent = `${gameInfo[state.game].name} sub skills`;
  elements.topicPageSkillsSummary.textContent = availableSkillIds.length
    ? `${availableSkillIds.length} ${availableSkillIds.length === 1 ? "skill is" : "skills are"} available for ${yearLabel}. Practise one exact question type, then play the topic area game for the shared leaderboard.`
    : `No sub skills are unlocked for ${yearLabel} yet.`;

  elements.topicPageSkillGrid.innerHTML = availableSkillIds.length
    ? availableSkillIds.map((skillId) => {
        const skill = gameInfo[skillId];
        const bestScore = getCurrentPlayerBestScore(skillId);
        const medal = getBestMedalForScore(bestScore, getMedalGoalsForGame(skillId));
        return `
          <article class="topic-page-skill-card ${skill.cardClass}">
            <div class="mini-game-icon" aria-hidden="true">${escapeHtml(skill.icon)}</div>
            <div>
              <p>${escapeHtml(getYearLabel(skill.accessYear))} skill</p>
              <h3>${escapeHtml(skill.name)}</h3>
              <span>${escapeHtml(skill.cardDescription)}</span>
            </div>
            <div class="topic-page-skill-meta">
              <small>${escapeHtml(medal ? medal.label : "No medal yet")}</small>
              <small>${bestScore ? `${bestScore.toLocaleString()} best` : "No score yet"}</small>
            </div>
            <a class="text-link" href="${getGameHash(skillId)}" data-game="${escapeHtml(skillId)}">Practise skill →</a>
          </article>
        `;
      }).join("")
    : `<article class="topic-page-skill-card"><p>No skills unlocked yet.</p></article>`;
}

function renderGameLeaderboard() {
  if (!isTopicArea(state.game)) {
    elements.gameBoardList.innerHTML = "";
    setGameBoardStatus("local", "Individual skills do not have shared leaderboards. Play the topic area game to join the leaderboard.");
    return;
  }

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
}) {
  const info = gameInfo[gameId] || {};
  const meta = `${getGameDurationLabel(gameId, state.boardYearLevel)} • ${getTopicSkillSummary(gameId, state.boardYearLevel)}`;

  return `
    <article class="leaderboard-grid-card">
      <div class="leaderboard-grid-card-head">
        <div>
          <p>${escapeHtml(meta)}</p>
          <h3>${escapeHtml(title)}</h3>
        </div>
        <span class="mini-game-icon" aria-hidden="true">${escapeHtml(info.icon)}</span>
      </div>
      <p class="leaderboard-grid-description">${escapeHtml(description)}</p>
      <ol class="compact-score-list">
        ${renderScoreRows(
          scores,
          `No ${getYearLabel(state.boardYearLevel)} scores yet.`,
          { scoreLimit: 10 },
        )}
      </ol>
    </article>
  `;
}

function formatDayCount(count) {
  return `${count.toLocaleString()} ${count === 1 ? "day" : "days"}`;
}

function getTopicCountMeta(entry) {
  const topicLabel = `${entry.games} ${entry.games === 1 ? "topic" : "topics"}`;
  return `${getScoreMeta(entry)} • ${topicLabel}`;
}

function renderSummaryLeaderboardCard({
  title,
  description,
  meta,
  icon,
  scores,
  className = "",
  emptyMessage,
  valueFormatter,
}) {
  return `
    <article class="leaderboard-grid-card summary-leaderboard-card ${className}">
      <div class="leaderboard-grid-card-head">
        <div>
          <p>${escapeHtml(meta)}</p>
          <h3>${escapeHtml(title)}</h3>
        </div>
        <span class="mini-game-icon" aria-hidden="true">${escapeHtml(icon)}</span>
      </div>
      <p class="leaderboard-grid-description">${escapeHtml(description)}</p>
      <ol class="compact-score-list">
        ${renderScoreRows(scores, emptyMessage, {
          scoreLimit: 10,
          valueFormatter,
          metaFormatter: getTopicCountMeta,
        })}
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

  const combinedScores = getCombinedTopicScores(gameIds);
  const streakScores = getTopicBronzeStreakScores(gameIds);
  const summaryCards = [
    renderSummaryLeaderboardCard({
      title: "Combined Topic Scores",
      description: "Adds each player's best score from every available topic area.",
      meta: `${gameIds.length} ${gameIds.length === 1 ? "topic" : "topics"} combined`,
      icon: "Σ",
      scores: combinedScores,
      className: "combined-leaderboard-card",
      emptyMessage: `No ${getYearLabel(state.boardYearLevel)} combined scores yet.`,
      valueFormatter: (entry) => `${entry.score.toLocaleString()} pts`,
    }),
    renderSummaryLeaderboardCard({
      title: "Streak",
      description: "Longest streak of days earning at least Bronze in any skill or topic.",
      meta: "Bronze-or-better days",
      icon: "↯",
      scores: streakScores,
      className: "topic-streak-leaderboard-card",
      emptyMessage: `No ${getYearLabel(state.boardYearLevel)} streaks yet.`,
      valueFormatter: (entry) => formatDayCount(entry.score),
    }),
  ].join("");
  const gameCards = gameIds.map((gameId) => renderLeaderboardGridCard({
    gameId,
    title: gameInfo[gameId].name,
    description: gameInfo[gameId].cardDescription,
    scores: getVisibleScores(gameId, { scoreLimit: 10 }),
  })).join("");

  elements.leaderboardsGrid.innerHTML = summaryCards + gameCards;

  if (!state.sharedConfigured) {
    setLeaderboardStatus("local", "Firebase setup needed. Until then, the grid uses scores saved on this device.");
  } else {
    setLeaderboardStatus(
      "shared",
      `Showing ${getYearLabel(state.boardYearLevel)} combined, streak, and topic-area leaderboards.`,
    );
  }
}

function stopAdminRequestListener() {
  if (state.adminRequestsUnsubscribe) {
    state.adminRequestsUnsubscribe();
    state.adminRequestsUnsubscribe = null;
  }
}

function listenToAdminRequests() {
  if (!state.sharedConfigured || !canManageStudentRequests()) {
    stopAdminRequestListener();
    return;
  }

  if (state.adminRequestsUnsubscribe) return;
  state.adminRequestsUnsubscribe = window.sharedLeaderboard.listenToYearLevelRequests(
    (requests) => {
      state.adminRequests = Array.isArray(requests) ? requests : [];
      if (state.page === "admin") renderAdminPage();
    },
    (error) => {
      console.warn("Could not load student requests.", error);
      state.adminRequests = [];
      if (state.page === "admin") {
        renderAdminPage();
        setAdminStatus("local", "Could not load requests. Check Firestore rules and your admin sign-in.");
      }
    },
  );
}

function renderAdminPage() {
  renderAdminNavigation();

  if (!canManageStudentRequests()) {
    stopAdminRequestListener();
    elements.adminRequestCount.textContent = "0";
    elements.adminAssignedCount.textContent = "0";
    elements.adminRequestList.innerHTML = `
      <p class="admin-empty-card">This page is only available to ${escapeHtml(STUDENT_REQUEST_ADMIN_EMAIL)}.</p>
    `;
    setAdminStatus("local", "Sign in with the admin teacher account to manage student year level requests.");
    return;
  }

  listenToAdminRequests();
  const requests = [...state.adminRequests].sort((left, right) => {
    const leftAssigned = left.status === "assigned" ? 1 : 0;
    const rightAssigned = right.status === "assigned" ? 1 : 0;
    if (leftAssigned !== rightAssigned) return leftAssigned - rightAssigned;
    return getFirestoreTimestampMillis(right.updatedAt) - getFirestoreTimestampMillis(left.updatedAt);
  });
  const pendingRequests = requests.filter((request) => request.status !== "assigned");
  const assignedRequests = requests.filter((request) => request.status === "assigned");

  elements.adminRequestCount.textContent = String(pendingRequests.length);
  elements.adminAssignedCount.textContent = String(assignedRequests.length);
  elements.adminRequestList.innerHTML = requests.length
    ? requests.map((request) => {
        const assigned = request.status === "assigned";
        const selectedYear = cleanYearLevel(request.assignedYearLevel);
        return `
          <article class="admin-request-row ${assigned ? "assigned" : ""}" data-request-id="${escapeHtml(request.id)}" data-request-email="${escapeHtml(request.email || "")}">
            <div class="admin-request-person">
              <strong>${escapeHtml(request.name || "Student")}</strong>
              <span>${escapeHtml(request.email || "No email")}</span>
              <small>${escapeHtml(assigned ? `Assigned to ${getYearLabel(selectedYear)}` : "Waiting for a year level")}</small>
            </div>
            <label class="select-field">
              <span>Year level</span>
              <select data-admin-year ${assigned ? "disabled" : ""}>
                <option value="">Choose</option>
                ${createYearOptions().replace(`value="${selectedYear}"`, `value="${selectedYear}" selected`)}
              </select>
            </label>
            <button class="button button-primary button-compact" type="button" data-admin-assign ${assigned ? "disabled" : ""}>
              ${assigned ? "Assigned" : "Assign"}
            </button>
          </article>
        `;
      }).join("")
    : `<p class="admin-empty-card">No student year level requests yet.</p>`;

  if (!state.sharedConfigured) {
    setAdminStatus("local", "Firebase setup needed before requests can sync.");
  } else if (!state.adminRequestsUnsubscribe) {
    setAdminStatus("connecting", "Loading student requests...");
  } else {
    setAdminStatus("shared", "Student requests update live from Firestore.");
  }
}

async function assignStudentRequest(row) {
  if (!row || !canManageStudentRequests()) return;
  const requestId = row.dataset.requestId || "";
  const email = row.dataset.requestEmail || "";
  const yearLevel = cleanYearLevel(row.querySelector("[data-admin-year]")?.value);
  if (!requestId || !email || !yearLevel) {
    setAdminStatus("local", "Choose a year level before assigning this request.");
    return;
  }

  const button = row.querySelector("[data-admin-assign]");
  if (button) {
    button.disabled = true;
    button.textContent = "Assigning...";
  }

  try {
    await window.sharedLeaderboard.assignStudentYearLevel(email, yearLevel, requestId);
    setAdminStatus("shared", `${email} assigned to ${getYearLabel(yearLevel)}.`);
  } catch (error) {
    console.error(error);
    setAdminStatus("local", getFirebaseMessage(error, "Could not assign this student."));
    if (button) {
      button.disabled = false;
      button.textContent = "Assign";
    }
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
  elements.studentYearSelectWrap.hidden = !state.studentYearLevel;
  elements.studentYearSave.hidden = true;
  elements.studentRequestButton.hidden = accountType !== "student" || Boolean(state.studentYearLevel);
  elements.studentRequestButton.disabled = state.requestingYearLevel || state.studentYearLevelRequest?.status === "new";
  elements.studentRequestButton.textContent = state.requestingYearLevel
    ? "Sending request..."
    : state.studentYearLevelRequest?.status === "new"
      ? "Request sent"
      : "Request year level";
  elements.accountTitle.textContent = needsSetup ? "Finish account setup" : "Settings";

  if (!accountType) {
    elements.accountRoleNote.textContent = "Checking your Google account...";
    elements.accountMessage.textContent = "Teacher accounts use @baysidecc.vic.edu.au. Student year levels come from the imported student directory.";
    elements.teacherYearPanel.hidden = true;
  } else if (accountType === "teacher") {
    elements.accountRoleNote.textContent = "@baysidecc.vic.edu.au accounts are teacher accounts.";
    elements.accountMessage.textContent = "Choose the name shown on leaderboards and pick the year levels you teach.";
    elements.teacherBadge.textContent = "Teacher";
    elements.teacherStatus.textContent = state.teacherYearLevels.length
      ? `Teaching years saved: ${getTeacherYearLabel()}.`
      : "Choose the year level(s) you teach before playing.";
    elements.teacherYearPanel.hidden = false;
    if (document.activeElement !== elements.teacherNameInput) {
      elements.teacherNameInput.value = getGooglePlayerName();
    }
  } else {
    elements.accountRoleNote.textContent = state.studentYearLevel
      ? `Student account locked to ${getYearLabel(state.studentYearLevel)}.`
      : `${getStudentRequestStatusLabel()}: year level needed.`;
    elements.accountMessage.textContent = "Student year levels are assigned from the uploaded student email list.";
    elements.studentDirectoryBadge.textContent = state.studentYearLevel ? "Assigned" : "Needed";
    elements.studentDirectoryStatus.textContent = state.studentYearLevel
      ? `${getGooglePlayerName()} is assigned to ${getYearLabel(state.studentYearLevel)}.`
      : state.studentYearLevelRequest?.status === "new"
        ? "Your request has been sent to Mr Thorne. You will be able to play once it is assigned."
        : "Your email is not in the student list yet. Send a request so Mr Thorne can assign your year level.";
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
          : state.studentYearLevelRequest?.status === "new"
            ? "Year request sent"
            : "Year level needed";
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
    return "Your year level needs to be assigned before submitting a score.";
  }

  if (code.includes("profile/year-level-locked")) {
    return "Your year level is locked by the student directory.";
  }

  if (code.includes("profile/game-locked")) {
    return "This challenge is locked for your year level. Higher year levels can play lower challenges.";
  }

  if (code.includes("profile/student-domain-required")) {
    return "Use a student Google account for student leaderboards.";
  }

  if (code.includes("profile/account-type-needed")) {
    return "Use a Google account before submitting a score.";
  }

  if (code.includes("admin/required")) {
    return "Only the site admin can manage student year level requests.";
  }

  if (code.includes("teacher/domain-required")) {
    return "Use an @baysidecc.vic.edu.au account for teacher leaderboards.";
  }

  if (code.includes("teacher/year-levels-needed")) {
    return "Choose at least one teaching year level before playing as a teacher.";
  }

  if (code.includes("teacher/year-level-locked")) {
    return "Choose one of your saved teaching year levels before playing this topic.";
  }

  if (code.includes("teacher/name-needed")) {
    return "Enter the teacher name you want shown on leaderboards.";
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
  if (getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent() && state.teacherYearLevels.includes(cleanLevel)) {
    state.teacherChallengeYearLevel = cleanLevel;
  }
  elements.boardYearSelect.value = cleanLevel;
  elements.gameBoardYearSelect.value = cleanLevel;
  renderBoardTabs();
  if (state.page === "game") {
    renderGamePage();
    if (isTopicArea(state.game)) listenToSharedBoard(state.game);
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
  updateResultMedal();
}

function renderAdminNavigation() {
  document.querySelectorAll("[data-admin-nav]").forEach((link) => {
    link.hidden = !canManageStudentRequests();
    link.classList.toggle("active", state.page === "admin");
  });
}

function shouldRequestStudentYearLevel() {
  return state.sharedConfigured
    && state.authAllowed
    && getActiveAccountType() === "student"
    && state.studentDirectoryStatus === "missing"
    && !state.studentYearLevel
    && !state.studentYearLevelRequest
    && !state.requestingYearLevel;
}

async function requestStudentYearLevel({ silent = false } = {}) {
  if (!state.sharedConfigured || !state.authAllowed || state.requestingYearLevel) return;
  if (!window.sharedLeaderboard?.requestYearLevelAssignment) return;

  try {
    state.requestingYearLevel = true;
    renderAuthControls();
    if (!silent) setProfileStatus("Sending year level request...");
    const authState = await window.sharedLeaderboard.requestYearLevelAssignment();
    applyAuthState(authState);
    setProfileStatus("Year level request sent. Mr Thorne can assign it from the Requests tab.");
  } catch (error) {
    console.error(error);
    setProfileStatus(getFirebaseMessage(error, "Could not send year level request."));
  } finally {
    state.requestingYearLevel = false;
    renderAuthControls();
  }
}

function maybeRequestStudentYearLevel() {
  if (shouldRequestStudentYearLevel()) {
    requestStudentYearLevel({ silent: true });
  }
}

function applyAuthState(authState) {
  const oldAuthUid = state.authUid;
  const oldAuthAllowed = state.authAllowed;
  const oldAccountType = state.accountType;
  const oldAuthName = state.authName;
  const oldTeacherLeaderboardName = state.teacherLeaderboardName;
  const oldStudentYearLevel = state.studentYearLevel;
  const oldTeacherYears = state.teacherYearLevels.join(",");
  const incomingAccountType = cleanAccountType(authState?.accountType);
  const incomingName = cleanLeaderboardName(authState?.name);
  const incomingTeacherName = cleanLeaderboardName(authState?.teacherLeaderboardName);

  state.authUid = authState?.uid || "";
  state.authEmail = authState?.email || "";
  state.authAllowed = Boolean(authState?.allowed);
  state.isAdmin = Boolean(authState?.isAdmin);
  state.allowedEmailDomain = authState?.allowedEmailDomain || state.allowedEmailDomain;
  state.allowedEmailDomains = authState?.allowedEmailDomains || state.allowedEmailDomains;
  state.accountType = incomingAccountType;
  state.teacherLeaderboardName = "";
  if (state.accountType === "teacher") {
    state.teacherLeaderboardName = incomingTeacherName || getCachedTeacherLeaderboardName(state.authUid, state.authEmail);
    state.authName = state.teacherLeaderboardName || incomingName;
    if (incomingTeacherName) {
      cacheTeacherLeaderboardName(incomingTeacherName, state.authUid, state.authEmail);
    }
  } else {
    state.authName = incomingName;
  }
  state.studentYearLevel = cleanYearLevel(authState?.studentYearLevel);
  state.studentYearLevelLocked = Boolean(authState?.studentYearLevelLocked);
  state.studentDirectoryStatus = authState?.studentDirectoryStatus || "";
  state.studentYearLevelRequest = authState?.studentYearLevelRequest || null;
  state.teacherYearLevels = Array.isArray(authState?.teacherYearLevels)
    ? authState.teacherYearLevels.map(cleanYearLevel).filter(Boolean)
    : [];
  if (state.accountType === "teacher" && state.teacherYearLevels.length) {
    syncTeacherChallengeYearLevel(state.game);
  } else {
    state.teacherChallengeYearLevel = DEFAULT_YEAR_LEVEL;
  }
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
    if (
      getActiveAccountType() === "teacher"
      && (
        oldAuthName !== state.authName
        || oldTeacherLeaderboardName !== state.teacherLeaderboardName
        || oldTeacherYears !== state.teacherYearLevels.join(",")
      )
    ) {
      updateLocalTeacherScoreMetadata(getGooglePlayerName(), state.teacherYearLevels);
    }
  } else {
    state.settingsOpen = false;
    state.settingsUserOpen = false;
    state.studentDirectoryStatus = "";
    state.studentYearLevelRequest = null;
    state.isAdmin = false;
  }

  if (!canManageStudentRequests()) {
    stopAdminRequestListener();
    state.adminRequests = [];
  }

  renderAdminNavigation();
  renderAuthControls();
  renderCurrentDataViews();
  maybeRequestStudentYearLevel();

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

function updateResultMedal() {
  if (elements.resultPanel.hidden) return;
  setResultMedalDisplay();
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
      state.sharedScores[game] = applyCurrentTeacherScoreName(scores);
      if (state.page === "home") renderHomeDashboard();
      if (state.game === game) renderGameLeaderboard();
      if (state.page === "progress") renderProgressPage();
      if (state.page === "leaderboards") renderAllLeaderboards();
      updateResultMedal();
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
  renderAdminNavigation();
  renderBoardTabs();
  if (isTopicArea(state.board)) listenToSharedBoard(state.board);
}

async function syncSharedBronzeStreak(gameId, scoreContext, bronzeStreak) {
  if (!state.sharedConfigured || !state.authAllowed || !hasPlayableProfile()) return false;
  if (!shouldSaveScore(scoreContext)) return false;
  if (typeof window.sharedLeaderboard?.updateBronzeStreak !== "function") return false;

  const leaderboardGame = getLeaderboardGameId(gameId);
  if (!isTopicArea(leaderboardGame) || !bronzeStreak?.highestStreak) return false;

  try {
    await window.sharedLeaderboard.updateBronzeStreak(leaderboardGame, {
      ...scoreContext,
      bestTopicBronzeStreak: bronzeStreak.highestStreak,
    });
    return true;
  } catch (error) {
    console.warn("Could not sync Bronze streak.", error);
    return false;
  }
}

async function saveSharedScore() {
  if (!state.sharedConfigured || state.savingSharedScore) return;
  const currentScoreContext = getScoreContext();
  const currentBronzeStreak = getBronzeStreak(currentScoreContext);

  if (!isTopicArea(state.game)) {
    state.pendingSharedScore = null;
    const streakSynced = scoreReachesBronze(state.game, state.score)
      && await syncSharedBronzeStreak(state.game, currentScoreContext, currentBronzeStreak);
    setLeaderboardStatus(
      "local",
      streakSynced
        ? "Skill score saved for medals. Your Streak was synced to the shared leaderboard."
        : "Skill score saved for medals. Play the topic-area game to join the shared leaderboard.",
    );
    return;
  }

  if (!shouldSaveScore(currentScoreContext)) {
    state.pendingSharedScore = null;
    return;
  }

  if (!state.authAllowed) {
    state.pendingSharedScore = {
      game: state.game,
      score: state.score,
      bestStreak: state.bestStreak,
      bestTopicBronzeStreak: currentBronzeStreak.highestStreak,
      context: currentScoreContext,
    };
    setResultMedalDisplay(
      state.score,
      state.game,
      {
        extraDetail: "Sign in with your Google account to save this score.",
        statusOverride: "blocked",
      },
    );
    renderAuthControls();
    setLeaderboardStatus(
      "local",
      "Sign in with your Google account to add this score to the shared leaderboard.",
    );
    return;
  }

  if (!hasPlayableProfile()) {
    state.pendingSharedScore = {
      game: state.game,
      score: state.score,
      bestStreak: state.bestStreak,
      bestTopicBronzeStreak: currentBronzeStreak.highestStreak,
      context: currentScoreContext,
    };
    setResultMedalDisplay(
      state.score,
      state.game,
      {
        extraDetail: getAccountSetupMessage(),
        statusOverride: "blocked",
      },
    );
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
          bestTopicBronzeStreak: state.pendingSharedScore.bestTopicBronzeStreak || 0,
        },
      }
    : {
        game: state.game,
        score: state.score,
        context: {
          ...currentScoreContext,
          bestStreak: state.bestStreak,
          bestTopicBronzeStreak: currentBronzeStreak.highestStreak,
        },
      };

  try {
    state.savingSharedScore = true;
    const savedScore = await window.sharedLeaderboard.addScore(
      scoreToSave.game,
      scoreToSave.score,
      scoreToSave.context,
    );
    state.pendingSharedScore = null;

    if (savedScore.role === "teacher") {
      setBoardYearLevel(savedScore.yearLevel || currentScoreContext.yearLevel);
    }

    if (savedScore.role === "teacher" && state.teacherFilter === "none") {
      state.teacherFilter = "year";
      renderTeacherFilterControls();
      renderLeaderboard();
    }

    renderAuthControls();
    renderCurrentDataViews();
    updateResultMedal();

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

  setLeaderboardStatus("connecting", "Waiting for Google sign-in...");

  try {
    applyAuthState(await window.sharedLeaderboard.signIn());
    return state.authAllowed;
  } catch (error) {
    console.error(error);
    setLeaderboardStatus(
      "local",
      getFirebaseMessage(error, "Sign in with your Google account to submit scores."),
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

  requestStudentYearLevel();
}

async function saveTeacherYears() {
  const teacherName = cleanLeaderboardName(elements.teacherNameInput.value);
  const nameError = validateLeaderboardName(teacherName);
  const yearLevels = [...elements.teacherYearOptions.querySelectorAll("input:checked")]
    .map((checkbox) => checkbox.value);

  if (nameError) {
    setProfileStatus(nameError);
    return;
  }

  if (!yearLevels.length) {
    setProfileStatus("Choose at least one teaching year level.");
    return;
  }

  try {
    setProfileStatus("Saving teacher details...");
    const authState = await window.sharedLeaderboard.saveTeacherYearLevels(yearLevels, teacherName);
    cacheTeacherLeaderboardName(teacherName, authState?.uid, authState?.email);
    applyAuthState(authState);
    updateLocalTeacherScoreMetadata(getGooglePlayerName(), state.teacherYearLevels);
    renderCurrentDataViews();
    setLeaderboardStatus(
      "shared",
      `${getGooglePlayerName()} will now show on teacher leaderboards for ${getTeacherYearLabel()}.`,
    );
    setSettingsOpen(false, { userAction: true });
  } catch (error) {
    console.error(error);
    setProfileStatus(getFirebaseMessage(error, "Could not save teacher details."));
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

function updateSelectedGameStartCopy() {
  const info = gameInfo[state.game];
  if (!info) return;

  const challengeYearLevel = getEffectiveChallengeYearLevel();
  const penNote = getPenAndPaperNote(state.game, challengeYearLevel);
  elements.startTitle.textContent = info.name;
  elements.startDescription.textContent = [
    info.description,
    `Time limit: ${getGameDurationLabel(state.game, challengeYearLevel)}.`,
    penNote,
  ].filter(Boolean).join(" ");
  elements.playMode.textContent = info.name;
}

function selectGame(mode) {
  if (!gameInfo[mode]) return;

  if (!canAccessGame(mode)) {
    setLeaderboardStatus("local", getGameAccessMessage(mode));
    renderGameCards();
    return;
  }

  state.game = mode;
  state.board = getLeaderboardGameId(mode);
  if (getActiveAccountType() === "teacher" && !isTeacherTestingAsStudent() && isTopicArea(mode)) {
    syncTeacherChallengeYearLevel(mode);
  }
  updateSelectedGameStartCopy();
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
    currentQuestionSkillId: "",
    topicSkillScores: {},
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
  setFractionAnswerMode(null);
  setChoiceAnswerMode(null);
  clearFractionAnswerFields();
}

function nextQuestion() {
  if (!state.running) return;

  const question = createQuestion(state.game);
  state.answer = question.answer;
  state.currentQuestionSkillId = isTopicArea(state.game) ? question.skillId || "" : "";
  state.questionNumber += 1;
  state.acceptingAnswer = true;
  const surdMode = isSurdAnswer(state.answer);
  const fractionMode = isFractionAnswer(state.answer);
  const choiceMode = isChoiceAnswer(state.answer);
  setSurdAnswerMode(surdMode);
  setFractionAnswerMode(state.answer);
  setChoiceAnswerMode(state.answer);
  elements.standardAnswerField.hidden = surdMode || fractionMode || choiceMode;
  elements.answerInput.disabled = surdMode || fractionMode || choiceMode;
  elements.answerInput.required = !surdMode && !fractionMode && !choiceMode;
  elements.answerInput.placeholder = fractionMode
    ? state.answer.requireMixed
      ? "e.g. 3 2/5"
      : "e.g. 3/4"
    : "?";
  elements.answerInput.inputMode = fractionMode ? "text" : "decimal";
  elements.question.classList.toggle("surd-question", surdMode);
  elements.question.classList.toggle("fraction-question", hasMathFraction(question.text));
  elements.question.classList.toggle("choice-question", choiceMode);
  elements.question.innerHTML = renderMathText(question.text);
  elements.questionCount.textContent = question.skillId && isTopicArea(state.game)
    ? `Question ${state.questionNumber} · ${gameInfo[question.skillId]?.name || "Topic skill"}`
    : `Question ${state.questionNumber}`;
  elements.answerInput.value = "";
  elements.surdCoefficientInput.value = "";
  elements.surdRadicandInput.value = "";
  clearFractionAnswerFields();
  const focusTarget = surdMode
    ? elements.surdCoefficientInput
    : fractionMode
      ? usesMixedFractionInput(state.answer)
        ? elements.mixedWholeInput
        : elements.fractionNumeratorInput
    : choiceMode
      ? null
      : elements.answerInput;
  focusTarget?.focus();
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
  } else if (scoreContext.role === "teacher") {
    setBoardYearLevel(scoreContext.yearLevel);
    state.teacherFilter = "year";
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
  } else if (scoreContext.role === "teacher") {
    setBoardYearLevel(scoreContext.yearLevel);
    if (state.teacherFilter === "none") {
      state.teacherFilter = "year";
      renderTeacherFilterControls();
    }
  }

  if (saveScore) {
    recordProgressAttempt(state.game, state.score, scoreContext);
    recordTopicSkillProgress(scoreContext);
    saveLocalScore();
  }
  elements.gamePanel.hidden = true;
  elements.resultPanel.hidden = false;
  elements.resultName.textContent = state.player;
  elements.finalScore.textContent = state.score.toLocaleString();
  elements.correctTotal.textContent = String(state.correct);
  elements.bestStreak.textContent = String(state.bestStreak);
  setResultMedalDisplay(
    state.score,
    state.game,
    saveScore
      ? {}
      : {
          extraDetail: "Test score only. It did not save to progress or leaderboards.",
          statusOverride: "test",
        },
  );
  state.board = getLeaderboardGameId(state.game);
  setActiveBoardTab();
  renderGamePage();
  renderLeaderboard();
  if (isTopicArea(state.board)) listenToSharedBoard(state.board);

  if (saveScore) {
    saveSharedScore();
  } else {
    state.pendingSharedScore = null;
    setLeaderboardStatus("local", `${getTestStudentLabel()} score was not saved to any leaderboard.`);
  }
}

function submitCurrentAnswer() {
  if (!state.running || !state.acceptingAnswer) return;

  const surdMode = isSurdAnswer(state.answer);
  const fractionMode = isFractionAnswer(state.answer);
  const choiceMode = isChoiceAnswer(state.answer);
  const guess = surdMode
    ? {
        coefficient: Number(elements.surdCoefficientInput.value),
        radicand: Number(elements.surdRadicandInput.value),
      }
    : fractionMode
      ? parseFractionBoxInput(state.answer)
      : choiceMode
        ? getChoiceGuess(state.answer)
        : Number(elements.answerInput.value);

  if (surdMode) {
    if (!Number.isFinite(guess.coefficient) || !Number.isFinite(guess.radicand)) return;
  } else if (fractionMode) {
    if (!guess) return;
  } else if (choiceMode) {
    if (!guess || (Array.isArray(guess) && !guess.length)) return;
  } else if (!Number.isFinite(guess)) {
    return;
  }

  state.acceptingAnswer = false;

  const isCorrect = surdMode
    ? guess.coefficient === state.answer.coefficient && guess.radicand === state.answer.radicand
    : fractionMode
      ? fractionsMatch(guess, state.answer)
        && (!state.answer.requireSimplified || isSimplifiedFractionGuess(guess))
        && (!state.answer.requireMixed || isMixedNumberGuess(guess))
        && (!state.answer.requireImproper || isImproperFractionGuess(guess))
      : choiceMode
        ? state.answer.type === "singleChoice"
          ? guess === state.answer.value
          : arraysMatch(guess, state.answer.values)
        : guess === state.answer;

  if (isCorrect) {
    state.streak += 1;
    state.correct += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const points = 100 + Math.min(state.streak - 1, 5) * 20;
    state.score += points;
    recordTopicSkillScore(state.currentQuestionSkillId, points);
    elements.feedback.textContent = state.streak > 2 ? `Correct! ${state.streak} answer streak!` : "Correct! Keep going.";
    elements.feedback.className = "feedback correct";
    playTone(true);
  } else {
    state.streak = 0;
    elements.feedback.innerHTML = `Not quite. The answer was ${renderMathText(getFormattedAnswer(state.answer))}.`;
    elements.feedback.className = "feedback incorrect";
    playTone(false);
  }

  elements.score.textContent = state.score.toLocaleString();
  elements.streak.textContent = String(state.streak);
  window.setTimeout(() => {
    if (state.running) nextQuestion();
  }, 220);
}

function submitAnswer(event) {
  event.preventDefault();
  submitCurrentAnswer();
}

function handleChoiceAutoSubmit(event) {
  if (!state.running || !state.acceptingAnswer) return;
  if (state.answer?.autoSubmit !== true || state.answer.type !== "singleChoice") return;
  if (typeof event.target.matches !== "function") return;
  if (!event.target.matches("input[name='choice-answer']")) return;

  window.setTimeout(submitCurrentAnswer, 80);
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
  if (state.page === "admin") renderAdminPage();
  if (state.sharedConfigured && canReadSharedLeaderboards()) {
    if (state.page === "home") listenToSharedBoards(getVisibleBoardGameIds());
    if (state.page === "game" && isTopicArea(state.game)) listenToSharedBoard(state.game);
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
  if (state.page === "admin") renderAdminPage();
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
    if (GAME_IDS.includes(gameId)) {
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

  if (rawHash === "admin") {
    return { page: "admin" };
  }

  return { page: "home" };
}

function openResultLeaderboard(event) {
  event.preventDefault();
  const leaderboardHash = getLeaderboardHash(state.game);

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
  document.body.classList.toggle("app-page-active", ["home", "games", "game", "progress", "leaderboards", "admin"].includes(route.page));
  document.body.classList.toggle("dashboard-page-active", route.page === "home");
  document.body.classList.toggle("leaderboards-page-active", route.page === "leaderboards");
  renderAdminNavigation();

  if (leavingGamePage || switchingGamePage || showingGameLeaderboard) {
    cancelActiveGame();
    elements.playSection.hidden = true;
  }

  elements.heroSection.hidden = route.page !== "home";
  elements.gamesSection.hidden = route.page !== "games";
  elements.gamePageSection.hidden = route.page !== "game";
  elements.progressSection.hidden = route.page !== "progress";
  elements.allLeaderboardsSection.hidden = route.page !== "leaderboards";
  elements.adminSection.hidden = route.page !== "admin";

  if (route.page !== "game") {
    elements.playSection.hidden = true;
  }

  if (route.page === "game") {
    state.game = route.gameId;
    state.board = getLeaderboardGameId(route.gameId);
    renderGamePage();
    if (isTopicArea(state.game)) listenToSharedBoard(state.game);
  } else if (route.page === "progress") {
    renderProgressPage();
  } else if (route.page === "leaderboards") {
    renderAllLeaderboards();
  } else if (route.page === "admin") {
    renderAdminPage();
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
            : route.page === "admin"
              ? elements.adminSection
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

elements.progressGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-progress-topic]");
  if (!button) return;
  const topicId = button.dataset.progressTopic;
  if (!isTopicArea(topicId)) return;

  if (state.expandedProgressTopics.has(topicId)) {
    state.expandedProgressTopics.delete(topicId);
  } else {
    state.expandedProgressTopics.add(topicId);
  }

  renderProgressPage();
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
    updateResultMedal();
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
elements.teacherChallengeYearSelect.addEventListener("change", () => {
  const selectedYearLevel = cleanYearLevel(elements.teacherChallengeYearSelect.value);
  if (!selectedYearLevel) return;

  state.teacherChallengeYearLevel = selectedYearLevel;
  state.pendingSharedScore = null;
  if (isTopicArea(state.game)) {
    setBoardYearLevel(selectedYearLevel);
    updateSelectedGameStartCopy();
    renderGamePage();
  }
  updateStartPanel();
});
elements.studentProfileForm.addEventListener("submit", saveStudentProfile);
elements.studentRequestButton.addEventListener("click", () => requestStudentYearLevel());
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
elements.choiceAnswerFields.addEventListener("change", handleChoiceAutoSubmit);
document.querySelector("#back-button").addEventListener("click", endAndHideGame);
document.querySelector("#quit-button").addEventListener("click", quitGame);
document.querySelector("#play-again").addEventListener("click", requestStartGame);
elements.resultLeaderboardLink.addEventListener("click", openResultLeaderboard);
elements.signInButton.addEventListener("click", signInForLeaderboard);
elements.homeSignInButton.addEventListener("click", signInForLeaderboard);
elements.homeSettingsButton.addEventListener("click", () => setSettingsOpen(true, { userAction: true }));
elements.signOutButton.addEventListener("click", signOutOfLeaderboard);
elements.resultSignIn.addEventListener("click", signInForLeaderboard);
elements.adminRequestList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-admin-assign]");
  if (!button) return;
  assignStudentRequest(button.closest("[data-request-id]"));
});
elements.adminRefreshButton.addEventListener("click", () => {
  stopAdminRequestListener();
  renderAdminPage();
});

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
