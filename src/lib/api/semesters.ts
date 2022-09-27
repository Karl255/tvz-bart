import { buildURL } from "$lib/buildUrl";

const baseURL = "/.netlify/functions/semesters";

export type ApiSemester = {
	SemesterNumber: string;
	Department: string;
};

export type Semester = {
	semester: number;
	subdepartment: string;
};

export async function fetchSemesters(department: string, year: number): Promise<ApiSemester[]> {
	const url = buildURL(baseURL, {
		department,
		year,
	});

	return await (await fetch(url)).json();
}

export function parseSemesters(apiSemesters: ApiSemester[]): Semester[] {
	return apiSemesters
		.map(s => ({
			semester: Number(s.SemesterNumber),
			subdepartment: s.Department
		} as Semester));
}
