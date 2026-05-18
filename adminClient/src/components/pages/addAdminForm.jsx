import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Fingerprint, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddAdminForm() {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
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
    setMessage('');
    setIsError(false);

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(`${baseURL}/api/head/add`, formData);
      setMessage(res.data.message || "Admin registered successfully.");
      setFormData({ userId: '', name: '', password: '' });
    } catch (err) {
      console.error("Error adding admin:", err);
      setIsError(true);
      setMessage(err.response?.data?.message || "Failed to add admin user profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex items-center justify-center p-6 relative overflow-hidden select-none antialiased">
      
      {/* Universal Structural Background Details */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.03),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(30,41,59,0.04)] space-y-6">
        
        {/* Navigation Action Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={() => navigate('/head/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" />
            Dashboard
          </button>
          <span className="text-[10px] font-mono tracking-widest text-slate-300">SECURE_NODE</span>
        </div>

        {/* Title Presentation */}
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Add New Admin</h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-wider">Create Coordinator Profile Credentials</p>
        </div>

        {/* Dynamic Server Feedback Notification Banner */}
        {message && (
          <div className={`p-4 rounded-xl flex items-start gap-3 text-xs font-medium border animate-[fadeIn_0.2s_ease-out] ${
            isError 
              ? 'bg-red-50/50 border-red-100 text-red-800' 
              : 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
          }`}>
            {isError ? (
              <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
            ) : (
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
            )}
            <p className="leading-normal">{message}</p>
          </div>
        )}

        {/* Registration Form Input Stack */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input 1: Admin User ID */}
          <div className="space-y-1.5">
            <label htmlFor="userId" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Admin User ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Fingerprint size={16} className="stroke-[2.2]" />
              </div>
              <input
                type="text"
                name="userId"
                id="userId"
                placeholder="e.g. ADMIN-5920"
                value={formData.userId}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all placeholder:text-slate-400/70"
              />
            </div>
          </div>

          {/* Input 2: Admin Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Admin Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={16} className="stroke-[2.2]" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all placeholder:text-slate-400/70"
              />
            </div>
          </div>

          {/* Input 3: Admin Security Password */}
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all placeholder:text-slate-400/70 tracking-widest font-mono"
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

          {/* Form Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-b from-blue-800 to-blue-950 text-white py-2.5 px-4 rounded-l text-xs font-bold uppercase tracking-wider hover:from-blue-900 hover:to-slate-950 active:scale-[0.99] shadow-md shadow-blue-950/5 transition-all duration-150"
            >
              Provision Admin Profile
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}