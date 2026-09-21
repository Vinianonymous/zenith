import { Settings } from "./types.js";
import { saveSettings, loadSettings } from "./settings.js";

const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const cyclePeriodInput = document.getElementById('cycle-interval') as HTMLInputElement;
const cycleAlarmPathInput = document.getElementById('cycle-alarm-path') as HTMLInputElement;
const tickingSoundEnabled = document.getElementById('tickingEnable') as HTMLInputElement;
const tickingSoundPath = document.getElementById('tickingSoundPath') as HTMLInputElement;
const cycleMessages = document.getElementById('cycleMessagesInput') as HTMLTextAreaElement;

const s = loadSettings();
console.log(s);
cyclePeriodInput.value = s.cyclePeriod;
cycleAlarmPathInput.value = s.cycleAlarmPath;
tickingSoundEnabled.checked = s.tickingEnabled;
tickingSoundPath.value = s.tickingSoundPath;
// TODO: Fix that solves the problem where if theres more than one message, they get joined because of no \n between array elements
cycleMessages.textContent = s.cycleMessages

saveBtn.addEventListener('click', ()=>{
    const cyclePeriodI = +cyclePeriodInput.value;
    const cycleAlarmPathI = cycleAlarmPathInput.value;
    const toggleTicking = tickingSoundEnabled.checked;
    const settings:Settings = {
        cyclePeriod:cyclePeriodI,
        cycleAlarmPath:cycleAlarmPathI,
        tickingEnabled:toggleTicking,
        tickingSoundPath:tickingSoundPath.value,
        cycleMessages: cycleMessages.value.split("\n").map(line => line.trim()).filter(line => line !=="")
    }
    saveSettings(settings);
})



