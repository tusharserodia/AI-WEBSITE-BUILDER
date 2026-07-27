// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-4f424.firebaseapp.com",
  projectId: "genwebai-4f424",
  storageBucket: "genwebai-4f424.firebasestorage.app",
  messagingSenderId: "679083365641",
  appId: "1:679083365641:web:e5e587956b3167de75afd8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);

const provider = new GoogleAuthProvider();

export {auth,provider}