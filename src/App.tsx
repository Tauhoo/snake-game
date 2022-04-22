import './App.css'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Vector from './util/math/vector'
import Snake from './entity/snake'
import SnakeRenderer from './renderer/snake'
import Terrain from './entity/terrain'
import TerrainRenderer from './renderer/terrain'
import { StoneGenerator } from './entity/stone'
import Range from './util/math/range'

function App() {
  const ref = useRef(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const sizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const snake = useRef<Snake>(
    new Snake({ initLength: 5, position: new Vector(0, 0.25, 0), width: 0.5 })
  )
  const snakeRenderer = useRef<SnakeRenderer | null>(null)
  const terrain = useRef<Terrain | null>(null)
  const terrainRenderer = useRef<TerrainRenderer | null>(null)
  const lastKey = useRef<string>('s')

  const tick = () => {
    if (cameraRef.current === null) return
    if (snakeRenderer.current === null) return
    if (rendererRef.current === null) return
    if (sceneRef.current === null) return
    if (terrain.current === null) return
    if (terrainRenderer.current === null) return

    // snake.current.forward()

    const snakePosition = snake.current.getPositions()[0].copy()
    const snakeRawDirection = snake.current.getRawDirection()
    const cameraPosition = snakePosition
      .copy()
      .sub(snakeRawDirection.scalarMult(2))
    cameraRef.current.position.x = cameraPosition.x
    cameraRef.current.position.y = cameraPosition.y + 5
    cameraRef.current.position.z = cameraPosition.z
    cameraRef.current.lookAt(
      new THREE.Vector3(snakePosition.x, snakePosition.y, snakePosition.z)
    )

    snakeRenderer.current.render()
    terrainRenderer.current.render()
    rendererRef.current.render(sceneRef.current, cameraRef.current)

    window.requestAnimationFrame(tick)
  }
  const onKeyPress = (e: KeyboardEvent) => {
    console.log(lastKey.current, e.key)

    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        if (lastKey.current === 's') return
        snake.current.setDirection(new Vector(0, 0, -1))
        lastKey.current = 'w'
        break
      case 'a':
      case 'ArrowLeft':
        if (lastKey.current === 'd') return
        snake.current.setDirection(new Vector(-1, 0, 0))
        lastKey.current = 'a'
        break
      case 'd':
      case 'ArrowRight':
        if (lastKey.current === 'a') return
        snake.current.setDirection(new Vector(1, 0, 0))
        lastKey.current = 'd'
        break
      case 's':
      case 'ArrowDown':
        if (lastKey.current === 'w') return
        snake.current.setDirection(new Vector(0, 0, 1))
        lastKey.current = 's'
        break
    }
  }

  const init = () => {
    if (window === undefined) return
    if (ref.current === null) return
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    const renderer = new THREE.WebGLRenderer({
      canvas: ref.current,
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)
    sceneRef.current = new THREE.Scene()
    snakeRenderer.current = new SnakeRenderer(snake.current, sceneRef.current)
    terrain.current = new Terrain({
      width: 20,
      height: 20,
      stoneNumber: 5,
      stoneGenerator: new StoneGenerator({
        heightRange: new Range(3, 1),
        radiusRange: new Range(2, 1),
        positionRange: {
          x: new Range(10, -10),
          z: new Range(10, -10),
        },
      }),
    })
    terrain.current.generateObjects()

    terrainRenderer.current = new TerrainRenderer({
      terrain: terrain.current,
      scene: sceneRef.current,
    })

    sceneRef.current.add(new THREE.AxesHelper(100))
    rendererRef.current = renderer
    sizeRef.current = sizes
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    )

    // const controls = new OrbitControls(cameraRef.current, ref.current)
    // controls.enableDamping = true
    // cameraRef.current.position.x = 0
    // cameraRef.current.position.y = 5
    // cameraRef.current.position.z = 5
    // cameraRef.current.lookAt(
    //   new THREE.Vector3(snakePosition.x, snakePosition.y, snakePosition.z)
    // )
  }

  useEffect(() => {
    tick()
    init()
    window.addEventListener('keydown', onKeyPress)
    return () => window.removeEventListener('keydown', onKeyPress)
  }, [])
  return (
    <div className='App'>
      <canvas ref={ref}></canvas>
    </div>
  )
}

export default App
