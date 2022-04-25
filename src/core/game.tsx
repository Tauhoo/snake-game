import { Terrain, World, Snake } from './entity'
import {
  SelfCollisionEventHandler,
  SelfCollisionEventPublisher,
} from './event/selfCollision'
import {
  WallCollisionEventHandler,
  WallCollisionEventPublisher,
} from './event/wallColision'
import { KeyDownEventHandler, KeyDownEventPublisher } from './event/keyDown'
import { KeyDownListener } from './key'
import { AnimationLoop, StableLoop } from './loop'
import {
  RenderProvider,
  SnakeCameraRenderer,
  SnakeRenderer,
  TerrainRenderer,
} from './renderer'
import { State, StateManager } from './state'
import { Vector3 } from './vector'

interface GameParams {
  canvas: HTMLCanvasElement
  width: number
  height: number
  window: Window
  loopFrequency: number
}

export class Game {
  private stateManager: StateManager
  private renderProvider: RenderProvider
  private renderLoop: AnimationLoop
  private logicLoop: StableLoop
  private keyDownListener: KeyDownListener

  private keyDownEventPublisher: KeyDownEventPublisher
  private wallCollisionPublisher: WallCollisionEventPublisher
  private selfCollisionPublisher: SelfCollisionEventPublisher

  private world: World

  constructor(params: GameParams) {
    this.stateManager = new StateManager(State.IN_GAME)
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
    this.logicLoop.registerExecuter(() => {
      if (this.stateManager.getState() === State.IN_GAME)
        this.world.getSnake().forward()
    })

    this.keyDownListener = new KeyDownListener(params.window)
    this.keyDownEventPublisher = new KeyDownEventPublisher(this.keyDownListener)
    this.keyDownEventPublisher.registerEventHandler(
      new KeyDownEventHandler(this.world.getSnake())
    )

    this.wallCollisionPublisher = new WallCollisionEventPublisher(
      this.world.getTerrain(),
      this.world.getSnake().getWidth(),
      snakeRenderer.getSnakeMeshes(),
      this.logicLoop
    )
    this.wallCollisionPublisher.registerEventHandler(
      new WallCollisionEventHandler(this.stateManager)
    )

    this.selfCollisionPublisher = new SelfCollisionEventPublisher(
      this.world.getSnake(),
      this.logicLoop
    )
    this.selfCollisionPublisher.registerEventHandler(
      new SelfCollisionEventHandler(this.stateManager)
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

  public getStateManager(): StateManager {
    return this.stateManager
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

  public resize = (width: number, height: number) => {
    this.renderProvider.resize(width, height)
  }

  public reset = () => {
    this.world.reset()
    this.stateManager.setState(State.IN_GAME)
  }
}
