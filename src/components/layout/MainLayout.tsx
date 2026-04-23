'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoginScreen } from './LoginScreen';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:8000';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isOnboardingComplete } = useAuth();
  const router = useRouter();
  const pathname = usePathname();


  // Handle Redirection Logic
  useEffect(() => {
    if (loading || isOnboardingComplete === null) return;

    if (user) {
      // If at root, go to dashboard or onboarding
      if (pathname === '/') {
        router.push(isOnboardingComplete ? '/dashboard' : '/onboarding');
      }
      // If onboarding is complete and we are on onboarding page, go to dashboard
      else if (isOnboardingComplete && pathname === '/onboarding') {
        router.push('/dashboard');
      }
    } else if (pathname !== '/') {
      router.push('/');
    }
  }, [user, loading, isOnboardingComplete, pathname, router]);

  if (loading || (user && isOnboardingComplete === null)) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <div className="text-center space-y-6">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto opacity-20" />
          <p className="text-[10px] font-black tracking-[0.4em] text-fg-muted uppercase">Synchronizing Session...</p>
        </div>
      </div>
    );
  }

  // Not logged in: Always show LoginScreen at root
  if (!user) {
    return <LoginScreen />;
  }

  // Onboarding phase: Show children (which will be the Onboarding component from the page)
  // We don't show the shell (sidebar/header) during onboarding
  if (pathname === '/onboarding') {
    return (
      <div className="min-h-screen w-full bg-bg-primary overflow-auto">
        {children}
      </div>
    );
  }

  // Authenticated Shell
  return (
    <div className="flex h-screen w-full bg-bg-primary text-fg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
         <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-[var(--container-width)] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
