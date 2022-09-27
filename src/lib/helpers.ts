import { Temporal } from "@js-temporal/polyfill";
import type { ClassPeriod, ClassPeriodSegregated, Schedule } from "$lib/api/schedule";

export function leading0(x: number, digits: number): string {
	return x.toString().padStart(digits, "0");
}

export function workdaysFilterByDate(schedule: Schedule, date: Temporal.PlainDate): ClassPeriod[] {
	return [...schedule.workdays.values()].filter(c => date.equals(c.date));
}

function intersects(p1: ClassPeriod, p2: ClassPeriod): boolean {
	const cmp = Temporal.PlainTime.compare;

	return cmp(p1.start, p2.end) < 0 && cmp(p1.end, p2.start) > 0;
}

export function segregatePeriods(periods: ClassPeriod[]): ClassPeriodSegregated[] {
	const segregated = periods.map(p => ({ ...p, column: 1, width: 1 } as ClassPeriodSegregated));

	// segregate into columns
	let isSegregated: boolean;

	do {
		isSegregated = true;

		for (let i = 0; i < periods.length - 1; i++) {
			for (let j = i + 1; j < periods.length; j++) {
				if (segregated[i].column === segregated[j].column && intersects(segregated[i], segregated[j])) {
					segregated[j].column++;
					isSegregated = false;
				}
			}
		}
	} while (false && !isSegregated);

	const maxColumn = segregated.reduce<number>((a, p) => Math.max(a, p.column), 1);

	// spread out
	for (let i = 0; i < periods.length; i++) {
		let isUnobstructed = true;
		for (let j = 0; j < periods.length; j++) {
			if (i !== j && segregated[i].column < segregated[j].column && intersects(segregated[i], segregated[j])) {
				isUnobstructed = false;
				break;
			}
		}

		if (isUnobstructed) {
			segregated[i].width = maxColumn - segregated[i].column + 1;
		}
	}

	return segregated;
}

export function getThisWeeksMonday(day: Temporal.PlainDate): Temporal.PlainDate {
	return day.subtract({ days: day.dayOfWeek - 1 });
}

export function dateToStringHR(date: Temporal.PlainDate): string {
	return `${leading0(date.day, 2)}.${leading0(date.month, 2)}.${leading0(date.year, 4)}.`;
}

export function getAcademicYear(d: Temporal.PlainDate): number {
	// starts October, ends September
	return d.month >= 10 ? d.year : d.year - 1;
}

export function thisMonday() {
	return getThisWeeksMonday(Temporal.PlainDate.from("2022-06-09") /*Temporal.Now.plainDateISO()*/);
}
