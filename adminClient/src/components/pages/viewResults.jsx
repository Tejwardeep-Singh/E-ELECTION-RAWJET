import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Search,
  ArrowLeft,
  MapPin,
} from 'lucide-react';

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

      // SORT CANDIDATES BY HIGHEST VOTES
      const sortedResults = [...res.data].sort(
        (a, b) => b.voteCount - a.voteCount
      );

      setResults(sortedResults);

    } 
    catch (err) {
      console.error(err);

      if (err.response?.status === 404) {
        setError('Election results are not live yet for this area.');
      } else if (err.response?.status === 403) {
        setError('Election is currently ongoing. Results will be available after voting ends.');
      } else {
        setError('Unable to load election results at the moment.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] p-6 md:p-10 font-[Poppins]">

      {/* TOP BAR */}
      <div className="max-w-5xl mx-auto">

        <button
          onClick={() =>
            navigate(`/${role === 'head' ? 'Head' : 'Admin'}/dashboard`)
          }
          className="flex items-center gap-2 mb-8 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-black text-slate-900">
            Election Results
          </h1>

          <p className="text-slate-500 mt-2 text-lg">
            View ranked election results area-wise.
          </p>

        </div>

        {/* SEARCH BAR */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center">

          <div className="flex items-center bg-slate-100 rounded-2xl px-4 py-3 w-full">

            <MapPin className="w-5 h-5 text-slate-500 mr-3" />

            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter constituency / area name"
              className="bg-transparent outline-none w-full text-slate-700"
            />

          </div>

          <button
            onClick={fetchResults}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition duration-300 shadow-lg shadow-blue-200"
          >
            <Search className="w-5 h-5" />
            Search
          </button>

        </div>

        {/* STATUS */}
        <div className="mt-8">

          {loading && (
            <p className="text-blue-600 font-medium">
              Loading results...
            </p>
          )}

          {error && (
  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mt-6 shadow-sm">

    <div className="flex items-start gap-4">

      <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
        📢
      </div>

      <div>

        <h3 className="text-lg font-bold text-amber-800 mb-1">
          Election Status
        </h3>

        <p className="text-amber-700 leading-relaxed">
          {error}
        </p>

      </div>

    </div>

  </div>
)}

        </div>

        {/* RESULTS */}
        <div className="mt-10 space-y-5">

          {!loading && results.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">

              <p className="text-slate-500 text-lg">
                No candidates found.
              </p>

            </div>
          ) : (
            results.map((cand, idx) => {

              const rank = idx + 1;

              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-6 border shadow-sm transition hover:shadow-md bg-white ${
                    rank === 1
                      ? 'border-yellow-300 bg-yellow-50/40'
                      : 'border-slate-200'
                  }`}
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex items-center gap-5">

                      {/* RANK */}
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${
                          rank === 1
                            ? 'bg-yellow-400 text-white'
                            : rank === 2
                            ? 'bg-slate-400 text-white'
                            : rank === 3
                            ? 'bg-orange-400 text-white'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        #{rank}
                      </div>

                      {/* DETAILS */}
                      <div>

                        <div className="flex items-center gap-2">

                          <h2 className="text-2xl font-bold text-slate-900">
                            {cand.name}
                          </h2>

                          {rank === 1 && (
                            <Trophy className="w-6 h-6 text-yellow-500" />
                          )}

                          {rank === 2 && (
                            <Medal className="w-5 h-5 text-slate-500" />
                          )}

                          {rank === 3 && (
                            <Medal className="w-5 h-5 text-orange-500" />
                          )}

                        </div>

                        <p className="text-slate-500 mt-1">
                          Area: {cand.area}
                        </p>

                      </div>

                    </div>

                    {/* RIGHT */}
                    <div className="text-left md:text-right">

                      <p className="text-slate-500 text-sm mb-1">
                        Total Votes
                      </p>

                      <h3 className="text-4xl font-black text-blue-700">
                        {cand.voteCount}
                      </h3>

                    </div>

                  </div>

                  {/* WINNER TAG */}
                  {rank === 1 && (
                    <div className="mt-5 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">

                      🏆 Winning Candidate

                    </div>
                  )}

                </div>
              );
            })
          )}

        </div>

      </div>
    </div>
  );
}