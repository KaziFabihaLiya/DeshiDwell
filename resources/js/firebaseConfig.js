// Import the functions you need from the Firebase SDK
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } = require("firebase/auth");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCl-xOD-39GtZgr5oRc_HPnN-BeiRQ-elo",
    authDomain: "deshidwell.firebaseapp.com",
    projectId: "deshidwell",
    storageBucket: "deshidwell.firebasestorage.app",
    messagingSenderId: "475231892984",
    appId: "1:475231892984:web:2dc8d27ff9a56083bad20d",
    measurementId: "G-ERE6H7DW5R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Auth

// Function to handle user login
const loginUser  = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User  signed in:', userCredential.user);
        return userCredential.user; // Return user data
    } catch (error) {
        console.error('Authentication error:', error.message);
        throw error; // Rethrow the error for handling in the calling function
    }
};

// Export app, analytics, and loginUser  for use in other files
module.exports = { app, analytics, loginUser , auth, GoogleAuthProvider, signInWithPopup };