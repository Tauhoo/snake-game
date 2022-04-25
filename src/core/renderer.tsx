import * as THREE from 'three'
import { Vector3 } from 'three'
import { Food, Snake, Terrain } from './entity'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface Renderer {
  render(): void
}

export class RenderProvider {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private webGLRenderer: THREE.WebGLRenderer

  private renderers: Renderer[]

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    camera?: THREE.PerspectiveCamera
  ) {
    this.renderers = []
    this.scene = new THREE.Scene()
    this.camera =
      camera === undefined
        ? new THREE.PerspectiveCamera(70, width / height)
        : camera
    this.webGLRenderer = new THREE.WebGLRenderer({ canvas })
    this.webGLRenderer.setSize(width, height)
  }

  public getCamera = (): THREE.PerspectiveCamera => {
    return this.camera
  }

  public registerRenderer = (renderer: Renderer): void => {
    this.renderers.push(renderer)
  }

  public getScene = (): THREE.Scene => {
    return this.scene
  }

  public render = () => {
    for (const renderer of this.renderers) {
      renderer.render()
    }
    this.webGLRenderer.render(this.scene, this.camera)
  }

  public getWebGLRenderer = (): THREE.WebGLRenderer => {
    return this.webGLRenderer
  }

  public resize = (width: number, height: number) => {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.webGLRenderer.setSize(width, height)
    this.webGLRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
}

export class SnakeRenderer implements Renderer {
  private snake: Snake
  private scene: THREE.Scene
  private meshes: THREE.Mesh[] = []
  private material: THREE.MeshBasicMaterial
  private geometry: THREE.SphereGeometry

  constructor(snake: Snake, scene: THREE.Scene) {
    this.snake = snake
    this.scene = scene
    this.material = new THREE.MeshBasicMaterial({ color: 'red' })
    this.geometry = new THREE.SphereGeometry(snake.getWidth() / 2)
  }

  private addMesh = (n: number): void => {
    for (let index = 0; index < n; index++) {
      const newMesh = new THREE.Mesh(this.geometry, this.material)
      this.meshes.push(newMesh)
      this.scene.add(newMesh)
    }
  }

  private removeMesh = (n: number): void => {
    for (let index = 0; index < n; index++) {
      const mesh = this.meshes.pop()
      if (mesh === undefined) return
      this.scene.remove(mesh)
    }
  }

  public getSnakeMeshes(): THREE.Mesh[] {
    return this.meshes
  }

  public render = () => {
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
}

export class TerrainRenderer {
  private terrain: Terrain
  private floorMesh: THREE.Mesh
  private floorGeometry: THREE.PlaneGeometry
  private scene: THREE.Scene

  constructor(terrain: Terrain, scene: THREE.Scene) {
    this.terrain = terrain
    this.scene = scene
    this.floorGeometry = new THREE.PlaneGeometry(
      this.terrain.getWidth(),
      this.terrain.getHeight()
    )
    this.floorMesh = new THREE.Mesh(
      this.floorGeometry,
      new THREE.MeshBasicMaterial({ color: 'green' })
    )
    this.floorMesh.rotation.x = -Math.PI / 2
    this.scene.add(this.floorMesh)
  }

  render = () => {}
}

export interface SnakeCameraRendererParams {
  snake: Snake
  camera?: THREE.PerspectiveCamera
  canvas: HTMLCanvasElement
  debug?: boolean
}

export class SnakeCameraRenderer {
  private camera: THREE.PerspectiveCamera
  private snake: Snake
  private debug: boolean
  private control: OrbitControls

  constructor(params: SnakeCameraRendererParams) {
    this.camera =
      params.camera === undefined
        ? new THREE.PerspectiveCamera()
        : params.camera
    this.snake = params.snake
    this.debug = params.debug === undefined ? false : params.debug
    this.control = new OrbitControls(this.camera, params.canvas)
    this.control.enableDamping = true
    this.setDebug(this.debug)
  }

  public setDebug = (debug: boolean) => {
    if (debug) {
      this.camera.position.x = 0
      this.camera.position.y = 10
      this.camera.position.z = 0
      this.camera.lookAt(new Vector3(0, 0, 0))
    }
    this.control.enabled = debug
    this.debug = debug
  }

  render = () => {
    if (!this.debug) {
      const positions = this.snake.getPositions()
      const snakeHeadPosition = positions[0]
      this.camera.position.x = snakeHeadPosition.x
      this.camera.position.y = 50
      this.camera.position.z = snakeHeadPosition.z
      this.camera.lookAt(
        new Vector3(
          snakeHeadPosition.x,
          snakeHeadPosition.y,
          snakeHeadPosition.z
        )
      )
    }
  }
}

export class FoodRenderer implements Renderer {
  private mesh: THREE.Mesh
  private food: Food
  private scene: THREE.Scene
  constructor(food: Food, scene: THREE.Scene) {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshBasicMaterial({ color: 'yellow' })
    )
    this.food = food
    this.scene = scene
    this.scene.add(this.mesh)
  }

  render(): void {
    const position = this.food.getPosition()
    this.mesh.position.x = position.x
    this.mesh.position.y = position.y
    this.mesh.position.z = position.z
  }
}
