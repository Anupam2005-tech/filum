'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoginScreen } from './LoginScreen';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Loader2 } from 'lucide-react';
import { PuterAssistant } from '../ai/PuterAssistant';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [mockLogin, setMockLogin] = useState(false);

  useEffect(() => {
    const handleMockLogin = () => setMockLogin(true);
    window.addEventListener('mock-login', handleMockLogin);
    return () => window.removeEventListener('mock-login', handleMockLogin);
  }, []);

  if (loading && !mockLogin) {
    return (
      <div className="flex h-screen items-center justify-center bg-(--bg-primary)">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user && !mockLogin) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen w-full bg-(--bg-primary) text-(--fg-primary) overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-width mx-auto">
            {children}
          </div>
        </main>
      </div>
      <PuterAssistant />
    </div>
  );
}

