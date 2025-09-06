import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResultsDashboard({ role }) {
  const [area, setArea] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      let url = `${baseURL}/api/results?role=${role}`;
      if (area.trim() !== '') {
        url += `&area=${encodeURIComponent(area.trim())}`;
      }

      const res = await axios.get(url);
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded"
        onClick={() => navigate(`/${role === 'head' ? 'Head' : 'Admin'}/dashboard`)}
      >
         Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold mb-4">{role === 'head' ? 'Head' : 'Admin'} Result Panel</h2>
      
      
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Enter area name (optional)"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={fetchResults}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading results...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="mt-6">
        {results.length === 0 && !loading ? (
          <p className="text-gray-600">No candidates found.</p>
        ) : (
          results.map((cand, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded my-2 shadow">
              <p><strong>{cand.name}</strong> ({cand.area})</p>
              <p>Votes: {cand.voteCount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
