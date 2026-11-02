import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const EmployeeScanner = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    setMessage('Check-in recorded (location verification enabled on server).');
  }, []);

  const handleCheckIn = async () => {
    if (!userId) {
      setMessage('Please log in first.');
      return;
    }
    try {
      const res = await axios.post('/api/attendance/checkin', { userId });
      setStatus('success');
      setMessage(res.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Check-in failed.');
    }
  };

  const handleCheckOut = async () => {
    if (!userId) {
      setMessage('Please log in first.');
      return;
    }
    try {
      const res = await axios.post('/api/attendance/checkout', { userId });
      setStatus('check-out-success');
      setMessage(res.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Check-out failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-brandBlue mb-6">
          {userName ? `Welcome back, ${userName}!` : 'SmartScan Check-In'}
        </h2>

        {status === 'idle' && (
          <p>Tap the button below to record your attendance for today.</p>
        )}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleCheckIn}
            className="w-full bg-brandBlue text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition"
            disabled={!userId}
          >
            CHECK IN NOW
          </button>
        </div>

        {status === 'success' && (
          <div>
            <h3>Check-In Successful!</h3>
            <p>{message}</p>
            <CheckCircle size={48} color="white" />
            {/* Check-out button appears after successful check-in */}
            <button
              onClick={handleCheckOut}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition mt-4"
              disabled={!userId}
            >
              CHECK OUT NOW
            </button>
          </div>
        )}

        {status === 'check-out-success' && (
          <div>
            <h3>Check-Out Successful!</h3>
            <p>{message}</p>
            <CheckCircle size={48} color="white" />
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-600 transition mt-4"
            >
              RESET DAY
            </button>
          </div>
        )}

        {status === 'error' && (
          <p className="text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeScanner;