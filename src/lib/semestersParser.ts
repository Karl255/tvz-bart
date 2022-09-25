import type { ApiSemester, Semester } from "./types/semesters";

export default function parseSemesters(apiSemesters: ApiSemester[]): Semester[] {
	return apiSemesters
		.map(s => ({
			semester: Number(s.SemesterNumber),
			subdepartment: s.Department
		} as Semester));
}
