import { localEndpoints } from "$lib/const/api";
import type { Department } from "./model";

type UnparsedDepartment = {
	Code: string;
	Name: string;
};

// to detect new departments
export const supportedDepartments = [
	"ELO",
	"IELO",
	"GRA",
	"IGRA",
	"INF",
	"IINF",
	"RAC",
	"IRAC",
	"STRO",
	"ISTRO",
	"MEH",
	"IMEH",
	"SPECELO",
	"SPECELO1",
	"ISPECELO1",
	"SPECGRA",
	"SPECGRA1",
	"ISPECGRA1",
	"SPECINF",
	"SPECINF1",
	"ISPECINF1",
	"SPECRAC1",
	"ISPECRAC1",
	"SPECSTRO",
	"ISPECSTRO",
	"ISPECDIG",
	"ISPECSIG",
	"ISPECSIGEN",
];

function parseDepartment(unparsedDepartment: UnparsedDepartment): Department {
	return {
		code: unparsedDepartment.Code,
		name: unparsedDepartment.Name,
	};
}

export async function getNewDepartments(): Promise<Department[]> {
	const response = await fetch(new URL(localEndpoints.departments, document.URL));
	const unparsedDepartments: UnparsedDepartment[] = await response.json();

	return unparsedDepartments.map(parseDepartment).filter(d => !supportedDepartments.includes(d.code));
}
