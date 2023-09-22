import type { ClassPeriod, Semester, StringPlainDateTime } from "$lib/api";

export interface ClassPeriodIdentifier {
	semester: Semester;
	academicYear: number;

	className: string;
	dayOfWeek: number;
	start: StringPlainDateTime;
	end: StringPlainDateTime;
}

export function toIdentifier(
	classPeriod: ClassPeriod,
	semester: Semester,
	academicYear: number,
): ClassPeriodIdentifier {
	return {
		semester,
		academicYear,

		className: classPeriod.className,
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
