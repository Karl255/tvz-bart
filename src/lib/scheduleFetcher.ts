import type { Temporal } from "@js-temporal/polyfill";
import type { ApiSchedule } from "$lib/types/schedule";
import { buildURL } from "./buildUrl";

const baseURL = "/.netlify/functions/schedule";

export default async function fetchScheduleWeek(department: string, semester: number, from: Temporal.PlainDate): Promise<ApiSchedule> {
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
