export enum EventCode {
  KEY_DOWN,
  COLLISION,
  WALL_COLLISION,
  SELF_COLLISION,
  SCEEN_RESIZE,
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

// export class WallCollisionEvent extends Event {
//   private position: Vector3
//   constructor(position: Vector3) {
//     super(EventCode.WALL_COLLISION)
//     this.position = position
//   }

//   public getPosition(): Vector3 {
//     return this.position
//   }
// }

// export class WallCollisionEventPublisher extends EventPublisher {
//   private logicLoop: StableLoop
//   private terrain: Terrain
//   private snakeMesh: THREE.Mesh[]
//   private raycasters: THREE.Raycaster[]
//   private snakeWidth: number
//   constructor(
//     terrain: Terrain,
//     snakeWidth: number,
//     snakeMesh: THREE.Mesh[],
//     logicLoop: StableLoop
//   ) {
//     super()
//     this.logicLoop = logicLoop
//     this.terrain = terrain
//     this.snakeMesh = snakeMesh
//     this.raycasters = []
//     this.snakeMesh = snakeMesh
//     this.snakeWidth = snakeWidth
//     this.initRaycaser()
//     this.logicLoop.registerExecuter(this.checkEvent)
//   }

//   private initRaycaser() {
//     const height = this.terrain.getHeight()
//     const width = this.terrain.getWidth()
//     const a = new THREE.Raycaster(
//       new THREE.Vector3(width / 2, this.snakeWidth / 2, height / 2)
//     )
//     a.ray.lookAt(new THREE.Vector3(-width / 2, this.snakeWidth / 2, height / 2))

//     const b = new THREE.Raycaster(
//       new THREE.Vector3(-width / 2, this.snakeWidth / 2, height / 2)
//     )
//     b.ray.lookAt(
//       new THREE.Vector3(-width / 2, this.snakeWidth / 2, -height / 2)
//     )

//     const c = new THREE.Raycaster(
//       new THREE.Vector3(-width / 2, this.snakeWidth / 2, -height / 2)
//     )
//     c.ray.lookAt(new THREE.Vector3(width / 2, this.snakeWidth / 2, -height / 2))

//     const d = new THREE.Raycaster(
//       new THREE.Vector3(width / 2, this.snakeWidth / 2, -height / 2)
//     )
//     d.ray.lookAt(new THREE.Vector3(width / 2, this.snakeWidth / 2, height / 2))
//     this.raycasters.push(a, b, c, d)
//   }

//   private checkEvent = () => {
//     for (let ray of this.raycasters) {
//       const values = ray.intersectObjects(this.snakeMesh)
//       if (values.length > 0) {
//         const { x, y, z } = values[0].point
//         this.publishEventToHandler(new WallCollisionEvent(new Vector3(x, y, z)))
//       }
//     }
//   }
// }

// export class WallCollisionEventHandler extends EventHandler {
//   private camera: THREE.PerspectiveCamera
//   constructor(camera: THREE.PerspectiveCamera) {
//     super(EventCode.WALL_COLLISION)
//     this.camera = camera
//   }

//   public execute = (event: WallCollisionEvent): void => {
//     console.log('DEBUG :', event.getPosition())
//   }
// }
