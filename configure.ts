const cycleInput = document.getElementById('cycle-interval') as HTMLInputElement;

function saveSettings(cycleInterval: number): void {
    try {
        const settings = {
            cycleInterval
        };

        localStorage.setItem('settings', JSON.stringify(settings));
    } catch (err) {
        console.error('Failed to save settings:', err);
    }
}

function loadSettings(): number {
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

    } catch (err) {
        console.error('Failed to load settings:', err);
        return 15;
    }
}

let cycleInterval = loadSettings();

const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;

saveBtn?.addEventListener('click', () => {
    cycleInterval = Number(cycleInput.value);
    saveSettings(cycleInterval);
});