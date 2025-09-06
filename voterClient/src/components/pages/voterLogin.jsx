import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Import Link

export default function VoterLogin() {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/voter/login`, formData);
      localStorage.setItem('voterToken', res.data.token);
      navigate('/voter/dashboard'); // Voter dashboard
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 h-screen">
      <h2 className="text-xl font-bold mb-4">Voter Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="userId"
          placeholder="User ID"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>

      {/* 🔗 Link to Registration */}
      <p className="mt-4 text-center">
        Not registered?{' '}
        <Link to="/voter/register" className="text-blue-600 underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
