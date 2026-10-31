// Defaults used when no settings have been saved yet.
// I made the right choice by making a class. It can be serialized directly to save to localstorage.
export class Settings {
  public cycleEnabled: boolean = false;
  public cyclePeriod: number = 15;
  public intercyclePeriod: number = 5;
  public intercycleMessages: string[] = ["Pray", "Stretch", "Toggle Standing/Sitting work"];
  public alarmSound: string = "";
}

const storageKey = "settings";
// Restore saved settings, falling back to defaults for missing or invalid values.
export function loadSettings(): Settings {
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
