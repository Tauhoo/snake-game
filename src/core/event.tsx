import * as THREE from 'three'
import { Snake, Terrain } from './entity'
import { KeyCode, KeyDownListener } from './key'
import { AnimationLoop, StableLoop } from './loop'
import { Vector3 } from './vector'

enum EventCode {
  KEY_DOWN,
  COLLISION,
  WALL_COLLISION,
  SELF_COLLISION,
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

export class WallCollisionEvent extends Event {
  private position: Vector3
  constructor(position: Vector3) {
    super(EventCode.WALL_COLLISION)
    this.position = position
  }

  public getPosition(): Vector3 {
    return this.position
  }
}

export class WallCollisionEventPublisher extends EventPublisher {
  private logicLoop: StableLoop
  private terrain: Terrain
  private snakeMesh: THREE.Mesh[]
  private raycasters: THREE.Raycaster[]
  private snakeWidth: number
  constructor(
    terrain: Terrain,
    snakeWidth: number,
    snakeMesh: THREE.Mesh[],
    logicLoop: StableLoop
  ) {
    super()
    this.logicLoop = logicLoop
    this.terrain = terrain
    this.snakeMesh = snakeMesh
    this.raycasters = []
    this.snakeMesh = snakeMesh
    this.snakeWidth = snakeWidth
    this.initRaycaser()
    this.logicLoop.registerExecuter(this.checkEvent)
  }

  private initRaycaser() {
    const height = this.terrain.getHeight()
    const width = this.terrain.getWidth()
    const a = new THREE.Raycaster(
      new THREE.Vector3(width / 2, this.snakeWidth / 2, height / 2)
    )
    a.ray.lookAt(new THREE.Vector3(-width / 2, this.snakeWidth / 2, height / 2))

    const b = new THREE.Raycaster(
      new THREE.Vector3(-width / 2, this.snakeWidth / 2, height / 2)
    )
    b.ray.lookAt(
      new THREE.Vector3(-width / 2, this.snakeWidth / 2, -height / 2)
    )

    const c = new THREE.Raycaster(
      new THREE.Vector3(-width / 2, this.snakeWidth / 2, -height / 2)
    )
    c.ray.lookAt(new THREE.Vector3(width / 2, this.snakeWidth / 2, -height / 2))

    const d = new THREE.Raycaster(
      new THREE.Vector3(width / 2, this.snakeWidth / 2, -height / 2)
    )
    d.ray.lookAt(new THREE.Vector3(width / 2, this.snakeWidth / 2, height / 2))
    this.raycasters.push(a, b, c, d)
  }

  private checkEvent = () => {
    for (let ray of this.raycasters) {
      const values = ray.intersectObjects(this.snakeMesh)
      if (values.length > 0) {
        const { x, y, z } = values[0].point
        this.publishEventToHandler(new WallCollisionEvent(new Vector3(x, y, z)))
      }
    }
  }
}

export class WallCollisionEventHandler extends EventHandler {
  private camera: THREE.PerspectiveCamera
  constructor(camera: THREE.PerspectiveCamera) {
    super(EventCode.WALL_COLLISION)
    this.camera = camera
  }

  public execute = (event: WallCollisionEvent): void => {
    console.log('DEBUG :', event.getPosition())
  }
}

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
  private camera: THREE.PerspectiveCamera
  constructor(camera: THREE.PerspectiveCamera) {
    super(EventCode.SELF_COLLISION)
    this.camera = camera
  }

  public execute = (event: WallCollisionEvent): void => {
    console.log('DEBUG : self', event.getPosition())
  }
}
