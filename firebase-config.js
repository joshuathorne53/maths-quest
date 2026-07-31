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

// Only Google accounts whose email ends with this domain can submit shared
// leaderboard scores. Use the part after the @ symbol, for example:
// "student.school.edu.au"
export const allowedEmailDomain = "bcc.vic.edu.au";
