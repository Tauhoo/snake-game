import Snake from '../entity/snake'
import * as THREE from 'three'

class SnakeRenderer {
  private snake: Snake
  private scene: THREE.Scene
  private meshes: THREE.Mesh[] = []
  private material: THREE.MeshBasicMaterial
  private geometry: THREE.SphereGeometry

  constructor(snake: Snake, scene: THREE.Scene) {
    this.snake = snake
    this.scene = scene
    this.material = new THREE.MeshBasicMaterial({ color: 'red' })
    this.geometry = new THREE.SphereGeometry(snake.getWidth())
  }

  updateMeshes() {
    const positions = this.snake.getPositions()
    if (positions.length > this.meshes.length) {
      this.addMesh(positions.length - this.meshes.length)
    } else if (positions.length < this.meshes.length) {
      this.removeMesh(this.meshes.length - positions.length)
    }
    for (let index = 0; index < this.meshes.length; index++) {
      this.meshes[index].position.x = positions[index].x
      this.meshes[index].position.y = positions[index].y
      this.meshes[index].position.z = positions[index].z
    }
  }

  private addMesh(n: number) {
    for (let index = 0; index < n; index++) {
      const newMesh = new THREE.Mesh(this.geometry, this.material)
      this.meshes.push(newMesh)
      this.scene.add(newMesh)
    }
  }

  private removeMesh(n: number) {
    for (let index = 0; index < n; index++) {
      const mesh = this.meshes.pop()
      if (mesh === undefined) return
      this.scene.remove(mesh)
    }
  }

  public render() {
    const positions = this.snake.getPositions()
    if (positions.length !== this.meshes.length) {
      console.log(
        positions.length,
        this.meshes.length,
        positions.length > this.meshes.length
      )
    }
    this.updateMeshes()
  }
}

export default SnakeRenderer
