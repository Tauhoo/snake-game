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
  FoodRenderer,
  RenderProvider,
  SnakeCameraRenderer,
  SnakeRenderer,
  TerrainRenderer,
} from './renderer'
import { State, StateManager } from './state'
import { Vector3 } from './vector'
import {
  FoodCollisionEventHandler,
  FoodCollisionEventPublisher,
} from './event/foodCollision'
import {
  StateChangeEventHandler,
  StateChangeEventPublisher,
} from './event/state'

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
  private foodCollisionPublisher: FoodCollisionEventPublisher
  private stateChangePublisher: StateChangeEventPublisher

  private world: World

  constructor(params: GameParams) {
    this.stateManager = new StateManager(State.PRE_GAME)
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
      debug: false,
    })
    const foodRenderer = new FoodRenderer(
      this.world.getFood(),
      this.renderProvider.getScene()
    )

    this.renderProvider.registerRenderer(foodRenderer)
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

    this.foodCollisionPublisher = new FoodCollisionEventPublisher(
      this.world.getSnake(),
      this.world.getFood(),
      this.logicLoop
    )
    this.foodCollisionPublisher.registerEventHandler(
      new FoodCollisionEventHandler(this.world, 2)
    )

    this.stateChangePublisher = new StateChangeEventPublisher(this.stateManager)
    this.stateChangePublisher.registerEventHandler(
      new StateChangeEventHandler(this.world)
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
      speed: 0.1,
    })
    return new World({
      terrain,
      snake,
    })
  }

  public getScore = (): number => {
    const snake = this.world.getSnake()
    return snake.getPositions().length - snake.getInitLength()
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
}
