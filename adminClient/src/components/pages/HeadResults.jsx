import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Vote,
    Users,
    MapPinned,
    CalendarDays,
    ChevronDown,
} from "lucide-react";

export default function HeadResults() {
    const [details, setDetails] = useState(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [selectedElection, setSelectedElection] = useState(null);

    const [summary, setSummary] = useState(null);

    const [selectedConstituency, setSelectedConstituency] = useState("");

    useEffect(() => {

        loadResults();

    }, []);

    async function loadResults() {

        try {

            setLoading(true);

            // Fetch elections

            const electionRes = await axios.get(

                `${import.meta.env.VITE_API_BASE_URL}/api/head/elections`,

                {

                    headers: {

                        Authorization: `Bearer ${localStorage.getItem("headToken")}`,

                    },

                }

            );

            const elections = electionRes.data;

            if (!elections.length) {

                setLoading(false);

                return;

            }

            const election =

                elections.find(e => e.status === "Active") ||

                elections.find(e => e.status === "Completed") ||

                elections[0];

            setSelectedElection(election);

            // Fetch summary

            const summaryRes = await axios.get(

                `${import.meta.env.VITE_API_BASE_URL}/api/head/results/${election._id}`,

                {

                    headers: {

                        Authorization: `Bearer ${localStorage.getItem("headToken")}`,

                    },

                }

            );

            setSummary(summaryRes.data);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <div className="flex h-screen items-center justify-center">

                Loading Results...

            </div>

        );

    }

    if (!summary) {

        return (

            <div className="flex h-screen items-center justify-center">

                No election available.

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="mx-auto max-w-7xl p-8">

                {/* Header */}

                <button

                    onClick={() => navigate("/head/dashboard")}

                    className="mb-8 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold"

                >

                    <ArrowLeft size={18} />

                    Back to Dashboard

                </button>

                <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">

                    <h1 className="text-4xl font-black">

                        Election Results

                    </h1>

                    <p className="mt-2 text-slate-500">

                        Election analytics and published results.

                    </p>

                    <div className="mt-8">

                        <h2 className="text-2xl font-black">

                            {summary.election.title}

                        </h2>

                        <div className="mt-3 flex gap-3">

                            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">

                                {summary.election.type}

                            </span>

                            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">

                                {summary.election.status}

                            </span>

                        </div>

                    </div>

                </div>

                {/* Statistics */}

                <div className="mt-8 grid gap-6 md:grid-cols-4">

                    <StatCard

                        icon={<Vote size={22} />}

                        title="Votes Cast"

                        value={summary.statistics.totalVotes.toLocaleString()}

                    />

                    <StatCard

                        icon={<Users size={22} />}

                        title="Candidates"

                        value={summary.statistics.totalCandidates}

                    />

                    <StatCard

                        icon={<MapPinned size={22} />}

                        title="Constituencies"

                        value={summary.statistics.totalConstituencies}

                    />

                    <StatCard

                        icon={<CalendarDays size={22} />}

                        title="Published"

                        value={summary.election.resultPublishedAt ?

                            new Date(summary.election.resultPublishedAt).toLocaleDateString("en-IN")

                            :

                            "Not Published"}

                    />

                </div>

                {/* Constituency */}

                <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

                    <h2 className="text-2xl font-black">

                        Constituency

                    </h2>

                    <p className="mt-2 text-slate-500">

                        Select a constituency to view detailed results.

                    </p>

                    <div className="relative mt-6 max-w-md">

                        <select

                            value={selectedConstituency}

                            onChange={async (e) => {

    const constituencyId = e.target.value;

    setSelectedConstituency(constituencyId);

    if (!constituencyId) {

        setDetails(null);

        return;

    }

    try {

        const res = await axios.get(

            `${import.meta.env.VITE_API_BASE_URL}/api/head/results/${selectedElection._id}/${constituencyId}`,

            {

                headers: {

                    Authorization:
                        `Bearer ${localStorage.getItem("headToken")}`

                }

            }

        );

        setDetails(res.data);

    }

    catch(err){

        console.error(err);

    }

}}

                            className="w-full appearance-none rounded-2xl border border-slate-200 px-5 py-4"

                        >

                            <option value="">

                                All Constituencies

                            </option>

                            {summary.constituencies.map(c=>(

                                <option

                                    key={c._id}

                                    value={c._id}

                                >

                                    {c.constituencyNumber} - {c.constituencyName}

                                </option>

                            ))}

                        </select>

                        <ChevronDown

                            className="absolute right-4 top-4"

                            size={20}

                        />

                    </div>

                </div>

                {/* Placeholder */}

                <div className="mt-8 rounded-3xl border-2 border-dashed border-slate-300 bg-white p-16 text-center">

                   {details && (

<div className="mt-8 space-y-8">

    <div className="grid md:grid-cols-2 gap-6">

        <div className="rounded-3xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 p-8">

            <p className="text-xs uppercase font-black tracking-widest text-yellow-700">

                Winner

            </p>

            <div className="mt-5 flex items-center gap-5">

                <img

                    src={details.winner?.candidateImage}

                    className="h-24 w-24 rounded-full object-cover"

                />

                <div>

                    <h2 className="text-3xl font-black">

                        {details.winner?.name}

                    </h2>

                    <p className="mt-2">

                        {details.winner?.voteCount.toLocaleString()} Votes

                    </p>

                </div>

            </div>

        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-8">

            <StatRow

                label="Runner Up"

                value={details.runnerUp?.name || "-"}

            />

            <StatRow

                label="Winning Margin"

                value={details.statistics.winningMargin.toLocaleString()}

            />

            <StatRow

                label="Candidates"

                value={details.statistics.candidateCount}

            />

            <StatRow

                label="Votes Cast"

                value={details.statistics.totalVotes.toLocaleString()}

            />

        </div>

    </div>

    <div className="rounded-3xl border bg-white p-8">

        <h2 className="text-2xl font-black mb-8">

            Candidate Rankings

        </h2>

        {details.candidates.map((candidate,index)=>{

                const percent=

                    details.statistics.totalVotes

                    ?(

                        candidate.voteCount/

                        details.statistics.totalVotes

                    )*100

                    :0;

                return(

                    <div
                        key={candidate._id}
                        className="rounded-2xl border border-slate-200 p-5"
                    >

                        <div className="flex justify-between">

                            <div className="flex items-center gap-4">

                                <span className="font-black">

                                    #{index+1}

                                </span>

                                <img

                                    src={candidate.candidateImage}

                                    className="h-14 w-14 rounded-full object-cover"

                                />

                                <div>

                                    <h3 className="font-black">

                                        {candidate.name}

                                    </h3>

                                    <p>

                                        {candidate.voteCount.toLocaleString()} Votes

                                    </p>

                                </div>

                            </div>

                            <div>

                                {percent.toFixed(1)}%

                            </div>

                        </div>

                        <div className="mt-4 h-3 rounded-full bg-slate-100">

                            <div

                                style={{

                                    width:`${percent}%`

                                }}

                                className="h-3 rounded-full bg-blue-600"

                            />

                        </div>

                    </div>

                )

            })}

    </div>

</div>

)}

                    <p className="mt-3 text-slate-500">

                        Select a constituency above.

                    </p>

                </div>

            </div>

        </div>

    );

}

function StatCard({ icon, title, value }) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="text-blue-600">

                {icon}

            </div>

            <p className="mt-5 text-xs uppercase font-bold tracking-widest text-slate-500">

                {title}

            </p>

            <h2 className="mt-2 text-3xl font-black">

                {value}

            </h2>

        </div>

    );

}
function StatRow({ label, value }) {

    return (

        <div className="flex justify-between border-b py-4 last:border-none">

            <span className="text-slate-500">

                {label}

            </span>

            <span className="font-black">

                {value}

            </span>

        </div>

    );

}