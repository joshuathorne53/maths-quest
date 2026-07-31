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
import { allowedEmailDomain, allowedEmailDomains, firebaseConfig } from "./firebase-config.js";

const validGames = new Set(["quick", "times", "missing"]);
const validYearLevels = new Set([
  "prep",
  "year1",
  "year2",
  "year3",
  "year4",
  "year5",
  "year6",
  "year7",
  "year8",
  "year9",
  "year10",
  "year11",
  "year12",
]);
const configuredDomains = Array.isArray(allowedEmailDomains) && allowedEmailDomains.length
  ? allowedEmailDomains
  : [allowedEmailDomain];
const cleanAllowedDomains = configuredDomains
  .map((domain) => String(domain || "").replace(/^@/, "").trim().toLowerCase())
  .filter((domain, index, domains) => domain && !domain.startsWith("your_") && domains.indexOf(domain) === index);
const cleanAllowedDomain = cleanAllowedDomains[0] || "";
const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => value && !String(value).startsWith("YOUR_"),
);
const hasAllowedDomain = cleanAllowedDomains.length > 0;
const isConfigured = hasFirebaseConfig && hasAllowedDomain;

let studentProfile = null;
let teacherProfile = null;
let teacherApplication = null;
let accountSettings = null;
let accountUnsubscribes = [];

function announceReady() {
  window.dispatchEvent(new CustomEvent("shared-leaderboard-ready"));
}

function emailIsAllowed(email) {
  return Boolean(
    email && cleanAllowedDomains.some((domain) => email.toLowerCase().endsWith(`@${domain}`)),
  );
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

function cleanAccountType(accountType) {
  const value = String(accountType || "").trim().toLowerCase();
  return value === "student" || value === "teacher" ? value : "";
}

function makeError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function resetAccountDocuments() {
  studentProfile = null;
  teacherProfile = null;
  teacherApplication = null;
  accountSettings = null;
}

function stopWatchingAccountDocuments() {
  accountUnsubscribes.forEach((unsubscribe) => unsubscribe());
  accountUnsubscribes = [];
}

function getPublicAuthState(user) {
  const email = user?.email || "";
  const teacherYearLevels = cleanYearLevels(teacherProfile?.yearLevels);

  return {
    signedIn: Boolean(user),
    allowed: emailIsAllowed(email),
    uid: user?.uid || "",
    email,
    name: user ? getAccountName(user) : "",
    allowedEmailDomain: cleanAllowedDomain,
    allowedEmailDomains: cleanAllowedDomains,
    accountType: cleanAccountType(accountSettings?.accountType),
    studentYearLevel: cleanYearLevel(studentProfile?.yearLevel),
    teacherApproved: Boolean(teacherProfile?.approved),
    teacherYearLevels,
    teacherApplicationStatus: teacherApplication?.status || "",
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

  function teacherApplicationRef(user) {
    return doc(db, "teacherApplications", user.uid);
  }

  function accountSettingsRef(user) {
    return doc(db, "accountSettings", user.uid);
  }

  async function readAccountDocuments(user) {
    resetAccountDocuments();
    if (!user || !emailIsAllowed(user.email)) return;

    const [studentSnapshot, teacherSnapshot, applicationSnapshot, settingsSnapshot] = await Promise.all([
      getDoc(studentProfileRef(user)),
      getDoc(teacherProfileRef(user)),
      getDoc(teacherApplicationRef(user)),
      getDoc(accountSettingsRef(user)),
    ]);

    studentProfile = studentSnapshot.exists() ? studentSnapshot.data() : null;
    teacherProfile = teacherSnapshot.exists() ? teacherSnapshot.data() : null;
    teacherApplication = applicationSnapshot.exists() ? applicationSnapshot.data() : null;
    accountSettings = settingsSnapshot.exists() ? settingsSnapshot.data() : null;
  }

  function watchAccountDocuments(user) {
    stopWatchingAccountDocuments();
    resetAccountDocuments();

    if (!user || !emailIsAllowed(user.email)) return;

    const handleError = (error) => console.warn("Could not read account setup.", error);
    accountUnsubscribes = [
      onSnapshot(
        studentProfileRef(user),
        (snapshot) => {
          studentProfile = snapshot.exists() ? snapshot.data() : null;
          announceAuth(auth.currentUser);
        },
        handleError,
      ),
      onSnapshot(
        teacherProfileRef(user),
        (snapshot) => {
          teacherProfile = snapshot.exists() ? snapshot.data() : null;
          announceAuth(auth.currentUser);
        },
        handleError,
      ),
      onSnapshot(
        teacherApplicationRef(user),
        (snapshot) => {
          teacherApplication = snapshot.exists() ? snapshot.data() : null;
          announceAuth(auth.currentUser);
        },
        handleError,
      ),
      onSnapshot(
        accountSettingsRef(user),
        (snapshot) => {
          accountSettings = snapshot.exists() ? snapshot.data() : null;
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

  async function saveAccountType(user, accountType) {
    const cleanType = cleanAccountType(accountType);
    if (!cleanType) {
      throw makeError("profile/account-type-needed", "Choose Student or Teacher.");
    }

    const settingsDocument = accountSettingsRef(user);
    const existingSettings = await getDoc(settingsDocument);
    const settingsData = {
      uid: user.uid,
      name: getAccountName(user),
      email: cleanEmail(user.email),
      accountType: cleanType,
      updatedAt: serverTimestamp(),
    };

    if (existingSettings.exists()) {
      await updateDoc(settingsDocument, settingsData);
    } else {
      await setDoc(settingsDocument, {
        ...settingsData,
        createdAt: serverTimestamp(),
      });
    }
  }

  async function saveStudentYearLevel(yearLevel) {
    const user = getAllowedUser();
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

    await saveAccountType(user, "student");
    await readAccountDocuments(user);
    announceAuth(user);
    return getPublicAuthState(user);
  }

  async function applyForTeacherAccount() {
    const user = getAllowedUser();
    const applicationDocument = teacherApplicationRef(user);
    const existingApplication = await getDoc(applicationDocument);
    const applicationData = {
      uid: user.uid,
      name: getAccountName(user),
      email: cleanEmail(user.email),
      status: "pending",
      updatedAt: serverTimestamp(),
    };

    if (existingApplication.exists()) {
      await updateDoc(applicationDocument, applicationData);
    } else {
      await setDoc(applicationDocument, {
        ...applicationData,
        requestedAt: serverTimestamp(),
      });
    }

    await saveAccountType(user, "teacher");
    await readAccountDocuments(user);
    announceAuth(user);
    return getPublicAuthState(user);
  }

  async function saveTeacherYearLevels(yearLevels) {
    const user = getAllowedUser();
    const cleanLevels = cleanYearLevels(yearLevels);
    if (!cleanLevels.length) {
      throw makeError("teacher/year-levels-needed", "Choose at least one teaching year level.");
    }

    const teacherDocument = teacherProfileRef(user);
    const teacherSnapshot = await getDoc(teacherDocument);
    const currentTeacherProfile = teacherSnapshot.exists() ? teacherSnapshot.data() : null;

    if (!currentTeacherProfile?.approved) {
      throw makeError("teacher/not-approved", "A teacher account must be approved before choosing teaching year levels.");
    }

    await updateDoc(teacherDocument, {
      uid: user.uid,
      name: getAccountName(user),
      email: cleanEmail(user.email),
      approved: true,
      yearLevels: cleanLevels,
      updatedAt: serverTimestamp(),
    });

    await saveAccountType(user, "teacher");
    await readAccountDocuments(user);
    announceAuth(user);
    return getPublicAuthState(user);
  }

  async function getStudentScorePayload(user, game, score, yearLevel) {
    const cleanLevel = cleanYearLevel(yearLevel || studentProfile?.yearLevel);
    if (!cleanLevel) {
      throw makeError("profile/year-level-needed", "Choose and save your year level before submitting a score.");
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
    const teacherSnapshot = await getDoc(teacherProfileRef(user));
    const currentTeacherProfile = teacherSnapshot.exists() ? teacherSnapshot.data() : null;
    const teacherYearLevels = cleanYearLevels(currentTeacherProfile?.yearLevels);

    if (!currentTeacherProfile?.approved) {
      throw makeError("teacher/not-approved", "A teacher account must be approved before submitting teacher scores.");
    }

    if (!teacherYearLevels.length) {
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
    applyForTeacherAccount,
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
      const accountType = cleanAccountType(accountSettings?.accountType);
      if (!accountType) {
        throw makeError("profile/account-type-needed", "Choose Student or Teacher before submitting a score.");
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
