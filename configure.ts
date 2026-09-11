import { Settings } from "./types.js";
import { saveSettings, loadSettings } from "./settings.js";

const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const cyclePeriodInput = document.getElementById('cycle-interval') as HTMLInputElement;
const cycleAlarmPathInput = document.getElementById('cycle-alarm-path') as HTMLInputElement;
const tickingSoundEnabled = document.getElementById('tickingEnable') as HTMLInputElement;

const s = loadSettings();
console.log(s);
cyclePeriodInput.value = s.cyclePeriod;
cycleAlarmPathInput.value = s.cycleAlarmPath;
tickingSoundEnabled.checked = s.tickingEnabled;

saveBtn.addEventListener('click', ()=>{
    const cyclePeriodI = +cyclePeriodInput.value;
    const cycleAlarmPathI = cycleAlarmPathInput.value;
    const toggleTicking = tickingSoundEnabled.checked;
    const settings:Settings = {
        cyclePeriod:cyclePeriodI,
        cycleAlarmPath:cycleAlarmPathI,
        tickingEnabled:toggleTicking
    }
    saveSettings(settings);
})



