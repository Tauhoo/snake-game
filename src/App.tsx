import './App.css'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import Snake from './entity/snake'
import SnakeRenderer from './renderer/snake'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { clear } from 'console'
import Vector from './util/math/vector'

function App() {
  const ref = useRef(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const sizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const snake = useRef<Snake>(new Snake({ initLength: 5 }))
  const snakeRenderer = useRef<SnakeRenderer | null>(null)

  const tick = () => {
    if (cameraRef.current === null) return
    if (snakeRenderer.current === null) return
    if (rendererRef.current === null) return
    if (sceneRef.current === null) return
    snake.current.forward()

    const snakePosition = snake.current.getPositions()[0].copy()
    cameraRef.current.position.x = snakePosition.x
    cameraRef.current.position.y = snakePosition.y + 5
    cameraRef.current.position.z = snakePosition.z + 5
    cameraRef.current.lookAt(
      new THREE.Vector3(snakePosition.x, snakePosition.y, snakePosition.z)
    )

    snakeRenderer.current.render()
    rendererRef.current.render(sceneRef.current, cameraRef.current)

    window.requestAnimationFrame(tick)
  }
  const onKeyPress = (e: KeyboardEvent) => {
    console.log(e.key)
    switch (e.key) {
      case 'a':
      case 'ArrowLeft':
        snake.current.setDirection(new Vector(-1, 0, 0))
        break
      case 'd':
      case 'ArrowRight':
        snake.current.setDirection(new Vector(1, 0, 0))
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
    sceneRef.current = new THREE.Scene()
    snakeRenderer.current = new SnakeRenderer(snake.current, sceneRef.current)

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
