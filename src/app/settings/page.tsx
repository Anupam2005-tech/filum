'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { user, deleteAccount } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (e) {
      alert("An error occurred while deleting your account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <section>
        <h1 className="text-3xl font-black tracking-tighter mb-2">Account Settings</h1>
        <p className="text-[var(--fg-secondary)]">Manage your personal information and account security.</p>
      </section>

      <div className="glass-panel p-8 space-y-8">
        <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-primary)]">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold">{user?.displayName?.[0] || 'U'}</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold">{user?.displayName || 'User'}</h3>
            <p className="text-sm text-[var(--fg-secondary)]">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs uppercase font-black text-[var(--fg-muted)] tracking-widest">Danger Zone</h4>
          
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-500">Delete Account</p>
                <p className="text-xs text-[var(--fg-secondary)] mt-1">
                  Permanently remove your profile, resumes, and all saved data. This action cannot be undone.
                </p>
              </div>
            </div>

            {!confirmDelete ? (
              <button 
                onClick={() => setConfirmDelete(true)}
                className="w-full py-3 px-4 rounded-xl border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
              >
                Initiate Deletion
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  Confirm Permanent Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
