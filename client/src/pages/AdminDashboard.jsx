import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';

const AdminDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const checkInUrl = `${window.location.origin}/scan`;

  useEffect(() => {
    axios.get('/api/attendance/today')
      .then(res => setAttendance(res.data))
      .catch(err => console.error(err));
  }, []);

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>SmartScan Attendance - QR Code</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; text-align: center; }
            .qr-code { margin: 20px auto; }
            .btn { padding: 10px 20px; margin: 5px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1>SmartScan Attendance</h1>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <div class="qr-code">
            <QRCode value="${checkInUrl}" size="256" />
          </div>
          <div style="margin-top: 30px;">
            <button class="btn" onclick="window.print()">Print QR Code</button>
            <button class="btn" onclick="window.close()">Close</button>
          </div>
          <p style="margin-top: 40px; font-size: 12px; color: #666;">
            SmartScan Attendance System • Printed: ${new Date().toLocaleTimeString()}
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
  };

  const handleDownloadCSV = () => {
    window.location.href = '/api/attendance/export-csv';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-brandBlue mb-8">
          SmartScan Admin Dashboard
        </h1>

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
            <h2 className="text-xl font-bold text-brandBlue mb-4">
              SMARTSCAN CHECK-IN
            </h2>
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
                      <span className="text-gray-500 text-sm">
                        {record.checkoutTime ? new Date(record.checkoutTime).toLocaleTimeString() : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleDownloadCSV}
            className="w-full bg-brandBlue text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition"
          >
            Download CSV Report
          </button>
          <button
            onClick={handlePrintQR}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition"
          >
            Print QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;