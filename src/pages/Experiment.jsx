import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import { StateMachine } from '../logic/stateMachine';
import { Logger } from '../logic/logger';
import './Experiment.css';

// Import condition files
import conditionNone from '../data/condition_none.json';
import conditionEmoji from '../data/condition_emoji.json';

const conditionMap = {
  'none': conditionNone,
  'emoji': conditionEmoji
};

const Experiment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get participant info from URL
  const participantId = searchParams.get('participant_id');
  
  // Redirect to welcome if no participant ID
  useEffect(() => {
    if (!participantId) {
      navigate('/', { replace: true });
    }
  }, [participantId, navigate]);
  
  // Randomize condition order if not provided (50/50 chance)
  const getConditionOrder = () => {
    const urlOrder = searchParams.get('condition_order');
    if (urlOrder) return urlOrder;
    
    // Check session storage
    const storedOrder = window.sessionStorage.getItem('condition_order');
    if (storedOrder) return storedOrder;
    
    // Generate random order: 50% chance for each
    const randomOrder = Math.random() < 0.5 ? 'none-emoji' : 'emoji-none';
    window.sessionStorage.setItem('condition_order', randomOrder);
    return randomOrder;
  };
  
  const conditionOrder = getConditionOrder();
  
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
      const sessionNumber = currentConditionIndex + 1; // 1 or 2
      
      const sm = new StateMachine(conditionData);
      const log = new Logger(participantId, condition, conditionOrder, sessionNumber);
      
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
      
      // Set bot prompt if this message expects input
      if (welcomeMessage.type === 'input') {
        log.setBotPrompt(sm.getCurrentState(), welcomeMessage.message);
      }
    } else {
      // All conditions completed, go to survey
      navigate(`/survey?participant_id=${participantId}`);
    }
  }, [currentConditionIndex, participantId, navigate, conditionOrder]);

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
            // Store logger in session storage for survey
            if (logger) {
              window.sessionStorage.setItem('currentLogger', JSON.stringify({
                participantId: logger.participantId,
                condition: logger.condition,
                conditionOrder: logger.conditionOrder,
                sessionNumber: logger.sessionNumber,
                sessionStart: logger.sessionStart,
                userResponses: logger.userResponses
              }));
            }
            
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
          
          // Set bot prompt if this message expects input
          if (nextMessage.type === 'input' && logger) {
            logger.setBotPrompt(stateMachine.getCurrentState(), nextMessage.message);
          }
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

  const currentCondition = conditions[currentConditionIndex];

  return (
    <div className="experiment-container">
      <ChatWindow
        messages={messages}
        currentMessage={currentMessage}
        onAmountSubmit={handleAmountSubmit}
        logger={logger}
        currentState={stateMachine.getCurrentState()}
        showInput={showInput}
        condition={currentCondition}
      />
    </div>
  );
};

export default Experiment;
