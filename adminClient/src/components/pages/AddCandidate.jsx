import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddCandidate() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    area: '',
    criminalCase: '',
  });
  const [candidateImage, setCandidateImage] = useState(null);
  const [partyImage, setPartyImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    data.append('candidateImage', candidateImage);
    data.append('partyImage', partyImage);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/candidate/add`, data);
      alert("Candidate added successfully!");
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert("Failed to add candidate.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded"
        onClick={() => navigate('/admin/dashboard')}
      >
         Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4">Add Candidate</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input name="id" type="number" required placeholder="Candidate ID" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="name" required placeholder="Name" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="area" required placeholder="Area" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="city" required placeholder="City" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="state" required placeholder="State" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="criminalCase" placeholder="Criminal Case Info" className="w-full border p-2 rounded" onChange={handleChange} />
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Candidate Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCandidateImage(e.target.files[0])}
            required
            className="block w-full border border-gray-300 rounded px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Party Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPartyImage(e.target.files[0])}
            required
            className="block w-full border border-gray-300 rounded px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Add Candidate</button>
      </form>
    </div>
  );
}
