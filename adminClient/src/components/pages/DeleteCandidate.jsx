import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DeleteCandidate() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchData = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/candidate/view`)
      .then(res => setCandidates(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/candidate/delete/${id}`);
      alert("Candidate deleted!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Deletion failed!");
    }
  };

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <button
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded"
        onClick={() => navigate('/admin/dashboard')}
      >
         Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4">Delete Candidates</h2>

      <input
        placeholder="Search by name or area"
        className="border p-2 rounded mb-4 w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.map(c => (
        <div key={c._id} className="border p-4 mb-3 rounded flex justify-between items-center">
          <span>{c.name} - {c.area}</span>
          <button onClick={() => handleDelete(c._id)} className="bg-red-600 text-white px-4 py-1 rounded">Delete</button>
        </div>
      ))}
    </div>
  );
}
