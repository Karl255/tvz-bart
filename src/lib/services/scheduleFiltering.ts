import type { BaseScheduleSource, ClassPeriod, ScheduleSourceAdditions } from "$lib/models/api";
import type { ClassPeriodIdentifier } from "$lib/models/scheduleFiltering";

export function toIdentifier<TSource extends BaseScheduleSource>(
	classPeriod: ClassPeriod,
	academicYear: number,
	source: ScheduleSourceAdditions<TSource>,
): ClassPeriodIdentifier<TSource> {
	return {
		for: {
			...source,
			academicYear,
		},

		className: classPeriod.className,
		classType: classPeriod.classType,
		dayOfWeek: classPeriod.date.dayOfWeek,
		start: classPeriod.start.toString(),
		end: classPeriod.end.toString(),
	};
}

export function doesPeriodIdentifierMatch<TSource extends BaseScheduleSource>(
	classPeriod: ClassPeriod,
	identifier: ClassPeriodIdentifier<TSource>,
) {
	return (
		classPeriod.className === identifier.className &&
		classPeriod.date.dayOfWeek === identifier.dayOfWeek &&
		classPeriod.start.equals(identifier.start) &&
		classPeriod.end.equals(identifier.end)
	);
}

export function identifierEquals<TSource extends BaseScheduleSource>(
	first: ClassPeriodIdentifier<TSource>,
	second: ClassPeriodIdentifier<TSource>,
) {
	return JSON.stringify(first) === JSON.stringify(second);
}
