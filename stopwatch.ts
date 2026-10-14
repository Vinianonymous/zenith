export class Stopwatch extends HTMLElement {
  private shadow: ShadowRoot;
  public secondsElapsed: number = 0;
  public isCounting: boolean = false;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

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
      return id;
    }, 1000);
  }

  public stop(id: number) {
    if (this.isCounting) return;
    this.isCounting = false;
    clearInterval(id);
  }

  connectedCallback(): void {
    this.shadow.innerHTML = `
    <div id="stopwatch-text">
      00:00:00
    </div>
    `;
    const label = this.shadow.getElementById("stopwatch-text") as HTMLDivElement;
    this.start(label);
  }
}

customElements.define("stopwatch-element", Stopwatch);
