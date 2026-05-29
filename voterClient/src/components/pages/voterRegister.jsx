import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Fingerprint, MapPin, Building, Lock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterVoter() {
  const [formData, setFormData] = useState({
    epicNumber: '',
    userId: '',
    name: '',
    area: '',
    city: '',
    state: '',
    password: ''
  });

  const [statusMessage, setStatusMessage] = useState({ isOpen: false, type: 'success', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatusMessage({ isOpen: false, type: 'success', text: '' });
    setIsSubmitting(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/voter/register`, formData);
      setStatusMessage({
        isOpen: true,
        type: 'success',
        text: 'Registered successfully! Moving to login page...'
      });
      setTimeout(() => {
        navigate('/voter/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        isOpen: true,
        type: 'error',
        text: err.response?.data?.message || 'Registration failed. Please check your details and try again.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FBFF] font-sans flex items-center justify-center p-6 relative overflow-hidden antialiased">
      
      {/* Background Pattern Layers */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-25 pointer-events-none" />

      {/* Registration Form Card */}
      <div className="relative z-10 w-full max-w-xl bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm space-y-6">
        
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Create Voter Profile</h2>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Fill in your information to register</p>
        </div>

        {/* Status Notifications */}
        {statusMessage.isOpen && (
          <div className={`p-4 border rounded-xl flex items-start gap-3 text-xs font-semibold ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' 
              : 'bg-red-50/50 border-red-100 text-red-800'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertTriangle size={16} className="shrink-0 text-red-600 mt-0.5" />
            )}
            <p className="leading-relaxed">{statusMessage.text}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* EPIC Number Input */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="epicNumber" className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                EPIC Number (Voter ID Card)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Fingerprint size={16} className="stroke-[2.2]" />
                </div>
                <input
                  type="text"
                  name="epicNumber"
                  id="epicNumber"
                  placeholder="Enter your EPIC number"
                  required
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-mono uppercase tracking-wide"
                />
              </div>
            </div>

            {/* User ID Input */}
            <div className="space-y-1.5">
              <label htmlFor="userId" className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={16} className="stroke-[2.2]" />
                </div>
                <input
                  type="text"
                  name="userId"
                  id="userId"
                  placeholder="Create a unique user ID"
                  required
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-mono"
                />
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={16} className="stroke-[2.2]" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="As shown on your ID card"
                  required
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
              </div>
            </div>

            {/* Area Input */}
            <div className="space-y-1.5">
              <label htmlFor="area" className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Area / Constituency
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={16} className="stroke-[2.2]" />
                </div>
                <input
                  type="text"
                  name="area"
                  id="area"
                  placeholder="Your voting area"
                  required
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
              </div>
            </div>

            {/* City Input */}
            <div className="space-y-1.5">
              <label htmlFor="city" className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building size={16} className="stroke-[2.2]" />
                </div>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="Your city"
                  required
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
              </div>
            </div>

            {/* State Input */}
            <div className="space-y-1.5">
              <label htmlFor="state" className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                State
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building size={16} className="stroke-[2.2]" />
                </div>
                <input
                  type="text"
                  name="state"
                  id="state"
                  placeholder="Your state"
                  required
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} className="stroke-[2.2]" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Create a password"
                  required
                  disabled={isSubmitting}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all tracking-widest font-mono"
                />
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm rounded-xl py-2.5 shadow-sm active:scale-[0.99] transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
              {!isSubmitting && <ArrowRight size={14} className="stroke-[2.5]" />}
            </button>
          </div>

        </form>

        {/* Link to Login */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs font-semibold text-[#64748B]">
            Already registered?{' '}
            <Link to="/voter/login" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors ml-0.5">
              Login here
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}