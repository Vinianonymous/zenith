import "./stopwatch.js";
// From 1000 lines in the other version to just this... I'm happy to rewrite zenith myself.
const stopL = document.getElementById("stopwatch");
const globalS = document.createElement("stopwatch-element");
globalS.setAttribute("secondsElapsed", "0");
stopL.appendChild(globalS);
