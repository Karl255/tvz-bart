import type { Semester } from "$lib/models/api";
import { buildUrl } from "$lib/util/url-util";
import { localEndpoints } from "./endpoints";

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
