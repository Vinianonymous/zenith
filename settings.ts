// Defaults used when no settings have been saved yet.
// I made the right choice by making a class. It can be serialized directly to save to localstorage.
export class Settings {
  public cycleEnabled: boolean = false;
  public cyclePeriod: number = 15;
  public intercyclePeriod: number = 5;
  public alarmSound: string = "";
}

const storageKey = "settings";
const form = document.getElementById("settings") as HTMLFormElement;
const cycleEnabledInput = document.getElementById("cycle-enabled") as HTMLInputElement;
const cyclePeriodInput = document.getElementById("cycle-period") as HTMLInputElement;
const intercyclePeriodInput = document.getElementById("intercycle-period") as HTMLInputElement;
const alarmSoundInput = document.getElementById("alarm-sound") as HTMLInputElement;

// Restore saved settings, falling back to defaults for missing or invalid values.
function loadSettings(): Settings {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return new Settings();

  try {
    const parsed = JSON.parse(saved) as Partial<Settings>;
    const settings = new Settings();
    if (typeof parsed.cycleEnabled === "boolean") settings.cycleEnabled = parsed.cycleEnabled;
    if (
      typeof parsed.cyclePeriod === "number" &&
      Number.isInteger(parsed.cyclePeriod) &&
      parsed.cyclePeriod > 0
    ) {
      settings.cyclePeriod = parsed.cyclePeriod;
    }
    if (
      typeof parsed.intercyclePeriod === "number" &&
      Number.isInteger(parsed.intercyclePeriod) &&
      parsed.intercyclePeriod > 0
    ) {
      settings.intercyclePeriod = parsed.intercyclePeriod;
    }
    if (typeof parsed.alarmSound === "string") settings.alarmSound = parsed.alarmSound;
    return settings;
  } catch {
    return new Settings();
  }
}

// Populate the form from the current settings.
function showSettings(settings: Settings): void {
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
