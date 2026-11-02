import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const EmployeeScanner = () => {
  const [status, setStatus] = useState('idle'); // idle, success, error
  const [message, setMessage] = useState('');

  const userId = localStorage.getItem('userId');

  const handleCheckIn = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/attendance/checkin', { userId });

      setStatus('success');
      setMessage(res.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Check-in failed.');
    }
  };

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-brandBlue mb-6">Employee Check-In</h2>

        {status === 'idle' && (
          <div>
            <p className="text-gray-600 mb-6">Tap the button below to record your attendance for today.</p>
            <button
              onClick={handleCheckIn}
              className="w-full bg-brandBlue text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition"
            >
              CHECK IN NOW
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-brandGreen rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={48} color="white" />
            </div>
            <h3 className="text-xl font-bold text-brandGreen mb-2">Check-In Successful!</h3>
            <p className="text-gray-700 font-medium">{message}</p>
            <p className="text-sm text-gray-500 mt-4">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              <br />
              {new Date().toLocaleDateString()}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-red-500 font-medium">
            <p>{message}</p>
            <button
              onClick={() => { setStatus('idle'); setMessage(''); }}
              className="mt-6 w-full border border-red-300 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeScanner;
