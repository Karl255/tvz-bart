import { ClassType, type ClassPeriod, type Holiday, type Schedule } from "$lib/models/api";

import type { StringPlainDate, StringPlainDateTime } from "$lib/models/temporal";
import { partition } from "$lib/util/array-util";
import { Temporal } from "@js-temporal/polyfill";

export type UnparsedClassPeriod = {
	id: number;
	title: string;
	start: StringPlainDateTime;
	end: StringPlainDateTime;
	allDay: false;
	color: string | null;
	editable: false;
};

export type UnparsedHoliday = {
	id: null;
	title: "nedjelja" | string;
	start: StringPlainDate;
	end: null;
	allDay: true;
	color: "Red";
	editable: false;
};

export type UnparsedSchedule = (UnparsedClassPeriod | UnparsedHoliday)[];

const titleParsingRegex = new RegExp(
	[
		/^/,
		/<strong>([^<]+)<\/strong> - ([^<]+)/,
		/(?:<br\/>(.+))?/,
		/<br\/>Učionica: ([^<]+)/,
		/<br\/>Smjer(?:ovi)?: ([^<]+)/,
		/(?:<br\/>Napomena: (.*))?/,
		/(?:<br\/>Grupa: ([^<]*))?/,
		/(?:<br\/>Broj studenata na kolegiju: (\d+|Nepoznato))?/,
		/$/,
	]
		.map(r => r.source)
		.join(""),
);

export function parseSchedule(unparsedSchedule: UnparsedSchedule, professorFallback?: string): Schedule {
	const [unparsedClassPeriods, unparsedHolidays] = partition<UnparsedClassPeriod, UnparsedHoliday>(
		unparsedSchedule,
		item => item.id === null,
	);

	const holidayPairs = unparsedHolidays
		.map(parseHoliday)
		.map(h => [h.date.toString({ calendarName: "never" }), h] as [StringPlainDate, Holiday]);

	const workdayPairs = unparsedClassPeriods
		.map(c => parseClassPeriodPair(c, professorFallback))
		.sort((a, b) => {
			return Temporal.PlainTime.compare(a[1].start, b[1].start) || Temporal.PlainTime.compare(b[1].end, a[1].end);
		});

	return {
		periods: new Map<number, ClassPeriod>(workdayPairs),
		holidays: new Map<StringPlainDate, Holiday>(holidayPairs),
	};
}

function parseClassPeriodPair(
	unparsedClassPeriod: UnparsedClassPeriod,
	professorFallback?: string,
): [number, ClassPeriod] {
	const titleParts = titleParsingRegex.exec(unparsedClassPeriod.title)!;

	const classPeriod: ClassPeriod = {
		id: Number(unparsedClassPeriod.id),

		date: Temporal.PlainDate.from(unparsedClassPeriod.start),
		start: Temporal.PlainTime.from(unparsedClassPeriod.start),
		end: Temporal.PlainTime.from(unparsedClassPeriod.end),

		courseNames: titleParts ? titleParts[5] : unparsedClassPeriod.title,
		className: titleParts ? titleParts[1] : "",
		professor: titleParts ? titleParts[3] ?? professorFallback : null,
		classType: titleParts ? parseClassType(titleParts[2]) : ClassType.Other,
		classroom: titleParts ? titleParts[4] : "",
		amountOfStudents: titleParts ? titleParts[8] ?? null : null,
		group: titleParts ? titleParts[7] ?? null : null,
		note: titleParts ? titleParts[6] ?? null : null,
	};

	return [classPeriod.id, classPeriod];
}

function parseClassType(s: string): ClassType {
	const entry = Object.entries(ClassType).filter(entry => entry[1] === s)[0];

	return (entry ?? [null, ClassType.Other])[1];
}

function parseHoliday(unparsedHoliday: UnparsedHoliday): Holiday {
	return {
		date: Temporal.PlainDate.from(unparsedHoliday.start),
		title: unparsedHoliday.title,
	};
}
