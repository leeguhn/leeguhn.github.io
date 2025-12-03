import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isBot }) => {
  return (
    <div className={`message-bubble ${isBot ? 'bot' : 'user'}`}>
      <div className="message-content">
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;
