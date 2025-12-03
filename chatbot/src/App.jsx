import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Experiment from './pages/Experiment';
import Survey from './pages/Survey';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Experiment />} />
        <Route path="/survey" element={<Survey />} />
      </Routes>
    </Router>
  );
}

export default App;
