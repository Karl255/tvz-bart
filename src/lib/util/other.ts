export function normalizeDepartment(department: string): string {
	if (department === "INF") {
		return department;
	}

	if (department.startsWith("I")) {
		return department.substring(1);
	}

	return department;
}
