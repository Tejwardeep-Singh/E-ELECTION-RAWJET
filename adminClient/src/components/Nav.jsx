import React, { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; 

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Helper function to dynamically track active path highlighting
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-md border-b border-slate-200/60 px-6 py-3.5 md:px-12 font-sans select-none transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* --- LEFT: BharatBallot Identity --- */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-serif font-black text-lg shadow-sm shadow-blue-600/10 transform group-hover:scale-[1.01] transition-transform duration-200">
            <span>B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-slate-900 font-display leading-none mb-0.5">
              Bharat<span className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 bg-clip-text text-transparent">Ballot</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase leading-none">
              Secure Election Portal
            </span>
          </div>
        </div>

        {/* --- CENTER/RIGHT: Desktop Civic Navigation --- */}
        <ul className="hidden md:flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          <li>
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 hover:text-slate-900 ${
                isActive('/') ? 'text-blue-600 bg-blue-50/60 font-black' : 'hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/admin" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 hover:text-slate-900 ${
                isActive('/admin') ? 'text-blue-600 bg-blue-50/60 font-black' : 'hover:bg-slate-50'
              }`}
            >
              Admin
            </Link>
          </li>
          <li>
            <Link 
              to="/head" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 hover:text-slate-900 ${
                isActive('/head') ? 'text-blue-600 bg-blue-50/60 font-black' : 'hover:bg-slate-50'
              }`}
            >
              Head Panel
            </Link>
          </li>

          {/* Institutional Structural Divider */}
          <div className="h-4 w-[1px] bg-slate-200 mx-3" />

          {/* Civic Micro-Status Token */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] font-black text-emerald-800 tracking-widest">
            <ShieldCheck size={12} className="stroke-[2.5] text-emerald-600" />
            SECURE NODE
          </div>
        </ul>

        {/* --- RIGHT: Mobile Hamburger Action --- */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-slate-700 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          aria-label="Toggle Menu"
        >
          {open ? <X size={20} className="stroke-[2.5]" /> : <Menu size={20} className="stroke-[2.5]" />}
        </button>
      </div>

      {/* --- BOTTOM: Mobile Panel Overlay Menu --- */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl shadow-slate-900/5 px-6 py-4 animate-[fadeIn_0.2s_ease-out]">
          <ul className="space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            <li>
              <Link 
                to="/" 
                onClick={() => setOpen(false)} 
                className={`block w-full px-4 py-3 rounded-xl transition-colors ${
                  isActive('/') ? 'text-blue-600 bg-blue-50 font-black' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/admin" 
                onClick={() => setOpen(false)} 
                className={`block w-full px-4 py-3 rounded-xl transition-colors ${
                  isActive('/admin') ? 'text-blue-600 bg-blue-50 font-black' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Admin
              </Link>
            </li>
            <li>
              <Link 
                to="/head" 
                onClick={() => setOpen(false)} 
                className={`block w-full px-4 py-3 rounded-xl transition-colors ${
                  isActive('/head') ? 'text-blue-600 bg-blue-50 font-black' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Head Panel
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}