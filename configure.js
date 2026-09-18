import { saveSettings, loadSettings } from "./settings.js";
const saveBtn = document.getElementById('save-btn');
const cyclePeriodInput = document.getElementById('cycle-interval');
const cycleAlarmPathInput = document.getElementById('cycle-alarm-path');
const tickingSoundEnabled = document.getElementById('tickingEnable');
const tickingSoundPath = document.getElementById('tickingSoundPath');
const s = loadSettings();
console.log(s);
cyclePeriodInput.value = s.cyclePeriod;
cycleAlarmPathInput.value = s.cycleAlarmPath;
tickingSoundEnabled.checked = s.tickingEnabled;
tickingSoundPath.value = s.tickingSoundPath;
saveBtn.addEventListener('click', () => {
    const cyclePeriodI = +cyclePeriodInput.value;
    const cycleAlarmPathI = cycleAlarmPathInput.value;
    const toggleTicking = tickingSoundEnabled.checked;
    const settings = {
        cyclePeriod: cyclePeriodI,
        cycleAlarmPath: cycleAlarmPathI,
        tickingEnabled: toggleTicking,
        tickingSoundPath: tickingSoundPath.value
    };
    saveSettings(settings);
});
