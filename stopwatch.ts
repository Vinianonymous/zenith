export class Stopwatch extends HTMLElement {
  private shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    let secondsElapsed: number = Number(this.getAttribute("secondsElapsed"));
    let isCounting: boolean = false;
    let interval: number;

    this.innerHTML = `
    <div id="stopwatch-text">
      00:00:00
    </div>
    `;
    const label = this.shadow.getElementById("stopwatch-text") as HTMLDivElement;

    function start() {
      return setInterval(() => {
        secondsElapsed++;
        const hour = String(Math.round(secondsElapsed / 3600)).padStart(2, "0");
        const minute = String(Math.round(secondsElapsed / 60)).padStart(2, "0");
        const second = String(Math.round(secondsElapsed / 3600 / 60)).padStart(2, "0");
        label.textContent = `${hour}:${minute}:${second}`;
      }, 1000);
    }
    interval = start();

    function stop(id: number) {
      clearInterval(id);
    }
  }
}

customElements.define("stopwatch-element", Stopwatch);
