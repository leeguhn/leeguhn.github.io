import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import './ChatWindow.css';

const ChatWindow = ({ messages, currentMessage, onAmountSubmit, logger, currentState, showInput, condition }) => {
  const messagesEndRef = useRef(null);
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const inputAvailableTimeRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentMessage]);

  useEffect(() => {
    // Log message render event when new message appears
    if (currentMessage) {
      logger.logEvent(currentState, 'message_render', { 
        message: currentMessage.message 
      });
    }
  }, [currentMessage, currentState, logger]);

  // Delay enabling input until after animation completes
  useEffect(() => {
    if (showInput) {
      setIsInputEnabled(false);
      const timer = setTimeout(() => {
        setIsInputEnabled(true);
        // Record when input becomes available
        inputAvailableTimeRef.current = performance.now();
        logger.logEvent(currentState, 'input_available', {
          timestamp: inputAvailableTimeRef.current
        });
      }, 550); // 300ms animation + 250ms buffer

      return () => clearTimeout(timer);
    } else {
      setIsInputEnabled(false);
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
      <InputBox
        onSubmit={onAmountSubmit}
        logger={logger}
        currentState={currentState}
        inputAvailableTime={inputAvailableTimeRef.current}
        disabled={!isInputEnabled}
        condition={condition}
      />
    </div>
  );
};

export default ChatWindow;
