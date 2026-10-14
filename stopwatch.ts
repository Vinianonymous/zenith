export class Stopwatch extends HTMLElement {
  private shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    let secondsElapsed: number = 0;

    let isCounting: boolean = false;
    let interval: number;

    this.shadow.innerHTML = `
    <div id="stopwatch-text">
      00:00:00
    </div>
    `;
    const label = this.shadow.getElementById("stopwatch-text") as HTMLDivElement;

    function start() {
      if (!isCounting) {
        const id = setInterval(() => {
          secondsElapsed++;
          const hour = String(Math.floor(secondsElapsed / 3600)).padStart(2, "0");
          const minute = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, "0");
          const second = String(secondsElapsed % 60).padStart(2, "0");
          label.textContent = `${hour}:${minute}:${second}`;
          return id;
        }, 1000);
      } else {
        console.log("I guess the interval should be cleared?");
      }
    }
    start();

    function stop(id: number) {
      clearInterval(id);
    }
  }
}

customElements.define("stopwatch-element", Stopwatch);
