import type { ClassType, Semester } from "$lib/models/api";
import type { StringPlainTime } from "./temporal";

export interface ClassPeriodIdentifier {
	semester: Semester;
	academicYear: number;

	className: string;
	classType: ClassType;
	dayOfWeek: number;
	start: StringPlainTime;
	end: StringPlainTime;
}