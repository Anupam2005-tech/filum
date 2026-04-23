'use client';

import React from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { LogoMark } from '@/components/ui/Logo';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export function LoginScreen() {
  const { signInWithGoogle, signInWithGithub } = useAuth();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-bg-primary overflow-hidden selection:bg-white selection:text-black">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-[50%] h-[50%] bg-white/10 blur-[120px] rounded-full" 
        />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <LogoMark size="large" className="mb-8" />
          
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.4em] text-white/30 uppercase"
            >
              <Sparkles className="w-3 h-3" />
              Neural Link Protocol
            </motion.div>
            <h1 className="text-5xl font-black tracking-tighter leading-none bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              FILUM<span className="text-white/20">.</span>
            </h1>
            <p className="text-sm text-fg-secondary font-medium tracking-tight opacity-60">
              Access your autonomous career infrastructure
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={signInWithGoogle}
            className="group w-full flex items-center justify-between bg-white text-black px-8 py-5 rounded-2xl text-xs font-black tracking-[0.1em] uppercase hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] active:scale-98 transition-all"
          >
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#000"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000"/>
              </svg>
              Establish via Google
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>

          <button 
            onClick={signInWithGithub}
            className="group w-full flex items-center justify-between bg-bg-secondary border border-border-primary text-white px-8 py-5 rounded-2xl text-xs font-black tracking-[0.1em] uppercase hover:bg-bg-tertiary hover:border-white/20 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Establish via GitHub
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-[9px] font-black tracking-[0.3em] text-fg-muted uppercase">
            Protocol: SECURE-RSA-4096 • SHA-256
          </p>
          <div className="flex items-center justify-center gap-4 text-[9px] font-black tracking-widest text-white/20 uppercase">
            <span>Privacy</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Infrastructure</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
