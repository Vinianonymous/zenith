export class Stopwatch extends HTMLElement {
    shadow;
    secondsElapsed = 0;
    isCounting = false;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }
    // This basically exposes the function
    start(label) {
        const id = setInterval(() => {
            this.secondsElapsed++;
            const hour = String(Math.floor(this.secondsElapsed / 3600)).padStart(2, "0");
            const minute = String(Math.floor((this.secondsElapsed % 3600) / 60)).padStart(2, "0");
            const second = String(this.secondsElapsed % 60).padStart(2, "0");
            label.textContent = `${hour}:${minute}:${second}`;
            return id;
        }, 1000);
    }
    stop(id) {
        clearInterval(id);
    }
    connectedCallback() {
        this.shadow.innerHTML = `
    <div id="stopwatch-text">
      00:00:00
    </div>
    `;
        const label = this.shadow.getElementById("stopwatch-text");
        this.start(label);
    }
}
customElements.define("stopwatch-element", Stopwatch);
