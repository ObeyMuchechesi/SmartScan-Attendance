import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeScanner from './pages/EmployeeScanner';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-brandBlue">Smarter Check-Ins</h1>
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
