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
