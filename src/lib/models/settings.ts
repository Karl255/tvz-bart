import type { Semester } from "$lib/models/api";

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
