import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, UserCheck, UserMinus, 
  Award, Sliders, BarChart3, Radio, RotateCcw, 
  ShieldAlert, LayoutDashboard, Settings, Activity
} from 'lucide-react';

export default function HeadDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleNavigate = (path) => {
    navigate(path); 
  };

  const handlePublishResults = async () => {
    const c1 = window.confirm("⚠️ Are you sure you want to make results visible?");
    if (!c1) return;
    const c2 = window.confirm("✅ This action cannot be undone. Proceed?");
    if (!c2) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/head/show-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) alert('✅ Results are now visible to everyone!');
      else alert('⚠️ ' + data.message);
    } catch (err) {
      console.error('Error:', err);
      alert('Error making results visible');
    }
  };

  const handleResetElection = async () => {
    const c1 = window.confirm("⚠️ Are you sure you want to RESET the election?");
    if (!c1) return;
    const c2 = window.confirm("❗ This will DELETE ALL CANDIDATES & RESET ALL VOTERS. Continue?");
    if (!c2) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/head/reset-election`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) alert('✅ Election reset successfully!');
      else alert('⚠️ ' + data.message);
    } catch (err) {
      console.error('Error resetting election:', err);
      alert('Error resetting election.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col md:flex-row antialiased select-none">
      
      {/* --- SIDEBAR TRAV NAVIGATION --- */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 z-20">
        <div className="space-y-8">
          {/* Internal Title Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
              E
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase">Head Portal</span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Control Unit</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'overview' ? 'bg-blue-50 text-blue-950 font-black' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={16} />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('personnel')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'personnel' ? 'bg-blue-50 text-blue-950 font-black' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users size={16} />
              Manage Admins
            </button>
            <button 
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'maintenance' ? 'bg-red-50 text-red-950 font-black' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings size={16} />
              System Settings
            </button>
          </nav>
        </div>

        {/* Security Badge Clear Footer inside sidebar */}
        <div className="hidden md:flex items-center gap-2 pt-4 border-t border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <ShieldAlert size={14} className="text-blue-900" />
          Master Clearance
        </div>
      </aside>

      {/* --- MAIN CORE PANEL WORKSPACE --- */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl overflow-y-auto relative z-10">
        
        {/* TAB STATE 1: SYSTEM OVERVIEW (Default Landing) */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome Back, System Head</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Here is a quick overview of your network control capabilities.</p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => handleNavigate('/head/candidates')} className="group p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-left hover:border-blue-800 transition-all">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-900 transition-colors mb-4">
                  <Award size={18} />
                </div>
                <span className="text-sm font-bold block text-slate-900">Parties & Candidates</span>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Review registrations and entries.</span>
              </button>

              <button onClick={() => handleNavigate('/head/election')} className="group p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-left hover:border-blue-800 transition-all">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-900 transition-colors mb-4">
                  <Sliders size={18} />
                </div>
                <span className="text-sm font-bold block text-slate-900">Election Timers</span>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Adjust or check active voting hours.</span>
              </button>

              <button onClick={() => handleNavigate('/head/results')} className="group p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-left hover:border-blue-800 transition-all">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-900 transition-colors mb-4">
                  <BarChart3 size={18} />
                </div>
                <span className="text-sm font-bold block text-slate-900">Live Vote Metrics</span>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Inspect real-time tally configurations.</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB STATE 2: PERSONNEL MANAGEMENT CHANNELS */}
        {activeTab === 'personnel' && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Personnel & Trustee Control</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Manage sub-administrator staff profiles and entry accounts.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => handleNavigate('/head/viewAdmins')} className="flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-blue-800 transition-all text-left">
                <div className="p-3 bg-slate-50 text-slate-700 rounded-xl"><Users size={20} /></div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">List System Admins</span>
                  <span className="text-xs text-slate-400 font-medium">View active coordinating accounts.</span>
                </div>
              </button>

              <button onClick={() => handleNavigate('/head/addAdmin')} className="flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-blue-800 transition-all text-left">
                <div className="p-3 bg-slate-50 text-slate-700 rounded-xl"><UserPlus size={20} /></div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Create Admin Profile</span>
                  <span className="text-xs text-slate-400 font-medium">Issue a new staff credential key.</span>
                </div>
              </button>

              <button onClick={() => handleNavigate('/head/editAdmin')} className="flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-blue-800 transition-all text-left">
                <div className="p-3 bg-slate-50 text-slate-700 rounded-xl"><UserCheck size={20} /></div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Modify Permissions</span>
                  <span className="text-xs text-slate-400 font-medium">Update standard account limitations.</span>
                </div>
              </button>

              <button onClick={() => handleNavigate('/head/deleteAdmin')} className="flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-red-600 transition-all text-left">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl"><UserMinus size={20} /></div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Revoke Credentials</span>
                  <span className="text-xs text-slate-400 font-medium">Immediately terminate admin privileges.</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TAB STATE 3: SYSTEM RISK / DANGER ZONE SETTINGS */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Critical System Maintenance</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">High-impact master parameters. Exercise caution before running actions.</p>
            </div>

            <div className="space-y-4">
              {/* Broadcast Card */}
              <div className="p-6 bg-white border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Radio size={16} className="animate-pulse" />
                    Make Results Public
                  </div>
                  <p className="text-xs text-slate-400 font-medium max-w-md">
                    This pushes compiled local data stacks to open view portals globally. This action cannot be undone.
                  </p>
                </div>
                <button onClick={handlePublishResults} className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0">
                  Publish Results
                </button>
              </div>

              {/* Reset Card */}
              <div className="p-6 bg-white border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <RotateCcw size={16} />
                    Reset Full Election Data
                  </div>
                  <p className="text-xs text-slate-400 font-medium max-w-md">
                    Completely deletes all candidates from the registry and resets voter histories to empty variables.
                  </p>
                </div>
                <button onClick={handleResetElection} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0">
                  Reset Data
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}