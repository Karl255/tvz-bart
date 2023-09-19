import { buildUrl } from "$lib/util/url";
import {
	ClassType,
	type ClassPeriod,
	type Holiday,
	type Schedule,
	type StringPlainDate,
	type StringPlainDateTime,
} from "./model";

import { localEndpoints } from "$lib/const/api";
import { getAcademicYear } from "$lib/util/helpers";
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

export async function fetchScheduleWeek(
	department: string,
	semester: number,
	from: Temporal.PlainDate,
): Promise<UnparsedSchedule> {
	const to = from.add({ days: 6 });
	const year = getAcademicYear(from);

	const url = buildUrl(localEndpoints.schedule, document.URL, {
		department,
		semester,
		year,
		start: from.toString({ calendarName: "never" }),
		end: to.toString({ calendarName: "never" }),
	});

	return await (await fetch(url)).json();
}

function parseClassType(s: string): ClassType {
	const entry = Object.entries(ClassType).filter(entry => entry[1] === s)[0];

	return (entry ?? [null, ClassType.Other])[1];
}

function parseHoliday(apiHoliday: UnparsedHoliday): Holiday {
	return {
		date: Temporal.PlainDate.from(apiHoliday.start),
		title: apiHoliday.title,
	};
}

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

function parseClassPeriod(apiClassPeriod: UnparsedClassPeriod): [number, ClassPeriod] {
	const titleParts = titleParsingRegex.exec(apiClassPeriod.title)!;
	const note = titleParts[6] ? /^Napomena: (.*)<br\/>$/.exec(titleParts[6])![1] : null;
	const group = titleParts[7] ? /^Grupa: (.*)<br\/>$/.exec(titleParts[7])![1] : null;

	const classPeriod: ClassPeriod = {
		id: Number(apiClassPeriod.id),
		apiColor: apiClassPeriod.color,

		date: Temporal.PlainDate.from(apiClassPeriod.start),
		start: Temporal.PlainTime.from(apiClassPeriod.start),
		end: Temporal.PlainTime.from(apiClassPeriod.end),

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

export function parseSchedule(apiSchedule: UnparsedSchedule): Schedule {
	const apiClassPeriods = apiSchedule.filter(x => x.id !== null) as UnparsedClassPeriod[];
	const apiHolidaysKV = (apiSchedule.filter(x => x.id === null) as UnparsedHoliday[])
		.map(parseHoliday)
		.map(h => [h.date.toString({ calendarName: "never" }), h] as [StringPlainDate, Holiday]);

	const workdaysKV = apiClassPeriods.map(parseClassPeriod).sort((a, b) => {
		return Temporal.PlainTime.compare(a[1].start, b[1].start) || Temporal.PlainTime.compare(b[1].end, a[1].end);
	});

	return {
		holidays: new Map<StringPlainDate, Holiday>(apiHolidaysKV),
		workdays: new Map<number, ClassPeriod>(workdaysKV),
	};
}
