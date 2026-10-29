// Defaults used when no settings have been saved yet.
export class Settings {
    cycleEnabled = false;
    cyclePeriod = 15;
    intercyclePeriod = 5;
    alarmSound = "";
}
const storageKey = "settings";
const form = document.getElementById("settings");
const cycleEnabledInput = document.getElementById("cycle-enabled");
const cyclePeriodInput = document.getElementById("cycle-period");
const intercyclePeriodInput = document.getElementById("intercycle-period");
const alarmSoundInput = document.getElementById("alarm-sound");
// Restore saved settings, falling back to defaults for missing or invalid values.
function loadSettings() {
    const saved = localStorage.getItem(storageKey);
    if (!saved)
        return new Settings();
    try {
        const parsed = JSON.parse(saved);
        const settings = new Settings();
        if (typeof parsed.cycleEnabled === "boolean")
            settings.cycleEnabled = parsed.cycleEnabled;
        if (typeof parsed.cyclePeriod === "number" &&
            Number.isInteger(parsed.cyclePeriod) &&
            parsed.cyclePeriod > 0) {
            settings.cyclePeriod = parsed.cyclePeriod;
        }
        if (typeof parsed.intercyclePeriod === "number" &&
            Number.isInteger(parsed.intercyclePeriod) &&
            parsed.intercyclePeriod > 0) {
            settings.intercyclePeriod = parsed.intercyclePeriod;
        }
        if (typeof parsed.alarmSound === "string")
            settings.alarmSound = parsed.alarmSound;
        return settings;
    }
    catch {
        return new Settings();
    }
}
// Populate the form from the current settings.
function showSettings(settings) {
    cycleEnabledInput.checked = settings.cycleEnabled;
    cyclePeriodInput.value = String(settings.cyclePeriod);
    intercyclePeriodInput.value = String(settings.intercyclePeriod);
    alarmSoundInput.value = settings.alarmSound;
}
// Show saved values as soon as the settings page loads.
showSettings(loadSettings());
// Clear custom errors after the user edits a period so the form can be resubmitted.
for (const input of [cyclePeriodInput, intercyclePeriodInput]) {
    input.addEventListener("input", () => input.setCustomValidity(""));
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Periods must be positive whole minutes; reject blank or fractional values.
    const cyclePeriod = cyclePeriodInput.valueAsNumber;
    const intercyclePeriod = intercyclePeriodInput.valueAsNumber;
    for (const input of [cyclePeriodInput, intercyclePeriodInput]) {
        input.setCustomValidity("");
        if (!Number.isInteger(input.valueAsNumber) || input.valueAsNumber < 1) {
            input.setCustomValidity("Enter a positive whole number of minutes.");
            input.reportValidity();
            return;
        }
    }
    const settings = new Settings();
    settings.cycleEnabled = cycleEnabledInput.checked;
    settings.cyclePeriod = cyclePeriod;
    settings.intercyclePeriod = intercyclePeriod;
    settings.alarmSound = alarmSoundInput.value;
    // Persist all four fields and reflect the stored values in the form.
    localStorage.setItem(storageKey, JSON.stringify(settings));
    showSettings(loadSettings());
});
