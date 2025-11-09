// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWtAg8SvzUHfG4b3bvElgdwm-5j3FQXsI",
  authDomain: "moviemaster-milon.firebaseapp.com",
  projectId: "moviemaster-milon",
  storageBucket: "moviemaster-milon.firebasestorage.app",
  messagingSenderId: "620518314729",
  appId: "1:620518314729:web:78c6e9cda1254d94195678",
  measurementId: "G-3SSVDXNGLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only if supported (e.g., not in SSR or localhost without HTTPS)
let analytics = null;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch(() => {
  // Analytics not supported, continue without it
});

export { analytics };
export default app;