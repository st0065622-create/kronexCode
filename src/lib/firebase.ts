import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize or reuse Firebase app instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

/**
 * Custom hook / helper function to sign in with Google Popup
 */
export const signInWithGoogle = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google Sign In Error:", error);
    throw error;
  }
};

/**
 * Sign out helper
 */
export const logoutFirebase = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export { 
  signInWithPopup, 
  firebaseSignOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
};
export type { User };
