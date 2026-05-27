import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, BarChart3, ShieldCheck, Fingerprint, HelpCircle, ArrowRight, AlertCircle } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  // Simulated status check matching the red notice box in image_68d2a0.png
  const isElectionLive = false; 

  return (
    <main className="min-h-[calc(100vh-70px)] bg-[#F8FBFF] font-sans flex items-center justify-center p-6 md:p-12 lg:p-16 relative overflow-hidden antialiased selection:bg-blue-500/10">
      
      {/* Structural Grid Background Pattern Layers */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.02),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Primary Layout Matrix: Scales to an expansive two-column format on large displays */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-12 lg:gap-16">
        
        {/* --- LEFT COLUMN: BRAND PALETTE & STATUS NOTICES --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-8 lg:py-4 text-center lg:text-left">
          
          {/* Top Status Alert Stack */}
          <div className="space-y-4 self-center lg:self-start w-full max-w-md">
            {!isElectionLive && (
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 w-full px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-700 animate-[fadeIn_0.3s_ease-out]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                System Maintenance Notice: Election is not live now!
              </div>
            )}

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200/80 rounded-full shadow-2xs text-[10px] font-bold uppercase tracking-wider text-blue-600">
              <ShieldCheck size={13} className="stroke-[2.5]" />
              Secured Digital Infrastructure Node
            </div>
          </div>

          {/* Central Title Block */}
          <div className="space-y-4 max-w-xl mx-auto lg:mx-0 py-6 lg:py-12">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-[#0F172A] leading-tight font-display">
              Bharat<span className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 bg-clip-text text-transparent">Ballot</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg font-medium text-[#64748B] leading-relaxed">
              Access your authorized regional polling desk securely. Cast your digital franchise using multi-factor cryptographic verification layers.
            </p>
          </div>

          {/* Compliance Tray (Left Anchor on Large Displays) */}
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t border-slate-200/40 pt-6">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-600 stroke-[2.2]" /> 
              Verification Compliant
            </div>
            <div className="h-3 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-1.5 hover:text-slate-600 transition-colors cursor-pointer">
              <HelpCircle size={13} /> 
              Citizen Support Help Desk
            </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: RESPONSIVE WORKSPACE ROUTING CARDS --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6 max-w-xl lg:max-w-none">
          
          {/* Action Module A: Terminal Authentication Entryway */}
          <div 
            onClick={() => navigate('/voter-login')}
            className="group relative bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-[0_4px_30px_-4px_rgba(15,23,42,0.01)] text-left flex flex-col sm:flex-row items-start gap-5 hover:border-blue-600 hover:shadow-[0_12px_40px_-6px_rgba(37,99,235,0.05)] transition-all duration-300 cursor-pointer"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
              <Vote size={22} className="stroke-[2.2]" />
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <h3 className="text-base md:text-lg font-bold text-[#0F172A] tracking-tight flex items-center gap-1.5">
                  Citizen Voting Terminal
                  <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-blue-600 transition-all duration-300" />
                </h3>
                <p className="text-xs md:text-sm font-medium text-[#64748B] leading-relaxed">
                  Authenticate using your unique credential credentials to access your local constituent candidate matrix safely.
                </p>
              </div>
              
              <div className="pt-3 border-t border-slate-100/60 flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <Fingerprint size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                SECURE_AUTH_GATEWAY
              </div>
            </div>
          </div>

          {/* Action Module B: Audit Ledger / Real-time Trends */}
          <div 
            onClick={() => navigate('/results')}
            className="group relative bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-[0_4px_30px_-4px_rgba(15,23,42,0.01)] text-left flex flex-col sm:flex-row items-start gap-5 hover:border-blue-600 hover:shadow-[0_12px_40px_-6px_rgba(37,99,235,0.05)] transition-all duration-300 cursor-pointer"
          >
            <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
              <BarChart3 size={22} className="stroke-[2.2]" />
            </div>

            <div className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <h3 className="text-base md:text-lg font-bold text-[#0F172A] tracking-tight flex items-center gap-1.5">
                  Live Election Trends
                  <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-blue-600 transition-all duration-300" />
                </h3>
                <p className="text-xs md:text-sm font-medium text-[#64748B] leading-relaxed">
                  Inspect statistical data counts, seat breakdowns, and public audit metrics validated by the central administration board.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100/60 flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <ShieldCheck size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                AUDIT_PUBLIC_LEDGER
              </div>
            </div>
          </div>

        </div>

        {/* Mobile/Tablet Fallback Footer (Hides on Desktop) */}
        <div className="flex lg:hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-4 w-full border-t border-slate-200/40">
          <div className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-600 stroke-[2.2]" /> Verification Compliant</div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-1.5 hover:text-slate-600 transition-colors cursor-pointer"><HelpCircle size={13} /> Citizen Support Help Desk</div>
        </div>

      </div>
    </main>
  );
}