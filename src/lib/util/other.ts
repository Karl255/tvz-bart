import type { Semester } from "$lib/models/api";

const depsStartingWithI = ["INF", "ID", "IRSIM"];

export function normalizeDepartment(department: string): string {
	if (depsStartingWithI.includes(department)) {
		return department;
	}

	if (department.startsWith("I")) {
		return department.substring(1);
	}

	return department;
}

export function normalizeSemester(semester: Semester): Semester {
	return {
		subdepartment: normalizeDepartment(semester.subdepartment),
		semester: semester.semester,
	};
}
