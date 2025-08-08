import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CountdownTimer = ({ onElectionEnd }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/election/timer`);
        const time = res.data.timeRemaining;
        setTimeLeft(time);
        if (time === 0 && onElectionEnd) onElectionEnd();
      } catch (err) {
        console.error('Failed to fetch timer', err);
      }
    };

    fetchTimer();
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 1000 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [onElectionEnd]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="text-center text-lg font-bold text-red-700 mt-4">
      {timeLeft !== null ? (
        timeLeft === 0 ? (
          "🟢 Election is not live now!"
        ) : (
          `⏳ Time left: ${formatTime(timeLeft)}`
        )
      ) : (
        'Loading timer...'
      )}
    </div>
  );
};

export default CountdownTimer;
