'use client';

import React from 'react';
import { Terminal, Shield, Zap, Sparkles, Activity } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { motion, AnimatePresence } from 'framer-motion';

const mockLogs = [
  { id: '1', type: 'info', agent: 'Scraper', msg: 'Core Neural scan initiated for LinkedIn sub-directories...', time: '1m ago' },
  { id: '2', type: 'success', agent: 'Scraper', msg: 'Successfully extracted 12 matches from Digital India NIC portal.', time: '3m ago' },
  { id: '3', type: 'warning', agent: 'Matcher', msg: 'Rate threshold detected. Re-routing via distributed proxy mesh.', time: '5m ago' },
  { id: '4', type: 'ai', agent: 'Matcher', msg: 'Gemini 2.0: Deep analysis confirms 96% fit for Amazon SDE-I.', time: '8m ago' },
  { id: '5', type: 'success', agent: 'Tailor', msg: 'Resume optimization complete. PDF binary constructed for Flipkart.', time: '12m ago' },
];

const typeStyles: Record<string, { icon: any, color: string, bg: string }> = {
  info: { icon: Terminal, color: 'text-fg-muted', bg: 'bg-white/5' },
  success: { icon: Zap, color: 'text-white', bg: 'bg-white/10' },
  warning: { icon: Shield, color: 'text-amber-500/80', bg: 'bg-amber-500/5' },
  ai: { icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-400/5' },
};

export function ActivityFeed() {
  const { messages, isConnected } = useWebSocket('ws://localhost:8000/ws');
  
  const displayLogs = messages.length > 0 ? messages.map((m, i) => ({ ...m, id: `real-${i}` })) : mockLogs;

  return (
    <div className="glass-panel flex flex-col h-[500px] relative overflow-hidden">
      {/* Terminal Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-fg-muted flex items-center gap-2 ml-2">
            <Activity className="w-3 h-3 text-white" />
            Neural Activity Feed
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-fg-muted">
            {isConnected ? 'Sync Active' : 'Establishing...'}
          </span>
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-white/20 animate-pulse'}`} />
            {isConnected && <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-75" />}
          </div>
        </div>
      </div>

      {/* Log Stream */}
      <div className="flex-1 overflow-auto p-6 space-y-4 font-mono scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {displayLogs.map((log) => {
            const style = typeStyles[log.type] || typeStyles.info;
            const Icon = style.icon;
            return (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex gap-4 pr-4"
              >
                <div className={`mt-1 h-8 w-8 shrink-0 rounded-lg ${style.bg} flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all`}>
                  <Icon className={`w-3.5 h-3.5 ${style.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[9px] font-black text-white/50 tracking-widest uppercase">
                      [{log.agent}]
                    </span>
                    <span className="h-px flex-1 bg-white/5" />
                    <span className="text-[9px] text-white/30">{log.time || 'NOW'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-fg-secondary group-hover:text-white transition-colors duration-200">
                    {log.msg}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Matrix Footer */}
      <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-md">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-fg-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="text-white opacity-40">CPU</span> 12%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-white opacity-40">MEM</span> 4.2GB
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-white opacity-20 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1 h-1 rounded-full bg-white opacity-20 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1 h-1 rounded-full bg-white opacity-20 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
