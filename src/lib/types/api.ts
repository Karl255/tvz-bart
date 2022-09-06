// TODO: replace all Date types with a third-party date type

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
	id: number;
	apiColor: string | null;

	from: Date;
	to: Date;

	courseName: string;
	className: string;
	professor: string;
	classType: "Predavanja" | "Auditorne vježbe" | "Laboratorijske vježbe";
	classroom: string;
	amountOfStudents: number | null;
};

export type Holiday = {
	date: Date;
	title: string;
};

export type Schedule = {
	holidays: Holiday[];
	workdays: Map<Date, Map<number, ClassPeriod>>;
};
