import "./stopwatch.js";

const stopL = document.getElementById("stopwatch") as HTMLDivElement;
const globalS = document.createElement("stopwatch-element") as HTMLDivElement;
globalS.setAttribute("secondsElapsed", "0");
stopL.appendChild(globalS);
