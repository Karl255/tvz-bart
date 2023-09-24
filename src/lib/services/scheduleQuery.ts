import type {
	ProfFetchRule,
	ScheduleFetchRule,
	ScheduleFilterRule,
	ScheduleQueryRule,
	SemesterFetchRule,
	SubjectFetchRule,
} from "$lib/models/scheduleQuery";
import { partition } from "$lib/util/array-util";

export function parseQuery(queries: string): [ScheduleFetchRule[], ScheduleFilterRule[]] | [null, null] {
	try {
		const rules = queries
			.split("\n")
			.map(line => line.split("##")[0].trim())
			.filter(line => line !== "")
			.map(parseRule);

		return partition<ScheduleFetchRule, ScheduleFilterRule>(rules, rule => rule.type === "filter");
	} catch {
		return [null, null];
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
	const [field, value] = args;

	if (typeof field !== "string" || typeof value !== "string") {
		throw new Error();
	}

	return {
		type: "filter",
		field,
		value,
	};
}
