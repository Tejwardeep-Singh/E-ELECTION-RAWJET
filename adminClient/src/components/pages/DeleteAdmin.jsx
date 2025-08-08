import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DeleteAdmin() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchAdmins = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/head/view`)
      .then(res => setAdmins(res.data))
      .catch(err => console.error(err));
  };

  const deleteAdmin = (id) => {
    axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/head/delete/${id}`)
      .then(() => fetchAdmins())
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAdmins();
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

      <h2 className="text-xl font-bold mb-4">Delete Admins</h2>

      <input
        type="text"
        placeholder="Search by User ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 border px-3 py-1 rounded w-full max-w-md"
      />

      {filteredAdmins.map(admin => (
        <div key={admin._id} className="flex justify-between border p-2 mb-2 rounded">
          <span>{admin.userId} - {admin.name}</span>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => deleteAdmin(admin._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
