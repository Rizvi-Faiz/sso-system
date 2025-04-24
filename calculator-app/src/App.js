import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Calculator from './pages/Calculator';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/calculator" 
              element={
                <PrivateRoute>
                  <Calculator />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/calculator" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
