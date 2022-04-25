import { EventCode, Event, EventHandler, EventPublisher } from './event'
import { Vector3 } from '../vector'
import { Food, Snake } from '../entity'
import { StableLoop } from '../loop'
import { State, StateManager } from '../state'

export class FoodCollisionEvent extends Event {
  constructor() {
    super(EventCode.FOOD_COLLISION)
  }
}

export class FoodCollisionEventPublisher extends EventPublisher {
  private snake: Snake
  private logicLoop: StableLoop
  private food: Food
  private lastCheck: boolean
  constructor(snake: Snake, food: Food, logicLoop: StableLoop) {
    super()
    this.logicLoop = logicLoop
    this.snake = snake
    this.food = food
    this.logicLoop.registerExecuter(this.checkEvent)
    this.lastCheck = false
  }

  private checkEvent = () => {
    const positions = this.snake.getPositions()
    const isIntercept =
      positions[0].copy().sub(this.food.getPosition()).getAmplitude() <
      this.snake.getWidth() / 2 + this.food.getRadius()
    if (isIntercept && !this.lastCheck) {
      this.publishEventToHandler(new FoodCollisionEvent())
    }
    this.lastCheck = isIntercept
  }
}

export class FoodCollisionEventHandler extends EventHandler {
  private snake: Snake
  constructor(snake: Snake) {
    super(EventCode.FOOD_COLLISION)
    this.snake = snake
  }

  public execute = (event: FoodCollisionEvent): void => {
    this.snake.eat()
  }
}
