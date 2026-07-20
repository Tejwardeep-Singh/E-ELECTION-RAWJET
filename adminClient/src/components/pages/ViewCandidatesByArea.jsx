import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User, MapPin, Building2, Gavel, Image as ImageIcon } from 'lucide-react';

export default function ViewCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidate/view`, { headers: { Authorization: `Bearer ${localStorage.getItem('headToken')}` } })
      .then(res => {
        setCandidates(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = candidates.filter(c =>
    (c.name && c.name.toLowerCase().includes(search.toLowerCase())) || 
    (c.address?.area && c.address.area.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FBFF] py-12 px-6 font-sans relative overflow-x-hidden select-none antialiased">
      
      {/* Background Subtle Geometries */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        
        {/* --- NAVIGATION ACTION HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/head/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors mb-2"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              Dashboard
            </button>
            <h1 className="text-3xl font-black tracking-tight text-[#0F172A] font-display">
              Candidate Directory
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] font-bold text-blue-900 tracking-wider w-fit h-fit self-start sm:self-auto shadow-xs">
            Total Verified Profiles: {candidates.length}
          </div>
        </div>

        {/* --- ACTION SEARCH FILTER BAR --- */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} className="stroke-[2.2]" />
          </div>
          <input
            type="text"
            placeholder="Search by candidate name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-xl shadow-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-slate-400/80"
          />
        </div>

        {/* --- DISPLAY CARDS ROSTER GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {loading ? (
            <div className="col-span-full text-center py-12 text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
              Reading official candidate directory indices...
            </div>
          ) : filtered.length > 0 ? (
            filtered.map(c => (
              <div 
                key={c._id} 
                className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md flex flex-col justify-between space-y-6"
              >
                {/* Header Information Segment */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block">
                      ID REFERENCE: {c.id || "N/A"}
                    </span>
                    <h3 className="text-xl font-black text-[#0F172A] tracking-tight">
                      {c.name || "Unnamed Profile"}
                    </h3>
                  </div>
                  
                  {/* Embedded Party Image/Emblem Placeholder Slot */}
                  {c.partyImage ? (
                    <img 
                      src={c.partyImage} 
                      alt="Party Emblem" 
                      className="w-12 h-12 object-contain bg-slate-50 border border-slate-100 p-1.5 rounded-xl shadow-xs" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                      <ImageIcon size={18} />
                    </div>
                  )}
                </div>

                {/* Grid Core Body Metrics Metadata */}
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs border-y border-slate-100 py-4 bg-slate-50/40 px-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Area Constituency</span>
                      <span className="font-semibold text-slate-900">{c.address?.area || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">City Location</span>
                      <span className="font-semibold text-slate-900">{c.address?.city || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">State Node</span>
                      <span className="font-semibold text-slate-900">{c.address?.state || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Gavel size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Criminal Records</span>
                      <span className={`font-bold uppercase text-[10px] tracking-wide px-2 py-0.5 rounded ${
                        c.criminalCase && c.criminalCase.toLowerCase() !== 'none'
                          ? 'bg-amber-50 border border-amber-100 text-amber-800'
                          : 'bg-emerald-50 border border-emerald-100 text-emerald-800'
                      }`}>
                        {c.criminalCase || 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Media Attachments View */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2.5">
                    {c.candidateImage ? (
                      <img 
                        src={c.candidateImage} 
                        alt="Candidate Identity Portrait" 
                        className="w-9 h-9 object-cover rounded-full border border-slate-200 shadow-xs bg-slate-50" 
                      />
                    ) : (
                      <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                        <User size={14} />
                      </div>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Verified Identity Profile
                    </span>
                  </div>
                  
                  <span className="text-[9px] font-mono font-bold text-slate-300">
                    STATUS: SECURED
                  </span>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-wider">
              No matching candidate records located inside registry indices.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
