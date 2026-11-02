import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';

const AdminDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  // The QR code directs employees to the check-in page
  const checkInUrl = `${window.location.origin}/scan`;

  useEffect(() => {
    // Fetch today's attendance (assuming API is running)
    axios.get('http://localhost:5000/api/attendance/today')
      .then(res => setAttendance(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-brandBlue mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Display Card */}
          <div className="bg-brandBlue p-8 rounded-xl shadow-lg text-center flex flex-col items-center justify-center">
            <h2 className="text-white text-2xl font-bold mb-2">EMPLOYEE CHECK-IN</h2>
            <p className="text-gray-300 mb-6">SCAN TO CHECK-IN</p>
            <div className="bg-white p-4 rounded-xl">
              <QRCode value={checkInUrl} size={256} />
            </div>
            <p className="text-brandGreen font-bold mt-6 bg-white px-6 py-2 rounded-full">
              SCAN • CHECK-IN • YOU'RE SET!
            </p>
          </div>

          {/* Real-time Attendance List */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-brandBlue mb-4">Today's Check-ins</h2>
            <div className="overflow-y-auto max-h-[400px]">
              {attendance.length === 0 ? (
                <p className="text-gray-500">No check-ins yet today.</p>
              ) : (
                <ul className="space-y-4">
                  {attendance.map((record) => (
                    <li key={record._id} className="flex justify-between items-center p-3 border-b">
                      <div>
                        <p className="font-semibold">{record.user?.name}</p>
                        <p className="text-sm text-gray-500">{record.user?.email}</p>
                      </div>
                      <span className="text-brandGreen font-medium">
                        {new Date(record.checkInTime).toLocaleTimeString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
