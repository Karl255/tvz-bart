import type { Temporal } from "@js-temporal/polyfill";

export type StringPlainDate = string;
export type StringPlainDateTime = string;

export type ApiClassPeriod = {
	id: number;
	title: string;
	start: StringPlainDateTime;
	end: StringPlainDateTime;
	allDay: false;
	color: string | null;
	editable: false;
};

export type ApiHoliday = {
	id: null;
	title: "nedjelja" | string;
	start: StringPlainDate;
	end: null;
	allDay: true;
	color: "Red";
	editable: false;
};

export type ApiSchedule = (ApiClassPeriod | ApiHoliday)[];

export type ClassPeriod = {
	id: number;
	apiColor: string | null;

	date: Temporal.PlainDate;
	start: Temporal.PlainTime;
	end: Temporal.PlainTime;

	courseName: string;
	className: string;
	professor: string;
	classType: "Predavanja" | "Auditorne vježbe" | "Laboratorijske vježbe";
	classroom: string;
	amountOfStudents: number | null;
};

export type Holiday = {
	date: Temporal.PlainDate;
	title: string;
};

export type Schedule = {
	workdays: Map<number, ClassPeriod>;
	holidays: Holiday[];
};
