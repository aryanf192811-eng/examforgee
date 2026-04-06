import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} as const;

const requiredConfig = Object.entries(firebaseConfig).filter(([, value]) => !value?.trim());

if (requiredConfig.length > 0) {
  const missingKeys = requiredConfig.map(([key]) => key).join(', ');
  throw new Error(
    `ExamForge Firebase configuration is incomplete. Missing: ${missingKeys}. ` +
      'Check Vercel Production environment variables and redeploy without build cache.',
  );
}

if (import.meta.env.DEV) {
  console.log('[ExamForge] Firebase config check:', {
    apiKey: firebaseConfig.apiKey ? 'set' : 'missing',
    authDomain: firebaseConfig.authDomain ? 'set' : 'missing',
    projectId: firebaseConfig.projectId ? 'set' : 'missing',
    storageBucket: firebaseConfig.storageBucket ? 'set' : 'missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? 'set' : 'missing',
    appId: firebaseConfig.appId ? 'set' : 'missing',
  });
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
export default app;

export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signupWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const logout = () => signOut(auth);

export const getIdToken = async (): Promise<string> => {
  const user = auth?.currentUser;
  if (!user) return '';
  return user.getIdToken();
};

export { onAuthStateChanged, onIdTokenChanged };
export type { User };
