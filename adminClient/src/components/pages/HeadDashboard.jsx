import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeadDashboard() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path); // Set up routes later for each path
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Head Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => handleNavigate('/head/viewAdmins')}
            className="bg-blue-900 text-white py-4 rounded-xl hover:bg-blue-800 transition text-lg font-semibold shadow-md"
          >
            👥 View Admins
          </button>

          <button
            onClick={() => handleNavigate('/head/addAdmin')}
            className="bg-green-600 text-white py-4 rounded-xl hover:bg-green-500 transition text-lg font-semibold shadow-md"
          >
            ➕ Add Admin
          </button>

          <button
            onClick={() => handleNavigate('/head/deleteAdmin')}
            className="bg-red-600 text-white py-4 rounded-xl hover:bg-red-500 transition text-lg font-semibold shadow-md"
          >
            ❌ Delete Admin
          </button>
          <button
            onClick={() => handleNavigate('/head/editAdmin')}
            className="bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-500 transition text-lg font-semibold shadow-md"
          >
            ✏️ EDIT Admin
          </button>

          <button
            onClick={() => handleNavigate('/head/candidates')}
            className="bg-yellow-600 text-white py-4 rounded-xl hover:bg-yellow-500 transition text-lg font-semibold shadow-md"
          >
            🏛️ View Parties & Candidates
          </button>
          <button
            onClick={() => handleNavigate('/head/election)}
            className="bg-indigo-700 text-white py-4 rounded-xl hover:bg-indigo-600 transition text-lg font-semibold shadow-md">
            🕒 Election Controls
          </button>
          <button
            onClick={() => handleNavigate('/head/results')}
            className="bg-purple-700 text-white py-4 rounded-xl hover:bg-purple-600 transition text-lg font-semibold shadow-md"
          >
            📊 View Results
          </button>
          <button
            onClick={async () => {
              try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/head/show-results`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

                const data = await res.json();
                if (res.ok) {
                  alert('✅ Results are now visible to everyone!');
                } else {
                  alert('⚠️ ' + data.message);
                }
              } catch (err) {
                console.error('Error:', err);
                alert('Error making results visible');
              }
            }}
            className="bg-green-800 text-white py-4 rounded-xl hover:bg-green-700 transition text-lg font-semibold shadow-md"
          >
            📢 Make Results Visible
          </button>

        </div>
      </div>
    </div>
  );
}

