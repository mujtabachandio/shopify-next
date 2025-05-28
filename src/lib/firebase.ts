import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBdO89-INHQJLfWXq6vkaSfodXMY_wttcM",
  authDomain: "sasta-bazar-8b625.firebaseapp.com",
  projectId: "sasta-bazar-8b625",
  storageBucket: "sasta-bazar-8b625.firebasestorage.app",
  messagingSenderId: "683254419384",
  appId: "1:683254419384:web:20771c0b35ab44a6b7094d",
  measurementId: "G-522MZ2MTY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, analytics }; 