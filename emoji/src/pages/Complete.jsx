import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Complete.css';

const Complete = () => {
  const navigate = useNavigate();

  return (
    <div className="complete-container">
      <div className="complete-card">
        <div className="checkmark-circle">
          <svg className="checkmark" viewBox="0 0 52 52">
            <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        
        <h1>Study Complete!</h1>
        <p className="complete-description">
          Thank you for participating in our research study. Your responses have been recorded successfully.
        </p>
        <p className="complete-description">
          Your contribution helps us understand how people interact with conversational AI systems.
        </p>
        
        <button onClick={() => navigate('/')} className="home-button">
          Return to Start
        </button>
      </div>
    </div>
  );
};

export default Complete;
