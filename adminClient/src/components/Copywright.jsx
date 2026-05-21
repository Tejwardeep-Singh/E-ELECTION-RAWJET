import React from 'react';

export default function Copyright() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/60 px-6 py-5 md:px-12 relative z-10 select-none text-center">
      <div className="max-w-7xl mx-auto text-xs font-medium tracking-wide text-[#64748B] font-sans">
        &copy; {new Date().getFullYear()} Team Rawjet. All rights reserved.
      </div>
    </footer>
  );
}