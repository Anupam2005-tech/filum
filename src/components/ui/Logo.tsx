'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const dimensions = {
    small: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base' },
    default: { container: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-xl' },
    large: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-2xl' },
  };

  const d = dimensions[size];

  return (
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${d.container} rounded-xl bg-gradient-to-br from-white via-white to-neutral-200 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-white to-neutral-200 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
        <svg
          className={`${d.icon} text-black relative z-10`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0"
          animate={{
            opacity: [0, 0.5, 0],
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>
      <span className={`${d.text} font-black tracking-tighter bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent`}>
        Filum
      </span>
    </div>
  );
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-10 h-10 rounded-xl bg-gradient-to-br from-white via-white to-neutral-200 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-white to-neutral-200 opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
      <svg
        className="w-5 h-5 text-black relative z-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0"
        animate={{
          opacity: [0, 0.5, 0],
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}
