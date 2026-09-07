import { Settings } from "./types.js";

// [Vinny work] Added type assertions so TypeScript knows these are the right
// element types. Without `as HTMLInputElement`, cyclePeriodInput has type
// HTMLElement which lacks `.value`. Without `as HTMLButtonElement`, saveBtn
// lacks `.textContent`. If the HTML ids ever change, these will return null
// and the assertions will fail at runtime — that's fine for static pages.
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const cyclePeriodInput = document.getElementById('cycle-interval') as HTMLInputElement;
const cycleAlarmPath = document.getElementById('cycle-alarm-path') as HTMLInputElement;


// [Vinny work] Fixed loadSettings: the old version returned the raw string
// from localStorage (or null) without ever parsing JSON. Now it:
//   - Handles null (first visit / no saved settings) by returning defaults
//   - Parses JSON and validates the shape before returning
//   - Catches corrupted JSON gracefully instead of throwing
//   - Returns a proper Settings object, not a raw string
export function loadSettings(): Settings {
    const defaults: Settings = {
        cyclePeriod: 15,
        cycleAlarmPath: "alarm.mp3"
    };

    try {
        const serialized = localStorage.getItem('settings');

        if (serialized === null) {
            return defaults;
        }

        const parsed = JSON.parse(serialized);

        // [Vinny work] Input validation: cyclePeriod must be a number >= 1.
        // A value of 0 would cause `minutes % 0` to return NaN in main.ts,
        // silently breaking the alarm (it never fires again). Negative
        // values are equally nonsensical.
        if (typeof parsed.cyclePeriod !== 'number' || parsed.cyclePeriod < 1) {
            return defaults;
        }

        return {
            cyclePeriod: parsed.cyclePeriod,
            cycleAlarmPath: typeof parsed.cycleAlarmPath === 'string'
                ? parsed.cycleAlarmPath
                : defaults.cycleAlarmPath
        };
    } catch (err) {
        console.error('Failed to load settings:', err);
        return defaults;
    }
}

// [Vinny work] Fixed saveSettings: the old version called
// localStorage.setItemItem() which doesn't exist (the correct method is
// setItem), and it saved the stale `settings` variable instead of reading
// the current input value. Now it:
//   - Reads the current value from the input element
//   - Clamps it to >= 1 to prevent a 0/negative value from breaking the alarm
//   - JSON.stringify's the object before storing (localStorage only stores strings)
//   - Gives the user visible feedback by changing the button text
function saveSettings(): void {
    const raw = Number(cyclePeriodInput.value);
    // Clamp: NaN (empty input) and values < 1 all fall back to 1
    const cyclePeriod = isNaN(raw) || raw < 1 ? 1 : raw;

    const settings: Settings = {
        cyclePeriod,
        cycleAlarmPath: "alarm.mp3"
    };

    try {
        localStorage.setItem('settings', JSON.stringify(settings));

        // [Vinny work] Save feedback: briefly change button text so the user
        // knows the save actually happened. Reverts after 1.5 seconds.
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
            saveBtn.textContent = 'Save';
        }, 1500);
    } catch (err) {
        console.error('Failed to save settings:', err);
    }
}

// [Vinny work] Load settings and pre-populate the input so the user sees
// their current value instead of the hardcoded HTML default of 15. Without
// this, there's a flash where the input shows 15 before JS overwrites it.
const settings = loadSettings();
cyclePeriodInput.value = settings.cyclePeriod.toString();
cycleAlarmPath.value = settings.cycleAlarmPath;
console.log(settings);
// [Vinny work] Save now reads directly from the input instead of passing
// the stale `settings` variable. The old code would save whatever was
// loaded, not what the user actually typed.
saveBtn.addEventListener('click', () => {
    console.log("Saving Settings!");
    saveSettings();
    console.log(settings);
});
