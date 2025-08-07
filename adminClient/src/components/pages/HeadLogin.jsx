import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function HeadLogin() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

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
      const res = await axios.post(`${baseURL}/api/headLogin`, formData);
      console.log('Login success:', res.data);

      localStorage.setItem('headToken', res.data.token);
      navigate('/head/dashboard');
    } catch (err) {
    console.error("❌ Error during login:", err);
    console.error("❌ Full error object:", JSON.stringify(err, null, 2));
    console.error("❌ Axios error response:", err.response);

  alert("Login failed. Please check your credentials.");
}

  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Head Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="userId" className="block mb-1 text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded-xl font-semibold hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
