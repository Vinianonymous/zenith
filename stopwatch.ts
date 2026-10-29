export class Stopwatch {
  public secondsElapsed: number = 0;
  public isCounting: boolean = false;
  public cyclePeriod: number = 15;
  public cycleEnabled: boolean = false;
  // This basically exposes the function
  public start(label: HTMLDivElement) {
    if (this.isCounting) return;
    this.isCounting = true;
    const id = setInterval(() => {
      this.secondsElapsed++;
      const hour = String(Math.floor(this.secondsElapsed / 3600)).padStart(2, "0");
      const minute = String(Math.floor((this.secondsElapsed % 3600) / 60)).padStart(2, "0");
      const second = String(this.secondsElapsed % 60).padStart(2, "0");
      label.textContent = `${hour}:${minute}:${second}`;
      if (this.cyclePeriod * 60 == this.secondsElapsed && this.cycleEnabled) {
        const cycleEvent = new CustomEvent("cycle", {
          detail: {},
          composed: true,
          bubbles: true,
        });
        document.dispatchEvent(cycleEvent);
      }
      return id;
    }, 1000);
  }

  public stop(id: number) {
    if (this.isCounting) return;
    this.isCounting = false;
    clearInterval(id);
  }
}
