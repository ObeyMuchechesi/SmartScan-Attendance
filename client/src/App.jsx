import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeScanner from './pages/EmployeeScanner';
import Login from './pages/Login';

function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(true);
  const [userRole, setUserRole] = useState('employee');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch {}
    }
    setIsAuthChecked(false);
  }, []);

  if (isAuthChecked) return null;

  return (
    <Router>
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2x text-brandBlue">📱</span>
          <h1 className="text-xl font-bold text-brandBlue">SmartScan Attendance</h1>
        </div>
        <div className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-brandBlue">Admin View</Link>
          <Link to="/scan" className="text-gray-600 hover:text-brandBlue">Employee Scan</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/scan" element={<EmployeeScanner />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;