// AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleNavigate = (path) => navigate(path);

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className='max-w-4xl mx-auto bg-gray-600 shadow-2xl rounded-2xl p-8 border border-blue-100 py-20'>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-400" onClick={() => handleNavigate('/admin/candidate/view')}>See Candidates</button>
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-400" onClick={() => handleNavigate('/admin/candidate/add')}>Add Candidate</button>
        <button className="bg-yellow-600 text-white py-2 rounded hover:bg-yellow-400" onClick={() => handleNavigate('/admin/candidate/edit')}>Edit Candidate</button>
        <button className="bg-red-600 text-white py-2 rounded hover:bg-red-400" onClick={() => handleNavigate('/admin/candidate/delete')}>Delete Candidate</button>
        <button className="bg-purple-600 text-white py-2 rounded hover:bg-purple-400" onClick={() => handleNavigate('/admin/results')}>View Results</button>
      </div>
      </div>
    </div>
  );
}
