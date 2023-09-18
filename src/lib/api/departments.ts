const baseURL = "/.netlify/functions/util/departments";

export type ApiDepartment = {
	Code: string;
	Name: string;
};

export type Department = {
	code: string;
	name: string;
};

// to detect new departments
export const supportedDepartments = ["ELO", "IELO", "GRA", "IGRA", "INF", "IINF", "RAC", "IRAC", "STRO", "ISTRO", "MEH", "IMEH", "SPECELO", "SPECELO1", "ISPECELO1", "SPECGRA", "SPECGRA1", "ISPECGRA1", "SPECINF", "SPECINF1", "ISPECINF1", "SPECRAC1", "ISPECRAC1", "SPECSTRO", "ISPECSTRO", "ISPECDIG", "ISPECSIG", "ISPECSIGEN"];

export async function fetchDepartments(): Promise<ApiDepartment[]> {
	let res = await fetch(new URL(baseURL, document.URL));
	return await res.json();
}

export function parseNewDepartments(apiDepartments: ApiDepartment[]): Department[] {
	// remove known departments
	supportedDepartments.forEach(supported => {
		let i = apiDepartments.findIndex(fromApi => {
			return fromApi.Code === supported;
		})

		if (i !== -1) {
			apiDepartments.splice(i, 1);
		}
	});

	return apiDepartments.map(d => ({
		code: d.Code,
		name: d.Name
	} as Department));
}
