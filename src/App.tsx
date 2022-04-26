import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Game } from './core/game'
import { State } from './core/state'
import Menu from './components/Menu'

function App() {
  const gameRef = useRef<Game | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState(State.IN_GAME)

  const onResize = () => {
    console.log(window.innerHeight, window.innerWidth)
    gameRef.current?.resize(window.innerWidth, window.innerHeight)
  }

  const onChangeGameState = (state: State): void => {
    setState(state)
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
    game.getStateManager().registerStateListener(onChangeGameState)
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
      {gameRef.current !== null && (
        <Menu game={gameRef.current} enable={state === State.END_GAME}></Menu>
      )}
    </div>
  )
}

export default App
