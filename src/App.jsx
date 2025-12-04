import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Experiment from './pages/Experiment';
import Survey from './pages/Survey';
import Complete from './pages/Complete';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/experiment" element={<Experiment />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/complete" element={<Complete />} />
      </Routes>
    </Router>
  );
}

export default App;
