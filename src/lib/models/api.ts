import type { Temporal } from "@js-temporal/polyfill";
import type { StringPlainDate } from "./temporal";

export interface Department {
	code: string;
	name: string;
}

export interface Semester {
	semester: number;
	subdepartment: string;
}

export enum ClassType {
	Lecture = "Predavanja",
	AuditoryExercises = "Auditorne vježbe",
	Lab = "Laboratorijske vježbe",
	Other = "Ostalo",
}

export interface ClassPeriod {
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
}

export interface Holiday {
	date: Temporal.PlainDate;
	title: string;
}

export interface Schedule {
	periods: Map<number, ClassPeriod>;
	holidays: Map<StringPlainDate, Holiday>;
}

export interface SourcedSchedule<TSource extends ScheduleSource> extends Schedule {
	for: TSource;
}

export interface ScheduleSource {
	weekStart: Temporal.PlainDate;
}

export interface SemesterScheduleSource extends ScheduleSource {
	semester: Semester;
	weekStart: Temporal.PlainDate;
}
