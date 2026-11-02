import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const EmployeeScanner = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  // Server-side location verification flag
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

  if (!userId) {
    return (
      <div>
        <h3>Badge Entry</h3>
        <p>Enter your badge number to check in.</p>
        <form
          onSubmit={async e => {
            e.preventDefault();
            const badge = e.target.elements.badge.value;
            try {
              const res = await axios.post('/api/auth/login', { badgeNumber: badge });
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('userId', res.data.user.id);
              localStorage.setItem('userName', res.data.user.name);
            } catch (err) {
              alert(err.response?.data?.message || 'Invalid badge number.');
            }
          }}
        >
          <input
            type="text"
            name="badge"
            placeholder="B-1234 or E001"
            required
          />
          <button type="submit">CHECK IN</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-brandBlue mb-6">
          {userName ? `Welcome back, ${userName}!` : 'Employee Check-In'}
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
      </div>
    </div>
  );
};

export default EmployeeScanner;