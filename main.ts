import { Stopwatch } from "./stopwatch.js";
// From 1000 lines in the other version to just this... I'm happy to rewrite zenith myself.stopwatch") as HTMLDivElement);
const globalSBackend = new Stopwatch();
const globalStopwatchLabel = document.getElementById("stopwatch") as HTMLDivElement;
globalSBackend.start(globalStopwatchLabel);
