import { Temporal } from "@js-temporal/polyfill";

export function thisMonday() {
	return getThisWeeksMonday(Temporal.Now.plainDateISO());
}

export function getAcademicYear(d: Temporal.PlainDate): number {
	// starts October, ends September next year
	return d.month >= 10 ? d.year : d.year - 1;
}

export function getThisWeeksMonday(day: Temporal.PlainDate): Temporal.PlainDate {
	return day.subtract({ days: day.dayOfWeek - 1 });
}

export function dateToStringHr(date: Temporal.PlainDate): string {
	const parts = [
		toStringWithLeading0(date.day, 2),
		toStringWithLeading0(date.month, 2),
		toStringWithLeading0(date.year, 4),
	];

	return parts.join(".") + ".";
}

function toStringWithLeading0(x: number, digits: number): string {
	return x.toString().padStart(digits, "0");
}
