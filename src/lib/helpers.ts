import type { Temporal } from "@js-temporal/polyfill";
import type { ClassPeriod, Schedule } from "./types/api";

export function leading0(x: number, digits: number): string {
	return x.toString().padStart(digits, "0");
}

export function workdaysFilterByDate(schedule: Schedule, date: Temporal.PlainDate): ClassPeriod[] {
	return [...schedule.workdays.values()].filter(c => date.equals(c.date));
}
