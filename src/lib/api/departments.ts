import { localEndpoints } from "$lib/const/api";
import type { Department } from "./model";

type UnparsedDepartment = {
	Code: string;
	Name: string;
};

export const obsoleteDepartments = ["SPECELO", "SPECGRA", "SPECINF"];

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
