import { Snake } from '../entity'
import { KeyCode, KeyDownListener } from '../key'
import { Vector3 } from '../vector'
import { EventCode, Event, EventHandler, EventPublisher } from './event'

export class KeyDownEvent extends Event {
  private key: KeyCode
  constructor(key: KeyCode) {
    super(EventCode.KEY_DOWN)
    this.key = key
  }

  public getKey = (): KeyCode => {
    return this.key
  }
}

export class KeyDownEventHandler extends EventHandler {
  private snake: Snake
  constructor(snake: Snake) {
    super(EventCode.KEY_DOWN)
    this.snake = snake
  }

  public execute = (event: KeyDownEvent): void => {
    const currentDirection = this.snake.getDirection()
    let currentDirectionInRadius = Math.atan2(
      currentDirection.z * -1,
      currentDirection.x
    )

    const rotationRate = Math.PI / 4

    switch (event.getKey()) {
      case KeyCode.LEFT:
        currentDirectionInRadius += rotationRate
        break
      case KeyCode.RIGHT:
        currentDirectionInRadius -= rotationRate
        break
    }

    const z = Math.sin(currentDirectionInRadius) * -1
    const x = Math.cos(currentDirectionInRadius)
    const newDirection = new Vector3(x, currentDirection.y, z)
    currentDirection.setFromVector3(newDirection)
  }
}

export class KeyDownEventPublisher extends EventPublisher {
  private keyDownListener: KeyDownListener
  constructor(keyDownListener: KeyDownListener) {
    super()
    this.keyDownListener = keyDownListener
    this.keyDownListener.registerCallback(this.onKeyDown)
  }

  onKeyDown = (k: KeyCode): void => {
    this.publishEventToHandler(new KeyDownEvent(k))
  }
}
