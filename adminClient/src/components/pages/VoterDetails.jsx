import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, ShieldCheck, User } from 'lucide-react';

const getToken = () => localStorage.getItem('adminToken');
const formatDate = (value) => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Not available';

export default function VoterDetails() {
  const { id } = useParams();
  const [voter, setVoter] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/voters/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(({ data }) => setVoter(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to retrieve voter details.'));
  }, [id]);

  if (error) return <main className="min-h-screen bg-[#F8FBFF] p-12"><div className="max-w-3xl mx-auto p-5 bg-red-50 border border-red-100 rounded-xl text-red-700">{error}</div></main>;
  if (!voter) return <main className="min-h-screen bg-[#F8FBFF] p-12 text-center text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Loading voter profile...</main>;

  const fields = [
    ['Full Name', voter.name], ['EPIC Number', voter.epicNumber], ['User ID', voter.userId],
    ['State', voter.address?.state], ['City', voter.address?.city], ['Area', voter.address?.area],
    ['Voting Status', voter.votingStatus?.replace('_', ' ')], ['Account Status', voter.status],
    ['Account Creation Date', formatDate(voter.createdAt)], ['Last Updated Date', formatDate(voter.updatedAt)],
  ];
  if (voter.lastVerification) fields.push(['Face Verification Status', voter.lastVerification.success ? 'Verified' : 'Not verified'], ['Last Face Verification', formatDate(voter.lastVerification.time)]);

  return (
    <main className="min-h-screen bg-[#F8FBFF] py-12 px-6 font-sans relative overflow-x-hidden antialiased">
      <div className="relative max-w-3xl mx-auto">
        <button onClick={() => navigate('/admin/voters')} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 mb-6"><ArrowLeft size={14} /> Voter Directory</button>
        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <header className="p-7 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-5 sm:items-center">
            {voter.photoUrl ? <img src={voter.photoUrl} alt={`${voter.name} profile`} className="w-24 h-24 rounded-2xl object-cover border border-slate-200" /> : <div className="w-24 h-24 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center"><User size={36} /></div>}
            <div><p className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Voter profile</p><h1 className="text-3xl font-black text-slate-900 mt-1">{voter.name}</h1><p className="text-sm text-slate-500 mt-1 inline-flex items-center gap-1"><MapPin size={14} />{[voter.address?.area, voter.address?.city, voter.address?.state].filter(Boolean).join(', ')}</p></div>
          </header>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 p-7">
            {fields.map(([label, value]) => <div key={label} className="border-b border-slate-100 pb-4"><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-800 capitalize">{value || 'Not available'}</dd></div>)}
          </dl>
          <footer className="px-7 py-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-600" /><CalendarDays size={14} /> Sensitive credentials and biometric data are not displayed.</footer>
        </section>
      </div>
    </main>
  );
}
