import type { ApiDepartment } from "$lib/types/departments";

const baseURL = "/.netlify/functions/departments";

export default async function fetchDepartments(): Promise<ApiDepartment[]> {
	let res = await fetch(new URL(baseURL, document.URL));
	return await res.json();
}
