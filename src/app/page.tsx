'use client';

import React, { useState } from 'react';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { CrewPipeline } from '@/components/dashboard/CrewPipeline';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { TopMatches } from '@/components/dashboard/TopMatches';
import { HuntModal } from '@/components/dashboard/HuntModal';
import { Sparkles, ArrowUpRight, Zap, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [isHuntModalOpen, setIsHuntModalOpen] = useState(false);

  return (
    <div className="space-y-10 pb-20 max-w-width mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome & Action Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 text-[10px] font-black text-fg-muted uppercase tracking-[0.3em] mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Neural Engine Synchronized
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none">
            Dashboard<span className="text-fg-muted">.</span>
          </h1>
          <p className="text-fg-secondary mt-4 font-bold text-lg max-w-xl">
            Autonomous agents are orchestrating your internship search across <span className="text-white underline decoration-white/20 underline-offset-4 pointer-events-none">32 high-value platforms</span>.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={() => setIsHuntModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-fg-secondary transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] group"
          >
            <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            TRIGGER NEW HUNT
          </button>
        </motion.div>
      </section>

      {/* Stats Overview */}
      <StatsGrid />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column: Pipeline & Activity */}
        <div className="xl:col-span-8 space-y-10">
          <section className="glass-panel p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tight">Agent Pipeline</h3>
                <p className="text-[10px] text-fg-muted uppercase font-black tracking-widest mt-1">Real-time Orchestration</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase text-fg-muted">
                4 Active Workers
              </div>
            </div>
            <CrewPipeline />
          </section>

          <ActivityFeed />
        </div>

        {/* Right Column: Top Matches & Quick Stats */}
        <div className="xl:col-span-4 space-y-10">
          <TopMatches />
          
          <div className="glass-panel p-8 bg-linear-to-br from-bg-secondary to-bg-tertiary border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-24 h-24" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-fg-muted mb-4">AI Projections</h4>
            <p className="text-3xl font-black tracking-tighter mb-2">92% Match</p>
            <p className="text-xs text-fg-muted leading-relaxed font-bold">
              Based on your current resume and preferences, you are in the top 10% of candidates for <span className="text-white">Full Stack</span> roles.
            </p>
            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-fg-muted">Optimization Score</span>
              <span className="text-sm font-black text-white">88/100</span>
            </div>
          </div>
        </div>
      </div>

      <HuntModal isOpen={isHuntModalOpen} onClose={() => setIsHuntModalOpen(false)} />
    </div>
  );
}

