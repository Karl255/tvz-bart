import type { Temporal } from "@js-temporal/polyfill";
import type { StringPlainDate } from "./temporal";
import type { ScheduleQuery } from "./scheduleQuery";

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

export interface SourcedSchedule<TSource extends BaseScheduleSource> extends Schedule {
	for: TSource;
}

export interface BaseScheduleSource {
	weekStart: Temporal.PlainDate;
}

export type ScheduleSourceAdditions<TSource extends BaseScheduleSource> = Omit<TSource, keyof BaseScheduleSource>;

export interface SemesterScheduleSource extends BaseScheduleSource {
	semester: Semester;
}

export interface CustomScheduleSource extends BaseScheduleSource {
	scheduleQueries: ScheduleQuery[];
}
