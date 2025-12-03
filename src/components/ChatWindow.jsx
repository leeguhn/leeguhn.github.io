import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import './ChatWindow.css';

const ChatWindow = ({ messages, currentMessage, onAmountSubmit, logger, currentState, showInput }) => {
  const messagesEndRef = useRef(null);
  const [delayedShowInput, setDelayedShowInput] = useState(false);
  const inputAvailableTimeRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Log message render event when new message appears
    if (currentMessage) {
      logger.logEvent(currentState, 'message_render', { 
        message: currentMessage.message 
      });
    }
  }, [currentMessage, currentState, logger]);

  // Delay showing input box until after animation completes
  useEffect(() => {
    if (showInput) {
      setDelayedShowInput(false);
      const timer = setTimeout(() => {
        setDelayedShowInput(true);
        // Record when input becomes available
        inputAvailableTimeRef.current = performance.now();
        logger.logEvent(currentState, 'input_available', {
          timestamp: inputAvailableTimeRef.current
        });
      }, 550); // 300ms animation + 250ms buffer

      return () => clearTimeout(timer);
    } else {
      setDelayedShowInput(false);
      inputAvailableTimeRef.current = null;
    }
  }, [showInput, currentState, logger]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>Safebank Support</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg.message}
            isBot={msg.isBot}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {delayedShowInput && (
        <InputBox
          onSubmit={onAmountSubmit}
          logger={logger}
          currentState={currentState}
          inputAvailableTime={inputAvailableTimeRef.current}
        />
      )}
    </div>
  );
};

export default ChatWindow;
