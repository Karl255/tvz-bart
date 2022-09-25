import type { Temporal } from "@js-temporal/polyfill";
import type { ApiSchedule } from "./types/api";

const baseURL = "/.netlify/functions/forward";

function buildURL(params: Record<string, string | number>): URL {
	const url = new URL(baseURL, document.URL);

	for (const key in params) {
		url.searchParams.append(key, params[key].toString());
	}

	url.searchParams.append("_", Date.now().toString());

	return url;
}

export default async function fetchScheduleWeek(department: string, semester: number, from: Temporal.PlainDate): Promise<ApiSchedule> {
	const to = from.add({ days: 6 });
	// a requirement by the API; seems like there is a 1-off error
	const year = from.year - 1;

	const url = buildURL({
		department,
		semester,
		year,
		start: from.toString({ calendarName: "never" }),
		end: to.toString({ calendarName: "never" }),
	});

	return await (await fetch(url)).json();
}
