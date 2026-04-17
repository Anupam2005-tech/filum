'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Plus, User, Command } from 'lucide-react';
import { motion } from 'framer-motion';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard Overview',
  '/resume': 'Candidate Persona',
  '/settings': 'Account Settings',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Filum';

  return (
    <header className="h-24 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl px-8 sticky top-0 z-40">
      <div className="max-w-width mx-auto h-full flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
           <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
             <Command className="w-5 h-5 text-white" />
           </div>
           <div>
             <h2 className="text-lg font-black tracking-tight">{title}</h2>
             <p className="text-[10px] text-fg-muted font-bold uppercase tracking-widest leading-none mt-1">
               System Version 4.0.2
             </p>
           </div>
        </motion.div>

        <div className="flex items-center gap-8">
          {/* Enhanced Search */}
          <div className="hidden md:flex relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Query system database..." 
              className="bg-bg-secondary/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-white/20 focus:bg-bg-secondary transition-all w-80 font-medium placeholder:text-fg-muted/50"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-3 hover:bg-white/5 rounded-2xl text-fg-muted hover:text-white transition-all group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full border-2 border-bg-primary" />
            </button>
            
            <div className="h-8 w-px bg-white/5 hidden sm:block" />

            <button className="flex items-center gap-3 p-1 pr-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all group">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-black/5">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Anupam</p>
                <p className="text-[9px] text-fg-muted font-bold mt-1">Premium Tier</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
