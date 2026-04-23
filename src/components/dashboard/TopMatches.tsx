'use client';

import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopMatchesProps {
  matches?: any[];
}

export function TopMatches({ matches: propMatches }: TopMatchesProps) {
  const defaultMatches = [
    { id: 1, company: 'Google', role: 'Software Engineer Intern', score: 98, platform: 'LinkedIn', initial: 'G' },
    { id: 2, company: 'Amazon', role: 'SDE Intern', score: 94, platform: 'Handshake', initial: 'A' },
    { id: 3, company: 'Zomato', role: 'Product Intern', score: 89, platform: 'Unstop', initial: 'Z' },
    { id: 4, company: 'TCS', role: 'Digital Intern', score: 82, platform: 'Direct', initial: 'T' },
  ];

  const matches = propMatches?.length ? propMatches.map((m: any, i: number) => ({
    id: i,
    company: m.company || 'Unknown',
    role: m.role || 'Position',
    score: m.score || 0,
    platform: m.platform || 'Direct',
    initial: (m.company || '?')[0]?.toUpperCase() || '?'
  })) : defaultMatches;

  return (
    <div className="glass-panel flex flex-col h-[500px]">
      <div className="p-6 border-b border-white/5 bg-bg-secondary/30">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-fg-muted flex items-center justify-between">
          <span>Target Matches</span>
          <span className="flex items-center gap-1.5 lowercase font-mono opacity-50">
            <span className="w-1 h-1 rounded-full bg-green-500" />
            Live Update
          </span>
        </h3>
      </div>

      <div className="flex-1 overflow-auto divide-y divide-white/5 scrollbar-hide">
        {matches.map((job: any, i: number) => (
          <motion.div 
            key={job.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 hover:bg-white/3 transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center font-black text-lg shadow-xl group-hover:scale-110 transition-transform">
                  {job.initial}
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight group-hover:text-white transition-colors">{job.company}</h4>
                  <p className="text-[10px] text-fg-muted font-bold tracking-wider uppercase">{job.platform}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black tracking-tighter flex items-center gap-1.5 justify-end">
                  {job.score}%
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-fg-muted">Match Score</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <p className="text-[11px] font-bold text-fg-secondary truncate max-w-[180px]">{job.role}</p>
              <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-fg-muted hover:text-white transition-colors">
                Details <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Hover Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      <div className="p-6 bg-white/5 border-t border-white/5">
        <button className="w-full py-3 rounded-xl border border-white/10 hover:border-white/25 text-[10px] font-black uppercase tracking-[0.2em] text-fg-muted hover:text-white transition-all">
          Explore All matches
        </button>
      </div>
    </div>
  );
}

