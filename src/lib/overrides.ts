import { Temporal } from "@js-temporal/polyfill";
import type { ClassPeriod, Schedule } from "$lib/api/schedule";
import type { Semester } from "$lib/api/semesters";

export type ClassPeriodOverride = {
	start: string;
	end: string;

	courseName: string | "~";
	className: string | "~";
	professor: string | "~";
	classType: "Predavanja" | "Auditorne vježbe" | "Laboratorijske vježbe" | "~";
	classroom: string | "~";
	group: string | "~";
	note: string | "~";
}

export type Override = {
	forEvent: {
		subdepartment: string;
		semester: number;
		academicYear: number;

		className: string;
		classroom: string;
		start: string | Temporal.PlainTime;
		end: string | Temporal.PlainTime;
		dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
	};
	replacements: ClassPeriodOverride[];
};

function doesOverrideMatch(c: ClassPeriod, e: Override["forEvent"]): boolean {
	return c.className === e.className
		&& c.classroom === e.classroom
		&& c.start === e.start
		&& c.end === e.end
		&& c.date.dayOfWeek === e.dayOfWeek;
}

function findOverride(classPeriod: ClassPeriod, overrides: Override[]): Override | null {
	for (let i = 0; i < overrides.length; i++) {
		if (doesOverrideMatch(classPeriod, overrides[i].forEvent)) {
			return overrides[i];
		}
	}

	return null;
}

function applyOverride(original: ClassPeriod, overrides: ClassPeriodOverride[]): ClassPeriod[] {
	let idIncrement = 0;

	return overrides.map(o => {
		idIncrement += 0.01;

		return {
			id: original.id + idIncrement,
			apiColor: original.apiColor,

			date: original.date,
			start: Temporal.PlainTime.from(o.start),
			end: Temporal.PlainTime.from(o.end),

			courseName: o.courseName === "~" ? original.courseName : o.courseName,
			className: o.courseName === "~" ? original.className : o.className,
			professor: o.professor === "~" ? original.professor : o.professor,
			classType: o.classType === "~" ? original.classType : o.classType,
			classroom: o.classroom === "~" ? original.classroom : o.classroom,
			group: o.group === "~" ? original.group : o.group,
			note: o.note === "~" ? original.note : o.note,
			amountOfStudents: original.amountOfStudents
		} as ClassPeriod;
	});
}

export function applyOverrides(schedule: Schedule, academicYear: number, semester: Semester, overrides: Override[]): Schedule {
	overrides = overrides
		.filter(o => {
			const e = o.forEvent;
			return e.subdepartment === semester.subdepartment
				&& e.semester === semester.semester
				&& e.academicYear === academicYear;
		});

	const classes = [...schedule.workdays.values()]
		.flatMap(c => {
			const override = findOverride(c, overrides);

			return override === null
				? [c]
				: applyOverride(c, override.replacements);
		});

	return schedule;
}
