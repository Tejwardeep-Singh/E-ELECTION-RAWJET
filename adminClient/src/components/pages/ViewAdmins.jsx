import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShieldCheck, Users, Sun, Moon } from 'lucide-react';

export default function ViewAdmins() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Localized state container controlling light / dark layouts
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/head/view`, { headers: { Authorization: `Bearer ${localStorage.getItem('headToken')}` } })
      .then(res => {
        setAdmins(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching admins:', err);
        setLoading(false);
      });
  }, []);

  const filteredAdmins = admins.filter(admin =>
    admin.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.name && admin.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`min-h-screen py-12 px-6 font-sans relative overflow-x-hidden select-none antialiased transition-colors duration-300 ${
      darkMode ? 'bg-[#0B0F19]' : 'bg-[#F8FBFF]'
    }`}>
      
      {/* Background Structural Overlays */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ${
        darkMode 
          ? 'bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_50%)]' 
          : 'bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%)]'
      }`} />
      <div className={`absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 pointer-events-none ${
        darkMode ? 'invert opacity-5' : ''
      }`} />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        
        {/* --- NAVIGATION & ACCESS ACTION BAR HEADER --- */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b transition-colors ${
          darkMode ? 'border-slate-800' : 'border-slate-200/60'
        }`}>
          <div className="space-y-1">
            <button
              onClick={() => navigate('/head/dashboard')}
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors mb-2 ${
                darkMode ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              Dashboard
            </button>
            <h1 className={`text-3xl font-black tracking-tight font-display ${
              darkMode ? 'text-white' : 'text-[#0F172A]'
            }`}>
              Administrator Roster
            </h1>
          </div>
          
          {/* Action Trigger Group: Badge Counter + Theme Toggle */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            
            {/* Real-time Tally Count Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl text-[11px] font-bold tracking-wider transition-all ${
              darkMode 
                ? 'bg-blue-950/40 border-blue-900/60 text-blue-400' 
                : 'bg-blue-50 border-blue-100 text-blue-900 shadow-xs'
            }`}>
              <Users size={14} />
              Total: {admins.length} registered
            </div>

            {/* Premium Theme Mode Controller Switch */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 border rounded-xl transition-all active:scale-95 ${
                darkMode 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
              aria-label="Toggle Portal Theme Mode"
            >
              {darkMode ? <Sun size={15} className="stroke-[2.2]" /> : <Moon size={15} className="stroke-[2.2]" />}
            </button>

          </div>
        </div>

        {/* --- ACTIONS / FILTERS BAR --- */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} className="stroke-[2.2]" />
          </div>
          <input
            type="text"
            placeholder="Search by name or User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-11 pr-4 py-2.5 text-sm font-medium rounded-xl focus:outline-none focus:ring-4 transition-all ${
              darkMode 
                ? 'bg-slate-900/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/10' 
                : 'bg-white border-slate-200 text-slate-900 shadow-sm placeholder:text-slate-400/80 focus:border-blue-600 focus:ring-blue-600/5'
            }`}
          />
        </div>

        {/* --- CENTRAL REGISTRY TABLE DATA CONTAINER --- */}
        <div className={`border rounded-2xl transition-all overflow-hidden ${
          darkMode 
            ? 'bg-slate-900/30 border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.2)]' 
            : 'bg-white border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
        } backdrop-blur-md`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200/60 text-[#64748B]'
                }`}>
                  <th className="px-6 py-4">User ID Reference</th>
                  <th className="px-6 py-4">Legal Name</th>
                  <th className="px-6 py-4 text-right">Clearance Verification</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm font-medium transition-colors ${
                darkMode ? 'divide-slate-800/60' : 'divide-slate-100'
              }`}>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-xs font-bold uppercase tracking-wider text-slate-400 animate-pulse">
                      Reading operational node data...
                    </td>
                  </tr>
                ) : filteredAdmins.length > 0 ? (
                  filteredAdmins.map(admin => (
                    <tr key={admin._id} className={`transition-colors ${
                      darkMode ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50/50'
                    }`}>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-500 dark:text-blue-400">
                        {admin.userId}
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? 'text-slate-200' : 'text-[#0F172A]'}`}>
                        {admin.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase border ${
                          darkMode 
                            ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' 
                            : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        }`}>
                          <ShieldCheck size={12} className="stroke-[2.5]" />
                          Active Token
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className={`px-6 py-12 text-center text-xs font-bold uppercase tracking-wider ${
                      darkMode ? 'text-slate-600' : 'text-[#64748B]'
                    }`}>
                      No matching administrator profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
