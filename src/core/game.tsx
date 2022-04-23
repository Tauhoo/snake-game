import { Terrain, World, Snake } from './entity'
import { KeyDownEventHandler, KeyDownEventPublisher } from './event'
import { KeyDownListener } from './key'
import { AnimationLoop, StableLoop } from './loop'
import {
  RenderProvider,
  SnakeCameraRenderer,
  SnakeRenderer,
  TerrainRenderer,
} from './renderer'
import { Vector3 } from './vector'

interface GameParams {
  canvas: HTMLCanvasElement
  width: number
  height: number
  window: Window
  loopFrequency: number
}

export class Game {
  private renderProvider: RenderProvider
  private renderLoop: AnimationLoop
  private logicLoop: StableLoop
  private keyDownListener: KeyDownListener
  private keyDownEventPublisher: KeyDownEventPublisher

  private world: World

  constructor(params: GameParams) {
    this.world = this.initWorld()

    this.renderProvider = new RenderProvider(
      params.canvas,
      params.width,
      params.height
    )
    this.renderLoop = new AnimationLoop(params.window)
    this.renderLoop.registerExecuter(this.renderProvider.render)
    const snakeRenderer = new SnakeRenderer(
      this.world.getSnake(),
      this.renderProvider.getScene()
    )
    const terrainRenderer = new TerrainRenderer(
      this.world.getTerrain(),
      this.renderProvider.getScene()
    )
    const cameraRenderer = new SnakeCameraRenderer({
      snake: this.world.getSnake(),
      camera: this.renderProvider.getCamera(),
      canvas: params.canvas,
      debug: true,
    })
    this.renderProvider.registerRenderer(snakeRenderer)
    this.renderProvider.registerRenderer(terrainRenderer)
    this.renderProvider.registerRenderer(cameraRenderer)

    this.logicLoop = new StableLoop(params.window, 1000 / params.loopFrequency)
    this.logicLoop.registerExecuter(this.world.getSnake().forward)

    this.keyDownListener = new KeyDownListener(params.window)
    this.keyDownEventPublisher = new KeyDownEventPublisher(this.keyDownListener)
    this.keyDownEventPublisher.registerEventHandler(
      new KeyDownEventHandler(this.world.getSnake())
    )
  }

  private initWorld = (): World => {
    const terrain = new Terrain({
      width: 20,
      height: 20,
    })
    const snake = new Snake({
      initLength: 5,
      position: new Vector3(0, 0.25, 0),
      width: 0.5,
    })
    return new World({
      terrain,
      snake,
    })
  }

  public getRenderProvider = (): RenderProvider => {
    return this.renderProvider
  }

  public start = () => {
    this.renderLoop.start()
    this.logicLoop.start()
    this.keyDownListener.start()
  }

  public destroy = () => {
    this.renderLoop.destroy()
    this.logicLoop.destroy()
    this.keyDownListener.destroy()
  }
}
