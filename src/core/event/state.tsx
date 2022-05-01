import { EventCode, Event, EventHandler, EventPublisher } from './event'
import { World } from '../entity'
import { State, StateManager } from '../state'

export class StateChangeEvent extends Event {
  private state: State
  constructor(state: State) {
    super(EventCode.STATE_CHANGE)
    this.state = state
  }

  public getState(): State {
    return this.state
  }
}

export class StateChangeEventPublisher extends EventPublisher {
  private stateManager: StateManager
  constructor(stateManager: StateManager) {
    super()
    this.stateManager = stateManager
    this.stateManager.registerStateListener(this.checkEvent)
  }

  private checkEvent = (state: State) => {
    this.publishEventToHandler(new StateChangeEvent(state))
  }
}

export class StateChangeEventHandler extends EventHandler {
  private world: World
  constructor(world: World) {
    super(EventCode.STATE_CHANGE)
    this.world = world
  }

  public execute = (event: StateChangeEvent): void => {
    switch (event.getState()) {
      case State.END_GAME:
        break
      case State.IN_GAME:
        this.world.reset()
        break
      case State.PRE_GAME:
        this.world.reset()
        break
    }
  }
}
