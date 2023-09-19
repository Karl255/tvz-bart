import type { Temporal } from "@js-temporal/polyfill";

export type StringPlainDate = string;
export type StringPlainDateTime = string;

export type Department = {
	code: string;
	name: string;
};

export type Semester = {
	semester: number;
	subdepartment: string;
};

export enum ClassType {
	Lecture = "Predavanja",
	AuditoryExercises = "Auditorne vježbe",
	Lab = "Laboratorijske vježbe",
	Other = "Ostalo",
}

export type ClassPeriod = {
	id: number;

	date: Temporal.PlainDate;
	start: Temporal.PlainTime;
	end: Temporal.PlainTime;

	courseName: string;
	className: string;
	professor: string;
	classType: ClassType;
	classroom: string;
	amountOfStudents: number | null;
	group: string | null;
	note: string | null;
};

export type ClassPeriodSegregated = ClassPeriod & {
	column: number;
	width: number;
};

export type Holiday = {
	date: Temporal.PlainDate;
	title: string;
};

export type Schedule = {
	workdays: Map<number, ClassPeriod>;
	holidays: Map<StringPlainDate, Holiday>;
};
