import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User, MapPin, Building2, Gavel, Image, Save } from 'lucide-react';

export default function EditCandidate() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidate/view`)
      .then(res => {
        setCandidates(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleEdit = async (e, id) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidate/edit/${id}`, data);
      alert("Candidate updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  const filtered = candidates.filter(c =>
    (c.name && c.name.toLowerCase().includes(search.toLowerCase())) || 
    (c.area && c.area.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FBFF] py-12 px-6 font-sans relative overflow-x-hidden select-none antialiased">
      
      {/* Background Subtle Geometries */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        
        {/* --- NAVIGATION ACTION HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors mb-2"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              Dashboard
            </button>
            <h1 className="text-3xl font-black tracking-tight text-[#0F172A] font-display">
              Modify Profiles
            </h1>
          </div>
          <div className="text-[10px] font-mono tracking-widest text-slate-300 font-bold px-3 py-1.5 bg-white border border-slate-200/60 rounded-xl shadow-xs self-start sm:self-auto">
            REGISTRY_MOD_NODE
          </div>
        </div>

        {/* --- ACTION SEARCH FILTER BAR --- */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} className="stroke-[2.2]" />
          </div>
          <input
            type="text"
            placeholder="Search by candidate name or constituency area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-xl shadow-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-slate-400/80"
          />
        </div>

        {/* --- CANDIDATES LIST MATRIX LAYER --- */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
              Reading official candidate directory indices...
            </div>
          ) : filtered.length > 0 ? (
            filtered.map(c => (
              <form 
                key={c._id} 
                onSubmit={(e) => handleEdit(e, c._id)} 
                encType="multipart/form-data" 
                className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)] backdrop-blur-md grid gap-6"
              >
                {/* Internal Card Sub-Header */}
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
                      {c.name || "Unnamed Profile"}
                    </h3>
                    <p className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider mt-0.5">
                      System UID Ref: {c.id || "N/A"}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/40">
                    Constituency: {c.area || "N/A"}
                  </span>
                </div>

                {/* Primary Data Input Fields Cluster Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  
                  {/* Field: ID */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Record ID</label>
                    <div className="relative">
                      <input name="id" defaultValue={c.id} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold font-mono rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
                    </div>
                  </div>

                  {/* Field: Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Legal Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={13} /></div>
                      <input name="name" defaultValue={c.name} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
                    </div>
                  </div>

                  {/* Field: Area */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Constituency Area</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><MapPin size={13} /></div>
                      <input name="area" defaultValue={c.area} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
                    </div>
                  </div>

                  {/* Field: City */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City Jurisdiction</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Building2 size={13} /></div>
                      <input name="city" defaultValue={c.city} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
                    </div>
                  </div>

                  {/* Field: State */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">State Node</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Building2 size={13} /></div>
                      <input name="state" defaultValue={c.state} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
                    </div>
                  </div>

                  {/* Field: Criminal History Record Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Criminal Case Indices</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Gavel size={13} /></div>
                      <input name="criminalCase" defaultValue={c.criminalCase} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
                    </div>
                  </div>

                </div>

                {/* File Media Selection Block Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 border border-slate-200/40 p-4 rounded-xl">
                  
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Image size={12} /> Candidate Identity Photo
                    </span>
                    <input 
                      type="file" 
                      name="candidateImage" 
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:uppercase file:tracking-wide file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Image size={12} /> Party Coalition Emblem
                    </span>
                    <input 
                      type="file" 
                      name="partyImage" 
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:uppercase file:tracking-wide file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
                    />
                  </div>

                </div>

                {/* Card Submission Anchor Button */}
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-xs rounded-xl px-5 py-2.5 shadow-sm active:scale-[0.99] transition-all uppercase tracking-wider font-display"
                  >
                    <Save size={14} />
                    Commit Profile Updates
                  </button>
                </div>

              </form>
            ))
          ) : (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-wider">
              No coordinating candidate indices matched your filter query.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}