import Range from '../util/math/range'
import Vector from '../util/math/vector'

interface StoneParams {
  height: number
  radius: number
  position: Vector
}

class Stone {
  private height: number
  private radius: number
  private position: Vector
  constructor(params: StoneParams) {
    this.height = params.height
    this.radius = params.radius
    this.position = params.position
  }

  public getHeight(): number {
    return this.height
  }

  public getRadius(): number {
    return this.radius
  }

  public getPosition(): Vector {
    return this.position
  }
}

interface StoneGeneratorParams {
  heightRange: Range
  radiusRange: Range
  positionRange: {
    x: Range
    z: Range
  }
}

export class StoneGenerator {
  private heightRange: Range
  private radiusRange: Range
  private positionRange: {
    x: Range
    z: Range
  }
  constructor(params: StoneGeneratorParams) {
    this.heightRange = params.heightRange
    this.radiusRange = params.radiusRange
    this.positionRange = params.positionRange
  }

  public generate(): Stone {
    const height =
      Math.random() * this.heightRange.getLength() + this.heightRange.getMin()
    return new Stone({
      height,
      radius:
        Math.random() * this.radiusRange.getLength() +
        this.radiusRange.getMin(),
      position: new Vector(
        Math.random() * this.positionRange.x.getLength() +
          this.positionRange.x.getMin(),
        height / 2,
        Math.random() * this.positionRange.z.getLength() +
          this.positionRange.z.getMin()
      ),
    })
  }
}

export default Stone
