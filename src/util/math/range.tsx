class Range {
  private min: number
  private max: number

  constructor(max: number, min: number) {
    if (max < min) throw new Error('max less than min')
    this.max = max
    this.min = min
  }

  public getMin() {
    return this.min
  }

  public getMax() {
    return this.max
  }

  public getLength() {
    return this.max - this.min
  }
}

export default Range
