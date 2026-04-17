'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Globe, Filter } from 'lucide-react';

const jobIntelligence = [
  { id: 1, company: 'Google', role: 'Software Engineer University Grad', location: 'Mountain View, CA', match: '98%', status: 'Active', trend: '+12%' },
  { id: 2, company: 'Stripe', role: 'Product Design Intern', location: 'Remote', match: '94%', status: 'Hiring', trend: '+24%' },
  { id: 3, company: 'Vercel', role: 'Frontend Engineer', location: 'San Francisco, CA', match: '91%', status: 'Active', trend: '+5%' },
  { id: 4, company: 'Scale AI', role: 'AI Resident', location: 'San Francisco, CA', match: '89%', status: 'Accelerated', trend: '+40%' },
];

export default function JobsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 bg-linear-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            Market Intelligence
          </h1>
          <p className="text-fg-muted text-sm font-medium">Real-time internship & role discovery across the ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="glass-button flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all">
            <Filter className="w-4 h-4" />
            Filter Data
          </button>
          <button className="glass-button flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-all">
            <Plus className="w-4 h-4" />
            Add Tracker
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Global Openings', value: '12,482', icon: Globe, color: 'text-blue-400' },
          { label: 'High Precision Matches', value: '142', icon: Briefcase, color: 'text-green-400' },
          { label: 'Market Velocity', value: '+12.4%', icon: TrendingUp, color: 'text-purple-400' },
          { label: 'System Uptime', value: '99.9%', icon: TrendingUp, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-fg-muted">{stat.label}</p>
              <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest">Active Intelligence Feeds</h3>
          <span className="flex items-center gap-2 text-[10px] font-bold text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live Syncing
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-fg-muted">Opportunity / Company</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-fg-muted">Location</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-fg-muted">Match Score</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-fg-muted">Trend</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-fg-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobIntelligence.map((job, i) => (
                <tr key={job.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs">
                        {job.company[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{job.role}</p>
                        <p className="text-xs text-fg-muted">{job.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-fg-muted font-medium">{job.location}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: job.match }}
                          className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        />
                      </div>
                      <span className="text-xs font-black">{job.match}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                      {job.trend}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                      View Insight
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
