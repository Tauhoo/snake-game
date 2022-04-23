import { Vector3 } from './vector'

export interface WorldParams {
  snake: Snake
  terrain: Terrain
}

export class World {
  private snake: Snake
  private terrain: Terrain

  constructor(params: WorldParams) {
    this.snake = params.snake
    this.terrain = params.terrain
  }

  getSnake = (): Snake => {
    return this.snake
  }

  getTerrain = (): Terrain => {
    return this.terrain
  }
}

export interface SnakeParams {
  stepSize?: number
  position?: Vector3
  direction?: Vector3
  initLength?: number
  speed?: number
  width?: number
}

export class Snake {
  private direction: Vector3
  private positions: Vector3[] = []
  private stepSize: number
  private speed: number
  private width: number

  constructor(params?: SnakeParams) {
    if (params === undefined) params = {}
    if (params.stepSize === undefined) params.stepSize = 1
    if (params.position === undefined) params.position = new Vector3(0, 0, 0)
    if (params.direction === undefined) params.direction = new Vector3(0, 0, -1)
    if (params.initLength === undefined || params.initLength < 2)
      params.initLength = 2
    if (params.speed === undefined) params.speed = 0.1
    if (params.width === undefined) params.width = 0.5

    this.width = params.width
    this.speed = params.speed
    this.stepSize = params.stepSize
    this.direction = params.direction.copy().normalize()

    for (let index = 0; index < params.initLength; index++) {
      const newPosition = params.position
        .copy()
        .add(this.direction.copy().scalarMult(index * params.stepSize))
      this.positions.push(newPosition)
    }
    this.positions.reverse()
  }

  public getWidth = (): number => {
    return this.width
  }

  public getDirection = (): Vector3 => {
    return this.direction
  }

  public getRawDirection = (): Vector3 => {
    return this.positions[0].copy().sub(this.positions[1]).normalize()
  }

  public getPositions = (): Vector3[] => {
    return this.positions
  }

  public eat = () => {
    const tailPosition = this.positions[this.positions.length - 1]
    const preTailPosition = this.positions[this.positions.length - 2]
    const newTailDirection = tailPosition
      .copy()
      .sub(preTailPosition)
      .normalize()
    const newTailPosition = tailPosition
      .copy()
      .add(newTailDirection.scalarMult(this.stepSize))
    this.positions.push(newTailPosition)
  }

  public setDirection = (value: Vector3) => {
    this.direction = value.normalize()
  }

  public forward = () => {
    this.positions[0].add(this.direction.copy().scalarMult(this.speed))
    for (let index = 1; index < this.positions.length; index++) {
      this.updatePositionFromNextProsition(
        this.positions[index],
        this.positions[index - 1]
      )
    }
  }

  private updatePositionFromNextProsition = (pre: Vector3, next: Vector3) => {
    const preDirection = pre.copy().sub(next)
    const newPrePath = preDirection.normalize().scalarMult(this.stepSize)
    pre.setFromVector3(next.copy().add(newPrePath))
  }
}

interface TerrainParams {
  width: number
  height: number
}

export class Terrain {
  private width: number
  private height: number

  constructor(params: TerrainParams) {
    this.width = params.width
    this.height = params.height
  }

  public getWidth = (): number => {
    return this.width
  }

  public getHeight = (): number => {
    return this.height
  }
}