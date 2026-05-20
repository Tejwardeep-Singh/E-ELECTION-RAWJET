import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserCheck, ShieldCheck, Users } from 'lucide-react';

export default function ViewAdmins() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/head/view`)
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
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6 font-sans relative overflow-x-hidden select-none antialiased">
      
      {/* Background Structural Decorators */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.03),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        
        {/* --- NAVIGATION ACTION HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/head/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors mb-2"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              Dashboard
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              View Admins
            </h1>
          </div>
          
          {/* Real-time Tally Count Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] font-bold text-blue-900 tracking-wider w-fit h-fit self-end sm:self-auto">
            <Users size={14} />
            Total: {admins.length} registered
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
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-xl shadow-sm focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all placeholder:text-slate-400/80"
          />
        </div>

        {/* --- CENTRAL REGISTRY TABLE --- */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">User ID Reference</th>
                  <th className="px-6 py-4">Legal Name</th>
                  <th className="px-6 py-4 text-right">Clearance Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-xs font-bold uppercase tracking-wider text-slate-400 animate-pulse">
                      Reading operational node data...
                    </td>
                  </tr>
                ) : filteredAdmins.length > 0 ? (
                  filteredAdmins.map(admin => (
                    <tr key={admin._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-900">
                        {admin.userId}
                      </td>
                      <td className="px-6 py-4 text-slate-900">
                        {admin.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-extrabold tracking-wide uppercase border border-emerald-100">
                          <ShieldCheck size={12} className="stroke-[2.5]" />
                          Active Token
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-400 font-medium">
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