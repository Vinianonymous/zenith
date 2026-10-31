import { loadSettings, Settings } from "./settings.js";
const form = document.getElementById("settings");
const cycleEnabledInput = document.getElementById("cycle-enabled");
const cyclePeriodInput = document.getElementById("cycle-period");
const intercyclePeriodInput = document.getElementById("intercycle-period");
const alarmSoundInput = document.getElementById("alarm-sound");
//const intercycleMessagesInput = document.getElementById(
//  "intercycle-messages",
//) as HTMLTextAreaElement;
// Populate the form from the current settings.
function showSettings(settings) {
    cycleEnabledInput.checked = settings.cycleEnabled;
    cyclePeriodInput.value = String(settings.cyclePeriod);
    intercyclePeriodInput.value = String(settings.intercyclePeriod);
    alarmSoundInput.value = settings.alarmSound;
    // TODO: I remember something had to be fixed in this thing because of the
    // way text area elements treated newlines
    //intercycleMessagesInput.textContent = settings.intercycleMessages.forEach((message) => {
    //  return message + "\n";
    //});
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
    localStorage.setItem("settings", JSON.stringify(settings));
    showSettings(loadSettings());
});
