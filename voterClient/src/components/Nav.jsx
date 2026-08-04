import React, { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/logo.png";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Helper function to handle active routing font colors
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 relative z-50 select-none font-sans transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* --- LEFT SIDE: LOGO BRAND IDENTITY --- */}
        <Link to="/" className="flex items-center group">
  <img
    src={logo}
    alt="Bharat Ballot"
    className="h-12 sm:h-16 md:h-20 lg:h-18 w-auto object-contain transition-all duration-300 group-hover:scale-105"
  />
</Link>

        {/* --- DESKTOP ROUTING NAVIGATION LINKS --- */}
        <ul className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider">
          <li>
            <Link 
              to="/" 
              className={`transition-colors duration-200 ${
                isActive('/') ? 'text-blue-600' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/voter/login" 
              className={`transition-colors duration-200 ${
                isActive('/voter/login') ? 'text-blue-600' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Voter Login
            </Link>
          </li>
        </ul>

        {/* --- MOBILE HAMBURGER TRIGGER BUTTON --- */}
        <button  
          onClick={() => setOpen(!open)} 
          className="md:hidden p-1.5 text-[#0F172A] bg-slate-50 border border-slate-200/60 rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
          aria-label="Toggle Navigation Menu"
        >
          {open ? <X size={18} className="stroke-[2.2]" /> : <Menu size={18} className="stroke-[2.2]" />}
        </button>
      </div>

      {/* --- RESPONSIVE MOBILE EXPANSION TRAY --- */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg p-6 md:hidden animate-[fadeIn_0.15s_ease-out]">
          <ul className="flex flex-col space-y-4 text-xs font-bold uppercase tracking-wider">
            <li>
              <Link 
                to="/" 
                onClick={() => setOpen(false)} 
                className={`block py-1 transition-colors ${
                  isActive('/') ? 'text-blue-600' : 'text-[#64748B]'
                }`}
              >
                Home Gateway
              </Link>
            </li>
            <li>
              <Link 
                to="/voter/login" 
                onClick={() => setOpen(false)} 
                className={`block py-1 transition-colors ${
                  isActive('/voter/login') ? 'text-blue-600' : 'text-[#64748B]'
                }`}
              >
                Voter Desk
              </Link>
            </li>
          </ul>
          
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            <ShieldCheck size={12} className="text-emerald-600" />
            NODE_SECURED_TLS
          </div>
        </div>
      )}
    </nav>
  );
}