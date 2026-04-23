'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  deleteUser
} from 'firebase/auth';
import { auth } from './config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isOnboardingComplete: boolean | null;
  setIsOnboardingComplete: (status: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isOnboardingComplete: null,
  setIsOnboardingComplete: () => {},
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
  signOut: async () => {},
  deleteAccount: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  const fetchOnboardingStatus = async (uid: string) => {
    try {
      // Check localStorage first
      const localData = localStorage.getItem(`onboarding_${uid}`);
      if (localData === 'true') {
        setIsOnboardingComplete(true);
        return;
      }

      const res = await fetch(`http://localhost:8000/user/status/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setIsOnboardingComplete(data.isOnboardingComplete);
        if (data.isOnboardingComplete) {
          localStorage.setItem(`onboarding_${uid}`, 'true');
        }
      }
    } catch (err) {
      console.warn("Failed to fetch onboarding status:", err);
    }
  };

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not configured.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setUser(usr);
      if (usr) {
        await syncUserWithBackend(usr);
        await fetchOnboardingStatus(usr.uid);
      } else {
        setIsOnboardingComplete(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserWithBackend = async (usr: User) => {
    try {
      await fetch('http://localhost:8000/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: usr.uid,
          email: usr.email,
          displayName: usr.displayName,
          photoURL: usr.photoURL,
        }),
      });
    } catch (error) {
      console.error("Error syncing user with backend:", error);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      alert("Firebase Auth not configured.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      alert(error.message || "Failed to sign in with Google.");
    }
  };

  const signInWithGithub = async () => {
    if (!auth) {
      alert("Firebase Auth not configured.");
      return;
    }
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("GitHub sign-in error:", error);
      alert(error.message || "Failed to sign in with GitHub.");
    }
  };

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
  };

  const deleteAccount = async () => {
    if (!auth || !auth.currentUser) {
      alert("No authenticated user found.");
      return;
    }

    const userId = auth.currentUser.uid;

    try {
      const response = await fetch(`http://localhost:8000/user/account/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete account data from server.");
      }

      await deleteUser(auth.currentUser);
      setUser(null);
      alert("Your account has been permanently deleted.");
    } catch (e: any) {
      console.error("Account deletion error:", e);
      alert(`Error deleting account: ${e.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isOnboardingComplete,
      setIsOnboardingComplete,
      signInWithGoogle, 
      signInWithGithub, 
      signOut, 
      deleteAccount 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
