import './App.css'
import { useEffect, useRef } from 'react'
import { Game } from './core/game'

function App() {
  const gameRef = useRef<Game | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window === undefined) return
    if (canvasRef.current === null) return

    const game = new Game({
      window,
      canvas: canvasRef.current,
      width: 500,
      height: 500,
      loopFrequency: 24,
    })
    game.start()

    gameRef.current = game
    return () => {
      if (gameRef.current === null) return
      gameRef.current.destroy()
    }
  }, [])
  return (
    <div className='App'>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default App
