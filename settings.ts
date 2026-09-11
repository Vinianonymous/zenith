import {Settings} from "./types.js"

export function loadSettings(){
    const DEFAULTS: Settings = {
        cycleAlarmPath:"alarm.mp3",
        cyclePeriod:15,
        tickingEnabled: false,
        tickingSoundPath:"ticking.mp3"
    }
    try {
        const raw = localStorage.getItem('settings');
        if (raw==null) return DEFAULTS;
        const parsed = JSON.parse(raw);
        return parsed;

    } catch (err) {
        console.error("Something went wrong, go cry lol");
        return DEFAULTS;
    }
}

export function saveSettings(settings:Settings) {
    try {
        const raw = JSON.stringify(settings);
        localStorage.setItem('settings', raw);
    } catch (err) {
        console.error("Error between Screen and Seat lol")
    }
}