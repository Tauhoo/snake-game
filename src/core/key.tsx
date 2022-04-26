export enum KeyCode {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  None,
}

export class KeyDownListener {
  private window: Window
  private callbacks: ((k: KeyCode) => void)[]

  constructor(window: Window) {
    this.window = window
    this.callbacks = []
  }

  private onKeyDown = (event: KeyboardEvent) => {
    let key = KeyCode.None

    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        key = KeyCode.UP
        break
      case 'a':
      case 'ArrowLeft':
        key = KeyCode.LEFT
        break
      case 'd':
      case 'ArrowRight':
        key = KeyCode.RIGHT
        break
      case 's':
      case 'ArrowDown':
        key = KeyCode.DOWN
        break
    }

    if (key === KeyCode.None) return

    for (const callback of this.callbacks) {
      callback(key)
    }
  }

  public registerCallback = (callback: (k: KeyCode) => void): void => {
    this.callbacks.push(callback)
  }

  public destroy = (): void => {
    this.window.removeEventListener('keydown', this.onKeyDown)
  }

  public start = (): void => {
    this.window.addEventListener('keydown', this.onKeyDown)
  }

  public stop = (): void => {
    this.window.removeEventListener('keydown', this.onKeyDown)
  }
}
