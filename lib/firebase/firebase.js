// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi91PtiSgCsEnW5Z2qoENbfpncDGwY4R8",
  authDomain: "pet-search-and-rescue.firebaseapp.com",
  projectId: "pet-search-and-rescue",
  storageBucket: "pet-search-and-rescue.firebasestorage.app",
  messagingSenderId: "571837295332",
  appId: "1:571837295332:web:7cabacd2bef12e16581af1",
  measurementId: "G-KE2ZSF6JPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);