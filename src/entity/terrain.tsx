import { lookupService } from 'dns'
import Stone, { StoneGenerator } from './stone'

interface TerrainParams {
  width: number
  height: number
  stoneNumber: number
  stoneGenerator: StoneGenerator
}

class Terrain {
  private stoneGenerator: StoneGenerator
  private width: number
  private height: number
  private stoneNumber: number

  private stones: Stone[]
  constructor(params: TerrainParams) {
    this.width = params.width
    this.height = params.height
    this.stoneNumber = params.stoneNumber
    this.stoneGenerator = params.stoneGenerator
    this.stones = []
  }

  private generateStones() {
    this.stones = []
    for (let index = 0; index < this.stoneNumber; index++) {
      this.stones.push(this.stoneGenerator.generate())
    }
  }

  public generateObjects() {
    this.generateStones()
  }

  public getWidth(): number {
    return this.width
  }

  public getHeight(): number {
    return this.height
  }

  public getStones(): Stone[] {
    return this.stones
  }
}

export default Terrain
