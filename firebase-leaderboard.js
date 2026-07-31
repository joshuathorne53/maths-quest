import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import {
  addDoc,
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { allowedEmailDomain, firebaseConfig } from "./firebase-config.js";

const validGames = new Set(["quick", "times", "missing"]);
const cleanAllowedDomain = String(allowedEmailDomain || "")
  .replace(/^@/, "")
  .trim()
  .toLowerCase();
const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => value && !String(value).startsWith("YOUR_"),
);
const hasAllowedDomain = cleanAllowedDomain && !cleanAllowedDomain.startsWith("your_");
const isConfigured = hasFirebaseConfig && hasAllowedDomain;

function announceReady() {
  window.dispatchEvent(new CustomEvent("shared-leaderboard-ready"));
}

function emailIsAllowed(email) {
  return Boolean(email && email.toLowerCase().endsWith(`@${cleanAllowedDomain}`));
}

function getPublicAuthState(user) {
  const email = user?.email || "";

  return {
    signedIn: Boolean(user),
    allowed: emailIsAllowed(email),
    email,
    allowedEmailDomain: cleanAllowedDomain,
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
  };
  announceReady();
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ hd: cleanAllowedDomain });

  onAuthStateChanged(auth, announceAuth);

  async function signInWithSchoolGoogle() {
    const credential = await signInWithPopup(auth, provider);

    if (!emailIsAllowed(credential.user.email)) {
      await signOut(auth);
      throw new Error(`Please sign in with your @${cleanAllowedDomain} Google account.`);
    }

    return getPublicAuthState(credential.user);
  }

  function getAllowedUser() {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Sign in with Google before submitting a leaderboard score.");
    }

    if (!emailIsAllowed(user.email)) {
      throw new Error(`Only @${cleanAllowedDomain} accounts can submit leaderboard scores.`);
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

    async addScore(game, name, score) {
      const user = getAllowedUser();
      const document = await addDoc(scoreCollection(game), {
        name,
        score,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      return document.id;
    },
  };

  announceReady();
}
