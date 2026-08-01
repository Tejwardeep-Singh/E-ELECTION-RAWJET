import { useEffect, useState } from "react";
import {
  Clock3,
  CalendarClock,
  CheckCircle2,
  Vote,
  Trophy,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ElectionLifecycleCard({ election, onViewResults }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    if (!election) return;

    const tick = () => {
      const now = Date.now();

      const start = new Date(election.startDate).getTime();
      const end = new Date(election.endDate).getTime();

      if (election.status === "Archived") {
        setPhase("archived");
        return;
      }

      if (election.resultVisible) {
        setPhase("published");
        return;
      }

      if (now < start) {
        setPhase("upcoming");
        setTimeLeft(start - now);
        return;
      }

      if (now < end) {
        setPhase("live");
        setTimeLeft(end - now);
        return;
      }

      setPhase("completed");
      setTimeLeft(0);
    };

    tick();

    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [election]);

  if (!election) return null;

  const total = Math.floor(timeLeft / 1000);

  const days = Math.floor(total / 86400);

  const hours = String(
    Math.floor((total % 86400) / 3600)
  ).padStart(2, "0");

  const minutes = String(
    Math.floor((total % 3600) / 60)
  ).padStart(2, "0");

  const seconds = String(total % 60).padStart(2, "0");

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 min-w-[85px]">
      <span className="text-3xl font-black text-slate-900">{value}</span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
        {label}
      </span>
    </div>
  );

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderCountdown = () => (
    <div className="mt-6 flex justify-center gap-3 flex-wrap">
      <TimeBox value={days} label="Days" />
      <TimeBox value={hours} label="Hours" />
      <TimeBox value={minutes} label="Minutes" />
      <TimeBox value={seconds} label="Seconds" />
    </div>
  );

  switch (phase) {
    case "upcoming":
      return (
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-8 shadow-sm">

          <div className="flex items-center gap-3">
            <CalendarClock className="text-amber-600" size={26} />
            <div>
              <p className="text-xs uppercase font-black tracking-widest text-amber-700">
                Upcoming Election
              </p>

              <h2 className="text-2xl font-black text-slate-900">
                {election.title}
              </h2>
            </div>
          </div>

          <p className="mt-6 text-slate-600">
            Voting begins in
          </p>

          {renderCountdown()}

          <div className="mt-8 rounded-2xl bg-white border border-amber-100 p-4">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Starts On
            </p>

            <p className="mt-1 text-lg font-bold">
              {formatDate(election.startDate)}
            </p>
          </div>

        </div>
      );

    case "live":
      return (
        <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-lg">

          <div className="flex justify-between items-start">

            <div>

              <div className="flex items-center gap-2">

                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>

                <span className="text-xs uppercase tracking-widest font-black text-emerald-700">
                  Election Live
                </span>

              </div>

              <h2 className="mt-3 text-3xl font-black">
                {election.title}
              </h2>

            </div>

            <Vote size={42} className="text-emerald-600" />

          </div>

          {renderCountdown()}

          <div className="mt-8 grid md:grid-cols-2 gap-4">

            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs uppercase font-bold text-slate-500">
                Voting Ends
              </p>

              <p className="mt-2 font-black text-lg">
                {formatDate(election.endDate)}
              </p>
            </div>

            <div className="rounded-2xl border bg-blue-50 p-4">
              <p className="text-xs uppercase font-bold text-blue-600">
                Election Type
              </p>

              <p className="mt-2 font-black text-lg">
                {election.type}
              </p>
            </div>

          </div>

        </div>
      );

    case "completed":
      return (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

          <div className="flex items-center gap-3">

            <AlertCircle size={28} className="text-red-600" />

            <div>

              <p className="text-xs uppercase font-black tracking-widest text-red-700">
                Voting Closed
              </p>

              <h2 className="text-2xl font-black">
                {election.title}
              </h2>

            </div>

          </div>

          <p className="mt-6 text-slate-700 leading-7">
            Voting has concluded successfully.
            The Election Commission is currently verifying and publishing the official results.
          </p>

        </div>
      );

    case "published":
      return (
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8">

          <div className="flex items-center gap-3">

            <Trophy size={30} className="text-blue-600" />

            <div>

              <p className="text-xs uppercase tracking-widest font-black text-blue-700">
                Results Published
              </p>

              <h2 className="text-2xl font-black">
                {election.title}
              </h2>

            </div>

          </div>

          <p className="mt-5 text-slate-700">
            Official election results have been published.
          </p>

          <button
            onClick={() => onViewResults?.()}
            className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white font-bold hover:bg-blue-700 transition"
          >
            View Election Results
          </button>

        </div>
      );

    default:
      return (
        <div className="rounded-3xl border border-slate-200 bg-slate-100 p-8">

          <div className="flex items-center gap-3">

            <CheckCircle2 size={26} />

            <div>

              <p className="text-xs uppercase tracking-widest font-black">
                Archived
              </p>

              <h2 className="text-2xl font-black">
                {election.title}
              </h2>

            </div>

          </div>

        </div>
      );
  }
}