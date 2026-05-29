import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FBFF] font-sans flex items-center justify-center p-6 md:p-12 lg:p-16 relative overflow-hidden antialiased selection:bg-blue-500/10">
      
      {/* Structural Grid Background Pattern Layers */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.02),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Primary Layout Matrix: Scales to an expansive format on large displays */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-12 lg:gap-16">
        
        {/* --- LEFT COLUMN: PRIMARY TITLE PRESENTATION --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
          <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-[#0F172A] leading-tight font-display">
              Bharat<span className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 bg-clip-text text-transparent">Ballot</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg font-medium text-[#64748B] leading-relaxed">
              Access your authorized regional polling desk securely. Cast your digital franchise using multi-factor cryptographic verification layers.
            </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN: STATIC PLATFORM DESCRIPTION PLATES --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6 max-w-xl lg:max-w-none">
          
          {/* Static Block A: Terminal Overview */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-[0_4px_30px_-4px_rgba(15,23,42,0.01)] text-left flex flex-col sm:flex-row items-start gap-5">
            <div className="space-y-2 flex-1">
              <h3 className="text-base md:text-lg font-bold text-[#0F172A] tracking-tight">
                Citizen Voting Terminal
              </h3>
              <p className="text-xs md:text-sm font-medium text-[#64748B] leading-relaxed">
                Authenticate using unique system credentials to safely access individual constituency metadata arrays and record choices.
              </p>
            </div>
          </div>

          {/* Static Block B: Ledger Overview */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-[0_4px_30px_-4px_rgba(15,23,42,0.01)] text-left flex flex-col sm:flex-row items-start gap-5">
            <div className="space-y-2 flex-1">
              <h3 className="text-base md:text-lg font-bold text-[#0F172A] tracking-tight">
                Live Election Trends
              </h3>
              <p className="text-xs md:text-sm font-medium text-[#64748B] leading-relaxed">
                Inspect public statistical charts, regional voter distributions, and audited ledger parameters compiled across regional nodes.
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}