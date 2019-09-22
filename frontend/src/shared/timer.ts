export default class Timer {
  public secondTillTheEnd: number
  public interval: any

  constructor() {
    this.secondTillTheEnd = 0
    this.interval = null
  }

  public setup(seconds: number) {
    this.stop()
    this.secondTillTheEnd = seconds
  }

  public currentValue() {
    return this.secondTillTheEnd
  }

  public start(
    onCycle: (secondsTillEnd: number) => void,
    onFinish: () => void,
  ) {
    if (this.secondTillTheEnd > 0) {
      const currentSecond = Date.now()
      this.interval = setInterval(
        () => {
          if (currentSecond + 1000 <= Date.now()) {
            this.secondTillTheEnd--
            onCycle(this.secondTillTheEnd)
            if (this.secondTillTheEnd <= 0) {
              onFinish()
              this.stop()
            }
          }
        },
        1000,
      )
    }
  }

  public stop() {
    if (this.interval !== null) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

}
