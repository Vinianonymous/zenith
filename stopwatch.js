export class Stopwatch extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        let secondsElapsed = 0;
        let isCounting = false;
        let interval;
        this.shadow.innerHTML = `
    <div id="stopwatch-text">
      00:00:00
    </div>
    `;
        const label = this.shadow.getElementById("stopwatch-text");
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
            }
            else {
                console.log("I guess the interval should be cleared?");
            }
        }
        start();
        function stop(id) {
            clearInterval(id);
        }
    }
}
customElements.define("stopwatch-element", Stopwatch);
