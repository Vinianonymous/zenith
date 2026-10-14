import "./stopwatch.js";
const stopL = document.getElementById("stopwatch");
const globalS = document.createElement("stopwatch-element");
globalS.setAttribute("secondsElapsed", "0");
stopL.appendChild(globalS);
