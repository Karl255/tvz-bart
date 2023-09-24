import type { ScheduleQuery } from "$lib/models/scheduleQuery";

export function parseQuery(queries: string): ScheduleQuery[] | null {
	try {
		return queries
			.split("\n")
			.map(line => line.split("#")[0].trim())
			.filter(line => line !== "")
			.map(parseQueryRule);
	} catch {
		return null;
	}
}

function parseQueryRule(query: string): ScheduleQuery {
	const [type, ...args] = query.split(":");

	if (type === "semester") {
		const [subdepartment, semester] = args[0].split("-");

		if (typeof subdepartment !== "string" || !semester.match(/^[1-6]$/)) {
			throw new Error();
		}

		return {
			type,
			semester: {
				subdepartment,
				semester: Number(semester),
			},
		};
	} else if (type === "subject") {
		return {
			type,
			courseId: Number(args[0]),
		};
	} else if (type === "user") {
		const [username, hash] = args;

		if (typeof username !== "string" || !hash.match(/^[0-9a-fA-F]{32}$/)) {
			throw new Error();
		}

		return {
			type,
			username,
			hash,
		};
	} else {
		throw new Error();
	}
}
