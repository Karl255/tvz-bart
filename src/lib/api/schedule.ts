import { Temporal } from "@js-temporal/polyfill";
import { buildURL } from "$lib/buildUrl";

const baseURL = "/.netlify/functions/schedule";

export type StringPlainDate = string;
export type StringPlainDateTime = string;

export type ApiClassPeriod = {
	id: number;
	title: string;
	start: StringPlainDateTime;
	end: StringPlainDateTime;
	allDay: false;
	color: string | null;
	editable: false;
};

export type ApiHoliday = {
	id: null;
	title: "nedjelja" | string;
	start: StringPlainDate;
	end: null;
	allDay: true;
	color: "Red";
	editable: false;
};

export type ApiSchedule = (ApiClassPeriod | ApiHoliday)[];

export type ClassPeriod = {
	id: number;
	apiColor: string | null;

	date: Temporal.PlainDate;
	start: Temporal.PlainTime;
	end: Temporal.PlainTime;

	courseName: string;
	className: string;
	professor: string;
	classType: "Predavanja" | "Auditorne vježbe" | "Laboratorijske vježbe";
	classroom: string;
	amountOfStudents: number | null;
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

export async function fetchScheduleWeek(department: string, semester: number, from: Temporal.PlainDate): Promise<ApiSchedule> {
	const to = from.add({ days: 6 });
	// a requirement by the API; seems like there is a 1-off error
	const year = from.year - 1;

	const url = buildURL(baseURL, {
		department,
		semester,
		year,
		start: from.toString({ calendarName: "never" }),
		end: to.toString({ calendarName: "never" }),
	});

	return await (await fetch(url)).json();
}

function parseHoliday(apiHoliday: ApiHoliday): Holiday {
	return {
		date: Temporal.PlainDate.from(apiHoliday.start),
		title: apiHoliday.title,
	};
}

function parseClassPeriod(apiClassPeriod: ApiClassPeriod): [number, ClassPeriod] {
	const date = apiClassPeriod.start.split("T")[0];

	const titleParsingRegexes = [
		/^\<strong\>([0-9A-Za-zŠĐČĆŽšđčćž ]+)\<\/strong\> \- ([A-Za-zŠĐČĆŽšđčćž ]+)$/,
		/^(.+)$/,
		/^Učionica\: ([0-9A-Za-zŠĐČĆŽšđčćž,.\-\/ ]+)$/,
		/^Smjer\: ([0-9A-Za-zŠĐČĆŽšđčćž ]+)$/,
		// TODO: add napomena field here (double-check position)
		/^Broj studenata na kolegiju\: (\d+|Nepoznato)$/,
	];

	const parsedTitle = apiClassPeriod.title
		.split("<br/>")
		.map((l, i) => titleParsingRegexes[i].exec(l)!);

	const classPeriod = {
		id: Number(apiClassPeriod.id),
		apiColor: apiClassPeriod.color,

		date: Temporal.PlainDate.from(apiClassPeriod.start),
		start: Temporal.PlainTime.from(apiClassPeriod.start),
		end: Temporal.PlainTime.from(apiClassPeriod.end),

		courseName: parsedTitle[3][1],
		className: parsedTitle[0][1],
		professor: parsedTitle[1][1],
		classType: parsedTitle[0][2],
		classroom: parsedTitle[2][1],
		amountOfStudents: parsedTitle[4][1] === "Nepoznato" ? null : Number(parsedTitle[4][1]),
	} as ClassPeriod;

	return [classPeriod.id, classPeriod];
}

export function parseSchedule(apiSchedule: ApiSchedule): Schedule {
	const apiClassPeriods = apiSchedule.filter(x => x.id !== null) as ApiClassPeriod[];
	const apiHolidaysKV = (apiSchedule.filter(x => x.id === null) as ApiHoliday[])
		.map(parseHoliday)
		.map(h => [h.date.toString({ calendarName: "never" }), h] as [StringPlainDate, Holiday]);

	let workdaysKV = apiClassPeriods.map(parseClassPeriod).sort((a, b) => {
		return Temporal.PlainTime.compare(a[1].start, b[1].start);
	});

	return {
		holidays: new Map<StringPlainDate, Holiday>(apiHolidaysKV),
		workdays: new Map<number, ClassPeriod>(workdaysKV),
	};
}
