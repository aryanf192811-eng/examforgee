import { create } from 'zustand';
import type { ProfileResponse } from '../../types';
import { auth, firebaseSignOut, onIdTokenChanged, type FirebaseUser } from '../firebase';

interface AuthState {
  user: ProfileResponse | null;
  idToken: string | null;
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  setUser: (user: ProfileResponse | null) => void;
  setIdToken: (token: string | null) => void;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setAuthLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  idToken: null,
  firebaseUser: null,
  isAuthLoading: true,

  setUser: (user) => set({ user }),
  setIdToken: (idToken) => set({ idToken }),
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Firebase sign out failed — clear state anyway
    }
    set({ user: null, idToken: null, firebaseUser: null });
  },
}));

// Subscribe to Firebase token changes — keeps idToken always current
onIdTokenChanged(auth, async (firebaseUser) => {
  const store = useAuthStore.getState();
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken();
    store.setFirebaseUser(firebaseUser);
    store.setIdToken(token);
  } else {
    store.setFirebaseUser(null);
    store.setIdToken(null);
    store.setUser(null);
  }
  store.setAuthLoading(false);
});
