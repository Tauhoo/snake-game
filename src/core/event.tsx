import { Snake } from './entity'
import { KeyCode, KeyDownListener } from './key'
import { Vector3 } from './vector'

enum EventCode {
  KEY_DOWN,
}

abstract class Event {
  private code: EventCode
  constructor(code: EventCode) {
    this.code = code
  }
  public getCode = (): EventCode => {
    return this.code
  }
}

abstract class EventHandler {
  private eventCode: EventCode
  constructor(eventCode: EventCode) {
    this.eventCode = eventCode
  }

  getEventCode = (): EventCode => {
    return this.eventCode
  }

  public abstract execute(event: Event): void
}

abstract class EventPublisher {
  private eventHandlerMap: Map<EventCode, EventHandler[]> = new Map<
    EventCode,
    EventHandler[]
  >()

  registerEventHandler = (handler: EventHandler) => {
    const eventCode = handler.getEventCode()
    const handlers = this.eventHandlerMap.get(eventCode)
    if (handlers !== undefined) {
      handlers.push(handler)
    } else {
      this.eventHandlerMap.set(eventCode, [handler])
    }
  }

  publishEventToHandler = (event: Event) => {
    const eventCode = event.getCode()
    const handlers = this.eventHandlerMap.get(eventCode)
    if (handlers === undefined) return
    for (const handler of handlers) {
      handler.execute(event)
    }
  }
}

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
