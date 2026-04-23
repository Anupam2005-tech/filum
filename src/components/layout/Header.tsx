'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/resume': 'Profile',
  '/jobs': 'Job Matches',
  '/settings': 'Settings',
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = pageTitles[pathname] || 'Filum';

  return (
    <header className="h-20 border-b border-white/5 bg-[var(--bg-primary)] px-8">
      <div className="max-w-[var(--container-width)] mx-auto h-full flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-black tracking-tight">{title}</h2>
        </motion.div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-white/5 rounded-xl text-[var(--fg-muted)] hover:text-white transition-all">
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tight">{user?.displayName?.split(' ')[0] || 'User'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
