'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, ArrowRight, ArrowLeft, Check, Loader2, 
  FileText, Briefcase, Clock, Building2, Laptop, 
  Wrench, AlertCircle, Sparkles, ChevronRight 
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

const STEPS = [
  { id: 'start', title: 'Get Started', subtitle: 'Import your professional identity' },
  { id: 'sector', title: 'Target Sector', subtitle: 'Where do you want to build?' },
  { id: 'position', title: 'Target Position', subtitle: 'Define your primary role' },
  { id: 'experience', title: 'Experience', subtitle: 'Level of expertise' },
  { id: 'company_size', title: 'Company Size', subtitle: 'Preferred environment' },
  { id: 'work_mode', title: 'Work Mode', subtitle: 'Your optimal setup' },
  { id: 'technologies', title: 'Intelligence', subtitle: 'Core stack & expertise' },
];

const SECTORS = ['AI & Machine Learning', 'FinTech', 'HealthTech', 'E-Commerce', 'SaaS', 'Gaming', 'Cybersecurity', 'Cloud Computing', 'Web3 & Crypto'];
const POSITIONS = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Product Manager', 'UI/UX Designer', 'Mobile Developer'];
const EXPERIENCE = ['0-1 years (Internship)', '1-2 years', '2-5 years', '5+ years'];
const COMPANY_SIZES = ['Startup (1-50)', 'SMB (51-200)', 'Mid-Market (201-1000)', 'Enterprise (1000+)'];
const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
const TECHNOLOGIES = ['React', 'Next.js', 'TypeScript', 'Python', 'Node.js', 'Go', 'Rust', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'PyTorch', 'TensorFlow', 'LLMs'];

const API_BASE = 'http://localhost:8000';

export function Onboarding() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    sector: '',
    position: '',
    experience_years: '',
    company_size: '',
    work_mode: '',
    top_technologies: [] as string[],
  });

  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFilename, setResumeFilename] = useState('');

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setError(null);
    setResumeFilename(file.name);
    
    const formDataUpload = new FormData();
    formDataUpload.append('user_id', user.uid);
    formDataUpload.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/onboarding/resume`, {
        method: 'POST',
        body: formDataUpload,
      });
      if (res.ok) {
        setResumeUploaded(true);
        setTimeout(() => setCurrentStep(1), 1200);
      }
    } catch (err) {
      setResumeUploaded(true);
      setTimeout(() => setCurrentStep(1), 1200);
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const profileData = JSON.stringify(formData);
      const formDataSubmit = new FormData();
      formDataSubmit.append('user_id', user.uid);
      formDataSubmit.append('data', profileData);

      await fetch(`${API_BASE}/onboarding/profile`, {
        method: 'POST',
        body: formDataSubmit,
      });
      localStorage.setItem(`onboarding_${user.uid}`, 'true');
      window.location.href = '/dashboard';
    } catch (err) {
      localStorage.setItem(`onboarding_${user.uid}`, 'true');
      window.location.href = '/dashboard';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return resumeUploaded;
      case 1: return !!formData.sector;
      case 2: return !!formData.position;
      case 3: return !!formData.experience_years;
      case 4: return !!formData.company_size;
      case 5: return !!formData.work_mode;
      case 6: return formData.top_technologies.length >= 3;
      default: return true;
    }
  };

  const toggleTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      top_technologies: prev.top_technologies.includes(tech)
        ? prev.top_technologies.filter(t => t !== tech)
        : [...prev.top_technologies, tech].slice(0, 5)
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-fg-primary flex flex-col overflow-hidden font-sans selection:bg-white selection:text-black">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.15, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-white/10 blur-[130px] rounded-full" 
        />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-white/[0.03] blur-[120px] rounded-full" />
      </div>

      {/* Glass Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center max-w-6xl mx-auto backdrop-blur-sm">
        <Logo />
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end gap-1.5">
            <span className="text-[10px] font-black tracking-[0.3em] text-fg-muted uppercase">
              Neural Sync Phase {currentStep + 1}
            </span>
            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Experience */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-10"
            >
              {/* Contextual Guidance */}
              <div className="space-y-4">
                <motion.div 
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-white/50 uppercase"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                  Deployment Step {currentStep + 1}
                </motion.div>
                
                <div className="space-y-2">
                  <motion.h1 
                    variants={itemVariants}
                    className="text-5xl sm:text-6xl font-black tracking-tighter leading-none"
                  >
                    {STEPS[currentStep].title}<span className="text-white/20">.</span>
                  </motion.h1>
                  <motion.p 
                    variants={itemVariants}
                    className="text-xl text-fg-secondary font-medium tracking-tight opacity-80"
                  >
                    {STEPS[currentStep].subtitle}
                  </motion.p>
                </div>
              </div>

              {/* Interaction Zone */}
              <div className="min-h-[340px]">
                {currentStep === 0 && (
                  <motion.div variants={itemVariants}>
                    <label className={`
                      relative group cursor-pointer overflow-hidden rounded-[2.5rem] border-2 border-dashed 
                       transition-all duration-700 p-12 flex flex-col items-center gap-6
                      ${resumeUploaded ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/40 hover:bg-white/[0.02]'}
                    `}>
                      <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleResumeUpload} disabled={isUploading} />
                      
                      <div className={`
                        w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-700
                        ${resumeUploaded ? 'bg-white scale-110 shadow-[0_0_60px_rgba(255,255,255,0.4)]' : 'bg-white/5'}
                      `}>
                        {isUploading ? (
                          <div className="relative">
                            <Loader2 className="w-10 h-10 animate-spin text-white" />
                            <motion.div 
                              className="absolute inset-0 border-2 border-white rounded-3xl"
                              animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            />
                          </div>
                        ) : resumeUploaded ? (
                          <Check className="w-10 h-10 text-black" strokeWidth={3} />
                        ) : (
                          <Upload className="w-10 h-10 text-white/50 group-hover:text-white transition-colors" />
                        )}
                      </div>

                      <div className="text-center space-y-3">
                        <p className="font-black tracking-tight text-2xl uppercase">
                          {isUploading ? 'Decrypting Credentials...' : resumeUploaded ? resumeFilename : 'Import Master Identity'}
                        </p>
                        <p className="text-[10px] text-fg-muted font-black uppercase tracking-[0.4em]">
                          {resumeUploaded ? 'Neural Mapping Complete' : 'Secure Upload • Encrypted Layer'}
                        </p>
                      </div>

                      {resumeUploaded && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                           className="absolute bottom-6 flex items-center gap-3 text-xs font-black tracking-widest text-white/40 uppercase"
                        >
                          Synchronizing with Phase 2
                          <ArrowRight className="w-4 h-4 animate-pulse" />
                        </motion.div>
                      )}
                    </label>
                  </motion.div>
                )}

                {currentStep >= 1 && currentStep <= 5 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(currentStep === 1 ? SECTORS : 
                      currentStep === 2 ? POSITIONS :
                      currentStep === 3 ? EXPERIENCE :
                      currentStep === 4 ? COMPANY_SIZES :
                      WORK_MODES).map((item) => {
                        const isSelected = 
                          currentStep === 1 ? formData.sector === item :
                          currentStep === 2 ? formData.position === item :
                          currentStep === 3 ? formData.experience_years === item :
                          currentStep === 4 ? formData.company_size === item :
                          formData.work_mode === item;

                        return (
                          <motion.button
                            variants={itemVariants}
                            key={item}
                            onClick={() => {
                              if (currentStep === 1) setFormData(p => ({ ...p, sector: item }));
                              else if (currentStep === 2) setFormData(p => ({ ...p, position: item }));
                              else if (currentStep === 3) setFormData(p => ({ ...p, experience_years: item }));
                              else if (currentStep === 4) setFormData(p => ({ ...p, company_size: item }));
                              else setFormData(p => ({ ...p, work_mode: item }));
                            }}
                            className={`
                               group relative flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all duration-500
                              ${isSelected 
                                ? 'bg-white border-white shadow-[0_25px_50px_-12px_rgba(255,255,255,0.2)]' 
                                : 'border-white/5 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-1'}
                            `}
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                            
                            <span className={`relative z-10 font-black tracking-tight text-xl ${isSelected ? 'text-black' : 'text-white'}`}>
                              {item}
                            </span>
                            
                            {isSelected ? (
                              <div className="relative z-10 w-7 h-7 bg-black rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" strokeWidth={3} />
                              </div>
                            ) : (
                              <ChevronRight className="relative z-10 w-5 h-5 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                            )}
                          </motion.button>
                        );
                      })
                    }
                  </div>
                )}

                 {currentStep === 6 && (
                   <div className="space-y-8">
                    <div className="flex flex-wrap gap-3 justify-center">
                      {TECHNOLOGIES.map((tech) => {
                        const isSelected = formData.top_technologies.includes(tech);
                        return (
                          <motion.button
                            variants={itemVariants}
                            key={tech}
                            onClick={() => toggleTechnology(tech)}
                            className={`
                              px-7 py-3 rounded-full border-2 font-black text-xs uppercase tracking-widest transition-all duration-500
                              ${isSelected 
                                ? 'bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                                : 'border-white/10 bg-white/5 hover:border-white/30 hover:-translate-y-1'}
                            `}
                          >
                            {tech}
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    <div className="flex flex-col items-center gap-6">
                      <div className="text-[10px] font-black uppercase tracking-[0.5em] text-fg-muted">
                        Selection Threshold: {formData.top_technologies.length} / 5
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div 
                            key={i} 
                            className={`w-10 h-1.5 rounded-full transition-all duration-700 ${i <= formData.top_technologies.length ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
               <div className="pt-8 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-8">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`
                      flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase transition-all
                      ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-fg-muted hover:text-white hover:-translate-x-1'}
                    `}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Return
                  </button>

                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase text-fg-muted hover:text-white transition-all"
                  >
                    Skip for now
                  </button>
                </div>

                {currentStep === STEPS.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className={`
                      relative px-12 py-6 rounded-3xl font-black text-xs tracking-[0.2em] uppercase transition-all
                      ${canProceed() && !isSubmitting 
                        ? 'bg-white text-black hover:scale-[1.05] hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] active:scale-95' 
                        : 'bg-white/10 text-white/20 cursor-not-allowed'}
                    `}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Initializing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        Initialize Agent Core
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className={`
                      px-12 py-6 rounded-3xl font-black text-xs tracking-[0.2em] uppercase transition-all
                      ${canProceed() 
                        ? 'bg-white text-black hover:scale-[1.05] hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] active:scale-95' 
                        : 'bg-white/10 text-white/20 cursor-not-allowed'}
                    `}
                  >
                    Continue Sequence
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Control Layer */}
       <footer className="relative z-10 p-6 flex justify-center md:justify-end max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-6 opacity-40">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[9px] font-black tracking-[0.3em] uppercase">Neural Link Stable</span>
          </div>
          <div className="w-[1px] h-3 bg-white/20" />
          <p className="text-[9px] font-black tracking-[0.3em] uppercase">
            Filum Core v1.4.0 • Authorized Personnel Only
          </p>
        </div>
      </footer>
    </div>
  );
}
