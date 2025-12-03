import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Survey.css';

const Survey = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const participantId = searchParams.get('participant_id') || 'test_user';

  const [responses, setResponses] = useState({
    // Competence questions (1-7 scale)
    competent: 4,
    knowledgeable: 4,
    reliable: 4,
    professional: 4,
    
    // Appropriateness questions (1-7 scale)
    appropriate_tone: 4,
    appropriate_formality: 4,
    appropriate_context: 4,
    
    // Message style
    message_style: '',
    
    // Transaction status
    transaction_complete: ''
  });

  const handleChange = (field, value) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const condition = searchParams.get('condition') || 'unknown';
    const conditionNumber = parseInt(searchParams.get('condition_number') || '1');
    const totalConditions = parseInt(searchParams.get('total_conditions') || '1');

    console.log('Survey submit clicked:', {
      condition,
      conditionNumber,
      totalConditions,
      responses
    });

    // Determine next navigation target FIRST
    const originalConditionOrder = searchParams.get('condition_order') || 
      (window.sessionStorage.getItem('condition_order')) || 'none-low';
    window.sessionStorage.setItem('condition_order', originalConditionOrder);

    console.log('Navigation info:', {
      conditionNumber,
      totalConditions,
      willNavigateToNext: conditionNumber < totalConditions,
      originalConditionOrder
    });

    // Save survey data in background (don't wait for it)
    const surveyData = {
      participant_id: participantId,
      condition: condition,
      condition_number: conditionNumber,
      ...responses,
      completed_at: new Date().toISOString(),
      timestamp: performance.now()
    };
    
    addDoc(collection(db, 'surveys'), surveyData)
      .then(() => console.log('Survey saved successfully'))
      .catch((error) => console.error('Error submitting survey:', error));

    // Navigate immediately without waiting for save
    if (conditionNumber < totalConditions) {
      // Move to next condition (start_from is zero-based index)
      const nextStart = conditionNumber; // conditionNumber is 1-based, so using it starts at next index
      const nextUrl = `/?participant_id=${participantId}&condition_order=${originalConditionOrder}&start_from=${nextStart}`;
      console.log('Navigating to next condition:', nextUrl);
      navigate(nextUrl, { replace: true });
    } else {
      console.log('All conditions complete, going home');
      navigate('/', { replace: true });
    }
  };

  const renderScale = (field, label, leftAnchor, rightAnchor) => (
    <div className="survey-question">
      <label className="question-label">{label}</label>
      <div className="scale-container">
        <span className="scale-anchor">{leftAnchor}</span>
        <div className="scale-options">
          {[1, 2, 3, 4, 5, 6, 7].map(value => (
            <label key={value} className="scale-option">
              <input
                type="radio"
                name={field}
                value={value}
                checked={responses[field] === value}
                onChange={(e) => handleChange(field, parseInt(e.target.value))}
                required
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
        <span className="scale-anchor">{rightAnchor}</span>
      </div>
    </div>
  );

  return (
    <div className="survey-container">
      <div className="survey-content">
        <h1>Post-Experiment Survey</h1>
        <p className="survey-intro">
          Please answer the following questions about your experience with the SafeBank chatbot you just completed.
        </p>
        <p className="survey-intro" style={{fontSize: '14px', color: '#999'}}>
          Condition {searchParams.get('condition_number') || '1'} of {searchParams.get('total_conditions') || '1'}
        </p>

        <form onSubmit={handleSubmit}>
          <section className="survey-section">
            <h2>Competence Assessment</h2>
            {renderScale('competent', 'The chatbot seemed:', 'Not at all competent', 'Very competent')}
            {renderScale('knowledgeable', 'The chatbot appeared:', 'Not knowledgeable', 'Very knowledgeable')}
            {renderScale('reliable', 'The chatbot felt:', 'Unreliable', 'Very reliable')}
            {renderScale('professional', 'The chatbot was:', 'Unprofessional', 'Very professional')}
          </section>

          <section className="survey-section">
            <h2>Appropriateness Assessment</h2>
            {renderScale('appropriate_tone', 'The tone of the messages was:', 'Inappropriate', 'Appropriate')}
            {renderScale('appropriate_formality', 'The level of formality was:', 'Inappropriate', 'Appropriate')}
            {renderScale('appropriate_context', 'For a banking context, the style was:', 'Inappropriate', 'Appropriate')}
          </section>

          <section className="survey-section">
            <h2>Message Style</h2>
            <div className="survey-question">
              <label className="question-label">
                Which message style did you prefer overall?
              </label>
              <select
                value={responses.message_style}
                onChange={(e) => handleChange('message_style', e.target.value)}
                className="survey-select"
              >
                <option value="">Select an option</option>
                <option value="no_emojis">No emojis</option>
                <option value="few_emojis">A few emojis</option>
                <option value="many_emojis">Many emojis</option>
                <option value="no_preference">No preference</option>
              </select>
            </div>
          </section>

          <section className="survey-section">
            <h2>Transaction Understanding</h2>
            <div className="survey-question">
              <label className="question-label">
                Did the chatbot successfully complete the transaction?
              </label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="transaction_complete"
                    value="yes"
                    checked={responses.transaction_complete === 'yes'}
                    onChange={(e) => handleChange('transaction_complete', e.target.value)}
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="transaction_complete"
                    value="no"
                    checked={responses.transaction_complete === 'no'}
                    onChange={(e) => handleChange('transaction_complete', e.target.value)}
                  />
                  <span>No</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="transaction_complete"
                    value="unsure"
                    checked={responses.transaction_complete === 'unsure'}
                    onChange={(e) => handleChange('transaction_complete', e.target.value)}
                  />
                  <span>Unsure</span>
                </label>
              </div>
            </div>
          </section>

          <button type="submit" className="submit-survey-button">
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
};

export default Survey;
