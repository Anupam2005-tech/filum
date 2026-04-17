'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  deleteUser
} from 'firebase/auth';
import { auth } from './config';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    getRedirectResult(auth).catch((error) => {
      console.error("Redirect auth error:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      // If user logs in, redirect to dashboard
      if (usr && !user) {
        router.push('/');
      }
      setUser(usr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, router]);

  const verifyBotStatus = async () => {
    if (!executeRecaptcha) return true;
    
    try {
      const token = await executeRecaptcha?.('login');
      if (!token) return false;

      const response = await fetch('http://localhost:8000/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      if (!response.ok) {
        console.warn("Backend verification failed, but allowing proceed in dev mode.");
        return true; 
      }

      const data = await response.json();
      return data.success;
    } catch (e) {
      // Graceful degradation: if backend is down on localhost, allow login for development
      if (e instanceof TypeError && e.message === 'Failed to fetch' && window.location.hostname === 'localhost') {
        console.warn("reCAPTCHA Backend unreachable. Bypassing verification for local development.");
        return true;
      }
      console.error("reCAPTCHA verification error:", e);
      return false;
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      alert("Firebase Config missing required keys.");
      return;
    }
    
    const isHuman = await verifyBotStatus();
    if (!isHuman) {
      alert("Bot detected or verification failed. Please try again.");
      return;
    }

    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const signInWithGithub = async () => {
    if (!auth) {
      alert("Firebase Config missing required keys.");
      return;
    }
    
    const isHuman = await verifyBotStatus();
    if (!isHuman) {
      alert("Bot detected or verification failed. Please try again.");
      return;
    }

    const provider = new GithubAuthProvider();
    await signInWithRedirect(auth, provider);
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
      // 1. Delete data from backend
      const response = await fetch(`http://localhost:8000/user/account/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete account data from server.");
      }

      // 2. Delete user from Firebase Auth
      await deleteUser(auth.currentUser);
      
      setUser(null);
      router.push('/login');
      alert("Your account has been permanently deleted.");
    } catch (e: any) {
      console.error("Account deletion error:", e);
      alert(`Error deleting account: ${e.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithGithub, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
