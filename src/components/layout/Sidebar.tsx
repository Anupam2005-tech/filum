'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Resume', icon: FileText, href: '/resume' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 border-r border-border-primary flex flex-col bg-bg-secondary h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 pt-8">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 relative group
                ${isActive 
                  ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]' 
                  : 'text-fg-muted hover:text-white hover:bg-bg-tertiary'}
              `}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-black' : ''}`} />
              {item.name}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-black rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border-primary bg-bg-primary/50 backdrop-blur-md">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-bg-tertiary/50 border border-border-primary">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-black text-white">{user?.displayName?.[0] || 'U'}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black truncate text-white uppercase tracking-tight">{user?.displayName || 'Beta Candidate'}</p>
              <p className="text-[9px] text-fg-muted truncate">{user?.email || 'filum@ai.io'}</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={signOut}
            className="p-2 hover:bg-red-500/10 hover:text-red-500 text-fg-muted rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </aside>
  );
}


