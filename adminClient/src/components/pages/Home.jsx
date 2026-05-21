import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#0F172A] font-sans flex flex-col justify-between relative overflow-hidden select-none antialiased">
      
      {/* Structural Security Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.02),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      {/* --- HERO / MAIN CORE CONTENT --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto">
        
        {/* Official Security Seal */}
        <div className="relative inline-flex items-center justify-center w-28 h-28 mb-10 mx-auto">
          {/* Slow Spin Geometry */}
          <div className="absolute inset-0 rounded-full border border-dashed border-blue-600/30 animate-[spin_60s_infinite_linear]" />
          {/* Inner Shield Matrix */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-slate-50 via-white to-blue-50/40 border border-slate-200 shadow-inner flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-600 drop-shadow-xs" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
        </div>

        {/* Branding Typography */}
        <h1 className="flex items-center justify-center gap-4 text-5xl md:text-7xl font-black tracking-tight text-[#0F172A] mb-6 font-display">
          <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-blue-600 to-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/10 text-3xl md:text-4xl font-serif font-extrabold">
            B
          </span>
          <span className="tracking-tight">
            Bharat<span className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 bg-clip-text text-transparent">Ballot</span>
          </span>
        </h1>
        
        {/* Subtle Decorative Accent Rule */}
        <div className="w-16 h-[3px] bg-blue-600 rounded-full mx-auto mb-8" />

        {/* Master Tagline Statement */}
        <p className="text-xl md:text-2xl text-[#64748B] font-normal max-w-2xl mx-auto leading-relaxed tracking-tight">
          Empowering democracy <span className="text-blue-600 font-semibold underline decoration-blue-600/20 decoration-2 underline-offset-8">digitally</span> and <span className="text-blue-600 font-semibold underline decoration-blue-600/20 decoration-2 underline-offset-8">securely</span>.
        </p>

        {/* Civic Trust Badge Indicator */}
        <div className="mt-12 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#64748B] bg-white border border-slate-200/80 rounded-full px-4 py-1.5 shadow-xs backdrop-blur-xs">
          <ShieldCheck size={13} className="text-emerald-600 stroke-[2.5]" />
          Verified Secure Democratic Infrastructure
        </div>

      </main>

    </div>
  );
}