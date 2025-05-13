import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW6GmifRk4VjMnuxRqdU06Qtx3bY_mUQA",
  authDomain: "drivergo-3a181.firebaseapp.com",
  projectId: "drivergo-3a181",
  storageBucket: "drivergo-3a181.firebasestorage.app",
  messagingSenderId: "464810468918",
  appId: "1:464810468918:web:0c0ea804d89109ee04da97",
  measurementId: "G-NGQNVTHPJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
