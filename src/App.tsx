// src/App.js
import 'livekit-react/dist/index.css';
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { PreJoinPage } from './PreJoinPage';
import { RoomPage } from './RoomPage';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <div className="container">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><PreJoinPage /></ProtectedRoute>} />
            <Route path="/room" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
