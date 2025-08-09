// import React, { useState } from 'react';
// import axios from 'axios';

// const ViewCandidatesByArea = () => {
//   const [area, setArea] = useState('');
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchCandidates = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await axios.get(`${baseURL}/api/head/candidates/${area}`);
//       setCandidates(response.data);
//     } catch (err) {
//       setError('Error fetching candidates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//         <button
//         className="mb-4 bg-gray-700 text-white px-4 py-2 rounded"
//         onClick={() => navigate('/head/dashboard')}
//       >
//          Back to Dashboard
//       </button>
//       <h2 className="text-2xl font-bold mb-4">View Candidates by Area</h2>

//       <div className="flex gap-4 mb-6">
//         <input
//           type="text"
//           value={area}
//           onChange={(e) => setArea(e.target.value)}
//           placeholder="Enter Area"
//           className="p-2 border border-gray-300 rounded w-1/2"
//         />
//         <button
//           onClick={fetchCandidates}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//         >
//           Search
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {candidates.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {candidates.map((candidate) => (
//             <div key={candidate._id} className="border p-4 rounded shadow">
//               <h3 className="font-semibold text-lg mb-2">{candidate.name}</h3>
//               <p><strong>Area:</strong> {candidate.area}</p>
//               <p><strong>Criminal Case:</strong> {candidate.criminalCase || 'None'}</p>
//               <img
//                 src={candidate.candidateImage}
//                 alt={`${candidate.name}'s pic`}
//                 className="w-24 h-24 object-cover mt-2"
//               />
//               <img
//                 src={candidate.partyImage}
//                 alt="Party Logo"
//                 className="w-12 h-12 object-cover mt-2"
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewCandidatesByArea;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ViewCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidate/view`)
      .then(res => setCandidates(res.data))
      .catch(err => console.error(err));
  }, []);

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <button
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded"
        onClick={() => navigate('/head/dashboard')}
      >
         Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4">All Candidates</h2>

      <input
        placeholder="Search by name or area"
        className="border p-2 rounded mb-4 w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4">
        {filtered.map(c => (
          <div key={c._id} className="border p-4 rounded shadow">
            <p><strong>ID:</strong> {c.id}</p>
            <p><strong>Name:</strong> {c.name}</p>
            <p><strong>Area:</strong> {c.area}</p>
            <p><strong>City:</strong> {c.city}</p>
            <p><strong>State:</strong> {c.state}</p>
            <p><strong>Criminal Case:</strong> {c.criminalCase || 'None'}</p>
            <img src={c.candidateImage} alt="Candidate" className="w-20 mt-2" />
            <img src={c.partyImage} alt="Party" className="w-20 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
