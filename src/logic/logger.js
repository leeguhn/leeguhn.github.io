// Logger utility for session-based data collection
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export class Logger {
  constructor(participantId, condition, conditionOrder, sessionNumber) {
    this.participantId = participantId;
    this.condition = condition;
    this.conditionOrder = conditionOrder; // e.g., "none-low"
    this.sessionNumber = sessionNumber; // 1 or 2
    this.sessionStart = performance.now();
    this.userResponses = []; // Accumulate all user responses
    this.currentBotPrompt = null; // Track current bot message for pairing
  }

  // Called when bot sends a message that expects user input
  setBotPrompt(state, message) {
    this.currentBotPrompt = {
      state: state,
      message: message,
      timestamp: performance.now()
    };
  }

  // Log user response with the bot prompt they're responding to
  logUserResponse(state, payload) {
    const responseEntry = {
      state: state,
      bot_prompt: this.currentBotPrompt ? this.currentBotPrompt.message : null,
      user_response: payload.response,
      keystroke_sequence: payload.keystrokes.map(ks => ({
        key: ks.key,
        timestamp: ks.timestamp,
        time_since_input_available: ks.timeSinceInputAvailable,
        time_since_first_keystroke: ks.timeSinceFirstKeystroke
      })),
      timing: {
        input_latency_ms: payload.input_latency_ms,
        time_to_first_keystroke_ms: payload.time_to_first_keystroke_ms,
        typing_duration_ms: payload.typing_duration_ms
      },
      timestamps: {
        bot_prompt_shown: this.currentBotPrompt ? this.currentBotPrompt.timestamp : null,
        input_available: payload.input_available_timestamp,
        first_keystroke: payload.first_keystroke_timestamp,
        submit: payload.submit_timestamp
      }
    };

    this.userResponses.push(responseEntry);
    
    console.log('User response logged:', responseEntry);
    
    // Clear current bot prompt after logging
    this.currentBotPrompt = null;
  }

  // Save complete session data with survey responses
  async saveSession(surveyResponses) {
    const sessionData = {
      participant_id: this.participantId,
      condition: this.condition,
      condition_order: this.conditionOrder,
      session_number: this.sessionNumber,
      session_start: new Date(Date.now() - (performance.now() - this.sessionStart)).toISOString(),
      session_duration_ms: performance.now() - this.sessionStart,
      user_responses: this.userResponses,
      survey_responses: surveyResponses,
      completed_at: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'experiment_sessions'), sessionData);
      console.log('Complete session saved:', sessionData);
      return sessionData;
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  // Legacy method for any other event logging needs
  async logEvent(state, eventType, payload = {}) {
    // Only handle response_submitted through new system
    if (eventType === 'response_submitted') {
      this.logUserResponse(state, payload);
      return;
    }

    // For other events, just log to console
    console.log('Event:', { state, eventType, payload });
  }
}
