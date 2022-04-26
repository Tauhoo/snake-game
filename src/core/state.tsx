export enum State {
  PRE_GAME,
  IN_GAME,
  END_GAME,
}

export type StateListener = (state: State) => void

export class StateManager {
  private state: State
  private stateListeners: StateListener[] = []

  constructor(initState: State) {
    this.state = initState
  }

  getState = (): State => {
    return this.state
  }

  setState = (state: State) => {
    this.state = state
    this.publishState(state)
  }

  public registerStateListener = (stateListener: StateListener) => {
    this.stateListeners.push(stateListener)
  }

  public publishState = (state: State) => {
    for (const stateListener of this.stateListeners) {
      stateListener(state)
    }
  }
}
