import React, { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; 

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Helper function to check active path for premium visual underline anchors
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 md:px-12 font-sans select-none transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* --- LEFT: Brand Identity --- */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-b from-blue-800 to-blue-950 rounded-xl flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm shadow-blue-950/10 transform group-hover:scale-[1.02] transition-transform duration-200">
            {/* If you want to use logo.png, just replace the 'E' below with your img tag */}
            <span>E</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-slate-900 uppercase leading-none mb-0.5">
              Admin Panel
            </span>
            <span className="text-[10px] font-bold tracking-widest text-blue-800 uppercase opacity-80 leading-none">
              Election Systems
            </span>
          </div>
        </div>

        {/* --- CENTER/RIGHT: Desktop Navigation --- */}
        <ul className="hidden md:flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          <li>
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 hover:text-slate-900 hover:bg-slate-100/60 ${
                isActive('/') ? 'text-blue-900 bg-blue-50/60 font-extrabold' : ''
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/admin" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 hover:text-slate-900 hover:bg-slate-100/60 ${
                isActive('/admin') ? 'text-blue-900 bg-blue-50/60 font-extrabold' : ''
              }`}
            >
              Admin
            </Link>
          </li>
          <li>
            <Link 
              to="/head" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 hover:text-slate-900 hover:bg-slate-100/60 ${
                isActive('/head') ? 'text-blue-900 bg-blue-50/60 font-extrabold' : ''
              }`}
            >
              Head
            </Link>
          </li>

          {/* Institutional Divider */}
          <div className="h-4 w-[1px] bg-slate-200 mx-3" />

          {/* Micro-status component inside navbar */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-extrabold text-emerald-700 tracking-widest">
            <ShieldCheck size={13} className="stroke-[2.5]" />
            SECURE
          </div>
        </ul>

        {/* --- RIGHT: Mobile Hamburger Action --- */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-slate-700 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
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
                  isActive('/') ? 'text-blue-900 bg-blue-50 font-extrabold' : 'hover:bg-slate-50 hover:text-slate-900'
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
                  isActive('/admin') ? 'text-blue-900 bg-blue-50 font-extrabold' : 'hover:bg-slate-50 hover:text-slate-900'
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
                  isActive('/head') ? 'text-blue-900 bg-blue-50 font-extrabold' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Head
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}