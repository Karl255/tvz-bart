import type { ClassType, ScheduleSourceAdditions } from "$lib/models/api";
import type { StringPlainTime } from "./temporal";
import type { BaseScheduleSource } from "$lib/models/api";

export interface ClassPeriodIdentifier<T extends BaseScheduleSource> {
	for: ScheduleSourceAdditions<T> & {
		academicYear: number;
	};

	className: string;
	classType: ClassType;
	dayOfWeek: number;
	start: StringPlainTime;
	end: StringPlainTime;
}
