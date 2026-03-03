import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { Box } from '@mui/material';

// Placeholders for future routes
import UploadPage from './components/UploadPage';
import ProcessingPage from './components/ProcessingPage';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/results" element={<ResultsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
