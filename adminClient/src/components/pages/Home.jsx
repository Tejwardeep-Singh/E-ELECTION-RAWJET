import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between relative overflow-hidden select-none antialiased">
      
      {/* Structural Security Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.02),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      

      {/* --- 2. HERO / MAIN CORE CONTENT --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto">
        
        {/* Official Security Seal */}
        <div className="relative inline-flex items-center justify-center w-28 h-28 mb-10 mx-auto">
          {/* Slow Spin Geometry */}
          <div className="absolute inset-0 rounded-full border border-dashed border-blue-800/30 animate-[spin_60s_infinite_linear]" />
          {/* Inner Shield */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-slate-50 via-white to-blue-50/40 border border-slate-200 shadow-inner flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-900/90 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
        </div>

        {/* Branding Typography */}
        <h1 className="flex items-center justify-center gap-5 text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-6">
          <span className="flex items-center justify-center w-18 h-18 bg-gradient-to-b from-blue-800 to-blue-950 text-white rounded-2xl shadow-xl shadow-blue-950/10 text-4xl font-serif px-5 py-3">
            E
          </span>
          <span className="font-sans tracking-tight">
            Election
          </span>
        </h1>
        
        {/* Subtle Horizontal Rules */}
        <div className="w-20 h-[3px] bg-blue-800 rounded-full mx-auto mb-8" />

        {/* Master Tagline Statement */}
        <p className="text-xl md:text-2xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed tracking-tight">
          Choose your representative <span className="text-blue-900 font-semibold underline decoration-blue-800/20 decoration-2 underline-offset-8">digitally</span> and <span className="text-blue-900 font-semibold underline decoration-blue-800/20 decoration-2 underline-offset-8">securely</span>.
        </p>

      </main>

    </div>
  );
}