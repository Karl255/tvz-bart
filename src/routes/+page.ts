import type { PageLoad } from "./$types";

import { getDepartments, type Department } from "$lib/api";

export interface LoadedData {
	departments: Department[];
}

export const load: PageLoad<LoadedData> = async () => {
	return {
		departments: await getDepartments(),
	};
};
