'use client';

import { Loader2 } from 'lucide-react';

export default function RootPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-bg-primary">
      <div className="text-center space-y-6">
        <Loader2 className="w-12 h-12 animate-spin text-white mx-auto opacity-20" />
        <p className="text-[10px] font-black tracking-[0.4em] text-fg-muted uppercase">Routing Neural Link...</p>
      </div>
    </div>
  );
}
