import Terrain from '../entity/terrain'
import * as THREE from 'three'

interface TerrainRendererParams {
  terrain: Terrain
  scene: THREE.Scene
}

class TerrainRenderer {
  private terrain: Terrain
  private needUpdate: boolean = true
  private floorMesh: THREE.Mesh | null
  private scene: THREE.Scene
  private stoneMeshes: THREE.Mesh[]

  constructor(params: TerrainRendererParams) {
    this.terrain = params.terrain
    this.scene = params.scene
    this.stoneMeshes = []
    this.floorMesh = null
  }

  private setupFloorMesh() {
    this.floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(
        this.terrain.getWidth(),
        this.terrain.getHeight()
      ),
      new THREE.MeshBasicMaterial({ color: 'green' })
    )
    this.floorMesh.rotation.x = -Math.PI / 2

    this.scene.add(this.floorMesh)
  }

  private setupStoneMesh() {
    const stones = this.terrain.getStones()
    console.log(stones)

    for (let index = 0; index < stones.length; index++) {
      const stone = stones[stones.length - 1 - index]
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          stone.getRadius(),
          stone.getRadius(),
          stone.getHeight()
        ),
        new THREE.MeshBasicMaterial({ color: 'blue' })
      )
      const position = stone.getPosition()
      mesh.position.x = position.x
      mesh.position.y = position.y
      mesh.position.z = position.z

      this.stoneMeshes.push(mesh)
      this.scene.add(mesh)
    }
  }

  private removeStoneMeshes() {
    const stones = this.terrain.getStones()
    for (let index = 0; index < stones.length; index++) {
      const mesh = this.stoneMeshes.pop()
      if (mesh === undefined) return
      this.scene.remove(mesh)
    }
  }

  private updateStoneMesh() {
    this.removeStoneMeshes()
    this.setupStoneMesh()
  }

  private updateMesh() {
    this.updateStoneMesh()
    if (this.floorMesh !== null) this.scene.remove(this.floorMesh)
    this.setupFloorMesh()
    this.needUpdate = false
  }

  render() {
    if (!this.needUpdate) return
    this.updateMesh()
  }
}

export default TerrainRenderer
