export enum EventCode {
  KEY_DOWN,
  COLLISION,
  WALL_COLLISION,
  SELF_COLLISION,
  SCEEN_RESIZE,
  FOOD_COLLISION,
}

export abstract class Event {
  private code: EventCode
  constructor(code: EventCode) {
    this.code = code
  }
  public getCode = (): EventCode => {
    return this.code
  }
}

export abstract class EventHandler {
  private eventCode: EventCode
  constructor(eventCode: EventCode) {
    this.eventCode = eventCode
  }

  getEventCode = (): EventCode => {
    return this.eventCode
  }

  public abstract execute(event: Event): void
}

export abstract class EventPublisher {
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
