import { supportedDepartments, type ApiDepartment, type Department } from "./types/departments";

export default function parseNewDepartments(apiDepartments: ApiDepartment[]): Department[] {
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
