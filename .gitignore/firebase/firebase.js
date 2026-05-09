import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyALfNIX5fpVr2_vca8-lhTJCGvIi8cCxFg",
  authDomain: "mali-bc9c5.firebaseapp.com",
  projectId: "mali-bc9c5",
  storageBucket: "mali-bc9c5.firebasestorage.app",
  messagingSenderId: "972332984504",
  appId: "1:972332984504:web:8aeabd02bbe7320a40ec4d",
  measurementId: "G-R4H1Z6R4H4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };