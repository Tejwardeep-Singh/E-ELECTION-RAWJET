import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, MapPin, Search, User } from 'lucide-react';

const getToken = () => localStorage.getItem('adminToken');

export default function ViewVoters() {
  const [voters, setVoters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/voter/view`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(({ data }) => setVoters(data))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Unable to load the voter directory.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredVoters = voters.filter((voter) => {
    const value = search.toLowerCase();
    return [voter.name, voter.epicNumber, voter.userId, voter.address?.area]
      .some((field) => field?.toLowerCase().includes(value));
  });

  return (
    <main className="min-h-screen bg-[#F8FBFF] py-12 px-6 font-sans relative overflow-x-hidden antialiased">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%)] pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <button onClick={() => navigate('/admin/dashboard')} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 mb-2">
              <ArrowLeft size={14} /> Dashboard
            </button>
            <h1 className="text-3xl font-black tracking-tight text-[#0F172A]">Voter Directory</h1>
            <p className="text-xs font-medium text-slate-500 mt-1">Profiles available within your authorized jurisdiction.</p>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] font-bold text-blue-900 tracking-wider w-fit">Total Profiles: {voters.length}</div>
        </div>

        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, EPIC number, or area..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-sm rounded-xl shadow-sm focus:outline-none focus:border-blue-600" />
        </div>

        {loading ? <p className="text-center py-12 text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Loading voter directory...</p> : error ? (
          <p className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredVoters.map((voter) => (
              <article key={voter._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                {voter.photoUrl ? <img src={voter.photoUrl} alt={`${voter.name} profile`} className="w-14 h-14 rounded-full object-cover border border-slate-200" /> : <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><User size={22} /></div>}
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-slate-900 truncate">{voter.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">EPIC: {voter.epicNumber}</p>
                  <p className="inline-flex items-center gap-1 text-xs text-slate-500 mt-2"><MapPin size={12} />{[voter.address?.area, voter.address?.city, voter.address?.state].filter(Boolean).join(', ')}</p>
                </div>
                <button onClick={() => navigate(`/admin/voters/${voter._id}`)} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors">
                  <Eye size={14} /> View Details
                </button>
              </article>
            ))}
            {!filteredVoters.length && <p className="col-span-full text-center py-12 bg-white border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-400">No voter profiles found.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
