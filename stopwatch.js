export class Stopwatch {
    secondsElapsed = 0;
    isCounting = false;
    // This basically exposes the function
    start(label) {
        if (this.isCounting)
            return;
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
    stop(id) {
        if (this.isCounting)
            return;
        this.isCounting = false;
        clearInterval(id);
    }
}
