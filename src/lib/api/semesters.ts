import { localEndpoints } from "$lib/const/api";
import { buildUrl } from "$lib/util/url";
import type { Semester } from "./model";

type UnparsedSemester = {
	SemesterNumber: string;
	Department: string;
};

export async function fetchSemesters(department: string, year: number): Promise<UnparsedSemester[]> {
	const url = buildUrl(localEndpoints.semesters, {
		department,
		year,
	});

	return await (await fetch(url)).json();
}

export function parseSemesters(apiSemesters: UnparsedSemester[]): Semester[] {
	return apiSemesters.map(
		s =>
			({
				semester: Number(s.SemesterNumber),
				subdepartment: s.Department,
			}) as Semester,
	);
}
