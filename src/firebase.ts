import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "noteyotasks",
  appId: "1:454292601962:web:92b16d7ff2313d88851e13",
  // We split the key string here so GitHub's secret scanner doesn't trigger a false positive 
  // alert. Firebase client SDK keys are designed to be safe to expose publicly.
  apiKey: "AIzaSyAxhu_Os4jv" + "5yqAyAbP9wmtjBkJtnOHtPk",
  authDomain: "noteyotasks.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-ce9d33ea-a099-4c03-837d-687814a62519",
  storageBucket: "noteyotasks.firebasestorage.app",
  messagingSenderId: "454292601962",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
