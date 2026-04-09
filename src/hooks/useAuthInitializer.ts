import { useEffect } from 'react';
import { useAuthStore } from '../lib/store/authStore';
import { getMe } from '../lib/api';

/**
 * Hook to initialize the authentication state and sync with the backend profile.
 * This ensures that on page refresh, if a Firebase session persists, 
 * the corresponding backend profile is re-fetched.
 */
export function useAuthInitializer() {
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  useEffect(() => {
    // We only trigger the sync if:
    // 1. Initial auth check (isAuthLoading) is done
    // 2. We have a firebase user (logged in via Firebase)
    // 3. We DON'T have a backend user profile yet (new session/refresh)
    if (!isAuthLoading && firebaseUser && !user) {
      const fetchProfile = async () => {
        try {
          console.log('[AuthInitializer] Firebase user detected, fetching backend profile...');
          const profile = await getMe();
          setUser(profile);
          console.log('[AuthInitializer] Profile sync successful');
        } catch (err) {
          console.error('[AuthInitializer] Failed to fetch backend profile:', err);
        }
      };

      fetchProfile();
    }
  }, [firebaseUser, user, isAuthLoading, setUser]);
}
