import { Temporal } from "@js-temporal/polyfill";
import { buildURL } from "$lib/buildUrl";
import { getAcademicYear } from "$lib/helpers";

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
	classType: "Predavanja" | "Auditorne vježbe" | "Laboratorijske vježbe" | string;
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

export async function fetchScheduleWeek(department: string, semester: number, from: Temporal.PlainDate): Promise<ApiSchedule> {
	const to = from.add({ days: 6 });
	const year = getAcademicYear(from);

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

const titleParsingRegex = new RegExp(
	"^"
	+"\\<strong\\>([^\<]+)\\<\\/strong\\> \\- ([^\<]+)\\<br\\/\\>"
	+ "(.+)\\<br\\/\\>"
	+ "Učionica\\: ([^\<]+)\\<br\\/\\>"
	+ "Smjer\\: ([^\<]+)\\<br\\/\\>"
	+ "(Napomena: [^\<]*\\<br\\/\\>)?"
	+ "(Grupa: [^\<]*\\<br\\/\\>)?"
	+ "Broj studenata na kolegiju\\: (\\d+|Nepoznato)"
	+ "$"
);

function parseClassPeriod(apiClassPeriod: ApiClassPeriod): [number, ClassPeriod] {
	const t = titleParsingRegex.exec(apiClassPeriod.title)
	if (!t) {
		console.log(apiClassPeriod.title);
	}
	const titleMatches = t!;
	
	const note = titleMatches[6]
		? /^Napomena: (.*)\<br\/\>$/.exec(titleMatches[6])![1]
		: null;
	
	const group = titleMatches[7]
		? /^Grupa: (.*)\<br\/\>$/.exec(titleMatches[7])![1]
		: null;
	
	const classPeriod: ClassPeriod = {
		id: Number(apiClassPeriod.id),
		apiColor: apiClassPeriod.color,

		date: Temporal.PlainDate.from(apiClassPeriod.start),
		start: Temporal.PlainTime.from(apiClassPeriod.start),
		end: Temporal.PlainTime.from(apiClassPeriod.end),

		courseName: titleMatches[5],
		className: titleMatches[1],
		professor: titleMatches[3],
		classType: titleMatches[2],
		classroom: titleMatches[4],
		amountOfStudents: titleMatches[8] === "Nepoznato" ? null : Number(titleMatches[8]),
		group,
		note,
	};

	return [classPeriod.id, classPeriod];
}

export function parseSchedule(apiSchedule: ApiSchedule): Schedule {
	const apiClassPeriods = apiSchedule.filter(x => x.id !== null) as ApiClassPeriod[];
	const apiHolidaysKV = (apiSchedule.filter(x => x.id === null) as ApiHoliday[])
		.map(parseHoliday)
		.map(h => [h.date.toString({ calendarName: "never" }), h] as [StringPlainDate, Holiday]);

	const workdaysKV = apiClassPeriods.map(parseClassPeriod).sort((a, b) => {
		return Temporal.PlainTime.compare(a[1].start, b[1].start);
	});

	return {
		holidays: new Map<StringPlainDate, Holiday>(apiHolidaysKV),
		workdays: new Map<number, ClassPeriod>(workdaysKV),
	};
}
