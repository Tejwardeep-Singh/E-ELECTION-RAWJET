// AdminLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <div className='min-h-screen bg-gray-50 flex items-center justify-center font-sans'>
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md border border-blue-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white  rounded-2xl w-96 space-y-6">
        <h2 className="text-xl font-bold text-center text-blue">Admin Login</h2>
        <input
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          placeholder="User ID"
          required
          className="w-full border px-3 py-2 rounded text-center text-blue"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border px-3 py-2 rounded text-center text-blue "
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-center">Login</button>
      </form>
    </div>
    </div>
  );
}
