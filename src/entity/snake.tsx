import Vector from '../util/math/vector'

export interface SnakeParams {
  stepSize?: number
  position?: Vector
  direction?: Vector
  initLength?: number
  speed?: number
  width?: number
}

class Snake {
  private direction: Vector
  private positions: Vector[] = []
  private stepSize: number
  private speed: number
  private width: number

  constructor(params?: SnakeParams) {
    if (params === undefined) params = {}
    if (params.stepSize === undefined) params.stepSize = 1
    if (params.position === undefined) params.position = new Vector(0, 0, 0)
    if (params.direction === undefined) params.direction = new Vector(0, 0, 1)
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

  public getWidth(): number {
    return this.width
  }

  public getDirection(): Vector {
    return this.direction
  }

  public getRawDirection(): Vector {
    return this.positions[0].copy().sub(this.positions[1]).normalize()
  }

  public getPositions(): Vector[] {
    return this.positions
  }

  public eat() {
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

  public setDirection(value: Vector) {
    this.direction = value.normalize()
  }

  public forward() {
    this.positions[0].add(this.direction.copy().scalarMult(this.speed))
    for (let index = 1; index < this.positions.length; index++) {
      this.updatePositionFromNextProsition(
        this.positions[index],
        this.positions[index - 1]
      )
    }
  }

  private updatePositionFromNextProsition(pre: Vector, next: Vector) {
    const preDirection = pre.copy().sub(next)
    const newPrePath = preDirection.normalize().scalarMult(this.stepSize)
    pre.setFromVector(next.copy().add(newPrePath))
  }
}

export default Snake
