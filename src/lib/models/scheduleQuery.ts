import type { Semester } from "./api";

export interface SemesterFetchRule {
	type: "semester";
	semester: Semester;
}

export interface SubjectFetchRule {
	type: "subject";
	courseId: number;
}

export interface ProfFetchRule {
	type: "prof";
	username: string;
	hash: string;
}

export interface ScheduleFilterRule {
	type: "filter";
	field: string;
	values: string[];
}

export type ScheduleFetchRule = SemesterFetchRule | SubjectFetchRule | ProfFetchRule;
export type ScheduleQueryRule = ScheduleFetchRule | ScheduleFilterRule;
