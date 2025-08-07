import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VoterResult() {
  const [results, setResults] = useState([]);
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('voterToken'); // make sure token key is correct
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/voter/results`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.candidates) {
          setResults(res.data.candidates);
          setArea(res.data.area || 'Unknown');
        } else {
          setResults([]);
          setArea('Unknown');
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setResults([]); // fallback to avoid undefined
        setArea('Unknown');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p className="p-4">Loading election results...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Election Results - {area}</h2>
      {results.length === 0 ? (
        <p>No candidates found in your area.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((c, index) => (
            <li key={c._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{index + 1}. {c.name} ({c.area})</h3>
              <p className="text-sm">Votes: {c.voteCount}</p>
              <p className="text-sm">Criminal Cases: {c.criminalCase || 'None'}</p>
              <img src={c.candidateImage} alt={c.name} className="h-20 mt-2" />
              <img src={c.partyImage} alt="Party" className="h-12 mt-2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
