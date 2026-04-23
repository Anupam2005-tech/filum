'use client';

import React, { useState } from 'react';
import { Search, Globe, Target, X, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/firebase/AuthContext';

export function HuntModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [role, setRole] = useState('Software Engineer Intern');
  const [platforms, setPlatforms] = useState(['LinkedIn', 'Unstop']);
  const [isHunting, setIsHunting] = useState(false);

  if (!isOpen) return null;

  const handleTriggerHunt = async () => {
    if (!user) return;
    setIsHunting(true);
    try {
      const formData = new FormData();
      formData.append('user_id', user.uid);
      
      // First, update the profile with the new target role from the modal
      const profileData = new FormData();
      profileData.append('user_id', user.uid);
      profileData.append('role', role);
      profileData.append('locations', 'Remote, Global'); // Simplified for now

      await fetch('http://localhost:8000/user/profile', {
        method: 'POST',
        body: profileData,
      });

      const res = await fetch('http://localhost:8000/ai/discover', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to trigger hunt");
      
      alert("AI Crew Activated! Your search is now running in the background.");
      onClose();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsHunting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
           <div className="p-6">
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Target className="text-black w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Initialize AI Hunt</h2>
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[var(--fg-muted)]">Configure ScraperAgent</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-[var(--fg-muted)] hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-black text-[var(--fg-muted)] mb-3 block tracking-widest">Target Role</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white transition-all font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[var(--fg-muted)] mb-3 block tracking-widest">Active Platforms</label>
                <div className="grid grid-cols-2 gap-3">
                  {['LinkedIn', 'Unstop', 'Internshala', 'Wellfound'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                      className={`
                        p-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between
                        ${platforms.includes(p) ? 'border-white bg-white text-black' : 'border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--fg-muted)] hover:border-white/30'}
                      `}
                    >
                      {p}
                      <Globe className={`w-3 h-3 ${platforms.includes(p) ? 'text-black' : 'text-[var(--fg-muted)]'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

             <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">
              <button 
                onClick={handleTriggerHunt}
                disabled={isHunting}
                className="w-full bg-white text-black py-4 rounded-xl font-black text-sm hover:bg-[var(--fg-secondary)] transition-all flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(255,255,255,0.1)] disabled:opacity-50"
              >
                {isHunting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-current" />
                )}
                {isHunting ? 'ACTIVATING CREW...' : 'ACTIVATE DISCOVERY CREW'}
              </button>
              <p className="text-center text-[9px] text-[var(--fg-muted)] mt-4 uppercase tracking-[0.1em]">
                Estimating 2-3 minutes for deep structural analysis
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
