import type { BaseScheduleSource, Semester, SemesterScheduleSource, SourcedSchedule } from "$lib/models/api";
import { buildUrl } from "$lib/util/url-util";
import { localEndpoints } from "./endpoints";

import { getAcademicYear } from "$lib/util/datetime-helpers";
import { Temporal } from "@js-temporal/polyfill";
import { parseSchedule, type UnparsedSchedule } from "./_schedule-helpers";

const blankSchedule: SourcedSchedule<BaseScheduleSource> = {
	periods: new Map(),
	holidays: new Map(),
	for: {
		weekStart: Temporal.PlainDate.from("1970-01-01"),
	},
};

export async function getBlankSchedule(): Promise<SourcedSchedule<BaseScheduleSource>> {
	return Promise.resolve(blankSchedule);
}

export async function getSemesterSchedule(
	semester: Semester,
	weekStart: Temporal.PlainDate,
): Promise<SourcedSchedule<SemesterScheduleSource>> {
	const url = buildUrl(localEndpoints.schedule, document.URL, {
		department: semester.subdepartment,
		semester: semester.semester,
		year: getAcademicYear(weekStart),
		start: weekStart.toString({ calendarName: "never" }),
		end: weekStart.add({ days: 6 }).toString({ calendarName: "never" }),
	});

	const response = await fetch(url);
	const unparsedSchedule: UnparsedSchedule = await response.json();

	return {
		...parseSchedule(unparsedSchedule),
		for: {
			weekStart,
			semester: semester,
		},
	};
}
