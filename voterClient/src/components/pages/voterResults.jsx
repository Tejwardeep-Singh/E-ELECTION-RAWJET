import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Users,
  Vote,
  Trophy,
  LoaderCircle,
} from "lucide-react";

export default function VoterResult() {
  const { electionId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [election, setElection] = useState(null);

  const [statistics, setStatistics] = useState(null);

  const [winner, setWinner] = useState(null);

  const [runnerUp, setRunnerUp] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadResults();
  }, [electionId]);

  async function loadResults() {
    try {
      const token = localStorage.getItem("voterToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/voter/results/${electionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      setElection(res.data.election);

      setStatistics(res.data.statistics);

      setWinner(res.data.winner);

      setRunnerUp(res.data.runnerUp);

      setCandidates(res.data.candidates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">

        <div className="flex flex-col items-center gap-4">

          <LoaderCircle
            className="animate-spin text-blue-600"
            size={38}
          />

          <p className="text-slate-500 font-semibold">
            Loading Election Results...
          </p>

        </div>

      </div>
    );

  if (!election)
    return (
      <div className="min-h-screen flex justify-center items-center">

        <div className="text-center">

          <h2 className="text-2xl font-bold">

            Election not found

          </h2>

        </div>

      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <div className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-8 py-6">

          <button
            onClick={() => navigate("/voter/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft size={18} />

            Back to Dashboard
          </button>

          <div className="mt-6">

            <h1 className="text-4xl font-black text-slate-900">

              Election Results

            </h1>

            <p className="mt-2 text-slate-500">

              Official Election Commission Results

            </p>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Election Details */}

        <div className="bg-white rounded-3xl border border-slate-200 p-8">

          <div className="flex justify-between items-start flex-wrap gap-6">

            <div>

              <p className="uppercase tracking-widest text-xs text-blue-600 font-black">

                {election.type}

              </p>

              <h2 className="text-3xl font-black mt-2">

                {election.title}

              </h2>

            </div>

            <div className="text-right">

              <div className="flex items-center gap-2 justify-end text-slate-500">

                <CalendarDays size={16} />

                Published

              </div>

              <p className="font-bold mt-1">

                {new Date(
                  election.resultPublishedAt
                ).toLocaleString()}
              </p>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

          <StatCard
            title="Total Votes"
            value={statistics.totalVotes}
            icon={<Vote size={22} />}
          />

          <StatCard
            title="Candidates"
            value={statistics.candidateCount}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Winner Margin"
            value={statistics.winnerMargin}
            icon={<Trophy size={22} />}
          />

          <StatCard
            title="Status"
            value={election.status}
            icon={<CalendarDays size={22} />}
          />

        </div>

       {/* Winner Section */}

{winner && (
  <section className="mt-10">

    <div className="relative overflow-hidden rounded-3xl border border-yellow-300 bg-gradient-to-br from-yellow-50 via-white to-amber-50 shadow-lg">

      {/* Winner Ribbon */}

      <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-2 text-xs font-black uppercase tracking-widest text-white shadow-md">

        🏆 Winner

      </div>

      <div className="grid gap-10 p-8 md:grid-cols-[220px_1fr]">

        {/* Candidate Image */}

        <div className="flex flex-col items-center justify-center">

          {winner.candidateImage ? (
            <img
              src={winner.candidateImage}
              alt={winner.name}
              className="h-44 w-44 rounded-full border-8 border-yellow-300 object-cover shadow-xl"
            />
          ) : (
            <div className="flex h-44 w-44 items-center justify-center rounded-full border-8 border-yellow-300 bg-slate-100 text-slate-400">
              No Image
            </div>
          )}

          {winner.partyImage && (
            <div className="mt-6 rounded-2xl border bg-white p-3 shadow">

              <img
                src={winner.partyImage}
                alt="Party Symbol"
                className="h-16 w-16 object-contain"
              />

            </div>
          )}

        </div>

        {/* Winner Details */}

        <div className="flex flex-col justify-center">

          <span className="text-xs font-black uppercase tracking-[0.35em] text-yellow-700">

            Official Winner

          </span>

          <h2 className="mt-3 text-5xl font-black text-slate-900">

            {winner.name}

          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5">

              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">

                Votes Received

              </p>

              <h3 className="mt-2 text-4xl font-black text-blue-700">

                {winner.voteCount.toLocaleString()}

              </h3>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">

              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">

                Vote Share

              </p>

              <h3 className="mt-2 text-4xl font-black text-emerald-600">

                {winner.percentage}%

              </h3>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">

              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">

                Victory Margin

              </p>

              <h3 className="mt-2 text-4xl font-black text-amber-600">

                {statistics.winnerMargin.toLocaleString()}

              </h3>

            </div>

          </div>

          <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-100 p-5">

            <p className="text-sm font-semibold text-slate-700">

              <span className="font-black text-yellow-700">

                Election Summary

              </span>

              {" "}
              {winner.name} secured the highest number of valid votes in this constituency and has been declared elected by the Election Commission.

            </p>

          </div>

        </div>

      </div>

    </div>

  </section>
)}

       {/* Rankings */}

<section className="mt-12">

  <div className="flex items-center justify-between mb-6">

    <div>

      <h2 className="text-3xl font-black text-slate-900">

        Constituency Rankings

      </h2>

      <p className="mt-1 text-slate-500">

        Candidates ranked according to total votes received.

      </p>

    </div>

    <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">

      {candidates.length} Candidates

    </span>

  </div>

  <div className="space-y-6">

    {candidates.map((candidate) => (

      <CandidateResultCard
        key={candidate._id}
        candidate={candidate}
        onView={() => setSelectedCandidate(candidate)}
      />

    ))}

  </div>

</section>
{/* Criminal Declaration Modal */}

{selectedCandidate && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-black">
          Criminal Declaration
        </h2>

        <button
          onClick={() => setSelectedCandidate(null)}
          className="text-3xl font-bold text-slate-400 hover:text-slate-700"
        >
          ×
        </button>

      </div>

      <div className="mt-6">

        <h3 className="text-xl font-black">
          {selectedCandidate.name}
        </h3>

        <p className="mt-5 leading-7 text-slate-600">
          {selectedCandidate.criminalCase ||
            "No criminal declaration submitted."}
        </p>

      </div>

    </div>

  </div>

)}

      </div>

    </div>
  );
}


function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">

      <div className="flex justify-between items-center">

        <span className="text-slate-400">

          {icon}

        </span>

      </div>

      <h3 className="mt-5 text-3xl font-black">

        {value}

      </h3>

      <p className="mt-2 text-sm text-slate-500">

        {title}

      </p>

    </div>
  );
}
function CandidateResultCard({ candidate, onView }) {

  const medals = [
    "🥇",
    "🥈",
    "🥉",
  ];

  const medal =
    medals[candidate.rank - 1] || `#${candidate.rank}`;

  const border =
    candidate.rank === 1
      ? "border-yellow-300"
      : candidate.rank === 2
      ? "border-slate-300"
      : candidate.rank === 3
      ? "border-orange-300"
      : "border-slate-200";

  return (

    <div
      className={`rounded-3xl border ${border} bg-white p-6 shadow-sm transition hover:shadow-lg`}
    >

      <div className="grid gap-6 md:grid-cols-[80px_1fr_250px]">

        {/* Photo */}

        <div className="flex justify-center">

          {candidate.candidateImage ? (

            <img
              src={candidate.candidateImage}
              alt={candidate.name}
              className="h-20 w-20 rounded-full border object-cover"
            />

          ) : (

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">

              👤

            </div>

          )}

        </div>

        {/* Details */}

        <div>

          <div className="flex items-center gap-3">

            <span className="text-3xl">

              {medal}

            </span>

            <h3 className="text-2xl font-black">

              {candidate.name}

            </h3>

          </div>

          {candidate.partyImage && (

            <div className="mt-4">

              <img
                src={candidate.partyImage}
                className="h-14 object-contain"
                alt="Party Symbol"
              />

            </div>

          )}

          <button
            onClick={onView}
            className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >

            ⚖ View Criminal Declaration

          </button>

        </div>

        {/* Votes */}

        <div className="flex flex-col justify-center">

          <div className="mb-3 flex justify-between">

            <span className="text-sm font-semibold text-slate-500">

              Vote Share

            </span>

            <span className="font-black">

              {candidate.percentage}%

            </span>

          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700"
              style={{
                width: `${candidate.percentage}%`,
              }}
            />

          </div>

          <div className="mt-4 flex justify-between">

            <span className="text-slate-500">

              Votes

            </span>

            <span className="text-2xl font-black text-slate-900">

              {candidate.voteCount.toLocaleString()}

            </span>

          </div>

        </div>

      </div>

    </div>

  );

}