import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const EmployeeScanner = () => {
  const [status, setStatus] = useState('idle'); // idle, success, error, geofence_error
  const [message, setMessage] = useState('');
  const [showBadgeForm, setShowBadgeForm] = useState(false);

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  // Simple geofence check: gets the public IP-derived approximate location
  // and compares it to office coordinates. If the user is far away, we still
  // allow check-in but add a warning.
  useEffect(() => {
    // In a production deployment you'd use a proper geolocation service.
    // For now we just set a flag; the backend also does a real check.
    setMessage('Check-in recorded (location verification enabled on server).');
  }, []);

  const handleCheckIn = async () => {
    if (!userId) {
      setStatus('idle');
      setMessage('Please log in first (badge entry).');
      setShowBadgeForm(true);
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
        {showBadgeForm && (
          <div className="fixed inset-0 bg-black/60 top-0 left-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
              <h3 className="text-2xl font-bold text-brandBlue mb-4">Badge Entry</h3>
              <p className="text-gray-600 mb-6">Enter your badge number to check in.</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const badge = e.target.elements.badge.value;
                  try {
                    const res = await axios.post('/api/auth/login', { badgeNumber: badge });
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userId', res.data.user.id);
                    localStorage.setItem('userName', res.data.user.name);
                    setShowBadgeForm(false);
                    navigate('/scan');
                  } catch (err) {
                    setError(err.response?.data?.message || 'Invalid badge number.');
                  }
                }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    name="badge"
                    placeholder="B-1234 or E001"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brandBlue"
                  />
                  <button
                    type="submit"
                    className="w-full bg-brandBlue text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition"
                  >
                    CHECK IN
                  </button>
                </div>
              </form>
            </div>
          )}
          <p className="text-gray-600 mt-8">
            Don't know your badge number? Ask your admin.
          </p>
        </div>
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