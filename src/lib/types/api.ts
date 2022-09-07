// TODO: replace all Date types with a third-party date type

import type { Temporal } from "@js-temporal/polyfill";

export type StringDate = string;

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
	holidays: Holiday[];
	workdays: Map<StringDate, Map<number, ClassPeriod>>;
};
