import React, { useState } from 'react';
import axios from 'axios';

export default function SetElection() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('${import.meta.env.VITE_API_BASE_URL}/api/head/set', {
        startTime,
        endTime
      });
      setMessage('election dates are set');
    } catch (err) {
      setMessage('Error setting election times');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Set Election Start & End Time</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Start Time</label>
            <input
              type="datetime-local"
              className="w-full border px-4 py-2 rounded-lg"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">End Time</label>
            <input
              type="datetime-local"
              className="w-full border px-4 py-2 rounded-lg"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800">
            Set Election Times
          </button>

          {message && <p className="text-center mt-4 font-medium text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
}
