import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ import Link

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 shadow-md font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold">
            <span><img src="/logo.png" alt="logo here" /></span>
          </div>
          <span className="text-xl font-semibold">Voter Panel</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          <li>
            <Link to="/" className="hover:text-blue-300 transition">Home</Link>
          </li>
          <li>
            <Link to="/voter/login" className="hover:text-blue-300 transition">voter</Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="md:hidden mt-4 space-y-2 text-sm font-medium">
          <li>
            <Link to="/" onClick={() => setOpen(false)} className="hover:text-blue-300 transition">Home</Link>
          </li>
          <li>
            <Link to="/admin" onClick={() => setOpen(false)} className="hover:text-blue-300 transition">Admin</Link>
          </li>
          <li>
            <Link to="/head" onClick={() => setOpen(false)} className="hover:text-blue-300 transition">Head</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
