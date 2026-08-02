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
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import {
  allowedEmailDomain,
  allowedEmailDomains,
  firebaseConfig,
  studentEmailDomain,
  teacherEmailDomain,
} from "./firebase-config.js";

const validGames = new Set([
  "quick",
  "times",
  "missing",
  "year7-fluency",
  "year8-fluency",
  "year9-fluency",
  "year10-fluency",
  "year11-fluency",
  "year12-fluency",
]);
const validYearLevels = new Set([
  "year7",
  "year8",
  "year9",
  "year10",
  "year11",
  "year12",
]);
const gameAccessYears = new Map([
  ["quick", "year7"],
  ["times", "year7"],
  ["missing", "year7"],
  ["year7-fluency", "year7"],
  ["year8-fluency", "year8"],
  ["year9-fluency", "year9"],
  ["year10-fluency", "year10"],
  ["year11-fluency", "year11"],
  ["year12-fluency", "year12"],
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
const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => value && !String(value).startsWith("YOUR_"),
);
const hasAllowedDomain = cleanAllowedDomains.length > 0;
const isConfigured = hasFirebaseConfig && hasAllowedDomain;

let studentProfile = null;
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
  if (domain === cleanStudentDomain) return "student";
  if (domain === cleanTeacherDomain) return "teacher";
  return "";
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
  teacherProfile = null;
}

function stopWatchingAccountDocuments() {
  accountUnsubscribes.forEach((unsubscribe) => unsubscribe());
  accountUnsubscribes = [];
}

function getPublicAuthState(user) {
  const email = user?.email || "";
  const accountType = getAccountTypeForEmail(email);
  const teacherYearLevels = cleanYearLevels(teacherProfile?.yearLevels);

  return {
    signedIn: Boolean(user),
    allowed: emailIsAllowed(email),
    uid: user?.uid || "",
    email,
    name: user ? getAccountName(user) : "",
    allowedEmailDomain: cleanAllowedDomain,
    allowedEmailDomains: cleanAllowedDomains,
    accountType,
    studentYearLevel: accountType === "student" ? cleanYearLevel(studentProfile?.yearLevel) : "",
    teacherYearLevels: accountType === "teacher" ? teacherYearLevels : [],
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

  function teacherProfileRef(user) {
    return doc(db, "teachers", user.uid);
  }

  async function readAccountDocuments(user) {
    resetAccountDocuments();
    const accountType = getAccountTypeForEmail(user?.email);
    if (!user || !accountType) return;

    if (accountType === "student") {
      const studentSnapshot = await getDoc(studentProfileRef(user));
      studentProfile = studentSnapshot.exists() ? studentSnapshot.data() : null;
      return;
    }

    const teacherSnapshot = await getDoc(teacherProfileRef(user));
    teacherProfile = teacherSnapshot.exists() ? teacherSnapshot.data() : null;
  }

  function watchAccountDocuments(user) {
    stopWatchingAccountDocuments();
    resetAccountDocuments();

    const accountType = getAccountTypeForEmail(user?.email);
    if (!user || !accountType) return;

    const handleError = (error) => console.warn("Could not read account setup.", error);
    accountUnsubscribes = [
      accountType === "student"
        ? onSnapshot(
            studentProfileRef(user),
            (snapshot) => {
              studentProfile = snapshot.exists() ? snapshot.data() : null;
              announceAuth(auth.currentUser);
            },
            handleError,
          )
        : onSnapshot(
            teacherProfileRef(user),
            (snapshot) => {
              teacherProfile = snapshot.exists() ? snapshot.data() : null;
              announceAuth(auth.currentUser);
            },
            handleError,
          ),
    ];
  }

  onAuthStateChanged(auth, (user) => {
    watchAccountDocuments(user);
    announceAuth(user);
  });

  async function signInWithSchoolGoogle() {
    await persistenceReady;
    const credential = await signInWithPopup(auth, provider);

    if (!emailIsAllowed(credential.user.email)) {
      await signOut(auth);
      throw new Error("Please sign in with an approved school Google account.");
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

  async function saveStudentYearLevel(yearLevel) {
    const user = getAllowedUser();
    if (getAccountTypeForEmail(user.email) !== "student") {
      throw makeError("profile/student-domain-required", "Only bcc.vic.edu.au accounts can save a student year level.");
    }

    const cleanLevel = cleanYearLevel(yearLevel);
    if (!cleanLevel) {
      throw makeError("profile/year-level-needed", "Choose a valid year level.");
    }

    const profileDocument = studentProfileRef(user);
    const existingProfile = await getDoc(profileDocument);
    const profileData = {
      uid: user.uid,
      name: getAccountName(user),
      email: cleanEmail(user.email),
      yearLevel: cleanLevel,
      updatedAt: serverTimestamp(),
    };

    if (existingProfile.exists()) {
      await updateDoc(profileDocument, profileData);
    } else {
      await setDoc(profileDocument, {
        ...profileData,
        createdAt: serverTimestamp(),
      });
    }

    await readAccountDocuments(user);
    announceAuth(user);
    return getPublicAuthState(user);
  }

  async function saveTeacherYearLevels(yearLevels) {
    const user = getAllowedUser();
    if (getAccountTypeForEmail(user.email) !== "teacher") {
      throw makeError("teacher/domain-required", "Only baysidecc.vic.edu.au accounts can save teacher year levels.");
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
      name: getAccountName(user),
      email: cleanEmail(user.email),
      approved: true,
      yearLevels: cleanLevels,
      updatedAt: serverTimestamp(),
    };

    if (currentTeacherProfile) {
      await updateDoc(teacherDocument, profileData);
    } else {
      await setDoc(teacherDocument, {
        ...profileData,
        createdAt: serverTimestamp(),
        approvedAt: serverTimestamp(),
      });
    }

    await readAccountDocuments(user);
    announceAuth(user);
    return getPublicAuthState(user);
  }

  async function getStudentScorePayload(user, game, score, yearLevel) {
    if (!validGames.has(game)) {
      throw new Error("Unknown game mode.");
    }

    if (getAccountTypeForEmail(user.email) !== "student") {
      throw makeError("profile/student-domain-required", "Only bcc.vic.edu.au accounts can submit student scores.");
    }

    const cleanLevel = cleanYearLevel(yearLevel || studentProfile?.yearLevel);
    if (!cleanLevel) {
      throw makeError("profile/year-level-needed", "Choose and save your year level before submitting a score.");
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
      name: getAccountName(user),
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

  window.sharedLeaderboard = {
    isConfigured: true,
    allowedEmailDomain: cleanAllowedDomain,
    allowedEmailDomains: cleanAllowedDomains,
    getAuthState: () => getPublicAuthState(auth.currentUser),
    signIn: signInWithSchoolGoogle,
    signOut: () => signOut(auth),
    saveStudentYearLevel,
    saveTeacherYearLevels,

    listen(game, onScores, onError) {
      const topScores = query(scoreCollection(game), orderBy("score", "desc"), limit(300));

      return onSnapshot(
        topScores,
        (snapshot) => {
          onScores(
            snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data(),
            })),
          );
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
      const scoreDocument = doc(scoreCollection(game), user.uid);
      const existingScore = await getDoc(scoreDocument);
      const existingData = existingScore.exists() ? existingScore.data() : null;
      const previousScore = Number.isInteger(existingData?.score) ? existingData.score : null;

      if (previousScore !== null && score <= previousScore) {
        if (shouldSyncScoreMetadata(existingData, scoreData)) {
          try {
            await updateDoc(scoreDocument, {
              ...scoreData,
              score: previousScore,
              updatedAt: serverTimestamp(),
            });
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
        };
      }

      if (existingScore.exists()) {
        await updateDoc(scoreDocument, {
          ...scoreData,
          updatedAt: serverTimestamp(),
        });
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
      };
    },
  };

  announceReady();
}
