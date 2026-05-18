import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(`${baseURL}/api/adminLogin`, formData);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex items-center justify-center p-6 relative overflow-hidden select-none antialiased">
      
      {/* Structural Background Layers */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.03),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(30,41,59,0.04)]">
        
        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-gradient-to-b from-blue-800 to-blue-950 rounded-xl items-center justify-center text-white font-serif font-bold text-xl shadow-md mb-4">
            E
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">Portal Sign In</h3>
          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Standard Admin Panel</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* User ID Field */}
          <div className="space-y-1.5">
            <label htmlFor="userId" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              User ID Reference
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={16} className="stroke-[2.2]" />
              </div>
              <input
                type="text"
                name="userId"
                id="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                placeholder="e.g. ADMIN-4920"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all placeholder:text-slate-400/80"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} className="stroke-[2.2]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all placeholder:text-slate-400/80 tracking-widest font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-b from-blue-800 to-blue-950 text-white py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:from-blue-900 hover:to-slate-950 active:scale-[0.99] shadow-lg shadow-blue-950/10 transition-all duration-150"
            >
              Authenticate Sign In
            </button>
          </div>

        </form>

        {/* Dynamic Verification Note */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          <ShieldCheck size={12} className="stroke-[2.5]" />
          End-to-End Encrypted Session
        </div>

      </div>
    </div>
  );
}