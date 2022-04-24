import { EventCode, Event, EventHandler, EventPublisher } from './event'
import { Vector3 } from '../vector'
import { Snake } from '../entity'
import { StableLoop } from '../loop'
import { State, StateManager } from '../state'

export class SelfCollisionEvent extends Event {
  private position: Vector3
  constructor(position: Vector3) {
    super(EventCode.SELF_COLLISION)
    this.position = position
  }

  public getPosition(): Vector3 {
    return this.position
  }
}

export class SelfCollisionEventPublisher extends EventPublisher {
  private snake: Snake
  private logicLoop: StableLoop
  constructor(snake: Snake, logicLoop: StableLoop) {
    super()
    this.logicLoop = logicLoop
    this.snake = snake
    this.logicLoop.registerExecuter(this.checkEvent)
  }

  private checkEvent = () => {
    const positions = this.snake.getPositions()
    const head = positions[0]
    for (let index = 1; index < positions.length; index++) {
      const position = positions[index]
      const distance = position.copy().sub(head).getAmplitude()
      if (distance < this.snake.getWidth()) {
        this.publishEventToHandler(new SelfCollisionEvent(position))
      }
    }
  }
}

export class SelfCollisionEventHandler extends EventHandler {
  private stateManager: StateManager
  constructor(stateManager: StateManager) {
    super(EventCode.SELF_COLLISION)
    this.stateManager = stateManager
  }

  public execute = (event: SelfCollisionEvent): void => {
    if (this.stateManager.getState() === State.IN_GAME)
      this.stateManager.setState(State.END_GAME)
  }
}
