// Firebase web app identifiers. These are safe to publish; access is controlled
// by Firebase Authentication and Firestore Security Rules.
export const firebaseConfig = {
  apiKey: "AIzaSyDVFgCMWxw2R20TXLV71LvpMH9tLMjm3JY",
  authDomain: "bayside-maths-challenge.firebaseapp.com",
  projectId: "bayside-maths-challenge",
  storageBucket: "bayside-maths-challenge.firebasestorage.app",
  messagingSenderId: "976100526278",
  appId: "1:976100526278:web:098b782ddb09aaefe56fc7",
  measurementId: "G-P3R47GE24L",
};

// Only Google accounts whose email ends with one of these domains can submit
// shared leaderboard scores. Student/teacher roles are assigned by domain.
export const studentEmailDomain = "bcc.vic.edu.au";
export const teacherEmailDomain = "baysidecc.vic.edu.au";
export const allowedEmailDomains = [studentEmailDomain, teacherEmailDomain];

// Kept as the primary domain for older code paths and display fallbacks.
export const allowedEmailDomain = allowedEmailDomains[0];
