export class Vector3 {
  public x: number
  public y: number
  public z: number
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  public static copyFrom = (vector: {
    x: number
    y: number
    z: number
  }): Vector3 => {
    const { x, y, z } = vector
    return new Vector3(x, y, z)
  }

  public copy = (): Vector3 => {
    return new Vector3(this.x, this.y, this.z)
  }

  public setFromVector3 = (v: Vector3) => {
    this.x = v.x
    this.y = v.y
    this.z = v.z
  }

  public add = (v: Vector3) => {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }

  public sub = (v: Vector3) => {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    return this
  }

  public scalarMult = (n: number) => {
    this.x *= n
    this.y *= n
    this.z *= n
    return this
  }

  public normalize = () => {
    const size: number = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
    this.x /= size
    this.y /= size
    this.z /= size
    return this
  }
}
