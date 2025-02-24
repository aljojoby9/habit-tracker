import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDw0M5fGZl5djSR0pPBBO5mdWxrgTzYlwg",
  authDomain: "keralaweatherai.firebaseapp.com",
  projectId: "project-1007225899762", // Updated project ID
  storageBucket: "keralaweatherai.firebasestorage.app",
  messagingSenderId: "1007225899762",
  appId: "1:1007225899762:web:d7bca6747d1653887ade6b",
  measurementId: "G-JSDTPX5TPS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);