import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from 'axios';
import { BarChart3, Camera, CheckCircle2, Gavel, Image as ImageIcon, MapPin, ShieldCheck, User, Vote, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ElectionStatusWidget from "../pages/ElectionStatusWidget";
import Webcam from "react-webcam";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const constituencyDetails = (voter) => [
  ['Municipal Constituency', voter?.constituencies?.municipal],
  ['Assembly Constituency', voter?.constituencies?.assembly],
  ['Lok Sabha Constituency', voter?.constituencies?.lokSabha],
].filter(([, constituency]) => constituency);

const fullAddress = (address = {}) => [address.houseNo, address.street, address.city, address.district, address.state, address.pincode].filter(Boolean).join(', ');

export default function VoterDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('voterToken');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const [voter, setVoter] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [loading, setLoading] = useState(true);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', description: '', candidateId: null, candidateName: '' });
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'success', message: '' });
  const webcamRef = useRef(null);
  const [faceVerification, setFaceVerification] = useState({
      open: false,
      candidateId: null,
      candidateName: "",
      loading: false,
  });
  const [selectedElectionData, setSelectedElectionData] = useState(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [declaration, setDeclaration] = useState(null);
  const triggerAlert = (type, message) => setAlertConfig({ isOpen: true, type, message });
  const loadCandidates = useCallback(async () => {

    if (!selectedElection) return;

    setCandidatesLoading(true);

    try {

        const response = await axios.get(
            `${API_URL}/api/voter/candidates/${selectedElection}`,
            { headers }
        );

        setCandidates(response.data.candidates || []);
        setSelectedElectionData(response.data.election);

        // NEW
        setAlreadyVoted(response.data.alreadyVoted);

    } catch (error) {

        setCandidates([]);
        setAlreadyVoted(false);

        triggerAlert(
            "error",
            error.response?.data?.message || "Unable to load candidates."
        );

    } finally {

        setCandidatesLoading(false);

    }

}, [headers, selectedElection]);
useEffect(() => {

    if (selectedElection) {
        loadCandidates();
    }

}, [selectedElection, loadCandidates]);

  const loadElections = useCallback(async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/voter/elections`,
      { headers }
    );

    setElections(response.data);

    if (response.data.length > 0) {
      setSelectedElection(response.data[0]._id);
    }

  } catch (error) {
    triggerAlert(
      "error",
      error.response?.data?.message || "Unable to load elections."
    );
  }
}, [headers]);
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/voter/me`, { headers });
        setVoter(response.data);
        await loadElections();
      } catch (error) {
        triggerAlert('error', error.response?.data?.message || 'Unable to load your voter profile.');
      } finally {
        setLoading(false);
      }
    };

    if (token) loadDashboard();
    else {
      setLoading(false);
      triggerAlert('error', 'Your voter session is unavailable. Please sign in again.');
    }
  }, [headers, token]);

  useEffect(() => {
    if (voter) loadCandidates();
  }, [loadCandidates, voter]);

  const handleVoteConfirmation = (candidateId, candidateName) => setModalConfig({
    isOpen: true,
    title: 'Confirm Your Selection?',
    description: `You are about to cast your digital franchise for ${candidateName}. This action is legally final and cannot be altered or undone.`,
    candidateId,
    candidateName,
  });

  const executeVote = async () => {
    const { candidateId } = modalConfig;
    setModalConfig((current) => ({ ...current, isOpen: false }));
    try {
      const response = await axios.post(`${API_URL}/api/voter/vote/${candidateId}`, {}, { headers });
      setVoter((current) => ({ ...current, votingStatus: response.data.votingStatus || 'voted' }));
      triggerAlert('success', 'Your electronic ballot has been signed and recorded onto the secure server pool.');
    } catch (error) {
      triggerAlert('error', error.response?.data?.message || 'Ballot verification failed. Transaction rejected by network rules.');
    }
  };
const verifyFace = async () => {

    try {

        setFaceVerification(current => ({
            ...current,
            loading: true,
        }));

        const image = webcamRef.current.getScreenshot();

        if (!image) {

            triggerAlert(
                "error",
                "Unable to capture image."
            );

            return;
        }

        const { data } = await axios.post(

            `${API_URL}/api/voter/verify-face`,

            {
                image,
            },

            {
                headers,
            }

        );
        if (data.success && data.match) {

            setFaceVerification({

                open: false,

                candidateId: null,

                candidateName: "",

                loading: false,

            });

            handleVoteConfirmation(

                faceVerification.candidateId,

                faceVerification.candidateName

            );

        } else {

            triggerAlert(

                "error",

                `Face verification failed.\nConfidence: ${(
                    data.confidence * 100
                ).toFixed(2)}%`

            );

        }

    } catch (err) {

        triggerAlert(

            "error",

            err.response?.data?.message ||

            "Unable to verify face."

        );

    } finally {

        setFaceVerification(current => ({

            ...current,

            loading: false,

        }));

    }

};

  

  if (loading) return <div className="min-h-screen bg-[#F8FBFF] flex items-center justify-center font-sans"><div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#64748B] animate-pulse"><div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />Synchronizing Secure Node Context...</div></div>;

  const profileImage = voter?.photo?.original
  ? `${API_URL}/${voter.photo.original}`
  : voter?.photoUrl || "/default-user.png";
  const now = new Date();

let canVote = false;
let voteButtonText = "Cast Vote";

if (!selectedElectionData) {
  voteButtonText = "Loading Election...";
} else if (selectedElectionData.status === "Draft") {
  voteButtonText = "🟡 Election in Draft";
} else if (selectedElectionData.status === "Archived") {
  voteButtonText = "⚫ Election Archived";
} else if (selectedElectionData.status === "Completed") {
  voteButtonText = "🔴 Voting Closed";
} else if (
  selectedElectionData.startDate &&
  now < new Date(selectedElectionData.startDate)
) {
  voteButtonText = `⏳ Voting Starts ${new Date(
    selectedElectionData.startDate
  ).toLocaleString()}`;
} else if (
  selectedElectionData.endDate &&
  now > new Date(selectedElectionData.endDate)
) {
  voteButtonText = "🔴 Voting Closed";
} else {
  canVote = true;
  voteButtonText = "Cast Vote";
}
  const constituencies = constituencyDetails(voter);
  const details = [['EPIC Number', voter?.epicNumber], ['Gender', voter?.gender], ['Mobile Number', voter?.mobile], ['Address', fullAddress(voter?.address) || 'Not available']];

  return <div className="min-h-screen bg-[#F8FBFF] py-12 px-6 font-sans relative overflow-x-hidden antialiased"><div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%)] pointer-events-none" /><div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 pointer-events-none" /><div className="relative z-10 max-w-4xl mx-auto space-y-8">
    {voter && <section className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm"><div className="flex flex-col md:flex-row gap-6"><div className="relative shrink-0 self-center md:self-start"><img src={profileImage} alt={`${voter.name}'s profile`} onError={(event) => { event.currentTarget.src = '/default-user.png'; }} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
    
    </div><div className="flex-1"><span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest">Authorized Constituent Profile</span><h1 className="mt-1 text-2xl font-black tracking-tight text-[#0F172A]">{voter.name}</h1>{updatingPhoto && <p className="mt-1 text-[10px] text-blue-600 font-bold animate-pulse">Uploading new profile image asset...</p>}<div className="mt-4 grid gap-3 sm:grid-cols-2">{details.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2"><p className="text-[10px] uppercase font-bold tracking-wide text-slate-400">{label}</p><p className="mt-0.5 text-xs font-semibold text-slate-700 break-words">{value || 'Not available'}</p></div>)}</div></div>
    <div
    className={`self-start px-4 py-3 rounded-2xl border text-center ${
        alreadyVoted
            ? "bg-emerald-50/50 border-emerald-100/60 text-emerald-800"
            : "bg-amber-50 border-amber-100 text-amber-800"
    }`}
>
    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
        <ShieldCheck size={13} />
        {alreadyVoted ? "Vote Cast" : "Vote Pending"}
    </div>

    {selectedElectionData && (
        <p className="mt-2 text-[10px] font-semibold opacity-80">
            {selectedElectionData.title}
        </p>
    )}
</div>
    </div></section>}

    <section className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm"><div className="flex items-start gap-3"><MapPin className="mt-0.5 text-blue-600" size={19} /><div><h2 className="font-black text-[#0F172A]">Your constituencies</h2><p className="mt-1 text-xs text-[#64748B]">Constituencies based on different election scales.</p></div></div><div className="mt-4 grid gap-3 md:grid-cols-3">{constituencies.map(([label, constituency]) => <div key={label} className="rounded-2xl border border-slate-200 p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-800">{constituency.constituencyName || constituency.name || 'Not available'}</p></div>)}{!constituencies.length && <p className="text-sm text-slate-500">No constituency assignments were returned for this voter.</p>}</div></section>

    <section className="space-y-4"><div className="border-b border-slate-200 pb-3"><h2 className="text-xl font-black text-[#0F172A] tracking-tight">Election Candidates</h2><p className="text-xs font-medium text-[#64748B] mt-0.5">Select an election to view the candidates you are eligible to vote for.</p></div>
    <label className="block max-w-md text-xs font-bold uppercase tracking-wide text-slate-500">
    Election

    <select
        value={selectedElection}
        onChange={(event) =>
            setSelectedElection(event.target.value)
        }
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700"
    >
        {elections.map((election) => (
            <option
                key={election._id}
                value={election._id}
            >
                {election.title}
            </option>
        ))}

        {!elections.length && (
            <option value="">
                No elections available
            </option>
        )}
    </select>
</label>
{selectedElectionData && (
    <ElectionStatusWidget
        election={selectedElectionData}
        onViewResults={() =>
        navigate(`/voter/results/${selectedElection}`)
    }
    />
)}
    {candidatesLoading ? <div className="py-12 text-center text-xs font-bold uppercase tracking-wider text-slate-400">Loading election candidates...</div> : candidates.length === 0 ? <div className="text-center py-12 bg-white border border-slate-200/60 rounded-2xl text-[#64748B] text-xs font-bold uppercase tracking-wider">No candidates are available for the selected election.</div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{candidates.map((candidate) => <article key={candidate._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6">
    <div className="flex gap-5 items-start">

  {/* Candidate Photo */}
  <div className="shrink-0">
    {candidate.candidateImage ? (
      <img
        src={candidate.candidateImage}
        alt={candidate.name}
        className="w-28 h-28 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
      />
    ) : (
      <div className="w-28 h-28 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <ImageIcon size={24} />
      </div>
    )}
  </div>

  {/* Candidate Info */}
  <div className="flex-1">

    <div className="flex justify-between items-start">

      <div>
        <h3 className="text-xl font-black text-slate-900">
          {candidate.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Candidate ID: {candidate.id || "N/A"}
        </p>

        <button
  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
  onClick={() => setDeclaration(candidate)}
>
  <Gavel size={14} />
  View Criminal Declaration
</button>
      </div>

      {candidate.partyImage ? (
        <img
          src={candidate.partyImage}
          alt="Party emblem"
          className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 object-contain"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300">
          <ImageIcon size={16} />
        </div>
      )}

    </div>

  </div>

</div>
    {alreadyVoted ? (
    <div className="w-full text-center py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-xl">
        ✅ Vote Already Cast
    </div>
) : canVote ? (
    <button
        onClick={() =>
    setFaceVerification({
        open: true,
        candidateId: candidate._id,
        candidateName: candidate.name,
        loading: false,
    })
}
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-xs rounded-xl py-2.5 shadow-sm uppercase tracking-wider"
    >
        <Vote size={14} />
        Cast Vote for {candidate.name}
    </button>
) : (
    <button
        disabled
        className="w-full bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold uppercase cursor-not-allowed"
    >
        {voteButtonText}
    </button>
)}
    </article>)}
    {declaration && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">
          Criminal Declaration
        </h2>

        <button
          onClick={() => setDeclaration(null)}
          className="text-2xl text-slate-400 hover:text-slate-700"
        >
          ×
        </button>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-500">
        {declaration.name}
      </p>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 whitespace-pre-wrap text-sm text-slate-700">
        {declaration.criminalCase || "No criminal declaration submitted."}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setDeclaration(null)}
          className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}</div>}</section>
    <button onClick={() => navigate(`/voter/results/${selectedElection}`)} className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm"><BarChart3 size={15} />View Verified Election Results Portal</button>
  </div>
  {
faceVerification.open && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">

<div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">

<h2 className="text-xl font-black">
Identity Verification
</h2>

<p className="mt-2 text-sm text-slate-500">
Please look directly into the camera before casting your vote.
</p>

<Webcam
    ref={webcamRef}
    audio={false}
    screenshotFormat="image/jpeg"
    className="mt-5 rounded-2xl border"
/>

<div className="mt-6 flex gap-3">

<button
onClick={()=>setFaceVerification({
    open:false,
    candidateId:null,
    candidateName:"",
    loading:false
})}
className="flex-1 rounded-xl border py-3"
>
Cancel
</button>

<button
    onClick={verifyFace}
    disabled={faceVerification.loading}
    className="flex-1 rounded-xl bg-blue-600 py-3 text-white disabled:opacity-60"
>
    {faceVerification.loading
        ? "Verifying..."
        : "Capture & Verify"}
</button>

</div>

</div>

</div>

)}
  {modalConfig.isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"><div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-lg space-y-6 text-center"><div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto"><Vote size={22} /></div><div><h3 className="text-lg font-black text-slate-900">{modalConfig.title}</h3><p className="mt-1.5 text-xs font-medium text-slate-500 leading-relaxed">{modalConfig.description}</p></div><div className="flex gap-3"><button onClick={() => setModalConfig((current) => ({ ...current, isOpen: false }))} className="w-1/2 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl py-3">Cancel</button><button onClick={executeVote} className="w-1/2 bg-blue-600 text-white text-xs font-bold uppercase rounded-xl py-3">Sign & Transmit Ballot</button></div></div></div>}
  {alertConfig.isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-xs"><div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md text-center space-y-5"><div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${alertConfig.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>{alertConfig.type === 'success' ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}</div><p className="text-xs font-semibold text-slate-800">{alertConfig.message}</p><button onClick={() => setAlertConfig((current) => ({ ...current, isOpen: false }))} className="w-full bg-slate-900 text-white text-xs font-bold uppercase rounded-xl py-2.5">Acknowledge</button></div></div>}
  </div>;
  
}
