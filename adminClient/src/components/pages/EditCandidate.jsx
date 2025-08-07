import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EditCandidate() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/candidate/view`)
      .then(res => setCandidates(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleEdit = async (e, id) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/admin/candidate/edit/${id}`, data);
      alert("Candidate updated!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Update failed!");
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
      <h2 className="text-xl font-bold mb-4">Edit Candidates</h2>

      <input
        placeholder="Search by name or area"
        className="border p-2 rounded mb-4 w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.map(c => (
        <form key={c._id} onSubmit={(e) => handleEdit(e, c._id)} encType="multipart/form-data" className="border p-4 mb-4 rounded shadow">
          <input name="id" defaultValue={c.id} className="block mb-2 border p-2 rounded w-full" />
          <input name="name" defaultValue={c.name} className="block mb-2 border p-2 rounded w-full" />
          <input name="area" defaultValue={c.area} className="block mb-2 border p-2 rounded w-full" />
          <input name="city" defaultValue={c.city} className="block mb-2 border p-2 rounded w-full" />
          <input name="state" defaultValue={c.state} className="block mb-2 border p-2 rounded w-full" />
          <input name="criminalCase" defaultValue={c.criminalCase} className="block mb-2 border p-2 rounded w-full" />
          <div className="mb-2">
            <label>New Candidate Image: </label>
            <input type="file" name="candidateImage" />
          </div>
          <div className="mb-2">
            <label>New Party Image: </label>
            <input type="file" name="partyImage" />
          </div>
          <button className="bg-green-600 text-white px-4 py-1 rounded" type="submit">Update</button>
        </form>
      ))}
    </div>
  );
}
