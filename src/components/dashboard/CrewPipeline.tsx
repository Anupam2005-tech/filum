'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Target, 
  PenTool, 
  Send,
  Zap,
  CheckCircle2,
  Loader2,
  ChevronRight
} from 'lucide-react';

const agents = [
  { 
    id: 'scraper', 
    name: 'Scraper', 
    role: 'Scout', 
    icon: Search, 
    status: 'done',
    desc: 'Scanning 30+ sources'
  },
  { 
    id: 'matcher', 
    name: 'Matcher', 
    role: 'Analyst', 
    icon: Target, 
    status: 'running',
    desc: 'Evaluating 124 leads'
  },
  { 
    id: 'tailor', 
    name: 'Tailor', 
    role: 'Specialist', 
    icon: PenTool, 
    status: 'pending',
    desc: 'Customizing resumes'
  },
  { 
    id: 'applicator', 
    name: 'Applicator', 
    role: 'Manager', 
    icon: Send, 
    status: 'pending',
    desc: 'Pending deployment'
  },
];

export function CrewPipeline() {
  return (
    <div className="relative group">
      {/* Background Pipeline Line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-[40px]" />
      
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const isLast = index === agents.length - 1;
          
          return (
            <div key={agent.id} className="relative">
              <div className="flex flex-col items-center group/agent">
                {/* Agent Node */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center border transition-all duration-500 mb-4
                    ${agent.status === 'done' ? 'bg-white border-white scale-95' : 
                      agent.status === 'running' ? 'bg-bg-tertiary border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 
                      'bg-bg-tertiary border-white/5'}
                  `}
                >
                  <Icon className={`w-8 h-8 ${agent.status === 'done' ? 'text-black' : 'text-white'}`} />
                  
                  {/* Status Overlays */}
                  {agent.status === 'running' && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-white/20 border-t-white rounded-3xl"
                    />
                  )}
                  {agent.status === 'done' && (
                    <div className="absolute -bottom-1 -right-1 bg-black rounded-full border border-white/20 p-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {agent.status === 'running' && (
                    <div className="absolute -top-1 -right-1">
                      <Zap className="w-4 h-4 text-white fill-current animate-pulse shadow-glow" />
                    </div>
                  )}
                </motion.div>
                
                {/* Text Context */}
                <div className="text-center group-hover/agent:-translate-y-1 transition-transform">
                  <h4 className={`text-xs font-black tracking-widest uppercase mb-1 ${agent.status === 'pending' ? 'text-fg-muted' : 'text-white'}`}>
                    {agent.name}
                  </h4>
                  <p className="text-[10px] text-fg-muted font-bold tracking-tight mb-2">
                    {agent.role}
                  </p>
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase inline-block border ${
                    agent.status === 'done' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    agent.status === 'running' ? 'bg-white/10 border-white/20 text-white' :
                    'bg-white/5 border-white/5 text-fg-muted'
                  }`}>
                    {agent.status === 'running' ? 'Active' : agent.status}
                  </div>
                </div>

                {/* Status Subtitle */}
                <p className="mt-3 text-[9px] text-fg-muted font-mono opacity-0 group-hover/agent:opacity-100 transition-opacity">
                   {agent.desc}
                </p>
              </div>

              {/* Connecting Arrow (Desktop) */}
              {!isLast && (
                <div className="hidden md:flex absolute top-[40px] -right-[15%] z-0 items-center gap-1 opacity-20">
                   <ChevronRight className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
