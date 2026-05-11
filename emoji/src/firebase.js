// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBMj9Znk224FTBtpevTfuEPBqaqNgWbMZ4",
  authDomain: "chatbot-e1266.firebaseapp.com",
  projectId: "chatbot-e1266",
  storageBucket: "chatbot-e1266.firebasestorage.app",
  messagingSenderId: "654348571918",
  appId: "1:654348571918:web:5976742bd26f16536ff35f"
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw error;
}

export { db };
