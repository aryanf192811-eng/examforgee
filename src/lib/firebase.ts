import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  onIdTokenChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} as const;

// Validation for environment variables
const requiredConfig = Object.entries(firebaseConfig).filter(([, value]) => !value?.trim());

if (requiredConfig.length > 0 && !import.meta.env.SSR) {
  const missingKeys = requiredConfig.map(([key]) => key).join(', ');
  console.warn(
    `ExamForge Firebase configuration is incomplete. Missing: ${missingKeys}. ` +
    'Authentication features may be disabled. Check your .env or Vercel environment variables.'
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  app, 
  auth, 
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  onIdTokenChanged
};

/**
 * Returns the current user's ID token, or null if not authenticated.
 * Forces a refresh if specified.
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

export type { FirebaseUser };
export default app;
