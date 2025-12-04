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
    
    console.log('Firebase db object:', db);
    console.log('Firebase app check:', db?.app?.options?.projectId);

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

    // Get logger data from session storage and save complete session
    const loggerDataStr = window.sessionStorage.getItem('currentLogger');
    console.log('Logger data from storage:', loggerDataStr ? 'Found' : 'Not found');
    
    try {
      if (loggerDataStr) {
        const loggerData = JSON.parse(loggerDataStr);
        console.log('Parsed logger data:', loggerData);
        
        // Helper function to convert to Korea Time (KST, UTC+9)
        const toKoreaTime = (date) => {
          const utcDate = new Date(date);
          const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
          return kstDate.toISOString().replace('Z', '+09:00');
        };
        
        // Create complete session data
        const sessionData = {
          participant_id: participantId,
          condition: loggerData.condition,
          condition_order: loggerData.conditionOrder,
          session_number: loggerData.sessionNumber,
          session_start: toKoreaTime(Date.now() - (performance.now() - loggerData.sessionStart)),
          session_duration_ms: performance.now() - loggerData.sessionStart,
          user_responses: loggerData.userResponses,
          survey_responses: responses,
          completed_at: toKoreaTime(Date.now())
        };

        console.log('Session data prepared:', sessionData);
        
        // Clear current logger from session storage
        window.sessionStorage.removeItem('currentLogger');
        
        if (conditionNumber === 1) {
          // First session - store in session storage
          console.log('Storing first session data for later...');
          window.sessionStorage.setItem('firstSessionData', JSON.stringify(sessionData));
        } else {
          // Second session - combine both sessions and save to Firebase
          console.log('Processing second session...');
          const firstSessionStr = window.sessionStorage.getItem('firstSessionData');
          
          if (firstSessionStr) {
            const firstSessionData = JSON.parse(firstSessionStr);
            
            // Create combined data package
            const combinedData = {
              participant_id: participantId,
              condition_order: originalConditionOrder,
              study_completed_at: toKoreaTime(Date.now()),
              sessions: [
                firstSessionData,
                sessionData
              ]
            };
            
            console.log('Saving combined session data:', combinedData);
            console.log('About to call addDoc with collection:', collection(db, 'experiment_sessions'));
            
            // Save to Firebase with timeout
            const savePromise = addDoc(collection(db, 'experiment_sessions'), combinedData);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Firebase save timed out after 10 seconds')), 10000)
            );
            
            console.log('Waiting for Firebase save...');
            const docRef = await Promise.race([savePromise, timeoutPromise]);
            console.log('Complete study data saved successfully with ID:', docRef.id);
            
            // Clear stored first session data
            window.sessionStorage.removeItem('firstSessionData');
          } else {
            console.error('First session data not found in storage!');
            alert('Error: First session data is missing. Please contact support.');
            return;
          }
        }
      } else {
        console.warn('No logger data found in session storage - skipping save');
      }
    } catch (error) {
      console.error('Error saving complete session:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        fullError: error
      });
      alert(`Error saving session data: ${error.message}. Please try again or contact support.`);
      return; // Don't navigate if save failed
    }

    // Navigate after successful save
    if (conditionNumber < totalConditions) {
      // Move to next condition (start_from is zero-based index)
      const nextStart = conditionNumber; // conditionNumber is 1-based, so using it starts at next index
      const nextUrl = `/experiment?participant_id=${participantId}&condition_order=${originalConditionOrder}&start_from=${nextStart}`;
      console.log('Navigating to next condition:', nextUrl);
      navigate(nextUrl, { replace: true });
    } else {
      console.log('All conditions complete, thank you!');
      navigate('/complete', { replace: true });
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
                required
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
                    required
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
