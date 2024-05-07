// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAneFtRu-sOD-nMYdfiUA4z6GmCUV2nFGg",
    authDomain: "wordle-7e1da.firebaseapp.com",
    projectId: "wordle-7e1da",
    storageBucket: "wordle-7e1da.appspot.com",
    messagingSenderId: "807535112213",
    appId: "1:807535112213:web:940af30db8c5022c135e1c",
    measurementId: "G-Y75K7FKEEH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
