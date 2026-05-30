import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, UserPlus, UserMinus, Sliders, BarChart3, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleNavigate = (path) => navigate(path);

  return (
    <main className="min-h-screen bg-[#F8FBFF] font-sans flex items-center justify-center p-6 md:p-12 relative overflow-hidden antialiased">
      
      {/* Background Subtle Pattern Layers */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-25 pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8">
        
        {/* --- DASHBOARD HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200/80 rounded-full shadow-2xs text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
              <ShieldCheck size={13} className="stroke-[2.5]" />
              Administrative Control Unit
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#0F172A] font-display">
              Admin Dashboard
            </h1>
            <p className="text-xs font-medium text-[#64748B]">
              Manage election configurations, candidate registries, and live data tallies.
            </p>
          </div>
        </div>

        {/* --- CONTROL PANELS GRID MATRIX --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          
          {/* Card 1: See Candidates */}
          <button 
            onClick={() => handleNavigate('/admin/candidate/view')}
            className="group bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(15,23,42,0.01)] text-left flex flex-col justify-between hover:border-blue-600 hover:shadow-[0_12px_40px_-6px_rgba(37,99,235,0.04)] transition-all duration-300 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <UserCheck size={20} className="stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
                  See Candidates
                </h3>
                <p className="text-xs font-medium text-[#64748B] leading-relaxed">
                  Browse and review all registered candidates and party emblems currently in the system.
                </p>
              </div>
            </div>
          </button>

          {/* Card 2: Add Candidate */}
          <button 
            onClick={() => handleNavigate('/admin/candidate/add')}
            className="group bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(15,23,42,0.01)] text-left flex flex-col justify-between hover:border-blue-600 hover:shadow-[0_12px_40px_-6px_rgba(37,99,235,0.04)] transition-all duration-300 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <UserPlus size={20} className="stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
                  Add Candidate
                </h3>
                <p className="text-xs font-medium text-[#64748B] leading-relaxed">
                  Register a new candidate profile, upload images, and assign constituency sectors.
                </p>
              </div>
            </div>
          </button>

          {/* Card 3: Edit Candidate */}
          <button 
            onClick={() => handleNavigate('/admin/candidate/edit')}
            className="group bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(15,23,42,0.01)] text-left flex flex-col justify-between hover:border-blue-600 hover:shadow-[0_12px_40px_-6px_rgba(37,99,235,0.04)] transition-all duration-300 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Sliders size={20} className="stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
                  Edit Candidate
                </h3>
                <p className="text-xs font-medium text-[#64748B] leading-relaxed">
                  Modify existing candidate profiles, change background records, or update state regions.
                </p>
              </div>
            </div>
          </button>

          {/* Card 4: Delete Candidate */}
          <button 
            onClick={() => handleNavigate('/admin/candidate/delete')}
            className="group bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(15,23,42,0.01)] text-left flex flex-col justify-between hover:border-red-600/60 hover:shadow-[0_12px_40px_-6px_rgba(220,38,38,0.03)] transition-all duration-300 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl w-fit group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                <UserMinus size={20} className="stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight group-hover:text-red-600 transition-colors">
                  Delete Candidate
                </h3>
                <p className="text-xs font-medium text-[#64748B] leading-relaxed">
                  Remove candidate entries entirely from the registry indices. Action is final.
                </p>
              </div>
            </div>
          </button>

          {/* Card 5: View Results */}
          <button 
            onClick={() => handleNavigate('/admin/results')}
            className="group bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(15,23,42,0.01)] text-left flex flex-col justify-between hover:border-blue-600 hover:shadow-[0_12px_40px_-6px_rgba(37,99,235,0.04)] transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1"
          >
            <div className="space-y-4">
              <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <BarChart3 size={20} className="stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
                  View Results
                </h3>
                <p className="text-xs font-medium text-[#64748B] leading-relaxed">
                  Monitor live vote accumulations, statistical curves, and cryptographic tally summaries.
                </p>
              </div>
            </div>
          </button>

        </div>

      </div>
    </main>
  );
}