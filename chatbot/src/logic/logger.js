// Logger utility for precise event timing
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export class Logger {
  constructor(participantId, condition) {
    this.participantId = participantId;
    this.condition = condition;
    this.sessionStart = performance.now();
  }

  async logEvent(state, eventType, payload = {}) {
    const currentTime = performance.now();
    
    const eventData = {
      participant_id: this.participantId,
      condition: this.condition,
      state: state,
      event_type: eventType,
      timestamp: currentTime,
      time_since_session_start: currentTime - this.sessionStart,
      payload: payload,
      created_at: new Date().toISOString()
    };

    // Structure response data more clearly
    if (eventType === 'response_submitted') {
      eventData.response_data = {
        text: payload.response,
        latency: {
          total_input_latency_ms: payload.input_latency_ms,
          time_to_first_keystroke_ms: payload.time_to_first_keystroke_ms,
          typing_duration_ms: payload.typing_duration_ms
        },
        keystrokes: {
          count: payload.keystroke_count,
          detailed_log: payload.keystrokes.map(ks => ({
            key: ks.key,
            timestamp: ks.timestamp,
            time_since_input_available: ks.timeSinceInputAvailable,
            time_since_first_keystroke: ks.timeSinceFirstKeystroke
          }))
        },
        timestamps: {
          input_available: payload.input_available_timestamp,
          first_keystroke: payload.first_keystroke_timestamp,
          submit: payload.submit_timestamp
        }
      };
    }

    try {
      await addDoc(collection(db, 'events'), eventData);
      console.log('Event logged:', eventData);
    } catch (error) {
      console.error('Error logging event:', error);
    }

    return eventData;
  }
}
