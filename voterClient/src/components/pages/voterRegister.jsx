import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterVoter() {
  const [formData, setFormData] = useState({
    epicNumber: '',
    userId: '',
    name: '',
    area: '',
    city:'',
    state:'',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/voter/register`, formData);
      alert('Voter registered successfully!');
      navigate('/voter/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Register as Voter</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="epicNumber" type="number" placeholder="EPIC Number" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="userId" placeholder="User ID" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="name" placeholder="Name" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="area" placeholder="Area" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="city" placeholder="City" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="state" placeholder="State" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required className="w-full border p-2 rounded" onChange={handleChange} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
