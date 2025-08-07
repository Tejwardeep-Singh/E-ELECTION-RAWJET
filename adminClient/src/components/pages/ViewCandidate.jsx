import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ViewCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/candidate/view`)
      .then(res => setCandidates(res.data))
      .catch(err => console.error(err));
  }, []);

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <button
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded"
        onClick={() => navigate('/admin/dashboard')}
      >
         Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4">All Candidates</h2>

      <input
        placeholder="Search by name or area"
        className="border p-2 rounded mb-4 w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4">
        {filtered.map(c => (
          <div key={c._id} className="border p-4 rounded shadow">
            <p><strong>ID:</strong> {c.id}</p>
            <p><strong>Name:</strong> {c.name}</p>
            <p><strong>Area:</strong> {c.area}</p>
            <p><strong>City:</strong> {c.city}</p>
            <p><strong>State:</strong> {c.state}</p>
            <p><strong>Criminal Case:</strong> {c.criminalCase || 'None'}</p>
            <img src={c.candidateImage} alt="Candidate" className="w-20 mt-2" />
            <img src={c.partyImage} alt="Party" className="w-20 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
