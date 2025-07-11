// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeR2dJb9_8huW-DjaSEuDmGmEuraLfUTw",
  authDomain: "appointment-app-3c5c2.firebaseapp.com",
  projectId: "appointment-app-3c5c2",
  storageBucket: "appointment-app-3c5c2.firebasestorage.app",
  messagingSenderId: "897691048572",
  appId: "1:897691048572:web:48be4cc1f2b72d31bdc7f9",
  measurementId: "G-MEYJL7HHJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);