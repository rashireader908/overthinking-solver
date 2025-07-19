import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import Dashboard from './components/Dashboard';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <div className="App">
          <ParticleBackground />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;
