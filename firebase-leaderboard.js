import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import {
  adminEmail,
  allowedEmailDomain,
  allowedEmailDomains,
  firebaseConfig,
  studentEmailDomain,
  teacherEmailDomain,
  yearLevelRequestEmail,
} from "./firebase-config.js?v=student-directory-20260811";

const validGames = new Set([
  "quick",
  "times",
  "missing",
  "y7-integers",
  "y7-fractions",
  "y7-simplifying-fractions",
  "y7-add-subtract-fractions",
  "y7-multiplying-fractions",
  "y7-percentages",
  "y7-bidmas",
  "y7-one-step-equations",
  "y8-square-powers",
  "y8-ratios",
  "y8-percentage-change",
  "y8-linear-equations",
  "y9-index-laws",
  "y9-gradients",
  "y9-expanding-brackets",
  "y9-two-step-equations",
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
const validYearLevels = new Set([
  "year7",
  "year8",
  "year9",
  "year10",
  "year11",
  "year12",
]);
const validTeacherFilters = new Set(["none", "year", "all"]);
const gameAccessYears = new Map([
  ["quick", "year7"],
  ["times", "year7"],
  ["missing", "year7"],
  ["y7-integers", "year7"],
  ["y7-fractions", "year7"],
  ["y7-simplifying-fractions", "year7"],
  ["y7-add-subtract-fractions", "year7"],
  ["y7-multiplying-fractions", "year7"],
  ["y7-percentages", "year7"],
  ["y7-bidmas", "year7"],
  ["y7-one-step-equations", "year7"],
  ["y8-square-powers", "year8"],
  ["y8-ratios", "year8"],
  ["y8-percentage-change", "year8"],
  ["y8-linear-equations", "year8"],
  ["y9-index-laws", "year9"],
  ["y9-gradients", "year9"],
  ["y9-expanding-brackets", "year9"],
  ["y9-two-step-equations", "year9"],
  ["y10-quadratics", "year10"],
  ["y10-pythagoras", "year10"],
  ["y10-simultaneous-equations", "year10"],
  ["y10-functions", "year10"],
  ["y11-derivatives", "year11"],
  ["y11-logarithms", "year11"],
  ["y11-arithmetic-sequences", "year11"],
  ["y11-surds", "year11"],
  ["y12-calculus-derivatives", "year12"],
  ["y12-integrals", "year12"],
  ["y12-complex-numbers", "year12"],
  ["y12-series", "year12"],
]);
const configuredDomains = Array.isArray(allowedEmailDomains) && allowedEmailDomains.length
  ? allowedEmailDomains
  : [allowedEmailDomain];
const cleanAllowedDomains = configuredDomains
  .map((domain) => String(domain || "").replace(/^@/, "").trim().toLowerCase())
  .filter((domain, index, domains) => domain && !domain.startsWith("your_") && domains.indexOf(domain) === index);
const cleanAllowedDomain = cleanAllowedDomains[0] || "";
const cleanStudentDomain = String(studentEmailDomain || "bcc.vic.edu.au").replace(/^@/, "").trim().toLowerCase();
const cleanTeacherDomain = String(teacherEmailDomain || "baysidecc.vic.edu.au").replace(/^@/, "").trim().toLowerCase();
const cleanAdminEmail = cleanEmail(adminEmail || "joshua.thorne@baysidecc.vic.edu.au");
const cleanYearLevelRequestEmail = cleanEmail(yearLevelRequestEmail || cleanAdminEmail);
const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => value && !String(value).startsWith("YOUR_"),
);
const hasAllowedDomain = cleanAllowedDomains.length > 0;
const isConfigured = hasFirebaseConfig && hasAllowedDomain;

let studentProfile = null;
let studentDirectoryEntry = null;
let yearLevelRequest = null;
let teacherProfile = null;
let accountUnsubscribes = [];

function announceReady() {
  window.dispatchEvent(new CustomEvent("shared-leaderboard-ready"));
}

function getEmailDomain(email) {
  const parts = cleanEmail(email).split("@");
  return parts.length === 2 ? parts[1] : "";
}

function getAccountTypeForEmail(email) {
  const domain = getEmailDomain(email);
  if (domain === cleanTeacherDomain) return "teacher";
  return cleanEmail(email) ? "student" : "";
}

function emailIsAllowed(email) {
  return Boolean(getAccountTypeForEmail(email));
}

function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getAccountName(user) {
  return user?.displayName || user?.email?.split("@")[0] || "Student";
}

function isAdminEmail(email) {
  return cleanEmail(email) === cleanAdminEmail;
}

function cleanLeaderboardName(name) {
  return String(name || "").replace(/\s+/g, " ").trim();
}

function isValidLeaderboardName(name) {
  const cleanName = cleanLeaderboardName(name);
  return cleanName.length >= 1 && cleanName.length <= 80;
}

function getTeacherLeaderboardName(user, profile = teacherProfile) {
  const profileName = cleanLeaderboardName(profile?.name);
  return isValidLeaderboardName(profileName) ? profileName : getAccountName(user);
}

function cleanYearLevel(yearLevel) {
  const value = String(yearLevel || "").trim().toLowerCase();
  return validYearLevels.has(value) ? value : "";
}

function cleanYearLevels(yearLevels) {
  if (!Array.isArray(yearLevels)) return [];
  return yearLevels
    .map(cleanYearLevel)
    .filter((yearLevel, index, levels) => yearLevel && levels.indexOf(yearLevel) === index);
}

function cleanTeacherFilter(filter) {
  const value = String(filter || "").trim().toLowerCase();
  return validTeacherFilters.has(value) ? value : "none";
}

function cleanBestStreak(bestStreak) {
  return Number.isInteger(bestStreak) && bestStreak >= 0 ? bestStreak : 0;
}

function getYearRank(yearLevel) {
  const cleanLevel = cleanYearLevel(yearLevel);
  return cleanLevel ? Number(cleanLevel.replace("year", "")) : 0;
}

function canStudentAccessGame(game, yearLevel) {
  const requiredYear = gameAccessYears.get(game);
  return Boolean(requiredYear) && getYearRank(yearLevel) >= getYearRank(requiredYear);
}

function makeError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function resetAccountDocuments() {
  studentProfile = null;
  studentDirectoryEntry = null;
  yearLevelRequest = null;
  teacherProfile = null;
}

function stopWatchingAccountDocuments() {
  accountUnsubscribes.forEach((unsubscribe) => unsubscribe());
  accountUnsubscribes = [];
}

function getPublicAuthState(user) {
  const email = user?.email || "";
  const accountType = getAccountTypeForEmail(email);
  const studentDirectoryYearLevel = cleanYearLevel(studentDirectoryEntry?.yearLevel);
  const teacherYearLevels = cleanYearLevels(teacherProfile?.yearLevels);
  const teacherLeaderboardName = accountType === "teacher"
    ? cleanLeaderboardName(teacherProfile?.name)
    : "";
  const publicName = user
    ? (accountType === "teacher" && isValidLeaderboardName(teacherLeaderboardName) ? teacherLeaderboardName : getAccountName(user))
    : "";

  return {
    signedIn: Boolean(user),
    allowed: emailIsAllowed(email),
    uid: user?.uid || "",
    email,
    name: publicName,
    allowedEmailDomain: cleanAllowedDomain,
    allowedEmailDomains: cleanAllowedDomains,
    accountType,
    studentYearLevel: accountType === "student" ? studentDirectoryYearLevel : "",
    studentYearLevelLocked: accountType === "student",
    studentDirectoryStatus: accountType === "student"
      ? studentDirectoryYearLevel ? "found" : "missing"
      : "",
    studentYearLevelRequest: accountType === "student" && yearLevelRequest
      ? {
          status: yearLevelRequest.status || "new",
          assignedYearLevel: cleanYearLevel(yearLevelRequest.assignedYearLevel),
          updatedAt: yearLevelRequest.updatedAt || null,
        }
      : null,
    isAdmin: isAdminEmail(email),
    teacherYearLevels: accountType === "teacher" ? teacherYearLevels : [],
    teacherLeaderboardName: accountType === "teacher" && isValidLeaderboardName(teacherLeaderboardName)
      ? teacherLeaderboardName
      : "",
  };
}

function announceAuth(user) {
  window.dispatchEvent(
    new CustomEvent("leaderboard-auth-changed", {
      detail: getPublicAuthState(user),
    }),
  );
}

if (!isConfigured) {
  window.sharedLeaderboard = {
    isConfigured: false,
    allowedEmailDomain: cleanAllowedDomain,
    allowedEmailDomains: cleanAllowedDomains,
  };
  announceReady();
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  if (cleanAllowedDomains.length === 1) {
    provider.setCustomParameters({ hd: cleanAllowedDomain });
  }
  const persistenceReady = setPersistence(auth, browserLocalPersistence);

  function studentProfileRef(user) {
    return doc(db, "studentProfiles", user.uid);
  }

  function studentDirectoryRef(email) {
    return doc(db, "studentDirectory", cleanEmail(email));
  }

  function yearLevelRequestRef(user) {
    return doc(db, "yearLevelRequests", user.uid);
  }

  function teacherProfileRef(user) {
    return doc(db, "teachers", user.uid);
  }

  async function readAccountDocuments(user) {
    resetAccountDocuments();
    const accountType = getAccountTypeForEmail(user?.email);
    if (!user || !accountType) return;

    if (accountType === "student") {
      const [studentSnapshot, directorySnapshot, requestSnapshot] = await Promise.all([
        getDoc(studentProfileRef(user)),
        getDoc(studentDirectoryRef(user.email)),
        getDoc(yearLevelRequestRef(user)),
      ]);
      studentProfile = studentSnapshot.exists() ? studentSnapshot.data() : null;
      studentDirectoryEntry = directorySnapshot.exists() ? directorySnapshot.data() : null;
      yearLevelRequest = requestSnapshot.exists() ? requestSnapshot.data() : null;
      return;
    }

    const teacherSnapshot = await getDoc(teacherProfileRef(user));
    teacherProfile = teacherSnapshot.exists() ? teacherSnapshot.data() : null;
  }

  function watchAccountDocuments(user) {
    stopWatchingAccountDocuments();
    resetAccountDocuments();

    const accountType = getAccountTypeForEmail(user?.email);
    if (!user || !accountType) return false;

    const handleError = (error) => console.warn("Could not read account setup.", error);
    accountUnsubscribes = accountType === "student"
      ? [
          onSnapshot(
            studentProfileRef(user),
            (snapshot) => {
              studentProfile = snapshot.exists() ? snapshot.data() : null;
              announceAuth(auth.currentUser);
            },
            handleError,
          ),
          onSnapshot(
            studentDirectoryRef(user.email),
            (snapshot) => {
              studentDirectoryEntry = snapshot.exists() ? snapshot.data() : null;
              announceAuth(auth.currentUser);
            },
            handleError,
          ),
          onSnapshot(
            yearLevelRequestRef(user),
            (snapshot) => {
              yearLevelRequest = snapshot.exists() ? snapshot.data() : null;
              announceAuth(auth.currentUser);
            },
            handleError,
          ),
        ]
      : [
          onSnapshot(
            teacherProfileRef(user),
            (snapshot) => {
              teacherProfile = snapshot.exists() ? snapshot.data() : null;
              announceAuth(auth.currentUser);
            },
            handleError,
          ),
        ];
    return true;
  }

  onAuthStateChanged(auth, (user) => {
    const isWatchingAccount = watchAccountDocuments(user);
    if (!isWatchingAccount) announceAuth(user);
  });

  async function signInWithSchoolGoogle() {
    await persistenceReady;
    const credential = await signInWithPopup(auth, provider);

    if (!emailIsAllowed(credential.user.email)) {
      await signOut(auth);
      throw new Error("Please sign in with a Google account.");
    }

    await readAccountDocuments(credential.user);
    announceAuth(credential.user);
    return getPublicAuthState(credential.user);
  }

  function getAllowedUser() {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Sign in with Google before submitting a leaderboard score.");
    }

    if (!emailIsAllowed(user.email)) {
      throw new Error("Only approved school Google accounts can submit leaderboard scores.");
    }

    return user;
  }

  function scoreCollection(game) {
    if (!validGames.has(game)) throw new Error("Unknown game mode.");
    return collection(db, "leaderboards", game, "scores");
  }

  function getStudentScoreDocumentId(user, yearLevel) {
    const cleanLevel = cleanYearLevel(yearLevel);
    return cleanLevel ? `${user.uid}_${cleanLevel}` : user.uid;
  }

  function isMatchingStudentScore(scoreData, user, game, yearLevel) {
    return scoreData?.uid === user.uid
      && scoreData?.role === "student"
      && scoreData?.game === game
      && cleanYearLevel(scoreData?.yearLevel) === yearLevel
      && Number.isInteger(scoreData?.score)
      && scoreData.score >= 0;
  }

  function getHighestScoreData(scoreSnapshots) {
    const matchingScores = scoreSnapshots
      .filter((snapshot) => snapshot.exists())
      .map((snapshot) => snapshot.data())
      .filter((scoreData) => Number.isInteger(scoreData?.score));

    const previousScore = matchingScores.length
      ? Math.max(...matchingScores.map((scoreData) => scoreData.score))
      : null;
    const previousBestStreak = matchingScores.reduce(
      (highest, scoreData) => Math.max(highest, cleanBestStreak(scoreData.bestStreak)),
      0,
    );

    return { previousScore, previousBestStreak };
  }

  async function getScoreDocumentState(user, game, scoreData) {
    if (scoreData.role !== "student") {
      const scoreDocument = doc(scoreCollection(game), user.uid);
      const existingScore = await getDoc(scoreDocument);
      const existingData = existingScore.exists() ? existingScore.data() : null;
      const previousScore = Number.isInteger(existingData?.score) ? existingData.score : null;
      const previousBestStreak = cleanBestStreak(existingData?.bestStreak);
      return { scoreDocument, existingScore, existingData, previousScore, previousBestStreak };
    }

    const yearLevel = cleanYearLevel(scoreData.yearLevel);
    const yearScoreDocument = doc(scoreCollection(game), getStudentScoreDocumentId(user, yearLevel));
    const legacyScoreDocument = doc(scoreCollection(game), user.uid);
    const [yearScoreSnapshot, legacyScoreSnapshot] = await Promise.all([
      getDoc(yearScoreDocument),
      getDoc(legacyScoreDocument),
    ]);
    const legacyMatchesYear = isMatchingStudentScore(legacyScoreSnapshot.data(), user, game, yearLevel);
    const preferredScoreDocument = !yearScoreSnapshot.exists() && legacyMatchesYear
      ? legacyScoreDocument
      : yearScoreDocument;
    const existingScore = preferredScoreDocument === legacyScoreDocument
      ? legacyScoreSnapshot
      : yearScoreSnapshot;
    const existingData = existingScore.exists() ? existingScore.data() : null;
    const relevantSnapshots = [
      yearScoreSnapshot.exists() && isMatchingStudentScore(yearScoreSnapshot.data(), user, game, yearLevel)
        ? yearScoreSnapshot
        : null,
      legacyMatchesYear ? legacyScoreSnapshot : null,
    ].filter(Boolean);
    const { previousScore, previousBestStreak } = getHighestScoreData(relevantSnapshots);

    return {
      scoreDocument: preferredScoreDocument,
      existingScore,
      existingData,
      previousScore,
      previousBestStreak,
    };
  }

  function scoreRowsFromSnapshot(snapshot) {
    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  }

  function sortLeaderboardRows(scores) {
    return scores
      .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
      .slice(0, 300);
  }

  function listenToStudentAllowedScores(game, teacherFilter, onScores, onError) {
    const yearLevel = cleanYearLevel(studentDirectoryEntry?.yearLevel);
    if (!yearLevel) {
      onScores([]);
      return () => {};
    }

    const latestRows = {
      students: [],
      teachers: [],
    };
    const emitRows = () => onScores(sortLeaderboardRows([
      ...latestRows.students,
      ...latestRows.teachers,
    ]));
    const unsubscribes = [
      onSnapshot(
        query(
          scoreCollection(game),
          where("role", "==", "student"),
          where("yearLevel", "==", yearLevel),
        ),
        (snapshot) => {
          latestRows.students = scoreRowsFromSnapshot(snapshot);
          emitRows();
        },
        onError,
      ),
    ];

    if (teacherFilter === "year") {
      unsubscribes.push(
        onSnapshot(
          query(
            scoreCollection(game),
            where("role", "==", "teacher"),
            where("teacherYearLevels", "array-contains", yearLevel),
          ),
          (snapshot) => {
            latestRows.teachers = scoreRowsFromSnapshot(snapshot);
            emitRows();
          },
          onError,
        ),
      );
    } else if (teacherFilter === "all") {
      unsubscribes.push(
        onSnapshot(
          query(
            scoreCollection(game),
            where("role", "==", "teacher"),
          ),
          (snapshot) => {
            latestRows.teachers = scoreRowsFromSnapshot(snapshot);
            emitRows();
          },
          onError,
        ),
      );
    }

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  async function saveStudentYearLevel(yearLevel) {
    const user = getAllowedUser();
    if (getAccountTypeForEmail(user.email) !== "student") {
      throw makeError("profile/student-domain-required", "Teacher accounts cannot request student year levels.");
    }

    await readAccountDocuments(user);
    if (cleanYearLevel(studentDirectoryEntry?.yearLevel)) {
      announceAuth(user);
      return getPublicAuthState(user);
    }

    return requestYearLevelAssignment();
  }

  async function requestYearLevelAssignment() {
    const user = getAllowedUser();
    if (getAccountTypeForEmail(user.email) !== "student") {
      throw makeError("profile/student-domain-required", "Teacher accounts already have teacher access.");
    }

    const directorySnapshot = await getDoc(studentDirectoryRef(user.email));
    if (directorySnapshot.exists() && cleanYearLevel(directorySnapshot.data()?.yearLevel)) {
      studentDirectoryEntry = directorySnapshot.data();
      announceAuth(user);
      return getPublicAuthState(user);
    }

    const requestDocument = yearLevelRequestRef(user);
    const requestSnapshot = await getDoc(requestDocument);
    const requestData = {
      uid: user.uid,
      name: getAccountName(user),
      email: cleanEmail(user.email),
      status: "new",
      notifyEmail: cleanYearLevelRequestEmail,
      updatedAt: serverTimestamp(),
    };

    if (requestSnapshot.exists()) {
      const currentRequest = requestSnapshot.data();
      if (!currentRequest.createdAt) {
        requestData.createdAt = serverTimestamp();
      }
      await updateDoc(requestDocument, requestData);
    } else {
      await setDoc(requestDocument, {
        ...requestData,
        createdAt: serverTimestamp(),
      });
    }

    await readAccountDocuments(user);
    announceAuth(user);
    return getPublicAuthState(user);
  }

  async function syncTeacherScoreMetadata(user, name, yearLevels) {
    const scoreUpdates = [...validGames].map(async (game) => {
      const scoreDocument = doc(scoreCollection(game), user.uid);
      const scoreSnapshot = await getDoc(scoreDocument);
      if (!scoreSnapshot.exists()) return;

      const scoreData = scoreSnapshot.data();
      if (scoreData.uid !== user.uid) return;
      if (scoreData.role && scoreData.role !== "teacher") return;
      if (!Number.isInteger(scoreData.score) || scoreData.score < 0) return;

      await updateDoc(scoreDocument, {
        name,
        score: scoreData.score,
        uid: user.uid,
        role: "teacher",
        teacherYearLevels: yearLevels,
        game,
        bestStreak: cleanBestStreak(scoreData.bestStreak),
        ...(scoreData.createdAt ? {} : { createdAt: serverTimestamp() }),
        updatedAt: serverTimestamp(),
      });
    });

    const results = await Promise.allSettled(scoreUpdates);
    results
      .filter((result) => result.status === "rejected")
      .forEach((result) => console.warn("Could not update teacher score name.", result.reason));
  }

  async function saveTeacherYearLevels(yearLevels, displayName = "") {
    const user = getAllowedUser();
    if (getAccountTypeForEmail(user.email) !== "teacher") {
      throw makeError("teacher/domain-required", "Only baysidecc.vic.edu.au accounts can save teacher year levels.");
    }

    const cleanName = cleanLeaderboardName(displayName);
    if (!isValidLeaderboardName(cleanName)) {
      throw makeError("teacher/name-needed", "Enter a leaderboard name up to 80 characters.");
    }

    const cleanLevels = cleanYearLevels(yearLevels);
    if (!cleanLevels.length) {
      throw makeError("teacher/year-levels-needed", "Choose at least one teaching year level.");
    }

    const teacherDocument = teacherProfileRef(user);
    const teacherSnapshot = await getDoc(teacherDocument);
    const currentTeacherProfile = teacherSnapshot.exists() ? teacherSnapshot.data() : null;
    const profileData = {
      uid: user.uid,
      name: cleanName,
      email: cleanEmail(user.email),
      approved: true,
      yearLevels: cleanLevels,
      updatedAt: serverTimestamp(),
    };

    if (currentTeacherProfile) {
      if (!currentTeacherProfile.createdAt) {
        profileData.createdAt = serverTimestamp();
      }
      if (!currentTeacherProfile.approvedAt) {
        profileData.approvedAt = serverTimestamp();
      }
      await updateDoc(teacherDocument, profileData);
    } else {
      await setDoc(teacherDocument, {
        ...profileData,
        createdAt: serverTimestamp(),
        approvedAt: serverTimestamp(),
      });
    }

    await syncTeacherScoreMetadata(user, cleanName, cleanLevels);
    await readAccountDocuments(user);
    announceAuth(user);
    return getPublicAuthState(user);
  }

  async function getStudentScorePayload(user, game, score, yearLevel) {
    if (!validGames.has(game)) {
      throw new Error("Unknown game mode.");
    }

    if (getAccountTypeForEmail(user.email) !== "student") {
      throw makeError("profile/student-domain-required", "Only student accounts can submit student scores.");
    }

    const directorySnapshot = await getDoc(studentDirectoryRef(user.email));
    studentDirectoryEntry = directorySnapshot.exists() ? directorySnapshot.data() : null;
    const cleanLevel = cleanYearLevel(studentDirectoryEntry?.yearLevel);
    if (!cleanLevel) {
      throw makeError("profile/year-level-needed", "Your year level needs to be assigned before submitting a score.");
    }

    if (yearLevel && cleanYearLevel(yearLevel) !== cleanLevel) {
      throw makeError("profile/year-level-locked", "Your year level is locked by your account setup.");
    }

    if (!canStudentAccessGame(game, cleanLevel)) {
      throw makeError("profile/game-locked", "This challenge is locked for your year level.");
    }

    return {
      name: getAccountName(user),
      score,
      uid: user.uid,
      role: "student",
      yearLevel: cleanLevel,
      game,
    };
  }

  async function getTeacherScorePayload(user, game, score) {
    if (getAccountTypeForEmail(user.email) !== "teacher") {
      throw makeError("teacher/domain-required", "Only baysidecc.vic.edu.au accounts can submit teacher scores.");
    }

    const teacherSnapshot = await getDoc(teacherProfileRef(user));
    const currentTeacherProfile = teacherSnapshot.exists() ? teacherSnapshot.data() : null;
    const teacherYearLevels = cleanYearLevels(currentTeacherProfile?.yearLevels);

    if (!currentTeacherProfile?.approved || !teacherYearLevels.length) {
      throw makeError("teacher/year-levels-needed", "Choose at least one teaching year level before playing.");
    }

    teacherProfile = currentTeacherProfile;
    return {
      name: getTeacherLeaderboardName(user, currentTeacherProfile),
      score,
      uid: user.uid,
      role: "teacher",
      teacherYearLevels,
      game,
    };
  }

  function sameArray(left = [], right = []) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }

  function shouldSyncScoreMetadata(existingData, scoreData) {
    if (!existingData) return false;
    if (existingData.name !== scoreData.name || existingData.role !== scoreData.role || existingData.game !== scoreData.game) {
      return true;
    }

    if (scoreData.role === "teacher") {
      return !sameArray(cleanYearLevels(existingData.teacherYearLevels), scoreData.teacherYearLevels);
    }

    return existingData.yearLevel !== scoreData.yearLevel;
  }

  function requireAdminUser() {
    const user = getAllowedUser();
    if (!isAdminEmail(user.email)) {
      throw makeError("admin/required", "Only the site admin can manage student requests.");
    }
    return user;
  }

  function requestRowsFromSnapshot(snapshot) {
    return snapshot.docs.map((requestDocument) => ({
      id: requestDocument.id,
      ...requestDocument.data(),
    }));
  }

  function listenToYearLevelRequests(onRequests, onError) {
    if (!isAdminEmail(auth.currentUser?.email)) {
      onRequests([]);
      return () => {};
    }

    return onSnapshot(
      query(collection(db, "yearLevelRequests"), orderBy("updatedAt", "desc"), limit(100)),
      (snapshot) => onRequests(requestRowsFromSnapshot(snapshot)),
      onError,
    );
  }

  async function assignStudentYearLevel(email, yearLevel, requestId = "") {
    const user = requireAdminUser();
    const cleanStudentEmail = cleanEmail(email);
    const cleanLevel = cleanYearLevel(yearLevel);
    if (!cleanStudentEmail || !cleanStudentEmail.includes("@")) {
      throw makeError("admin/email-needed", "Choose a valid student email.");
    }
    if (!cleanLevel) {
      throw makeError("admin/year-needed", "Choose a valid year level.");
    }

    const directoryDocument = studentDirectoryRef(cleanStudentEmail);
    await setDoc(directoryDocument, {
      email: cleanStudentEmail,
      yearLevel: cleanLevel,
      source: "admin",
      updatedBy: cleanEmail(user.email),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    if (requestId) {
      const requestDocument = doc(db, "yearLevelRequests", requestId);
      const requestSnapshot = await getDoc(requestDocument);
      if (requestSnapshot.exists()) {
        await updateDoc(requestDocument, {
          status: "assigned",
          assignedYearLevel: cleanLevel,
          resolvedBy: cleanEmail(user.email),
          resolvedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    return { email: cleanStudentEmail, yearLevel: cleanLevel };
  }

  window.sharedLeaderboard = {
    isConfigured: true,
    allowedEmailDomain: cleanAllowedDomain,
    allowedEmailDomains: cleanAllowedDomains,
    getAuthState: () => getPublicAuthState(auth.currentUser),
    signIn: signInWithSchoolGoogle,
    signOut: () => signOut(auth),
    saveStudentYearLevel,
    requestYearLevelAssignment,
    saveTeacherYearLevels,
    listenToYearLevelRequests,
    assignStudentYearLevel,

    listen(game, onScores, onError, context = {}) {
      const accountType = getAccountTypeForEmail(auth.currentUser?.email);
      if (accountType === "student") {
        return listenToStudentAllowedScores(game, cleanTeacherFilter(context.teacherFilter), onScores, onError);
      }

      if (accountType !== "teacher") {
        onScores([]);
        return () => {};
      }

      const topScores = query(scoreCollection(game), orderBy("score", "desc"), limit(300));

      return onSnapshot(
        topScores,
        (snapshot) => {
          onScores(scoreRowsFromSnapshot(snapshot));
        },
        onError,
      );
    },

    async addScore(game, score, context = {}) {
      const user = getAllowedUser();
      if (!validGames.has(game)) {
        throw new Error("Unknown game mode.");
      }

      const accountType = getAccountTypeForEmail(user.email);
      if (!accountType) {
        throw makeError("profile/account-type-needed", "Use an approved school Google account before submitting a score.");
      }

      const role = accountType === "teacher" ? "teacher" : "student";
      const scoreData = role === "teacher"
        ? await getTeacherScorePayload(user, game, score)
        : await getStudentScorePayload(user, game, score, context.yearLevel);
      const currentBestStreak = cleanBestStreak(context.bestStreak);
      const {
        scoreDocument,
        existingScore,
        existingData,
        previousScore,
        previousBestStreak,
      } = await getScoreDocumentState(user, game, scoreData);
      scoreData.bestStreak = Math.max(previousBestStreak, currentBestStreak);

      if (previousScore !== null && score <= previousScore) {
        const preferredScore = Number.isInteger(existingData?.score) ? existingData.score : null;
        if (
          shouldSyncScoreMetadata(existingData, scoreData)
          || scoreData.bestStreak > previousBestStreak
          || preferredScore === null
          || previousScore > preferredScore
        ) {
          try {
            const updateData = {
              ...scoreData,
              score: previousScore,
              updatedAt: serverTimestamp(),
            };
            if (!existingData?.createdAt) {
              updateData.createdAt = serverTimestamp();
            }
            await updateDoc(scoreDocument, updateData);
          } catch (error) {
            console.warn("Could not update score metadata.", error);
          }
        }

        return {
          id: user.uid,
          improved: false,
          previousScore,
          role: scoreData.role,
          score: previousScore,
          bestStreak: scoreData.bestStreak,
        };
      }

      if (existingScore.exists()) {
        const updateData = {
          ...scoreData,
          updatedAt: serverTimestamp(),
        };
        if (!existingData?.createdAt) {
          updateData.createdAt = serverTimestamp();
        }
        await updateDoc(scoreDocument, updateData);
      } else {
        await setDoc(scoreDocument, {
          ...scoreData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      return {
        id: user.uid,
        improved: true,
        previousScore,
        role: scoreData.role,
        score,
        bestStreak: scoreData.bestStreak,
      };
    },
  };

  announceReady();
}
