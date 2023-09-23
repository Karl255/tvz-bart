import type { Semester } from "./api";

export interface SemesterScheduleQuery {
	type: "semester";
	semester: Semester;
}

export interface SubjectScheduleQuery {
	type: "subject";
	courseId: number;
}

export interface UserScheduleQuery {
	type: "user";
	username: string;
	hash: string;
}

export type ScheduleQuery = SemesterScheduleQuery | SubjectScheduleQuery | UserScheduleQuery;
