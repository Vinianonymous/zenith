"use strict";
const cycleInput = document.getElementById('cycle-interval');
function saveSettings(cycleInterval) {
    try {
        const settings = {
            cycleInterval
        };
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    catch (err) {
        console.error('Failed to save settings:', err);
    }
}
function loadSettings() {
    try {
        const serializedState = localStorage.getItem('settings');
        if (serializedState === null) {
            return 15;
        }
        const settings = JSON.parse(serializedState);
        if (typeof settings.cycleInterval !== 'number') {
            return 15;
        }
        cycleInput.value = String(settings.cycleInterval);
        return settings.cycleInterval;
    }
    catch (err) {
        console.error('Failed to load settings:', err);
        return 15;
    }
}
let cycleInterval = loadSettings();
const saveBtn = document.getElementById('save-btn');
saveBtn?.addEventListener('click', () => {
    cycleInterval = Number(cycleInput.value);
    saveSettings(cycleInterval);
});
