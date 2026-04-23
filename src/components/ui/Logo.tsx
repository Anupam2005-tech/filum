'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Logo({ size = 'default', showText = true }: { size?: 'small' | 'default' | 'large', showText?: boolean }) {
  const dimensions = {
    small: { container: 'w-7 h-7', inner: 'w-3 h-3', text: 'text-lg', gap: 'gap-2' },
    default: { container: 'w-9 h-9', inner: 'w-4 h-4', text: 'text-2xl', gap: 'gap-4' },
    large: { container: 'w-12 h-12', inner: 'w-5 h-5', text: 'text-4xl', gap: 'gap-6' },
  };

  const d = dimensions[size];

  return (
    <div className={`flex items-center ${d.gap}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${d.container} bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] relative overflow-hidden`}
      >
        <div className={`${d.inner} bg-black rounded-[3px]`} />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/10 to-black/0"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>
      {showText && (
        <span className={`${d.text} font-black tracking-tighter text-white uppercase`}>
          FILUM<span className="text-white/20">.</span>
        </span>
      )}
    </div>
  );
}

export function LogoMark({ className = '', size = 'default' }: { className?: string, size?: 'small' | 'default' | 'large' }) {
  const dimensions = {
    small: { container: 'w-7 h-7', inner: 'w-3 h-3' },
    default: { container: 'w-9 h-9', inner: 'w-4 h-4' },
    large: { container: 'w-12 h-12', inner: 'w-5 h-5' },
  };

  const d = dimensions[size];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${d.container} bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] relative overflow-hidden ${className}`}
    >
      <div className={`${d.inner} bg-black rounded-[3px]`} />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/10 to-black/0"
        animate={{
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

