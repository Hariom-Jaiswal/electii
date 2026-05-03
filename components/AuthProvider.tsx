'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { trackAuthEvent } from '@/lib/analytics';

interface AuthContextType {
  /** The currently signed-in Firebase user, or null if unauthenticated. */
  user: User | null;
  /** True while the initial auth state is being resolved. */
  loading: boolean;
  /** Initiates Google OAuth popup sign-in. */
  signInWithGoogle: () => Promise<void>;
  /** Signs the current user out. */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Wraps the app with Firebase Authentication state.
 * Must be placed in the component tree above any component that calls `useAuth`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    await signInWithPopup(auth, provider);
    trackAuthEvent('login', 'google');
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    trackAuthEvent('logout', 'google');
  }, []);

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signOut }),
    [user, loading, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Returns the current authentication context.
 * Must be used inside an `<AuthProvider>`.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>.');
  }
  return context;
}
