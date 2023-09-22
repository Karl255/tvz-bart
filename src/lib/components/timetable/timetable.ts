import type { ClassPeriod, Schedule } from "$lib/models/api";
import { Temporal } from "@js-temporal/polyfill";

export interface ClassPeriodSegregated extends ClassPeriod {
	column: number;
	width: number;
}

export function workdaysFilterByDate(schedule: Schedule, date: Temporal.PlainDate): ClassPeriod[] {
	return [...schedule.periods.values()].filter(c => date.equals(c.date));
}

export function segregatePeriods(periods: ClassPeriod[]): ClassPeriodSegregated[] {
	const segregated = periods.map(p => ({ ...p, column: 1, width: 1 }) as ClassPeriodSegregated);

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
				}
			}
		}
	} while (overlaps);

	const maxColumn = segregated.reduce<number>((a, p) => Math.max(a, p.column), 1);

	// spread out
	for (let i = 0; i < periods.length; i++) {
		let isUnobstructed = true;
		for (let j = 0; j < periods.length; j++) {
			if (
				i !== j &&
				segregated[i].column < segregated[j].column &&
				periodsIntersect(segregated[i], segregated[j])
			) {
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

function periodsIntersect(p1: ClassPeriod, p2: ClassPeriod): boolean {
	return timeIsBetween(p1.start, p2.start, p2.end) || timeIsBetween(p2.start, p1.start, p1.end);
}

function timeIsBetween(t: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime): boolean {
	return Temporal.PlainTime.compare(t, start) >= 0 && Temporal.PlainTime.compare(t, end) < 0;
}
