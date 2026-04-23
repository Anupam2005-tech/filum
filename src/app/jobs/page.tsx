'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Zap,
  CheckCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Target
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  type: string;
  score: number;
  link: string;
  description?: string;
  applied?: boolean;
}

const MOCK_JOBS: Job[] = [
  { id: '1', company: 'Stripe', title: 'Software Engineer Intern', location: 'San Francisco, CA', type: 'Full-time', score: 94, link: 'https://stripe.com/jobs' },
  { id: '2', company: 'OpenAI', title: 'ML Research Intern', location: 'Remote', type: 'Internship', score: 91, link: 'https://openai.com/careers' },
  { id: '3', company: 'Vercel', title: 'Frontend Engineer Intern', location: 'Remote', type: 'Full-time', score: 88, link: 'https://vercel.com/careers' },
  { id: '4', company: 'Anthropic', title: 'AI Safety Engineer', location: 'San Francisco, CA', type: 'Full-time', score: 86, link: 'https://anthropic.com/careers' },
  { id: '5', company: 'Linear', title: 'Full Stack Developer', location: 'Remote', type: 'Full-time', score: 82, link: 'https://linear.app/careers' },
  { id: '6', company: 'Notion', title: 'Product Engineer', location: 'New York, NY', type: 'Full-time', score: 79, link: 'https://notion.so/careers' },
];

const API_BASE = 'http://localhost:8000';

export default function JobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoApply, setAutoApply] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    
    // Always use mock data for demo - backend can be integrated later
    setTimeout(() => {
      setJobs(MOCK_JOBS);
      setLoading(false);
    }, 1200);

    // Try to fetch from backend if available
    if (!user) return;
    
    try {
      const res = await fetch(`${API_BASE}/ai/jobs/${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      }
    } catch (err) {
      console.warn('Backend not available, using demo data');
    }
  };

  const handleApply = async (job: Job) => {
    if (applyingId) return;
    setApplyingId(job.id);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAppliedJobs(prev => new Set([...prev, job.id]));
    setApplyingId(null);
  };

  const handleAutoApplyAll = async () => {
    const unappliedJobs = jobs.filter(j => !appliedJobs.has(j.id));
    for (const job of unappliedJobs) {
      await handleApply(job);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="space-y-6 text-center">
          <div className="relative inline-block">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
            <motion.div 
              className="absolute inset-0 border-2 border-white/20 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          <p className="text-[10px] font-black tracking-[0.4em] text-fg-muted uppercase">Neural Matchmaking in Progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-10">
        <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-white/10 blur-[100px] rounded-full" />
      </div>

      {/* Header with Advanced Controls */}
      <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-8">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[10px] font-black tracking-[0.4em] text-white/40 uppercase"
          >
            <Target className="w-3 h-3" />
            Target Acquisition
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter leading-none">
            Job Matches<span className="text-white/20">.</span>
          </h1>
          <p className="text-fg-secondary font-medium tracking-tight opacity-70">
            {jobs.length} synchronized opportunities discovered
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6 glass-panel px-8 py-5"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-fg-muted uppercase leading-none mb-1">Autonomous</span>
                <span className="text-sm font-black tracking-tight">AUTO-APPLY</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setAutoApply(!autoApply);
                if (!autoApply) handleAutoApplyAll();
              }}
              disabled={applyingId !== null}
              className={`
                relative w-14 h-7 rounded-full transition-all duration-500
                ${autoApply ? 'bg-white' : 'bg-white/10'}
                ${applyingId ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <motion.div
                animate={{ x: autoApply ? 30 : 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`absolute top-1 w-5 h-5 rounded-full ${autoApply ? 'bg-black' : 'bg-white/40'}`}
              />
            </button>
          </motion.div>

          <button
            onClick={fetchJobs}
            className="p-5 glass-panel rounded-3xl hover:bg-white/[0.05] hover:border-white/20 transition-all active:scale-95 group"
          >
            <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </div>

      {/* High-Fidelity Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {jobs.map((job, index) => {
            const isApplied = appliedJobs.has(job.id);
            const isApplying = applyingId === job.id;
            
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className={`
                  glass-panel p-8 relative overflow-hidden group
                  ${isApplied ? 'border-white/40 bg-white/[0.05]' : 'hover:border-white/30 hover:bg-white/[0.02]'}
                  transition-all duration-500
                `}
              >
                {/* Score Badge */}
                <div className="absolute top-6 right-6 flex flex-col items-end gap-1">
                  <div className={`
                    px-3 py-1 rounded-full text-[10px] font-black tracking-tighter
                    ${job.score >= 90 ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/10 text-white'}
                  `}>
                    {job.score}% MATCH
                  </div>
                </div>

                {/* Company Logomark */}
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-[0_15px_30px_rgba(0,0,0,0.3)] border-2 border-white/10 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500">
                  <span className="text-3xl font-black text-black leading-none">{job.company[0]}</span>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-10">
                  <h3 className="text-2xl font-black tracking-tight leading-tight pr-10">{job.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-fg-muted">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Futuristic Actions */}
                <div className="flex items-center gap-3">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-bg-tertiary border border-border-primary hover:border-white transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    Details
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleApply(job)}
                    disabled={isApplied || isApplying}
                    className={`
                      flex-[1.5] flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all
                      ${isApplied 
                        ? 'bg-white/20 text-white/50 cursor-default' 
                        : isApplying
                          ? 'bg-white/30 text-white cursor-wait'
                          : 'bg-white text-black hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] active:scale-95'}
                    `}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Deployed
                      </>
                    ) : isApplying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current" />
                        AI Deploy
                      </>
                    )}
                  </button>
                </div>

                {/* Applied Scanline Effect */}
                {isApplied && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent skew-x-12 pointer-events-none" 
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="relative mb-10">
            <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10">
              <Briefcase className="w-10 h-10 text-fg-muted" />
            </div>
          </div>
          <h3 className="text-3xl font-black tracking-tighter mb-3">No Active Targets Found</h3>
          <p className="text-fg-secondary font-medium tracking-tight opacity-60 mb-10 max-w-sm">
            The neural scouter couldn't find matches for your current profile parameters.
          </p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
          >
            Update Core Profile
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
