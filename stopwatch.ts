export class Stopwatch {
  public secondsElapsed: number = 0;
  public isCounting: boolean = false;
  public cyclePeriod: number = 15;
  public cycleEnabled: boolean = false;
  public id: number = 0;
  cycleEvent = new CustomEvent("cycle", {
    detail: {},
    composed: true,
    bubbles: true,
  }); // This basically exposes the function
  public toggle(label: HTMLDivElement) {
    if (!this.isCounting) {
      this.isCounting = true;
      this.id = setInterval(() => {
        this.secondsElapsed++;
        const hour = String(Math.floor(this.secondsElapsed / 3600)).padStart(2, "0");
        const minute = String(Math.floor((this.secondsElapsed % 3600) / 60)).padStart(2, "0");
        const second = String(this.secondsElapsed % 60).padStart(2, "0");
        label.textContent = `${hour}:${minute}:${second}`;
        if (this.secondsElapsed % (this.cyclePeriod * 60) == 0 && this.cycleEnabled) {
          document.dispatchEvent(this.cycleEvent);
        }
      }, 10);
    } else {
      this.isCounting = false;
      clearInterval(this.id);
    }
  }
}
export class Timer {
  // Default 5 min timer
  public secondsRemaining: number = 300;
  public id: number = 0;
  public isCounting: boolean = false;
  public render(label: HTMLDivElement) {
    const hour = String(Math.floor(this.secondsRemaining / 3600)).padStart(2, "0");
    const minute = String(Math.floor((this.secondsRemaining % 3600) / 60)).padStart(2, "0");
    const second = String(this.secondsRemaining % 60).padStart(2, "0");
    label.textContent = `${hour}:${minute}:${second}`;
  }

  public toggleCounting(label: HTMLDivElement) {
    this.render(label);
    if (!this.isCounting) {
      this.isCounting = true;
      this.id = setInterval(() => {
        this.secondsRemaining--;
        this.render(label);
        if (this.secondsRemaining <= 0) {
          this.isCounting = false;
          label.textContent = "IC completed!";
          clearInterval(this.id);
        }
      }, 1000);
    } else {
      this.isCounting = false;
      clearInterval(this.id);
    }
  }
}
