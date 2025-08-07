// AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleNavigate = (path) => navigate(path);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <button className="bg-blue-500 text-white py-2 rounded" onClick={() => handleNavigate('/admin/candidate/view')}>See Candidates</button>
        <button className="bg-green-500 text-white py-2 rounded" onClick={() => handleNavigate('/admin/candidate/add')}>Add Candidate</button>
        <button className="bg-yellow-500 text-white py-2 rounded" onClick={() => handleNavigate('/admin/candidate/edit')}>Edit Candidate</button>
        <button className="bg-red-500 text-white py-2 rounded" onClick={() => handleNavigate('/admin/candidate/delete')}>Delete Candidate</button>
        <button className="bg-purple-500 text-white py-2 rounded" onClick={() => handleNavigate('/admin/results')}>View Results</button>
      </div>
    </div>
  );
}
