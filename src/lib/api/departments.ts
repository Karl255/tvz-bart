import type { Department } from "$lib/models/api";
import { localEndpoints } from "./endpoints";

type UnparsedDepartment = {
	Code: string;
	Name: string;
};

const obsoleteDepartments = ["SPECELO", "SPECGRA", "SPECINF"];

function parseDepartment(unparsedDepartment: UnparsedDepartment): Department {
	return {
		code: unparsedDepartment.Code,
		name: unparsedDepartment.Name,
	};
}

export async function getDepartments(): Promise<Department[]> {
	const response = await fetch(new URL(localEndpoints.departments, document.URL));
	const unparsedDepartments: UnparsedDepartment[] = await response.json();

	return unparsedDepartments
		.map(parseDepartment)
		.filter(department => !obsoleteDepartments.includes(department.code));
}
