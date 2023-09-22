import type { PageLoad } from "./$types";

import { getDepartments } from "$lib/api";
import type { Department } from "$lib/models/api";

export interface LoadedData {
	departments: Department[];
}

export const load: PageLoad<LoadedData> = async () => {
	return {
		departments: await getDepartments(),
	};
};
