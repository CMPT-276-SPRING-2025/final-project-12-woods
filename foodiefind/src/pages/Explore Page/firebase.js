// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnyQXy4kM2CP5XDR0LyyuRkSjfy-zu2sI",
  authDomain: "foodiefind-c3574.firebaseapp.com",
  databaseURL: "https://foodiefind-c3574-default-rtdb.firebaseio.com",
  projectId: "foodiefind-c3574",
  storageBucket: "foodiefind-c3574.firebasestorage.app",
  messagingSenderId: "273464184708",
  appId: "1:273464184708:web:e9fd9616712462d64ed7d1",
  measurementId: "G-EX5LLRC686"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database };
