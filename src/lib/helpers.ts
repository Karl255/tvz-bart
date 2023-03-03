import { Temporal } from "@js-temporal/polyfill";
import type { ClassPeriod, ClassPeriodSegregated, Schedule } from "$lib/api/schedule";
import { dev } from "$app/environment";

export function leading0(x: number, digits: number): string {
	return x.toString().padStart(digits, "0");
}

export function workdaysFilterByDate(schedule: Schedule, date: Temporal.PlainDate): ClassPeriod[] {
	return [...schedule.workdays.values()].filter(c => date.equals(c.date));
}

function timeIsBetween(t: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime): boolean {
	return Temporal.PlainTime.compare(t, start) >= 0 && Temporal.PlainTime.compare(t, end) < 0;
}

function periodsIntersect(p1: ClassPeriod, p2: ClassPeriod): boolean {
	return timeIsBetween(p1.start, p2.start, p2.end)
		|| timeIsBetween(p2.start, p1.start, p1.end);
}

export function segregatePeriods(periods: ClassPeriod[]): ClassPeriodSegregated[] {
	const segregated = periods.map(p => ({ ...p, column: 1, width: 1 } as ClassPeriodSegregated));

	// segregate into columns
	let overlaps: boolean;

	do {
		overlaps = false;

		for (let i = 0; i < periods.length - 1; i++) {
			// move self into free place (elements before i are already "locked in")
			for (let j = 0; j < i; j++) {
				if (segregated[i].column === segregated[j].column && periodsIntersect(segregated[i], segregated[j])) {
					segregated[i].column++;
					overlaps = true;
				}
			}

			// push others into next column
			for (let j = i + 1; j < periods.length; j++) {
				if (segregated[i].column === segregated[j].column && periodsIntersect(segregated[i], segregated[j])) {
					segregated[j].column++;
					overlaps = true;

					if (segregated[j].id === 10537070) {
						console.log(`pushed into next column by [${segregated[i].start.toJSON()} - ${segregated[i].end.toJSON()}] in column ${segregated[i].column}`);
						console.log(`${segregated[j].id} is now in column ${segregated[j].column}`);
					}
				}
			}
		}
	} while (overlaps);

	const maxColumn = segregated.reduce<number>((a, p) => Math.max(a, p.column), 1);

	// spread out
	for (let i = 0; i < periods.length; i++) {
		let isUnobstructed = true;
		for (let j = 0; j < periods.length; j++) {
			if (i !== j && segregated[i].column < segregated[j].column && periodsIntersect(segregated[i], segregated[j])) {
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
	return getThisWeeksMonday(dev ? Temporal.PlainDate.from("2023-03-06") : Temporal.Now.plainDateISO());
}
