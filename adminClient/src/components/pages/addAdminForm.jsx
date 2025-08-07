import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddAdminForm() {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    password: ''
  });
  const [message, setMessage] = useState('');
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

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(`${baseURL}/head/add`, formData);
      setMessage(res.data.message);
      setFormData({ userId: '', name: '', password: '' });
    } catch (err) {
      console.error("Error adding admin:", err);
      setMessage(err.response?.data?.message || "Failed to add admin");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto h-screen flex-column allign-center justify-center mt-4">
      <button
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded"
        onClick={() => navigate('/head/dashboard')}
      >
        🔙 Back to Dashboard
      </button>
      <h2 className="text-xl font-bold text-blue-800 mb-4">Add New Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <input
          type="text"
          name="userId"
          placeholder="Admin User ID"
          value={formData.userId}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="name"
          placeholder="Admin Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Admin
        </button>
      </form>
      {message && <p className="mt-3 text-green-600 font-medium">{message}</p>}
    </div>
  );
}
