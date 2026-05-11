// State machine for managing conversation flow
export class StateMachine {
  constructor(conditionData) {
    this.states = conditionData;
    this.stateOrder = Object.keys(conditionData);
    this.currentState = this.stateOrder[0];
    this.history = [];
  }

  getCurrentState() {
    return this.currentState;
  }

  getCurrentMessage() {
    return this.states[this.currentState];
  }

  transition(nextState) {
    if (this.states[nextState]) {
      this.history.push(this.currentState);
      this.currentState = nextState;
      return true;
    }
    return false;
  }

  getNextState() {
    const currentIndex = this.stateOrder.indexOf(this.currentState);
    return currentIndex < this.stateOrder.length - 1 ? this.stateOrder[currentIndex + 1] : null;
  }

  reset() {
    this.currentState = this.stateOrder[0];
    this.history = [];
  }
}
