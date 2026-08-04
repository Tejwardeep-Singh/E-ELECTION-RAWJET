import React from 'react';

export default function Copyright() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/60 px-6 py-4 relative z-10 select-none">
      <div className="max-w-7xl mx-auto text-center text-[11px] font-bold uppercase tracking-widest text-slate-500">
        © {new Date().getFullYear()} Bharat Ballot. All rights reserved.
      </div>
    </footer>
  );
}