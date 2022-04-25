import { PerspectiveCamera } from 'three'
import { EventCode, Event, EventHandler, EventPublisher } from './event'

export class ScreenResizeEvent extends Event {
  private height: number
  private width: number
  constructor(height: number, width: number) {
    super(EventCode.SCEEN_RESIZE)
    this.height = height
    this.width = width
  }

  public getWidth(): number {
    return this.width
  }

  public getHeight(): number {
    return this.height
  }
}

export class ScreenResizeEventPublisher extends EventPublisher {
  constructor() {
    super()
  }
}

export class ScreenResizeEventHandler extends EventHandler {
  private camera: PerspectiveCamera
  private canvas: HTMLCanvasElement
  constructor(camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
    super(EventCode.SCEEN_RESIZE)
    this.camera = camera
    this.canvas = canvas
  }

  public execute = (event: ScreenResizeEvent): void => {}
}
