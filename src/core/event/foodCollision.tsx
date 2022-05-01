import { EventCode, Event, EventHandler, EventPublisher } from './event'
import { Vector3 } from '../vector'
import { Food, Snake, World } from '../entity'
import { StableLoop } from '../loop'

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
  private world: World
  private padding: number
  constructor(world: World, padding: number) {
    super(EventCode.FOOD_COLLISION)
    this.world = world
    this.padding = padding
  }

  public execute = (_: FoodCollisionEvent): void => {
    const terrain = this.world.getTerrain()
    const width = terrain.getWidth()
    const height = terrain.getHeight()
    const food = this.world.getFood()
    const snake = this.world.getSnake()
    const paddedHeight = height - this.padding * 2
    const paddedWidth = width - this.padding * 2
    food.setPosition(
      new Vector3(
        Math.random() * paddedWidth - paddedWidth / 2,
        food.getPosition().y,
        Math.random() * paddedHeight - paddedHeight / 2
      )
    )

    snake.setSpeed(snake.getSpeed() * 1.2)
    this.world.getSnake().eat()
  }
}
