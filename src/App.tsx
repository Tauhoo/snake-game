import './App.css'
import { useEffect, useRef } from 'react'
import { Game } from './core/game'

function App() {
  const gameRef = useRef<Game | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onResize = () => {
    console.log(window.innerHeight, window.innerWidth)
    gameRef.current?.resize(window.innerWidth, window.innerHeight)
  }

  useEffect(() => {
    if (window === undefined) return
    if (canvasRef.current === null) return

    const game = new Game({
      window,
      canvas: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      loopFrequency: 24,
    })
    game.start()

    gameRef.current = game

    window.addEventListener('resize', onResize)
    return () => {
      if (gameRef.current === null) return
      gameRef.current.destroy()
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return (
    <div className='App'>
      <canvas ref={canvasRef}></canvas>
      <button
        style={{ position: 'fixed', top: '0px', left: '0px' }}
        onClick={() => {
          if (gameRef.current !== null) gameRef.current.reset()
        }}
      >
        CLICK
      </button>
    </div>
  )
}

export default App
