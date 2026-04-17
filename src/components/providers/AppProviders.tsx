'use client';

import React from 'react';
import { AuthProvider } from '@/lib/firebase/AuthContext';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAGG-v3S_S9mBAtU_L7pA_SReCHS';
  
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </GoogleReCaptchaProvider>
  );
}
