import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import UploadPage from './components/UploadPage';
import ProcessingPage from './components/ProcessingPage';
import RoadmapPage from './components/RoadmapPage';
import ReportPage from './components/ReportPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
