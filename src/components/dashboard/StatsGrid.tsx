'use client';

import React from 'react';
import { Briefcase, CheckCircle, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { 
    label: 'Total Scanned', 
    value: '1,284', 
    icon: Briefcase, 
    trend: '+12%',
    sub: 'Analyzed today'
  },
  { 
    label: 'AI Matched', 
    value: '42', 
    icon: Zap, 
    trend: '94%',
    sub: 'Suitability score'
  },
  { 
    label: 'Applied', 
    value: '18', 
    icon: CheckCircle, 
    trend: '+4',
    sub: 'In last 2h'
  },
  { 
    label: 'Wait Time', 
    value: '12m', 
    icon: Clock, 
    trend: '-2m',
    sub: 'Processing speed'
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 group hover:border-white/20 transition-all cursor-default"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-fg-muted group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-black text-white px-2 py-1 rounded-full bg-white/5 border border-white/10">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-fg-muted mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tighter text-white">{stat.value}</h3>
              <p className="text-[9px] text-fg-muted font-bold mt-1 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                {stat.sub}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
