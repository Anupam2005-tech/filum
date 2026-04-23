'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  Plus, 
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Wrench,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';

export default function ResumePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchResume();
    }
  }, [user]);

  async function fetchResume() {
    try {
      const res = await fetch(`http://localhost:8000/user/resume/${user?.uid}`);
      if (res.ok) {
        const data = await res.json();
        setResumeData(data);
      }
    } catch (e) {
      console.error("Error fetching resume:", e);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('user_id', user.uid);
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/user/resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload resume");

      await fetchResume();
      // After upload, let the user know or redirect them to dashboard
      alert("Resume uploaded and parsed successfully!");
      router.push('/');
    } catch (e: any) {
      setUploadError(e.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <section>
        <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Professional Profile
        </h1>
        <p className="text-[var(--fg-secondary)] mt-2">Manage your master resume and AI-extracted profile</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Upload & Files */}
        <div className="lg:col-span-1 space-y-6">
          <label className={`
            glass-panel p-6 border-dashed border-2 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer 
            ${isUploading ? 'opacity-50 pointer-events-none' : 'hover:border-white transition-all'}
          `}>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.docx" 
              onChange={handleFileUpload} 
            />
            <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center group-hover:bg-white transition-all">
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-white group-hover:text-black" />
              ) : (
                <Upload className="w-8 h-8 text-[var(--fg-muted)] group-hover:text-black transition-all" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold">{isUploading ? 'Parsing Resume...' : 'Upload New Resume'}</p>
              <p className="text-[10px] text-[var(--fg-muted)] mt-1">PDF or DOCX max 5MB</p>
            </div>
          </label>

          {uploadError && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {uploadError}
            </div>
          )}

          <div className="glass-panel p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Current Version</h3>
            <div className="space-y-3">
              {resumeData ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-transparent hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-[var(--fg-muted)]" />
                    <div className="truncate">
                      <p className="text-xs font-medium truncate">{resumeData.filename}</p>
                      <p className="text-[9px] text-[var(--fg-muted)]">Master • {new Date(resumeData.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-white/10 rounded"><Download className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 hover:bg-white/10 rounded text-red-500/50 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[var(--fg-muted)] italic text-center py-4">No resume uploaded yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Parsed Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border-primary)]">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                Parsed AI Profile
              </h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)] hover:text-white transition-all">
                Edit Content
              </button>
            </div>

            {resumeData ? (
              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-[var(--fg-muted)]" />
                    <h4 className="text-sm font-bold uppercase tracking-tight">Extracted Content</h4>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-[var(--border-primary)]">
                    <p className="text-xs text-[var(--fg-secondary)] leading-relaxed whitespace-pre-wrap">
                      {resumeData.text}
                    </p>
                  </div>
                </section>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-[var(--fg-muted)]" />
                </div>
                <div>
                  <p className="text-sm font-bold">No data to display</p>
                  <p className="text-xs text-[var(--fg-secondary)]">Please upload your resume to generate your AI profile.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
