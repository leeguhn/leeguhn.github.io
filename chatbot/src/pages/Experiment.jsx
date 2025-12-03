import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import { StateMachine } from '../logic/stateMachine';
import { Logger } from '../logic/logger';
import './Experiment.css';

// Import condition files
import conditionNone from '../data/condition_none.json';
import conditionLow from '../data/condition_low.json';
import conditionHigh from '../data/condition_high.json';

const conditionMap = {
  'none': conditionNone,
  'low': conditionLow,
  'high': conditionHigh
};

const Experiment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get participant info from URL
  const participantId = searchParams.get('participant_id') || 'test_user';
  const conditionOrder = searchParams.get('condition_order') || 'none-low';
  
  // Store condition order in session storage
  useEffect(() => {
    window.sessionStorage.setItem('condition_order', conditionOrder);
  }, [conditionOrder]);
  
  const conditions = conditionOrder.split('-');
  const startFrom = parseInt(searchParams.get('start_from') || '0');
  const [currentConditionIndex, setCurrentConditionIndex] = useState(startFrom);
  const [stateMachine, setStateMachine] = useState(null);
  const [logger, setLogger] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('50.00');

  // Update currentConditionIndex when startFrom URL param changes
  useEffect(() => {
    setCurrentConditionIndex(startFrom);
  }, [startFrom]);

  // Initialize state machine and logger when condition changes
  useEffect(() => {
    if (currentConditionIndex < conditions.length) {
      const condition = conditions[currentConditionIndex];
      const conditionData = conditionMap[condition];
      
      const sm = new StateMachine(conditionData);
      const log = new Logger(participantId, condition);
      
      setStateMachine(sm);
      setLogger(log);
      setMessages([]);
      
      // Start with welcome message
      const welcomeMessage = sm.getCurrentMessage();
      setCurrentMessage(welcomeMessage);
      setMessages([{
        message: welcomeMessage.message,
        isBot: true
      }]);
      setShowInput(welcomeMessage.type === 'input');
    } else {
      // All conditions completed, go to survey
      navigate(`/survey?participant_id=${participantId}`);
    }
  }, [currentConditionIndex, participantId, navigate]);

  const moveToNextState = () => {
    if (!stateMachine) return;

    const nextState = stateMachine.getNextState();
    if (nextState) {
      stateMachine.transition(nextState);
      const nextMessage = stateMachine.getCurrentMessage();
      setCurrentMessage(nextMessage);

      // Handle wait state
      if (nextMessage.type === 'wait') {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            message: nextMessage.message,
            isBot: true
          }]);
          // After wait duration, move to next state
          setTimeout(() => {
            moveToNextState();
          }, nextMessage.duration || 3000);
        }, 500);
      } else if (nextMessage.type === 'final') {
        // Final message, then go to survey
        setTimeout(() => {
          setMessages(prev => [...prev, {
            message: nextMessage.message,
            isBot: true
          }]);
          setTimeout(() => {
            // Go to survey with current condition info
            const currentCondition = conditions[currentConditionIndex];
            navigate(`/survey?participant_id=${participantId}&condition=${currentCondition}&condition_number=${currentConditionIndex + 1}&total_conditions=${conditions.length}&condition_order=${conditionOrder}`);
          }, 2000);
        }, 500);
      } else {
        // Regular message
        setTimeout(() => {
          setMessages(prev => [...prev, {
            message: nextMessage.message,
            isBot: true
          }]);
          setShowInput(nextMessage.type === 'input');
        }, 500);
      }
    }
  };

  const handleAmountSubmit = (amount) => {
    if (!stateMachine || !logger) return;

    setShowInput(false);

    // Add user message
    setMessages(prev => [...prev, {
      message: amount,
      isBot: false
    }]);

    // Store amount if needed
    const currentState = stateMachine.getCurrentState();
    if (currentState === 'amount_confirmation') {
      setSelectedAmount(amount);
    }

    // Move to next state
    moveToNextState();
  };

  if (!stateMachine || !logger) {
    return <div className="loading">Loading experiment...</div>;
  }

  return (
    <div className="experiment-container">
      <div className="experiment-info">
        Condition {currentConditionIndex + 1} of {conditions.length}: {conditions[currentConditionIndex]}
      </div>
      <ChatWindow
        messages={messages}
        currentMessage={currentMessage}
        onAmountSubmit={handleAmountSubmit}
        logger={logger}
        currentState={stateMachine.getCurrentState()}
        showInput={showInput}
      />
    </div>
  );
};

export default Experiment;
