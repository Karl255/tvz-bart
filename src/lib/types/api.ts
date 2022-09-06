export type ApiClassPeriod = {
	id: number;
	title: string;
	start: string;
	end: string;
	allDay: false;
	color: string | null;
	editable: false;
};

export type ApiHoliday = {
	id: null;
	title: "nedjelja" | string;
	start: string;
	end: null;
	allDay: true;
	color: "Red";
	editable: false;
};

export type ApiSchedule = (ApiClassPeriod | ApiHoliday)[];

export type ClassPeriod = {
	apiId: number;
	apiColor: string | null;

	from: Date;
	to: Date;

	studyName: string;
	className: string;
	professor: string;
	periodType: "Predavanja" | "Auditorne vježbe" | "Laboratorijske vježbe";
	classroom: string;
	amountOfStudents: number | null;
};

export type Holiday = {
	date: Date;
	title: string;
};

export type Schedule = {
	holidays: Holiday[];

	workdays: { [key: string]: ClassPeriod };
};
