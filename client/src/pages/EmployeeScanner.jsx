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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-brandBlue mb-6">
          {userName ? `Welcome back, ${userName}!` : 'SmartScan Check-In'}
        </h2>

        {status === 'idle' && (
          <p>Tap the button below to record your attendance for today.</p>
        )}
        <button
          onClick={handleCheckIn}
          className="w-full bg-brandBlue text-white py-3 rounded-lg font-bold text-lg"
        >
          CHECK IN NOW
        </button>
        {status === 'success' && (
          <div>
            <h3>Check-In Successful!</h3>
            <p>{message}</p>
            <CheckCircle size={48} color="white" />
          </div>
        )}
        {status === 'error' && (
          <p className="text-red-500">{message}</p>
        )}

        {/* QR Code section - show a download link after check-in */}
        {status !== 'idle' && (
          <div className="mt-8">
            <h4>Download Check-In Record</h4>
            <p>Your check-in has been recorded. You can print this page or save as PDF.</p>
            <a
              href="/api/attendance/today"
              download="SmartScan-CheckIn-Record.html"
              className="w-full bg-brandGreen text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition"
            >
              Download Attendance Record
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeScanner;