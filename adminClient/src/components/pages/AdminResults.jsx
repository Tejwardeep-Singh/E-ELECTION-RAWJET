import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { BarChart3, Trophy, Users, Vote } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <section
    className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
  >
    {children}
  </section>
);

const StatCard = ({ title, value, Icon }) => (
  <Card>
    <Icon className="mb-4 text-blue-600" size={20} />
    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
      {title}
    </p>
    <p className="mt-2 text-2xl font-black text-slate-900">
      {value}
    </p>
  </Card>
);

export default function AdminResults() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api("/api/admin/results", {
            role: "admin",
        })
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
  return (
    <div>

      {/* Header */}

      <div className="mb-7">
        <h1 className="text-2xl font-black text-slate-900">
          Election Results
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View the published results of your assigned constituency.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Election"
          value={loading ? "Loading..." : data?.election?.title || "—"}
          Icon={Vote}
        />

        <StatCard
          title="Constituency"
          value={
            loading
                ? "Loading..."
                : data?.constituency?.constituencyName || "—"
        }
                Icon={Users}
                />

        <StatCard
          title="Turnout"
          value={loading ? "--" : data?.statistics?.totalVotes || 0}
          Icon={BarChart3}
        />

        <StatCard
          title="Winner"
          value={
    loading
        ? "Loading..."
        : data?.winner?.name || "No Winner"
}
          Icon={Trophy}
        />

      </div>

      {/* Candidate Results */}

      <Card className="mt-6 overflow-x-auto">

        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Candidate Results
        </h2>

        <table className="min-w-[900px] w-full table-fixed text-left text-sm">

          <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Candidate</th>
              <th className="px-4 py-3 whitespace-nowrap">Party</th>
              <th className="px-4 py-3 whitespace-nowrap">Votes</th>
              <th className="px-4 py-3 whitespace-nowrap">Vote %</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
            </tr>

          </thead>

          <tbody>

    {loading ? (

        <tr>
            <td
                colSpan="5"
                className="px-4 py-10 text-center text-slate-500"
            >
                Loading...
            </td>
        </tr>

    ) : (

        data?.candidates?.map((candidate) => {

            const percentage =
                data.statistics.totalVotes
                    ? (
                          (candidate.voteCount /
                              data.statistics.totalVotes) *
                          100
                      ).toFixed(2)
                    : 0;

            return (

                <tr
                    key={candidate._id}
                    className="border-b"
                >

                    <td className="px-4 py-3">
    <div className="flex items-center gap-3">

        <img
            src={candidate.candidateImage}
            alt={candidate.name}
            className="h-12 w-12 rounded-full object-cover border border-slate-200"
        />

        <div>
            <p className="font-semibold text-slate-900">
                {candidate.name}
            </p>

            <p className="text-xs text-slate-500">
                Candidate #{candidate.id}
            </p>
        </div>

    </div>
</td>

                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                            <img
                                src={candidate.partyImage}
                                alt="Party Symbol"
                                className="h-8 w-8 object-contain rounded-full"
                            />
                        </div>
                    </td>

                    <td className="px-4 py-3">
                        {candidate.voteCount}
                    </td>

                    <td className="px-4 py-3">
                        {percentage}%
                    </td>

                    <td className="px-4 py-3">

                        {candidate._id === data.winner?._id ? (
                            <span className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                                Winner
                            </span>
                        ) : (
                            "-"
                        )}

                    </td>

                </tr>

            );

        })

    )}

</tbody>

        </table>

      </Card>

    </div>
  );
}