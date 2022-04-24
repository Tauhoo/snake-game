import * as THREE from 'three'
import { Terrain } from '../entity'
import { StableLoop } from '../loop'
import { State, StateManager } from '../state'
import { Vector3 } from '../vector'
import { EventCode, Event, EventHandler, EventPublisher } from './event'

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
  private stateManager: StateManager
  constructor(stateManager: StateManager) {
    super(EventCode.WALL_COLLISION)
    this.stateManager = stateManager
  }

  public execute = (event: WallCollisionEvent): void => {
    if (this.stateManager.getState() === State.IN_GAME)
      this.stateManager.setState(State.END_GAME)
  }
}
