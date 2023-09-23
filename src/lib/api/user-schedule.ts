import type { BaseScheduleSource, SourcedSchedule } from "$lib/models/api";
import { buildUrl } from "$lib/util/url-util";
import type { Temporal } from "@js-temporal/polyfill";
import { parseSchedule, type UnparsedClassPeriod } from "./_schedule-helpers";
import { localEndpoints } from "./endpoints";

export async function getSubjectSchedule(
	username: string,
	hash: string,
	weekStart: Temporal.PlainDate,
): Promise<SourcedSchedule<BaseScheduleSource>> {
	const url = buildUrl(localEndpoints.userSchedule, document.URL, {
		username,
		hash,
		start: weekStart.toString({ calendarName: "never" }),
		end: weekStart.add({ days: 6 }).toString({ calendarName: "never" }),
	});

	const response = await fetch(url);
	const unparsedSchedule: UnparsedClassPeriod[] = await response.json();

	return {
		...parseSchedule(unparsedSchedule),
		for: {
			weekStart,
		},
	};
}
