import React from 'react';

export default function Copyright() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 px-6 py-4 md:px-12 relative z-10 select-none text-center">
      <div className="max-w-7xl mx-auto text-xs font-medium tracking-wide text-slate-400">
        &copy; {new Date().getFullYear()} Team Rawjet. All rights reserved.
      </div>
    </footer>
  );
}