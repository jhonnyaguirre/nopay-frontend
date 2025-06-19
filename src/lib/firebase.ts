// Import the functions you need from the SDKs you need
//import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJjMZUmHAV0Qje5HuiStNtk0um8SF3BpY",
  authDomain: "nopay-2c118.firebaseapp.com",
  projectId: "nopay-2c118",
  storageBucket: "nopay-2c118.firebasestorage.app",
  messagingSenderId: "152457533506",
  appId: "1:152457533506:web:84e60fec2a4ddc34b6b5db",
  measurementId: "G-8ZNKHC9GNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };