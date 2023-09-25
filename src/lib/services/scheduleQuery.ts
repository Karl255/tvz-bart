import type {
	ProfFetchRule,
	ScheduleFetchRule,
	ScheduleFilterRule,
	ScheduleQueryRule,
	SemesterFetchRule,
	SubjectFetchRule,
} from "$lib/models/scheduleQuery";
import { partition } from "$lib/util/array-util";

export function parseQuery(
	queries: string,
): [string | null, ScheduleFetchRule[], ScheduleFilterRule[]] | [null, null, null] {
	try {
		const queryName = getQueryName(queries);

		const rules = queries
			.split("\n")
			.map(line => line.split("##")[0].trim())
			.filter(line => line !== "")
			.map(parseRule);

		return [queryName, ...partition<ScheduleFetchRule, ScheduleFilterRule>(rules, rule => rule.type === "filter")];
	} catch {
		return [null, null, null];
	}
}

function getQueryName(query: string): string | null {
	if (query.startsWith("##")) {
		const end = query.indexOf("\n");
		return query.substring(2, end).trim();
	} else {
		return null;
	}
}

function parseRule(query: string): ScheduleQueryRule {
	const parsers: Record<string, (args: string[]) => ScheduleQueryRule> = {
		semester: parseSemesterRule,
		subject: parseSubjectRule,
		prof: parseProfRule,
		filter: parseFilterRule,
	};

	const [type, ...args] = query.split(":");

	if (parsers[type]) {
		return parsers[type](args);
	} else {
		throw new Error();
	}
}

function parseSemesterRule(args: string[]): SemesterFetchRule {
	const [subdepartment, semester] = args[0].split("-");

	if (typeof subdepartment !== "string" || !semester.match(/^[1-6]$/)) {
		throw new Error();
	}

	return {
		type: "semester",
		semester: {
			subdepartment,
			semester: Number(semester),
		},
	};
}

function parseSubjectRule(args: string[]): SubjectFetchRule {
	if (!args[0].match(/^\d+$/)) {
		throw new Error();
	}

	return {
		type: "subject",
		courseId: Number(args[0]),
	};
}

function parseProfRule(args: string[]): ProfFetchRule {
	const [username, hash] = args;

	if (typeof username !== "string" || !hash.match(/^[0-9a-fA-F]{32}$/)) {
		throw new Error();
	}

	return {
		type: "prof",
		username,
		hash,
	};
}

function parseFilterRule(args: string[]): ScheduleFilterRule {
	const [field, values] = args;

	if (typeof field !== "string" || typeof values !== "string" || values.length === 0) {
		throw new Error();
	}

	return {
		type: "filter",
		field,
		values: values.split("|"),
	};
}
