import { supportedDepartments } from "$lib/api/departments";
import type { Semester } from "$lib/api/semesters";

export type Settings = {
	autoSave: boolean;
	departmentCode: string;
	semester: Semester;
	useBuiltinOverrides: boolean;
};

export const defaultSettings: Settings = {
	autoSave: true,
	departmentCode: supportedDepartments[6],
	semester: {
		semester: 3,
		subdepartment: "PRIN",
	},
	useBuiltinOverrides: true,
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
