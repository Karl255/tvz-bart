import type { Department, UnparsedDepartment } from "./model";
export * from "./model";

import { buildUrl } from "$lib/util/url";
import type { Semester, UnparsedSemester } from "./model";

import { localEndpoints } from "$lib/const/api";
import { getAcademicYear } from "$lib/util/helpers";
import { Temporal } from "@js-temporal/polyfill";
import {
	ClassType,
	type ClassPeriod,
	type Holiday,
	type Schedule,
	type StringPlainDate,
	type UnparsedClassPeriod,
	type UnparsedHoliday,
	type UnparsedSchedule,
} from "./model";

// to detect new departments
export const supportedDepartments = [
	"ELO",
	"IELO",
	"GRA",
	"IGRA",
	"INF",
	"IINF",
	"RAC",
	"IRAC",
	"STRO",
	"ISTRO",
	"MEH",
	"IMEH",
	"SPECELO",
	"SPECELO1",
	"ISPECELO1",
	"SPECGRA",
	"SPECGRA1",
	"ISPECGRA1",
	"SPECINF",
	"SPECINF1",
	"ISPECINF1",
	"SPECRAC1",
	"ISPECRAC1",
	"SPECSTRO",
	"ISPECSTRO",
	"ISPECDIG",
	"ISPECSIG",
	"ISPECSIGEN",
];

export async function fetchDepartments(): Promise<UnparsedDepartment[]> {
	const res = await fetch(new URL(localEndpoints.departments, document.URL));
	return await res.json();
}

export function parseNewDepartments(apiDepartments: UnparsedDepartment[]): Department[] {
	// remove known departments
	supportedDepartments.forEach(supported => {
		const i = apiDepartments.findIndex(fromApi => {
			return fromApi.Code === supported;
		});

		if (i !== -1) {
			apiDepartments.splice(i, 1);
		}
	});

	return apiDepartments.map(
		d =>
			({
				code: d.Code,
				name: d.Name,
			}) as Department,
	);
}

export async function fetchSemesters(department: string, year: number): Promise<UnparsedSemester[]> {
	const url = buildUrl(localEndpoints.semesters, {
		department,
		year,
	});

	return await (await fetch(url)).json();
}

export function parseSemesters(apiSemesters: UnparsedSemester[]): Semester[] {
	return apiSemesters.map(
		s =>
			({
				semester: Number(s.SemesterNumber),
				subdepartment: s.Department,
			}) as Semester,
	);
}

export async function fetchScheduleWeek(
	department: string,
	semester: number,
	from: Temporal.PlainDate,
): Promise<UnparsedSchedule> {
	const to = from.add({ days: 6 });
	const year = getAcademicYear(from);

	const url = buildUrl(localEndpoints.schedule, {
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
	const t = titleParsingRegex.exec(apiClassPeriod.title);
	if (!t) {
		console.log(apiClassPeriod.title);
	}
	const titleMatches = t!;

	const note = titleMatches[6] ? /^Napomena: (.*)<br\/>$/.exec(titleMatches[6])![1] : null;

	const group = titleMatches[7] ? /^Grupa: (.*)<br\/>$/.exec(titleMatches[7])![1] : null;

	const classPeriod: ClassPeriod = {
		id: Number(apiClassPeriod.id),
		apiColor: apiClassPeriod.color,

		date: Temporal.PlainDate.from(apiClassPeriod.start),
		start: Temporal.PlainTime.from(apiClassPeriod.start),
		end: Temporal.PlainTime.from(apiClassPeriod.end),

		courseName: titleMatches[5],
		className: titleMatches[1],
		professor: titleMatches[3],
		classType: parseClassType(titleMatches[2]),
		classroom: titleMatches[4],
		amountOfStudents: titleMatches[8] === "Nepoznato" ? null : Number(titleMatches[8]),
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
