type Executor = () => void
abstract class Loop {
  public executers: Executor[]
  constructor() {
    this.executers = []
  }
  public registerExecuter = (ex: Executor) => {
    this.executers.push(ex)
  }

  public execute = () => {
    for (const ex of this.executers) ex()
  }

  public abstract destroy(): void
  public abstract start(): void
  public abstract stop(): void
}

export class AnimationLoop extends Loop {
  private window: Window
  private isActive: boolean
  constructor(window: Window) {
    super()

    this.window = window
    this.isActive = false
  }

  tick = () => {
    this.window.requestAnimationFrame(() => {
      this.execute()
      if (this.isActive) this.tick()
    })
  }

  start = () => {
    this.isActive = true
    this.tick()
  }

  stop = () => {
    this.isActive = false
  }

  public destroy = () => {
    this.stop()
  }
}

export class StableLoop extends Loop {
  private window: Window
  private interval: number
  private intervalID: number | null
  constructor(window: Window, interval: number) {
    super()

    this.window = window
    this.interval = interval
    this.intervalID = null
  }

  start = () => {
    this.intervalID = this.window.setInterval(this.execute, this.interval)
  }

  stop = () => {
    if (this.intervalID === null) return
    this.window.clearInterval(this.intervalID)
  }

  public destroy = () => {
    this.stop()
  }
}
