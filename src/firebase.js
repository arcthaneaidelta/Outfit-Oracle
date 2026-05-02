import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC4bUrMTke5ckCWg9M3Tj1K3xVP5Jf_TcE",
  authDomain: "outfitoracle-c8b61.firebaseapp.com",
  projectId: "outfitoracle-c8b61",
  storageBucket: "outfitoracle-ae6ab.firebasestorage.app",
  messagingSenderId: "766477420343",
  appId: "1:766477420343:web:dc5263b9a17c2b7df2bcb2",
  measurementId: "G-RTYCESYQYM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;