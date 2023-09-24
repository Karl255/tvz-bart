import type { CustomScheduleSource, Schedule, SourcedSchedule } from "$lib/models/api";
import type { ScheduleQueryRules } from "$lib/models/scheduleQuery";
import type { Temporal } from "@js-temporal/polyfill";
import { getSemesterSchedule } from "./schedule";
import { getSubjectSchedule } from "./subject-schedule";
import { getUserSchedule } from "./user-schedule";

export async function getCustomSchedule(
	queries: ScheduleQueryRules[],
	weekStart: Temporal.PlainDate,
): Promise<SourcedSchedule<CustomScheduleSource>> {
	const promises = queries.map(query => fetchSingleSchedule(query, weekStart));

	const schedules = await Promise.all(promises);

	return {
		periods: new Map(schedules.flatMap(s => [...s.periods.entries()])),
		holidays: new Map(schedules.flatMap(s => [...s.holidays.entries()])),
		for: {
			weekStart,
			scheduleQueries: queries,
		},
	};
}

function fetchSingleSchedule(query: ScheduleQueryRules, weekStart: Temporal.PlainDate): Promise<Schedule> {
	const { type } = query;

	if (type === "semester") {
		return getSemesterSchedule(query.semester, weekStart);
	} else if (type === "subject") {
		return getSubjectSchedule(query.courseId, weekStart);
	} else if (type === "prof") {
		return getUserSchedule(query.username, query.hash, weekStart);
	} else {
		throw new Error();
	}
}
