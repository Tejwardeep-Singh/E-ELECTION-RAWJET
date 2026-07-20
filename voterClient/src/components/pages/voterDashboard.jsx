import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, ShieldCheck, CheckCircle2, AlertTriangle, Vote, BarChart3, Gavel, Image as ImageIcon, Camera } from 'lucide-react';

export default function VoterDashboard() {
  const [voter, setVoter] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [electionStatus, setElectionStatus] = useState({ electionLive: false, resultVisible: false });
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', description: '', candidateId: null, candidateName: '' });
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'success', message: '' });

  const token = localStorage.getItem('voterToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoterData = async () => {
      try {
        const voterRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/voter/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVoter(voterRes.data);
        setVoted(voterRes.data.votingStatus === 'voted');
        
        const { area, city, state } = voterRes.data.address;
        const candidatesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidate/by-area/${area}`, {
          params: { city, state },
        });
        setCandidates(candidatesRes.data);
      } catch (err) {
        console.error('Failed to fetch voter/candidates:', err);
        triggerAlert('error', 'Session validation error. Unable to verify constituent identity nodes.');
      }
    };

    const fetchElectionStatus = async () => {
      try {
        const statusRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/election/status`);
        setElectionStatus(statusRes.data);
      } catch (err) {
        console.error('Failed to fetch election status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVoterData();
    fetchElectionStatus();
  }, [token]);

  const triggerAlert = (type, message) => {
    setAlertConfig({ isOpen: true, type, message });
  };

  const handleVoteConfirmation = (candidateId, candidateName) => {
    setModalConfig({
      isOpen: true,
      title: "Confirm Your Selection?",
      description: `You are about to cast your digital franchise for ${candidateName}. This action is legally final and cannot be altered or undone.`,
      candidateId,
      candidateName
    });
  };

  const executeVote = async () => {
    const { candidateId } = modalConfig;
    setModalConfig(prev => ({ ...prev, isOpen: false }));
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/voter/vote/${candidateId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      triggerAlert('success', 'Your electronic ballot has been signed and recorded onto the secure server pool.');
      setVoted(true);
    } catch (err) {
      console.error(err);
      triggerAlert('error', err.response?.data?.message || 'Ballot verification failed. Transaction rejected by network rules.');
    }
  };

  const handlePhotoUpdate = async (e) => {
    try {
      setUpdatingPhoto(true);
      const file = e.target.files[0];
      if (!file) {
        setUpdatingPhoto(false);
        return;
      }

      const formData = new FormData();
      formData.append("photoUrl", file);

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/voter/update-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setVoter(prev => ({ ...prev, photoUrl: res.data.photoUrl }));
      triggerAlert('success', 'Profile photo updated successfully.');
    } catch (err) {
      console.error(err);
      triggerAlert('error', err.response?.data?.message || 'Failed to update profile photo.');
    } finally {
      setUpdatingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FBFF] flex items-center justify-center font-sans">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#64748B] animate-pulse">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Synchronizing Secure Node Context...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF] py-12 px-6 font-sans relative overflow-x-hidden antialiased">
      
      {/* Background Meshes */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* --- SECTION 1: CLEAN INTEGRATED PROFILE CARD --- */}
        {voter && (
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Side: Avatar Upload + Identity Metrics */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full">
              {/* Profile Avatar Frame with Built-in Photo Update Control */}
              <div className="relative shrink-0 group">
                <img
                  src={voter.photoUrl || "/default-user.png"}
                  alt="voter profile"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/default-user.png";
                  }}
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                />
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer transition-colors border-2 border-white">
                  <Camera size={14} />
                  <input type="file" accept="image/*" hidden onChange={handlePhotoUpdate} />
                </label>
              </div>

              {/* Text Info */}
              <div className="space-y-3 w-full">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest block">Authorized Constituent Profile</span>
                  <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">{voter.name}</h1>
                  {updatingPhoto && <p className="text-[10px] text-blue-600 font-bold animate-pulse">Uploading new profile image asset...</p>}
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-[#64748B]">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-xl">
                    <MapPin size={13} className="text-slate-400" /> {voter.address?.area}
                  </span>
                  <span className={`flex items-center gap-1.5 px-3 py-1 border rounded-xl font-bold uppercase tracking-wider text-[10px] ${
                    voted ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'
                  }`}>
                    <ShieldCheck size={13} className={voted ? 'text-emerald-600' : 'text-amber-600'} />
                    {voted ? "Ballot Submitted" : "Ballot Pending"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right Side: Station Operational Status Box */}
            <div className={`w-full md:w-auto px-4 py-3 rounded-2xl border text-center md:text-right shrink-0 ${
              electionStatus.electionLive ? 'bg-emerald-50/50 border-emerald-100/60 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs font-black uppercase tracking-wider">
                <span className={`w-2 h-2 rounded-full ${electionStatus.electionLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                {electionStatus.electionLive ? 'Station Live' : 'Station Inactive'}
              </div>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">Secure Cloud Ballot Box</p>
            </div>
          </div>
        )}

        {/* --- SECTION 2: LIVE AREA CANDIDATES DIRECTORY --- */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Candidates in Your Constituency</h2>
            <p className="text-xs font-medium text-[#64748B] mt-0.5">Please review official records and backgrounds carefully before choosing.</p>
          </div>

          {candidates.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200/60 rounded-2xl text-[#64748B] text-xs font-bold uppercase tracking-wider">
              No matching candidate records indexed for constituency: {voter?.address?.area}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.map(candidate => (
                <div key={candidate._id} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-6">
                  
                  {/* Card Main Header Segments */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-[#0F172A] tracking-tight">{candidate.name}</h3>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
                          <Gavel size={12} /> Disclosures:
                          <span className={`font-black rounded px-1.5 py-0.5 uppercase text-[9px] ${
                            candidate.criminalCase && candidate.criminalCase.toLowerCase() !== 'none'
                              ? 'bg-amber-50 text-amber-800 border border-amber-100'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          }`}>
                            {candidate.criminalCase || 'None'}
                          </span>
                        </span>
                      </div>
                      
                      {/* Party Image Slot */}
                      {candidate.partyImage ? (
                        <img src={candidate.partyImage} alt="Party Emblem" className="w-10 h-10 object-contain bg-slate-50 border border-slate-100 p-1 rounded-xl shadow-2xs" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300"><ImageIcon size={14} /></div>
                      )}
                    </div>

                    {/* Candidate Portrait Thumbnail */}
                    {candidate.candidateImage && (
                      <div className="w-full h-32 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative">
                        <img src={candidate.candidateImage} alt="Candidate Portrait" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Actions Toggle Parameters */}
                  {electionStatus.electionLive && !voted ? (
                    <button
                      onClick={() => handleVoteConfirmation(candidate._id, candidate.name)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-xs rounded-xl py-2.5 shadow-sm active:scale-[0.99] transition-all uppercase tracking-wider cursor-pointer"
                    >
                      <Vote size={14} />
                      Cast Vote for {candidate.name}
                    </button>
                  ) : electionStatus.electionLive && voted ? (
                    <div className="w-full text-center py-2 bg-slate-50 border border-slate-200/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-xl">
                      Voting Locked
                    </div>
                  ) : null}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- SECTION 3: SYSTEM AUDIT CONCLUDED CONTEXT --- */}
        {electionStatus.resultVisible && (
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => navigate('/voter/results')}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
            >
              <BarChart3 size={15} />
              View Verified Election Results Portal
            </button>
          </div>
        )}

      </div>

      {/* --- REUSABLE CONFIRMATION ACTION BALLOT OVERLAY --- */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-lg space-y-6 text-center animate-[scaleUp_0.2s_ease-out]">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Vote size={22} className="stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black tracking-tight text-slate-900">{modalConfig.title}</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">{modalConfig.description}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                className="w-1/2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-xl py-3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeVote}
                className="w-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl py-3 shadow-sm transition-colors cursor-pointer"
              >
                Sign & Transmit Ballot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- THEME-ALIGNED STATUS ALERT NOTIFICATION POPUP --- */}
      {alertConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-xs animate-[fadeIn_0.1s_ease-out]">
          <div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md text-center space-y-5 animate-[scaleUp_0.15s_ease-out]">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${
              alertConfig.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
            }`}>
              {alertConfig.type === 'success' ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed px-2">{alertConfig.message}</p>
            <button
              type="button"
              onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
              className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl py-2.5 transition-colors cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
