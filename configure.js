import { saveSettings, loadSettings } from "./settings.js";
const saveBtn = document.getElementById('save-btn');
const cyclePeriodInput = document.getElementById('cycle-interval');
const cycleAlarmPathInput = document.getElementById('cycle-alarm-path');
const tickingSoundEnabled = document.getElementById('tickingEnable');
const tickingSoundPath = document.getElementById('tickingSoundPath');
const cycleMessages = document.getElementById('cycleMessagesInput');
const s = loadSettings();
console.log(s);
cyclePeriodInput.value = s.cyclePeriod;
cycleAlarmPathInput.value = s.cycleAlarmPath;
tickingSoundEnabled.checked = s.tickingEnabled;
tickingSoundPath.value = s.tickingSoundPath;
cycleMessages.textContent = s.cycleMessages;
saveBtn.addEventListener('click', () => {
    const cyclePeriodI = +cyclePeriodInput.value;
    const cycleAlarmPathI = cycleAlarmPathInput.value;
    const toggleTicking = tickingSoundEnabled.checked;
    const settings = {
        cyclePeriod: cyclePeriodI,
        cycleAlarmPath: cycleAlarmPathI,
        tickingEnabled: toggleTicking,
        tickingSoundPath: tickingSoundPath.value,
        cycleMessages: cycleMessages.value.split("\n").map(line => line.trim()).filter(line => line !== "")
    };
    saveSettings(settings);
});
