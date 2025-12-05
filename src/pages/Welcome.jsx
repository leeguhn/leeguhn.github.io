import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      // Generate random condition order (50/50)
      const randomOrder = Math.random() < 0.5 ? 'none-emoji' : 'emoji-none';
      window.sessionStorage.setItem('condition_order', randomOrder);
      
      // Navigate to experiment with participant name
      navigate(`/experiment?participant_id=${encodeURIComponent(name.trim())}&condition_order=${randomOrder}&start_from=0`);
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome to SafeBank Study</h1>
        <p className="welcome-description">
          Thank you for participating in our research study. You will interact with two different versions 
          of a chatbot and provide feedback through short surveys.
        </p>
        <p className="welcome-description" style={{fontWeight: '500', color: '#444'}}>
          You sent $50 to 'Mom' yesterday, but she hasn't received it. You will need to verify your identity and provide details. Please type your answers naturally.
        </p>
        <p className="welcome-description" style={{fontWeight: '500', color: 'red'}}>
          This simulation is not intended for mobile. Please use a desktop or laptop for the best experience. The entire study takes approximately 5 minutes to complete. 
        </p>
        
        <form onSubmit={handleSubmit} className="welcome-form">
          <div className="input-group">
            <label htmlFor="participant-name">Please enter your name:</label>
            <input
              id="participant-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="name-input"
              required
              autoFocus
            />
          </div>
          
          <button type="submit" className="begin-button">
            Begin Study
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
