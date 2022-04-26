import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Game } from './core/game'
import { State } from './core/state'
import Menu from './components/Menu'
import Summary from './components/Summary'

function App() {
  const gameRef = useRef<Game | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<State>(State.PRE_GAME)
  const [loading, setLoading] = useState<boolean>(true)

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
    setLoading(false)
    return () => {
      if (gameRef.current === null) return
      gameRef.current.destroy()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const onSetState = (state: State) => {
    if (gameRef === null) return
    setState(state)
    gameRef.current?.getStateManager().setState(state)
  }

  return (
    <div className='App'>
      <canvas ref={canvasRef}></canvas>
      {!loading && (
        <Menu enable={state === State.PRE_GAME} setState={onSetState}></Menu>
      )}
      {!loading && (
        <Summary
          enable={state === State.END_GAME}
          setState={onSetState}
        ></Summary>
      )}
    </div>
  )
}

export default App
