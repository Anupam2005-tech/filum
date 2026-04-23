'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Briefcase, FileText, Loader2, CheckCircle, Bot, Search, PenTool, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';

const PIPELINE_STEPS = [
  { id: 'parsing_resume', icon: FileText, label: 'Parsing Resume' },
  { id: 'scanning_platforms', icon: Search, label: 'Scanning Platforms' },
  { id: 'ai_matching', icon: Bot, label: 'AI Matching' },
  { id: 'tailoring_profiles', icon: PenTool, label: 'Tailoring Profiles' },
  { id: 'ready_to_apply', icon: Zap, label: 'Ready to Apply' },
];

const API_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8000';

export default function DashboardPage() {
  const { user, isOnboardingComplete } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showOnboardingNudge, setShowOnboardingNudge] = useState(false);
  const [stepStatus, setStepStatus] = useState<Record<string, 'pending' | 'running' | 'done'>>({
    parsing_resume: 'pending',
    scanning_platforms: 'pending',
    ai_matching: 'pending',
    tailoring_profiles: 'pending',
    ready_to_apply: 'pending',
  });
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
      if (isOnboardingComplete) {
        startProcess();
      } else {
        setShowOnboardingNudge(true);
      }
    }, 1500);

    // Setup WebSocket
    connectWS();

    return () => {
      if (ws.current) ws.current.close();
      clearTimeout(timer);
    };
  }, [user]);

  const connectWS = () => {
    if (!user) return;
    
    try {
      ws.current = new WebSocket(`${WS_BASE}/ws/${user.uid}`);
      
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'progress') {
          setStepStatus(prev => ({
            ...prev,
            [data.step]: data.status // 'running' or 'done'
          }));
        }
      };

      ws.current.onclose = () => {
        setTimeout(connectWS, 3000); // Reconnect
      };
    } catch (err) {
      console.error('WS Connection failed');
    }
  };

  const startProcess = async () => {
    if (!user) return;
    
    if (!isOnboardingComplete) {
      setShowOnboardingNudge(true);
      return;
    }

    try {
      // Simulate local flow if backend not responding or use real call
      setStepStatus(prev => ({ ...prev, parsing_resume: 'running' }));
      
      const formData = new FormData();
      formData.append('user_id', user.uid);
      
      fetch(`${API_BASE}/ai/process`, {
        method: 'POST',
        body: formData,
      }).catch(() => console.warn('Real AI process trigger failed, falling back to simulation'));

      // Simulation sequence for high-fidelity demo feel
      await new Promise(r => setTimeout(r, 2000));
      setStepStatus(prev => ({ ...prev, parsing_resume: 'done', scanning_platforms: 'running' }));
      
      await new Promise(r => setTimeout(r, 3000));
      setStepStatus(prev => ({ ...prev, scanning_platforms: 'done', ai_matching: 'running' }));
      
      await new Promise(r => setTimeout(r, 4000));
      setStepStatus(prev => ({ ...prev, ai_matching: 'done', tailoring_profiles: 'running' }));
      
      await new Promise(r => setTimeout(r, 2500));
      setStepStatus(prev => ({ ...prev, tailoring_profiles: 'done', ready_to_apply: 'running' }));
      
      await new Promise(r => setTimeout(r, 1500));
      setStepStatus(prev => ({ ...prev, ready_to_apply: 'done' }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-6">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto opacity-20" />
          <p className="text-[10px] font-black tracking-[0.4em] text-fg-muted uppercase">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Welcome Section */}
      <section className="pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-[10px] font-black text-fg-muted uppercase tracking-[0.3em] mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            AI Assistant Active
          </div>
          
          <h1 className="text-6xl font-black tracking-tighter leading-tight">
            Dashboard<span className="text-white/20">.</span>
          </h1>
          
          <p className="text-lg text-fg-secondary font-medium max-w-2xl opacity-70">
            Welcome back, <span className="text-white">{user?.displayName?.split(' ')[0] || 'User'}</span>. 
            Your autonomous agent is currently optimizing your job search strategy.
          </p>
        </motion.div>
      </section>

      {/* Pipeline Status */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-fg-muted">Neural Processing Pipeline</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-fg-muted">Live Stream</span>
          </div>
        </div>
        
        <div className="glass-panel p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Bot className="w-32 h-32" />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            {PIPELINE_STEPS.map((step, index) => {
              const Icon = step.icon;
              const status = stepStatus[step.id];
              const isLast = index === PIPELINE_STEPS.length - 1;
              
              return (
                <React.Fragment key={step.id}>
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center gap-4 flex-1 max-w-[120px]"
                  >
                    <div className={`
                      w-16 h-16 rounded-[2rem] flex items-center justify-center border-4 transition-all duration-700
                      ${status === 'done' ? 'bg-white border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 
                        status === 'running' ? 'bg-white/10 border-white/40 animate-pulse' : 
                        'bg-white/5 border-white/5'}
                    `}>
                      {status === 'done' ? (
                        <CheckCircle className="w-8 h-8 text-black" />
                      ) : status === 'running' ? (
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                      ) : (
                        <Icon className="w-8 h-8 text-white/10" />
                      )}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-center ${
                      status === 'done' ? 'text-white' : status === 'running' ? 'text-white underline underline-offset-8 decoration-white/30' : 'text-fg-muted opacity-30'
                    }`}>
                      {step.label}
                    </span>
                  </motion.div>
                  
                  {!isLast && (
                    <div className="flex-1 px-4 self-start mt-8">
                       <div className={`h-[2px] w-full transition-all duration-1000 ${
                        status === 'done' ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-white/10'
                      }`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Onboarding Nudge Overlay */}
          <AnimatePresence>
            {showOnboardingNudge && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-md"
              >
                <div className="text-center space-y-8 p-12 max-w-md">
                  <div className="w-20 h-20 rounded-[2.5rem] bg-white mx-auto flex items-center justify-center shadow-[0_20px_40px_rgba(255,255,255,0.2)]">
                    <Sparkles className="w-10 h-10 text-black" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black tracking-tight uppercase">Action Required</h3>
                    <p className="text-sm text-fg-secondary font-medium leading-relaxed opacity-60">
                      To activate the Neural Processing Pipeline and scan for optimizations, your core profile must be initialized.
                    </p>
                  </div>
                  <button 
                    onClick={() => router.push('/onboarding')}
                    className="w-full py-5 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_15px_30px_rgba(255,255,255,0.1)] active:scale-95 flex items-center justify-center gap-3"
                  >
                    Complete Onboarding
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Stats and Matches Link */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => router.push('/jobs')}
            className="glass-panel p-10 text-left group hover:bg-white/[0.03] transition-all duration-500 cursor-pointer border-white/5 hover:border-white/20 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                <Briefcase className="w-7 h-7 text-black" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Active Matches</h3>
                <p className="text-sm text-fg-secondary font-medium leading-relaxed opacity-60">
                  Access the neural grid of optimized internship opportunities.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                Access Intel
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-[0.02] rotate-12 transition-transform group-hover:rotate-6">
              <Briefcase className="w-48 h-48" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => router.push('/resume')}
            className="glass-panel p-10 text-left group hover:bg-white/[0.03] transition-all duration-500 cursor-pointer border-white/5 hover:border-white/20 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Core Profile</h3>
                <p className="text-sm text-fg-secondary font-medium leading-relaxed opacity-60">
                  Update your identity parameters and ATS optimization.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                Modify Source
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          {[
            { label: 'Neural Precision', value: '94%', sub: 'Optimized' },
            { label: 'Scouter Reach', value: '30+', sub: 'Platforms live' },
            { label: 'Auto-Apply', value: 'Active', sub: 'Status: Steady' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glass-panel p-8 group hover:bg-white/[0.02] transition-colors border-white/5"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fg-muted mb-2 group-hover:text-white transition-colors">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#22c55e]">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
