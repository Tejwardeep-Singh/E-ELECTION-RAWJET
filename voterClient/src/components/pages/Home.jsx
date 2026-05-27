import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, BarChart3, ShieldCheck, Fingerprint, HelpCircle } from 'lucide-react';
// Import your streamlined timer component if needed here:
// import CountdownTimer from './CountdownTimer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-70px)] bg-[#F8FBFF] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden select-none antialiased">
      
      {/* Structural Background Layers */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.05),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-10 my-auto">
        
        {/* --- HERO BRAND IDENTITY HEADER --- */}
        <div className="space-y-4">
          {/* Animated Central Emblem Token */}
          <div className="inline-flex w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl items-center justify-center text-white font-serif font-black text-2xl shadow-md shadow-blue-600/10 mb-2 transform hover:scale-[1.02] transition-transform duration-200">
            B
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0F172A] font-display leading-tight">
            Bharat<span className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 bg-clip-text text-transparent">Ballot</span>
          </h1>
          
          <p className="text-base md:text-lg font-medium text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Cast your digital franchise securely. Exercise your democratic choice via decentralized cryptographic authentication protocols.
          </p>
        </div>

        {/* --- DYNAMIC TIMER AREA --- */}
        {/* You can swap out this placeholder shell with your real compact timer component smoothly */}
        <div className="w-full max-w-md mx-auto transform hover:scale-[1.01] transition-transform">
          {/* <CountdownTimer onElectionEnd={() => console.log('Election Ended')} /> */}
          <div className="bg-white/80 backdrop-blur-xs border border-slate-200/60 rounded-xl py-2 px-4 flex items-center justify-center gap-2 shadow-xs text-xs font-bold uppercase tracking-wider text-blue-600">
            <ShieldCheck size={14} className="stroke-[2.5]" />
            Encrypted Voting Framework Active
          </div>
        </div>

        {/* --- PRIMARY PORTAL CARD NAVIGATIONS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
          
          {/* Action A: Proceed to Auth Voting Terminal */}
          <button 
            onClick={() => navigate('/voter-login')}
            className="group p-6 bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] text-left flex flex-col justify-between hover:border-blue-600 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 mb-5 shadow-xs">
                <Vote size={20} className="stroke-[2.2]" />
              </div>
              <h3 className="text-base font-black text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
                Citizen Voting Terminal
              </h3>
              <p className="text-xs text-[#64748B] font-medium mt-1 leading-normal">
                Authenticate your Aadhaar ID/Constituent keys to cast your ballot safely into the secure server pool.
              </p>
            </div>
            
            <div className="mt-6 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-500 transition-colors">
              <Fingerprint size={12} />
              Verify & Vote
            </div>
          </button>

          {/* Action B: Track Real-Time Results Public Portal */}
          <button 
            onClick={() => navigate('/results')}
            className="group p-6 bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] text-left flex flex-col justify-between hover:border-blue-600 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div>
              <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 mb-5 shadow-xs">
                <BarChart3 size={20} className="stroke-[2.2]" />
              </div>
              <h3 className="text-base font-black text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
                Live Election Trends
              </h3>
              <p className="text-xs text-[#64748B] font-medium mt-1 leading-normal">
                Inspect statistical data flows, seat compositions, and live constituent tally outputs if released by the head desk.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-500 transition-colors">
              <ShieldCheck size={12} />
              Auditable Ledger
            </div>
          </button>

        </div>

        {/* --- PLATFORM COMPLIANCE FOOTER INDICATOR --- */}
        <div className="pt-4 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-600 stroke-[2.5]" /> UIDAI Compliant</div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-1 hover:text-slate-600 cursor-pointer"><HelpCircle size={12} /> Help Desk</div>
        </div>

      </div>
    </main>
  );
}