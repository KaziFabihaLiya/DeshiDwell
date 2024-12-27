// Ensure Firebase scripts are loaded
if (typeof firebase !== "undefined") {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCl-xOD-39GtZgr5oRc_HPnN-BeiRQ-elo",
    authDomain: "deshidwell.firebaseapp.com",
    projectId: "deshidwell",
    storageBucket: "deshidwell.appspot.com",
    messagingSenderId: "475231892984",
    appId: "1:475231892984:web:2dc8d27ff9a56083bad20d",
    measurementId: "G-ERE6H7DW5R"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized:', firebase.apps.length > 0);
} else {
  console.error('Firebase SDK not loaded.');
}
