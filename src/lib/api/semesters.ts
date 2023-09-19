import { localEndpoints } from "$lib/const/api";
import { buildUrl } from "$lib/util/url";
import type { Semester } from "./model";

type UnparsedSemester = {
	SemesterNumber: string;
	Department: string;
};

function parseSemester(unparsedSemester: UnparsedSemester): Semester {
	return {
		semester: Number(unparsedSemester.SemesterNumber),
		subdepartment: unparsedSemester.Department,
	};
}

export async function getSemesters(department: string, year: number): Promise<Semester[]> {
	const url = buildUrl(localEndpoints.semesters, document.URL, {
		department,
		year,
	});

	const response = await fetch(url);
	const unparsedSemesters: UnparsedSemester[] = await response.json();

	return unparsedSemesters.map(parseSemester);
}
