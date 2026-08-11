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

// Teacher roles are assigned by domain. Student year levels and score access
// are locked from Firestore's studentDirectory collection.
export const studentEmailDomain = "bcc.vic.edu.au";
export const teacherEmailDomain = "baysidecc.vic.edu.au";
export const allowedEmailDomains = [studentEmailDomain, teacherEmailDomain];
export const adminEmail = "joshua.thorne@baysidecc.vic.edu.au";
export const yearLevelRequestEmail = adminEmail;

// Kept as the primary domain for older code paths and display fallbacks.
export const allowedEmailDomain = allowedEmailDomains[0];
