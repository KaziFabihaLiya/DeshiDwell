const { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } = require("firebase/auth");
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