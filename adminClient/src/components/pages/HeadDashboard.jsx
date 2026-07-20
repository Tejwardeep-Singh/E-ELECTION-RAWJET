import React, { useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, UserCheck, UserMinus, 
  Award, Sliders, BarChart3, Radio, RotateCcw, 
  ShieldAlert, LayoutDashboard, Settings, AlertTriangle, CheckCircle2
} from 'lucide-react';

export default function HeadDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // 1. Confirmation Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    isDangerous: false,
    onConfirm: () => {}
  });

  // 2. Alert Notification State (Replaces browser alert())
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'success', // 'success' | 'error' | 'warning'
    message: ''
  });
  const [resultsLive, setResultsLive] = useState(false);

  const handleNavigate = (path) => {
    navigate(path); 
  };

  const triggerConfirmation = (config) => {
    setModalConfig({
      isOpen: true,
      title: config.title,
      description: config.description,
      confirmText: config.confirmText,
      isDangerous: config.isDangerous,
      onConfirm: () => {
        config.action();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const triggerAlert = (type, message) => {
    setAlertConfig({
      isOpen: true,
      type,
      message
    });
  };
  const fetchElectionStatus = async () => {
  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/election/status`
    );

    const data = await res.json();

    setResultsLive(data.resultVisible);

  } catch (err) {

    console.error(err);

  }
};
useEffect(() => {
  fetchElectionStatus();
}, []);
  const executePublishResults = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/head/show-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('headToken')}` },
      });
      const data = await res.json();
      if (res.ok) {
        triggerAlert('success', 'Results are now visible to everyone on the public platform!');
      } else {
        triggerAlert('warning', data.message || 'Failed to broadcast results.');
      }
    } catch (err) {
      console.error('Error:', err);
      triggerAlert('error', 'Network configuration fault: Failed to submit broadcast.');
    }
  };

  const executeResetElection = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/head/reset-election`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('headToken')}` },
      });
      const data = await res.json();
      if (res.ok) {
        triggerAlert('success', 'Election core matrices reset successfully!');
      } else {
        triggerAlert('warning', data.message || 'Failed to clear election data.');
      }
    } catch (err) {
      console.error('Error resetting election:', err);
      triggerAlert('error', 'System runtime fault: Core reset operation aborted.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] font-sans flex flex-col md:flex-row antialiased select-none">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 z-20">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif font-black text-base shadow-sm">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase">Head Portal</span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Control Unit</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'overview' ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={16} />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('personnel')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'personnel' ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users size={16} />
              Manage Admins
            </button>
            <button 
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'maintenance' ? 'bg-red-50 text-red-600 font-black' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings size={16} />
              System Settings
            </button>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2 pt-4 border-t border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <ShieldAlert size={14} className="text-blue-600" />
          Master Clearance
        </div>
      </aside>

      {/* --- MAIN CORE PANEL WORKSPACE --- */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl overflow-y-auto relative z-10">
        
        {/* TAB STATE 1: SYSTEM OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome Back, System Head</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Here is a quick overview of your network control capabilities.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => handleNavigate('/head/candidates')} className="group p-5 bg-white border border-slate-200/60 rounded-2xl shadow-xs text-left hover:border-blue-600 transition-all">
                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-4">
                  <Award size={18} />
                </div>
                <span className="text-sm font-bold block text-slate-900">Parties & Candidates</span>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Review registrations and entries.</span>
              </button>

              <button onClick={() => handleNavigate('/head/election')} className="group p-5 bg-white border border-slate-200/60 rounded-2xl shadow-xs text-left hover:border-blue-600 transition-all">
                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-4">
                  <Sliders size={18} />
                </div>
                <span className="text-sm font-bold block text-slate-900">Election Timers</span>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Adjust or check active voting hours.</span>
              </button>

              <button onClick={() => handleNavigate('/head/results')} className="group p-5 bg-white border border-slate-200/60 rounded-2xl shadow-xs text-left hover:border-blue-600 transition-all">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl w-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-4">
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
              <button onClick={() => handleNavigate('/head/viewAdmins')} className="flex items-center gap-4 p-4 bg-white border border-slate-200/60 rounded-2xl shadow-xs hover:border-blue-600 transition-all text-left">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl"><Users size={20} /></div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">List System Admins</span>
                  <span className="text-xs text-slate-400 font-medium">View active coordinating accounts.</span>
                </div>
              </button>

              <button onClick={() => handleNavigate('/head/addAdmin')} className="flex items-center gap-4 p-4 bg-white border border-slate-200/60 rounded-2xl shadow-xs hover:border-blue-600 transition-all text-left">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl"><UserPlus size={20} /></div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Create Admin Profile</span>
                  <span className="text-xs text-slate-400 font-medium">Issue a new staff credential key.</span>
                </div>
              </button>

              <button onClick={() => handleNavigate('/head/editAdmin')} className="flex items-center gap-4 p-4 bg-white border border-slate-200/60 rounded-2xl shadow-xs hover:border-blue-600 transition-all text-left">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl"><UserCheck size={20} /></div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Modify Permissions</span>
                  <span className="text-xs text-slate-400 font-medium">Update standard account limitations.</span>
                </div>
              </button>

              <button onClick={() => handleNavigate('/head/deleteAdmin')} className="flex items-center gap-4 p-4 bg-white border border-slate-200/60 rounded-2xl shadow-xs hover:border-red-600 transition-all text-left">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl"><UserMinus size={20} /></div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Revoke Credentials</span>
                  <span className="text-xs text-slate-400 font-medium">Immediately terminate admin privileges.</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TAB STATE 3: SYSTEM MAINTENANCE CONTROLS */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Critical System Maintenance</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">High-impact master parameters. Exercise caution before running actions.</p>
            </div>

            <div className="space-y-4">
              {/* Broadcast Card */}
              <div className="p-6 bg-white border border-slate-200/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Radio size={16} className="animate-pulse" />
                    Make Results Public
                  </div>
                  <p className="text-xs text-slate-400 font-medium max-w-md">
                    This pushes compiled local data stacks to open view portals globally. This action cannot be undone.
                  </p>
                </div>
                <button
  disabled={resultsLive}
  onClick={() => {

    if (resultsLive) return;

    triggerConfirmation({
      title: "Make Results Public?",
      description:
        "This action publishes the finalized vote logs to the public citizen portal. This process cannot be reversed.",
      confirmText: "Publish Broadcast",
      isDangerous: false,
      action: executePublishResults
    });

  }}
  className={`px-5 py-2.5 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all shrink-0 ${
    resultsLive
      ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
      : 'bg-emerald-600 hover:bg-emerald-700'
  }`}
>

  {resultsLive
    ? 'Results Already Live'
    : 'Publish Results'}

</button>
              </div>

              {/* Reset Card */}
              <div className="p-6 bg-white border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <RotateCcw size={16} />
                    Reset Full Election Data
                  </div>
                  <p className="text-xs text-slate-400 font-medium max-w-md">
                    Completely deletes all candidates from the registry and resets voter histories to empty variables.
                  </p>
                </div>
                <button 
                  onClick={() => triggerConfirmation({
                    title: "Reset Full Election Data?",
                    description: "Warning: This block completely wipes all registered candidates and clears historical citizen voting traces. This action is irreversible.",
                    confirmText: "Execute Hard Reset",
                    isDangerous: true,
                    action: executeResetElection
                  })} 
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors shrink-0"
                >
                  Reset Data
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- A. THE THEME-ALIGNED CONFIRMATION MODAL OVERLAY --- */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] space-y-6 text-center animate-[scaleUp_0.2s_ease-out]">
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border ${
              modalConfig.isDangerous ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'
            }`}>
              <AlertTriangle size={22} className="stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black tracking-tight text-slate-900 font-display">{modalConfig.title}</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">{modalConfig.description}</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                className="w-1/2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-xl py-3 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={modalConfig.onConfirm}
                className={`w-1/2 text-white text-xs font-bold uppercase tracking-wider rounded-xl py-3 transition-colors shadow-sm ${
                  modalConfig.isDangerous 
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/10' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/10'
                }`}
              >
                {modalConfig.confirmText}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- B. THE THEME-ALIGNED NOTIFICATION STATUS ALERT (Replaces alert()) --- */}
      {alertConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-xs animate-[fadeIn_0.1s_ease-out]">
          <div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.1)] text-center space-y-5 animate-[scaleUp_0.15s_ease-out]">
            
            {/* Dynamic Status Icon Circle */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${
              alertConfig.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
              alertConfig.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' :
              'bg-amber-50 border-amber-100 text-amber-600'
            }`}>
              {alertConfig.type === 'success' ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
            </div>

            <p className="text-xs font-semibold text-slate-800 leading-relaxed px-2">
              {alertConfig.message}
            </p>

            <button
              type="button"
              onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
              className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl py-2.5 transition-colors"
            >
              Acknowledge
            </button>

          </div>
        </div>
      )}

    </div>
  );
} 
