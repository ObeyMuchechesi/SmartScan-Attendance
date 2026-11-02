import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
        // Decode JWT payload without a library — atob the base64 middle segment
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch {}
    }
    setIsAuthChecked(false);
  }, []);

  if (isAuthChecked) return null;

  // Role guard: employees cannot access the admin dashboard ("/")
  if (window.location.pathname === '/' && userRole !== 'admin') {
    return <Navigate to="/scan" replace />;
  }

  return (
    <Router>
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-brandBlue">Smarter Check-Ins</h1>
        <div className="space-x-4">
          {userRole === 'admin' && (
            <Link to="/" className="text-gray-600 hover:text-brandBlue">Admin View</Link>
          )}
          <Link to="/scan" className="text-gray-600 hover:text-brandBlue">Employee Scan</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/scan" element={<EmployeeScanner />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;