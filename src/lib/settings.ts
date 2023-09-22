import type { Semester } from "$lib/api";

export interface Settings {
	autoSave: boolean;
	departmentCode: string;
	semester: Semester;
}

export const defaultSettings: Settings = {
	autoSave: true,
	departmentCode: "RAC",
	semester: {
		semester: 3,
		subdepartment: "PRIN",
	},
};

const localStorageSettingsKey = "SETTINGS";

export function loadSettings(): Settings {
	const serializedSettings = localStorage.getItem(localStorageSettingsKey);

	if (serializedSettings) {
		try {
			return JSON.parse(serializedSettings) as Settings;
		} catch {
			// TODO: notify user
			// TODO: implement upgrading of old settings
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
	console.log("SETTINGS: saved", settings);
}

function resetSettings() {
	saveSettings(defaultSettings);
}
