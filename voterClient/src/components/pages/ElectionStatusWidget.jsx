import { useEffect, useState } from "react";
import {
  Clock3,
  ShieldCheck,
  AlertCircle,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";

const ElectionStatusWidget = ({ election }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!election) return;

    const updateTimer = () => {
      const now = Date.now();

      let remaining = 0;

      if (election.status === "Active") {
        remaining =
          new Date(election.endDate).getTime() - now;
      } else if (election.status === "Draft") {
        remaining =
          new Date(election.startDate).getTime() - now;
      }

      setTimeLeft(Math.max(remaining, 0));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [election]);

  if (!election) return null;

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);

    const days = Math.floor(totalSeconds / 86400);

    const hrs = Math.floor((totalSeconds % 86400) / 3600);

    const mins = Math.floor((totalSeconds % 3600) / 60);

    const secs = totalSeconds % 60;

    return {
      days,
      hrs: String(hrs).padStart(2, "0"),
      mins: String(mins).padStart(2, "0"),
      secs: String(secs).padStart(2, "0"),
    };
  };

  const { days, hrs, mins, secs } = formatTime(timeLeft);

  // ---------------- Draft ----------------

  if (election.status === "Draft") {
    return (
      <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2">
          <CalendarClock className="text-amber-600" size={18} />
          <span className="font-black uppercase text-xs tracking-wider text-amber-700">
            Upcoming Election
          </span>
        </div>

        <p className="mt-2 text-lg font-black text-slate-900">
          {election.title}
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Voting begins in
        </p>

        <div className="mt-4 flex gap-2 font-mono">
          <TimeBox value={days} label="Days" />
          <TimeBox value={hrs} label="Hours" />
          <TimeBox value={mins} label="Minutes" />
          <TimeBox value={secs} label="Seconds" />
        </div>
      </div>
    );
  }

  // ---------------- Active ----------------

  if (election.status === "Active") {
    return (
      <div className="w-full rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">

            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>

            <ShieldCheck
              size={18}
              className="text-emerald-600"
            />

            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
              Election Live
            </span>

          </div>

          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <Clock3 size={14} />
            Ends Soon
          </div>

        </div>

        <h2 className="mt-3 text-xl font-black text-slate-900">
          {election.title}
        </h2>

        <div className="mt-5 flex gap-2 font-mono">
          <TimeBox value={days} label="Days" />
          <TimeBox value={hrs} label="Hours" />
          <TimeBox value={mins} label="Minutes" />
          <TimeBox value={secs} label="Seconds" />
        </div>

      </div>
    );
  }

  // ---------------- Completed ----------------

  if (election.status === "Completed") {
    return (
      <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-5">

        <div className="flex items-center gap-2">

          <AlertCircle
            size={18}
            className="text-red-600"
          />

          <span className="font-black uppercase text-xs tracking-wider text-red-700">
            Voting Closed
          </span>

        </div>

        <h2 className="mt-3 text-lg font-black">
          {election.title}
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          This election has concluded.
          Results will be published by the Election Commission.
        </p>

      </div>
    );
  }

  // ---------------- Archived ----------------

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 p-5">

      <div className="flex items-center gap-2">

        <CheckCircle2
          size={18}
          className="text-slate-600"
        />

        <span className="font-black uppercase text-xs tracking-wider text-slate-700">
          Election Archived
        </span>

      </div>

      <h2 className="mt-3 text-lg font-black">
        {election.title}
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        This election has been archived.
      </p>

    </div>
  );
};

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 min-w-[72px]">

      <span className="text-2xl font-black text-slate-900">
        {value}
      </span>

      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>

    </div>
  );
}

export default ElectionStatusWidget;