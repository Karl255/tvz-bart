import type { ClassPeriod, Semester } from "$lib/models/api";
import type { ClassPeriodIdentifier } from "$lib/models/scheduleFiltering";
import { normalizeDepartment } from "$lib/util/other";

export function toIdentifier(
	classPeriod: ClassPeriod,
	semester: Semester,
	academicYear: number,
): ClassPeriodIdentifier {
	return {
		semester: {
			subdepartment: normalizeDepartment(semester.subdepartment),
			semester: semester.semester,
		},
		academicYear,

		className: classPeriod.className,
		classType: classPeriod.classType,
		dayOfWeek: classPeriod.date.dayOfWeek,
		start: classPeriod.start.toString(),
		end: classPeriod.end.toString(),
	};
}

export function doesPeriodIdentifierMatch(classPeriod: ClassPeriod, identifier: ClassPeriodIdentifier) {
	return (
		classPeriod.className === identifier.className &&
		classPeriod.date.dayOfWeek === identifier.dayOfWeek &&
		classPeriod.start.equals(identifier.start) &&
		classPeriod.end.equals(identifier.end)
	);
}

export function identifierEquals(first: ClassPeriodIdentifier, second: ClassPeriodIdentifier) {
	return (
		first.semester.subdepartment === second.semester.subdepartment &&
		first.semester.semester === second.semester.semester &&
		first.academicYear === second.academicYear &&
		first.className === second.className &&
		first.classType === second.classType &&
		first.dayOfWeek === second.dayOfWeek &&
		first.start === second.start &&
		first.end === second.end
	);
}
