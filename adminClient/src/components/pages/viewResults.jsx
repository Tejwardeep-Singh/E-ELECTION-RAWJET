import React, { useState } from 'react';
import axios from 'axios';

export default function ResultsDashboard({ role }) {
  const [area, setArea] = useState('');
  const [results, setResults] = useState([]);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/results?area=${area}&role=${role}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{role === 'head' ? 'Head' : 'Admin'} Result Panel</h2>
      <input
        type="text"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder="Enter area name"
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={fetchResults}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <div className="mt-6">
        {results.map((cand, idx) => (
          <div key={idx} className="bg-gray-100 p-4 rounded my-2 shadow">
            <p><strong>{cand.name}</strong> ({cand.area})</p>
            <p>Votes: {cand.voteCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
