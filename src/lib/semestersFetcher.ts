import type { ApiSemester } from "$lib/types/semesters";
import { buildURL } from "./buildUrl";

const baseURL = "/.netlify/functions/semesters";

export default async function fetchSemesters(department: string, year: number): Promise<ApiSemester[]> {
	const url = buildURL(baseURL, {
		department,
		year,
	});

	return await (await fetch(url)).json();
}
