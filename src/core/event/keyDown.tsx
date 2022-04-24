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
    switch (event.getKey()) {
      case KeyCode.UP:
        this.snake.setDirection(new Vector3(0, 0, -1))
        break
      case KeyCode.LEFT:
        this.snake.setDirection(new Vector3(-1, 0, 0))
        break
      case KeyCode.RIGHT:
        this.snake.setDirection(new Vector3(1, 0, 0))
        break
      case KeyCode.DOWN:
        this.snake.setDirection(new Vector3(0, 0, 1))
        break
    }
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
