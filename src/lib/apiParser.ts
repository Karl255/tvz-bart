import type { ApiClassPeriod, ApiHoliday, ApiSchedule, ClassPeriod, Holiday, Schedule } from "$lib/types/api";
import { Temporal } from "@js-temporal/polyfill";

function parseHoliday(apiHoliday: ApiHoliday): Holiday {
	return {
		date: Temporal.PlainDate.from(apiHoliday.start),
		title: apiHoliday.title,
	};
}

function parseClassPeriod(apiClassPeriod: ApiClassPeriod): [string, number, ClassPeriod] {
	const date = apiClassPeriod.start.split("T")[0];

	const titleParsingRegexes = [
		/^\<strong\>([0-9A-Za-zŠĐČĆŽšđčćž ]+)\<\/strong\> \- ([A-Za-zŠĐČĆŽšđčćž ]+)$/,
		/^(.+)$/,
		/^Učionica\: ([0-9A-Za-zŠĐČĆŽšđčćž,.\- ]+)$/,
		/^Smjer\: ([0-9A-Za-zŠĐČĆŽšđčćž ]+)$/,
		/^Broj studenata na kolegiju\: (\d+|Nepoznato)$/,
	];

	const parsedTitle = apiClassPeriod.title
		.split("<br/>")
		.map((l, i) => titleParsingRegexes[i].exec(l)!);

	const classPeriod = {
		id: Number(apiClassPeriod.id),
		apiColor: apiClassPeriod.color,

		start: Temporal.PlainTime.from(apiClassPeriod.start),
		end: Temporal.PlainTime.from(apiClassPeriod.end),

		courseName: parsedTitle[3][1],
		className: parsedTitle[0][1],
		professor: parsedTitle[1][1],
		classType: parsedTitle[0][2],
		classroom: parsedTitle[2][1],
		amountOfStudents: parsedTitle[4][1] === "Nepoznato" ? null : Number(parsedTitle[4][1]),
	} as ClassPeriod;

	return [date, classPeriod.id, classPeriod];
}

export default function parseSchedule(apiSchedule: ApiSchedule): Schedule {
	const apiClassPeriods = apiSchedule.filter(x => x.id !== null) as ApiClassPeriod[];
	const apiHolidays = apiSchedule.filter(x => x.id === null) as ApiHoliday[];

	const workdays = new Map<string, Map<number, ClassPeriod>>();

	let t = apiClassPeriods.map(parseClassPeriod).sort((a, b) => {
		return Temporal.PlainTime.compare(a[2].start, b[2].start);
	});

	for (const [date, id, classPeriod] of t) {
		if (!workdays.has(date)) {
			workdays.set(date, new Map<number, ClassPeriod>());
		}

		workdays.get(date)!.set(id, classPeriod);
	}

	return {
		holidays: apiHolidays.map(parseHoliday),
		workdays: workdays,
	};
}
