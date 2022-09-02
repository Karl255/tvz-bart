const baseURL = "https://homer.tvz.hr/CalendarJson";

function buildURL(params: Record<string, string | number>): URL {
	const url = new URL(baseURL);

	for (const key in params) {
		url.searchParams.append(key, params[key].toString());
	}
	
	url.searchParams.append("_", Date.now().toString());
	
	return url;
}

function justDateString(date: Date): string {
	return date.toJSON().slice(0, 10);
}

export async function fetchSchedule(department: string, semester: number, from: Date, to: Date): Promise<Array<Object>> {
	// a requirement by the API; seems like there is a 1-off error
	const year = from.getFullYear() - 1;

	const url = buildURL({
		department,
		semester: semester,
		year: year,
		start: justDateString(from),
		end: justDateString(to)
	});
	
	const result = await fetch(url, {
		mode: "no-cors" // damned cors
	});
	
	//return await result.json();
	return []
}
