export enum State {
  MENU,
  IN_GAME,
  END_GAME,
}

export class StateManager {
  private state: State

  constructor(initState: State) {
    this.state = initState
  }

  getState = (): State => {
    return this.state
  }

  setState = (state: State) => {
    this.state = state
  }
}
