import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EditAdmin() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchAdmins = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/head/view`)
      .then(res => setAdmins(res.data))
      .catch(err => console.error(err));
  };

  const handleEdit = (adminId, updatedData) => {
    axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/head/edit/${adminId}`, updatedData)
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

      <h2 className="text-xl font-bold mb-4">Edit Admins</h2>

      <input
        type="text"
        placeholder="Search by User ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 border px-3 py-1 rounded w-full max-w-md"
      />

      {filteredAdmins.map(admin => (
        <form key={admin._id} onSubmit={(e) => {
          e.preventDefault();
          const updated = {
            userId: e.target.userId.value,
            name: e.target.name.value,
            password: e.target.password.value
          };
          handleEdit(admin._id, updated);
        }} className="border p-3 mb-3 rounded shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <input defaultValue={admin.userId} name="userId" className="border p-1 rounded" />
            <input defaultValue={admin.name} name="name" className="border p-1 rounded" />
            <input name="password" placeholder="New Password" className="border p-1 rounded" />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Update</button>
          </div>
        </form>
      ))}
    </div>
  );
}
