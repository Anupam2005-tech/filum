'use client';

import React, { useState } from 'react';
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
  Wrench
} from 'lucide-react';

export default function ResumePage() {
  const [isUploading, setIsUploading] = useState(false);

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
          <div className="glass-panel p-6 border-dashed border-2 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-white transition-all">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center group-hover:bg-white transition-all">
              <Upload className="w-8 h-8 text-[var(--fg-muted)] group-hover:text-black transition-all" />
            </div>
            <div>
              <p className="text-sm font-bold">Upload New Resume</p>
              <p className="text-[10px] text-[var(--fg-muted)] mt-1">PDF or DOCX max 5MB</p>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Current Versions</h3>
            <div className="space-y-3">
              {[
                { name: 'Master_Resume_2024.pdf', type: 'Master', date: '2d ago' },
                { name: 'Google_Tailored_v1.docx', type: 'Tailored', date: '4h ago' },
                { name: 'Amazon_Tailored_v3.docx', type: 'Tailored', date: '6h ago' },
              ].map((file) => (
                <div key={file.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-transparent hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-[var(--fg-muted)]" />
                    <div className="truncate">
                      <p className="text-xs font-medium truncate">{file.name}</p>
                      <p className="text-[9px] text-[var(--fg-muted)]">{file.type} • {file.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-white/10 rounded"><Download className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 hover:bg-white/10 rounded text-red-500/50 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
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

            <div className="space-y-8">
              {/* Experience */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-4 h-4 text-[var(--fg-muted)]" />
                  <h4 className="text-sm font-bold uppercase tracking-tight">Experience</h4>
                </div>
                <div className="space-y-4">
                  <div className="pl-4 border-l-2 border-[var(--border-primary)] py-1">
                    <p className="text-xs font-bold">Frontend Engineer Intern</p>
                    <p className="text-[10px] text-[var(--fg-muted)] uppercase font-black">Startup X • 2023 - Present</p>
                    <p className="text-xs text-[var(--fg-secondary)] mt-2 italic">Building scalable React components and optimizing performance.</p>
                  </div>
                </div>
              </section>

              {/* Education */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-4 h-4 text-[var(--fg-muted)]" />
                  <h4 className="text-sm font-bold uppercase tracking-tight">Education</h4>
                </div>
                <div className="pl-4 border-l-2 border-[var(--border-primary)] py-1">
                  <p className="text-xs font-bold">B.Tech in Computer Science</p>
                  <p className="text-[10px] text-[var(--fg-muted)] uppercase font-black">Top University • 2021 - 2025</p>
                </div>
              </section>

              {/* Skills */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="w-4 h-4 text-[var(--fg-muted)]" />
                  <h4 className="text-sm font-bold uppercase tracking-tight">Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'Typescript', 'Node.js', 'Python', 'AWS', 'Firebase', 'CrewAI'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-[var(--border-primary)] rounded-full text-[10px] text-[var(--fg-secondary)]">
                      {skill}
                    </span>
                  ))}
                  <button className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center hover:bg-[var(--fg-secondary)] transition-all">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
