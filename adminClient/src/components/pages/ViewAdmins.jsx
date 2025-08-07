import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ViewAdmins() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/head/view`)
      .then(res => setAdmins(res.data))
      .catch(err => console.error('Error fetching admins:', err));
  }, []);

  const filteredAdmins = admins.filter(admin =>
    admin.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <button
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded"
        onClick={() => navigate('/head/dashboard')}
      >
        🔙 Back to Dashboard
      </button>

      <h2 className="text-xl font-bold mb-4">All Admins</h2>

      <input
        type="text"
        placeholder="Search by User ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 border px-3 py-1 rounded w-full max-w-md"
      />

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">User ID</th>
            <th className="p-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map(admin => (
            <tr key={admin._id}>
              <td className="p-2">{admin.userId}</td>
              <td className="p-2">{admin.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
