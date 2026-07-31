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

function announceReady() {
  window.dispatchEvent(new CustomEvent("shared-leaderboard-ready"));
}

function emailIsAllowed(email) {
  return Boolean(
    email && cleanAllowedDomains.some((domain) => email.toLowerCase().endsWith(`@${domain}`)),
  );
}

function getAccountName(user) {
  return user?.displayName || user?.email?.split("@")[0] || "Student";
}

function getPublicAuthState(user) {
  const email = user?.email || "";

  return {
    signedIn: Boolean(user),
    allowed: emailIsAllowed(email),
    email,
    name: user ? getAccountName(user) : "",
    allowedEmailDomain: cleanAllowedDomain,
    allowedEmailDomains: cleanAllowedDomains,
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

  onAuthStateChanged(auth, announceAuth);

  async function signInWithSchoolGoogle() {
    await persistenceReady;
    const credential = await signInWithPopup(auth, provider);

    if (!emailIsAllowed(credential.user.email)) {
      await signOut(auth);
      throw new Error("Please sign in with an approved school Google account.");
    }

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

  window.sharedLeaderboard = {
    isConfigured: true,
    allowedEmailDomain: cleanAllowedDomain,
    allowedEmailDomains: cleanAllowedDomains,
    getAuthState: () => getPublicAuthState(auth.currentUser),
    signIn: signInWithSchoolGoogle,
    signOut: () => signOut(auth),

    listen(game, onScores, onError) {
      const topScores = query(scoreCollection(game), orderBy("score", "desc"), limit(20));

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

    async addScore(game, score) {
      const user = getAllowedUser();
      const scoreDocument = doc(scoreCollection(game), user.uid);
      const existingScore = await getDoc(scoreDocument);
      const existingData = existingScore.exists() ? existingScore.data() : null;
      const previousScore = Number.isInteger(existingData?.score) ? existingData.score : null;

      if (previousScore !== null && score <= previousScore) {
        return {
          id: user.uid,
          improved: false,
          previousScore,
          score: previousScore,
        };
      }

      if (existingScore.exists()) {
        await updateDoc(scoreDocument, {
          name: getAccountName(user),
          score,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(scoreDocument, {
          name: getAccountName(user),
          score,
          uid: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      return {
        id: user.uid,
        improved: true,
        previousScore,
        score,
      };
    },
  };

  announceReady();
}
