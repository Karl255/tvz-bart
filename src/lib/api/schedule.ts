import {
	ClassType,
	type ClassPeriod,
	type Holiday,
	type Schedule,
	type Semester,
	type SemesterScheduleSource,
	type SourcedSchedule,
} from "$lib/models/api";
import { buildUrl } from "$lib/util/url-util";
import { localEndpoints } from "./endpoints";

import type { StringPlainDate, StringPlainDateTime } from "$lib/models/temporal";
import { partition } from "$lib/util/array-util";
import { getAcademicYear } from "$lib/util/datetime-helpers";
import { Temporal } from "@js-temporal/polyfill";

type UnparsedClassPeriod = {
	id: number;
	title: string;
	start: StringPlainDateTime;
	end: StringPlainDateTime;
	allDay: false;
	color: string | null;
	editable: false;
};

type UnparsedHoliday = {
	id: null;
	title: "nedjelja" | string;
	start: StringPlainDate;
	end: null;
	allDay: true;
	color: "Red";
	editable: false;
};

type UnparsedSchedule = (UnparsedClassPeriod | UnparsedHoliday)[];

const titleParsingRegex = new RegExp(
	[
		"^",
		"\\<strong\\>([^<]+)\\<\\/strong\\> \\- ([^<]+)\\<br\\/\\>",
		"(.+)\\<br\\/\\>",
		"Učionica\\: ([^<]+)\\<br\\/\\>",
		"Smjer\\: ([^<]+)\\<br\\/\\>",
		"(Napomena: [^<]*\\<br\\/\\>)?",
		"(Grupa: [^<]*\\<br\\/\\>)?",
		"Broj studenata na kolegiju\\: (\\d+|Nepoznato)",
		"$",
	].join(""),
);

export async function getSemesterWeekSchedule(
	semester: Semester,
	from: Temporal.PlainDate,
): Promise<SourcedSchedule<SemesterScheduleSource>> {
	const url = buildUrl(localEndpoints.schedule, document.URL, {
		department: semester.subdepartment,
		semester: semester.semester,
		year: getAcademicYear(from),
		start: from.toString({ calendarName: "never" }),
		end: from.add({ days: 6 }).toString({ calendarName: "never" }),
	});

	const response = await fetch(url);
	const unparsedSchedule: UnparsedSchedule = await response.json();

	return {
		...parseSchedule(unparsedSchedule),
		for: {
			semester,
			weekStart: from,
		},
	};
}

function parseSchedule(unparsedSchedule: UnparsedSchedule): Schedule {
	const [unparsedClassPeriods, unparsedHolidays] = partition<UnparsedClassPeriod, UnparsedHoliday>(
		unparsedSchedule,
		item => item.id === null,
	);

	const holidayPairs = unparsedHolidays
		.map(parseHoliday)
		.map(h => [h.date.toString({ calendarName: "never" }), h] as [StringPlainDate, Holiday]);

	const workdayPairs = unparsedClassPeriods.map(parseClassPeriodPair).sort((a, b) => {
		return Temporal.PlainTime.compare(a[1].start, b[1].start) || Temporal.PlainTime.compare(b[1].end, a[1].end);
	});

	return {
		periods: new Map<number, ClassPeriod>(workdayPairs),
		holidays: new Map<StringPlainDate, Holiday>(holidayPairs),
	};
}

function parseClassPeriodPair(unparsedClassPeriod: UnparsedClassPeriod): [number, ClassPeriod] {
	const titleParts = titleParsingRegex.exec(unparsedClassPeriod.title)!;
	const note = titleParts[6] ? /^Napomena: (.*)<br\/>$/.exec(titleParts[6])![1] : null;
	const group = titleParts[7] ? /^Grupa: (.*)<br\/>$/.exec(titleParts[7])![1] : null;

	const classPeriod: ClassPeriod = {
		id: Number(unparsedClassPeriod.id),

		date: Temporal.PlainDate.from(unparsedClassPeriod.start),
		start: Temporal.PlainTime.from(unparsedClassPeriod.start),
		end: Temporal.PlainTime.from(unparsedClassPeriod.end),

		courseName: titleParts[5],
		className: titleParts[1],
		professor: titleParts[3],
		classType: parseClassType(titleParts[2]),
		classroom: titleParts[4],
		amountOfStudents: titleParts[8] === "Nepoznato" ? null : Number(titleParts[8]),
		group,
		note,
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
