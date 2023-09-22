import { defaultSettings, type Settings } from "$lib/models/settings";

const localStorageSettingsKey = "SETTINGS";

export function loadSettings(): Settings {
	const serializedSettings = localStorage.getItem(localStorageSettingsKey);

	if (serializedSettings) {
		try {
			return JSON.parse(serializedSettings) as Settings;
		} catch {
			resetSettings();
			return defaultSettings;
		}
	} else {
		resetSettings();
		return defaultSettings;
	}
}

export function saveSettings(settings: Settings) {
	localStorage.setItem(localStorageSettingsKey, JSON.stringify(settings));
}

function resetSettings() {
	saveSettings(defaultSettings);
}
