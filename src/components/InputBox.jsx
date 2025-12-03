import React, { useState, useEffect, useRef } from 'react';
import './InputBox.css';

const InputBox = ({ onSubmit, logger, currentState, inputType = 'text', expectedAnswer = null, inputAvailableTime, disabled = false }) => {
  const [value, setValue] = useState('');
  const [hasTyped, setHasTyped] = useState(false);
  const [error, setError] = useState('');
  const [keystrokes, setKeystrokes] = useState([]);
  const [firstKeystrokeTime, setFirstKeystrokeTime] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Reset all state when currentState changes
    setHasTyped(false);
    setValue('');
    setError('');
    setKeystrokes([]);
    setFirstKeystrokeTime(null);
  }, [currentState]);

  useEffect(() => {
    // Auto-focus input when it becomes enabled
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e) => {
    const keystrokeTime = performance.now();
    
    // Record first keystroke time
    if (!hasTyped) {
      setFirstKeystrokeTime(keystrokeTime);
      setHasTyped(true);
    }

    // Log every keystroke with timing
    const keystrokeData = {
      key: e.key,
      timestamp: keystrokeTime,
      timeSinceInputAvailable: inputAvailableTime ? keystrokeTime - inputAvailableTime : null,
      timeSinceFirstKeystroke: firstKeystrokeTime ? keystrokeTime - firstKeystrokeTime : 0
    };

    setKeystrokes(prev => [...prev, keystrokeData]);
  };

  const validateInput = (input) => {
    const trimmedInput = input.trim();
    // Remove trailing period for certain phrase validations
    const normalizedInput = trimmedInput.replace(/\.+$/, '');
    
    // Define validation rules for specific states
    const validations = {
      'greeting': { 
        expected: ['X9J2P', 'x9j2p'],
        errorMessage: 'Incorrect security code. Please try again.'
      },
      'welcome': { 
        expected: ['A4W9C', 'a4w9c'],
        errorMessage: 'Incorrect security code. Please try again.'
      },
      'phone_verification': {
        validator: (val) => /^\d{4}$/.test(val),
        errorMessage: 'Please enter exactly 4 digits.'
      },
      'math_verification': {
        expected: ['13'],
        errorMessage: 'Incorrect answer. Please try again.'
      },
      'secret_question': {
        expected: ['Paris', 'paris', 'PARIS'],
        errorMessage: 'Incorrect answer. Please try again.'
      },
      'protocol_authorization': {
        validator: (val) => {
          const normalized = val.replace(/\.+$/, '').toLowerCase();
          return normalized === 'i authorize this investigation';
        },
        errorMessage: 'Incorrect phrase. Please type the exact phrase shown above.'
      },
      'timeout': {
        expected: ['Continue', 'continue', 'CONTINUE'],
        errorMessage: "Please type 'Continue' to reconnect."
      },
      'result': {
        validator: (val) => {
          const normalized = val.replace(/\.+$/, '').toLowerCase();
          return normalized === 'i approve this request';
        },
        errorMessage: 'Incorrect phrase. Please type the exact phrase shown above.'
      },
      'identification': {
        // Basic email validation
        validator: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        errorMessage: 'Please enter a valid email address.'
      },
      'issue_identification': {
        // Must contain at least 3 words and not be only numbers
        validator: (val) => {
          const words = val.split(/\s+/).filter(word => word.length > 0);
          const isOnlyNumbers = /^\d+$/.test(val.replace(/\s+/g, ''));
          return words.length >= 3 && !isOnlyNumbers;
        },
        errorMessage: 'Please provide a detailed description (at least 3 words).'
      },
      'issue_categorization': {
        // Must contain at least 2 words and not be only numbers
        validator: (val) => {
          const words = val.split(/\s+/).filter(word => word.length > 0);
          const isOnlyNumbers = /^\d+$/.test(val.replace(/\s+/g, ''));
          return words.length >= 2 && !isOnlyNumbers;
        },
        errorMessage: 'Please provide a brief description (at least 2 words).'
      },
      'recipient_name': {
        // Must contain at least 2 characters and not be only numbers
        validator: (val) => {
          const hasLetters = /[a-zA-Z]/.test(val);
          const isOnlyNumbers = /^\d+$/.test(val);
          return val.length >= 2 && hasLetters && !isOnlyNumbers;
        },
        errorMessage: 'Please enter a valid name.'
      },
      'recipient': {
        // Same as recipient_name
        validator: (val) => {
          const hasLetters = /[a-zA-Z]/.test(val);
          const isOnlyNumbers = /^\d+$/.test(val);
          return val.length >= 2 && hasLetters && !isOnlyNumbers;
        },
        errorMessage: 'Please enter a valid name.'
      },
      'relationship_declaration': {
        // Must be a full sentence (at least 5 words) and not be only numbers
        validator: (val) => {
          const words = val.split(/\s+/).filter(word => word.length > 0);
          const isOnlyNumbers = /^\d+$/.test(val.replace(/\s+/g, ''));
          const hasLetters = /[a-zA-Z]/.test(val);
          return words.length >= 5 && !isOnlyNumbers && hasLetters;
        },
        errorMessage: 'Please provide a complete sentence describing your relationship and reason (at least 5 words).'
      }
    };

    const validation = validations[currentState];
    
    if (!validation) {
      return { valid: true };
    }

    // Check if there's a custom validator function
    if (validation.validator) {
      if (validation.validator(trimmedInput)) {
        return { valid: true };
      }
      return { valid: false, message: validation.errorMessage };
    }

    // Check against expected answers
    if (validation.expected) {
      if (validation.expected.includes(trimmedInput)) {
        return { valid: true };
      }
      return { valid: false, message: validation.errorMessage };
    }

    return { valid: true };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      const validation = validateInput(value);
      
      if (!validation.valid) {
        setError(validation.message);
        logger.logEvent(currentState, 'validation_error', { 
          value: value,
          error: validation.message,
          keystrokes: keystrokes,
          keystroke_count: keystrokes.length
        });
        return;
      }

      const submitTime = performance.now();
      
      // Calculate latencies
      const inputLatency = inputAvailableTime ? submitTime - inputAvailableTime : null;
      const typingLatency = firstKeystrokeTime ? submitTime - firstKeystrokeTime : null;
      const timeToFirstKeystroke = firstKeystrokeTime && inputAvailableTime 
        ? firstKeystrokeTime - inputAvailableTime 
        : null;

      setError('');
      
      // Log comprehensive response data
      logger.logEvent(currentState, 'response_submitted', { 
        response: value,
        input_latency_ms: inputLatency,
        time_to_first_keystroke_ms: timeToFirstKeystroke,
        typing_duration_ms: typingLatency,
        keystroke_count: keystrokes.length,
        keystrokes: keystrokes,
        input_available_timestamp: inputAvailableTime,
        first_keystroke_timestamp: firstKeystrokeTime,
        submit_timestamp: submitTime
      });
      
      // Console output for developer visibility
      console.log('=== RESPONSE SUBMITTED ===');
      console.log('State:', currentState);
      console.log('Response:', value);
      console.log('Latency (ms):', {
        total_input_latency: inputLatency?.toFixed(2),
        time_to_first_keystroke: timeToFirstKeystroke?.toFixed(2),
        typing_duration: typingLatency?.toFixed(2)
      });
      console.log('Keystrokes:', keystrokes.length);
      console.log('Keystroke Log:', keystrokes.map(ks => ({
        key: ks.key,
        time_since_available: ks.timeSinceInputAvailable?.toFixed(2) + 'ms',
        time_since_first_key: ks.timeSinceFirstKeystroke?.toFixed(2) + 'ms'
      })));
      console.log('========================');
      
      onSubmit(value);
      setValue('');
      setHasTyped(false);
      setKeystrokes([]);
      setFirstKeystrokeTime(null);
    }
  };

  const getPlaceholder = () => {
    if (currentState === 'amount_confirmation') return 'Enter amount...';
    if (currentState === 'greeting') return 'Type the security code...';
    if (currentState === 'identification') return 'Enter your email...';
    if (currentState === 'phone_verification') return 'Last 4 digits...';
    if (currentState === 'math_verification') return 'Type your answer...';
    if (currentState === 'secret_question') return 'Type your answer...';
    if (currentState === 'protocol_authorization') return "Type the exact phrase...";
    if (currentState === 'timeout') return "Type 'Continue' to reconnect";
    if (currentState === 'result') return "Type 'I approve this request' to confirm";
    if (currentState === 'issue_identification') return 'Briefly describe the issue...';
    if (currentState === 'recipient_name') return 'Recipient name...';
    if (currentState === 'relationship_declaration') return 'Describe relationship and reason...';
    if (currentState === 'service_feedback') return 'Any other questions?';
    return 'Type here...';
  };

  const getInputType = () => {
    return currentState === 'amount_confirmation' ? 'number' : 'text';
  };

  return (
    <form className="input-box" onSubmit={handleSubmit}>
      {error && <div className="input-error">{error}</div>}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          ref={inputRef}
          type={getInputType()}
          step={currentState === 'amount' ? '0.01' : undefined}
          min={currentState === 'amount' ? '0' : undefined}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(''); // Clear error when user starts typing
          }}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className={`amount-input ${error ? 'input-error-border' : ''}`}
          autoFocus
          disabled={disabled}
        />
        <button type="submit" className="submit-button" disabled={disabled}>
          Send
        </button>
      </div>
    </form>
  );
};

export default InputBox;
