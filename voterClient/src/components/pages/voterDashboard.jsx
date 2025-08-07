import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VoterDashboard() {
  const [voter, setVoter] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [electionStatus, setElectionStatus] = useState({ electionLive: false, resultVisible: false });
  const [voted, setVoted] = useState(false);

  const token = localStorage.getItem('voterToken');
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/voter/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setVoter(res.data);
        setVoted(res.data.hasVoted);
        fetchCandidates(res.data.area);
      })
      .catch(err => console.error('Failed to fetch voter:', err));

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/election/status`)
      .then(res => setElectionStatus(res.data))
      .catch(err => console.error('Failed to fetch election status:', err));
  }, []);

  const fetchCandidates = (area) => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidate/by-area/${area}`)
      .then(res => setCandidates(res.data))
      .catch(err => console.error('Failed to fetch candidates:', err));
  };

  const handleVote = async (candidateId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/voter/vote/${candidateId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Vote submitted successfully!');
      setVoted(true);
    } catch (err) {
      console.error(err);
      alert('Vote failed.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome to Voter Dashboard</h2>

      {voter && (
        <div className="mb-6 text-lg">
          <p><strong>Name:</strong> {voter.name}</p>
          <p><strong>Area:</strong> {voter.area}</p>
          <p><strong>Status:</strong> {voted ? "You have voted" : "You have not voted"}</p>
        </div>
      )}

      {/* Candidate Details */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Candidates in Your Area</h3>
        {candidates.length === 0 ? (
          <p>No candidates available.</p>
        ) : (
          <div className="grid gap-4">
            {candidates.map(candidate => (
              <div key={candidate._id} className="p-4 border rounded shadow-sm">
                <h4 className="font-bold text-lg">{candidate.name}</h4>
                <p><strong>Area:</strong> {candidate.area}</p>
                <p><strong>Criminal Cases:</strong> {candidate.crimminalCase || 'None'}</p>
                <div className="flex gap-4 mt-2">
                  <img src={candidate.candidateImage} alt="Candidate" className="w-20 h-20 rounded" />
                  <img src={candidate.partyImage} alt="Party" className="w-20 h-20 rounded" />
                </div>

                {/* Show vote button only if election is live and voter hasn't voted */}
                {electionStatus.electionLive && !voted && (
                  <button
                    onClick={() => handleVote(candidate._id)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Vote for {candidate.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show results only if election is over */}
      {electionStatus.resultVisible && (
        <button
          onClick={() => handleNavigate('/voter/results')}
          className="bg-sky-600 text-white py-4 px-4 rounded-xl hover:bg-sky-900 transition text-lg font-semibold shadow-md"
        >
          View Election Results
        </button>
      )}
    </div>
  );
}
