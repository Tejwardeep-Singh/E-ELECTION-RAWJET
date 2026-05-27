import React from 'react';

export default function Copyright() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/60 px-6 py-4 relative z-10 select-none text-center transition-colors">
      <div className="max-w-7xl mx-auto text-[11px] font-bold uppercase tracking-widest text-[#64748B] font-mono">
        &copy; {new Date().getFullYear()} Team Rawjet. All rights reserved.
      </div>
    </footer>
  );
}