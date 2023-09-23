<script lang="ts">
	import { getBlankSchedule, getSemesterSchedule, getSemesters } from "$lib/api";
	import CalendarViewer, { type ScheduleFilter, type ScheduleLoader } from "$lib/components/CalendarViewer.svelte";
	import DepartmentPicker from "$lib/components/DepartmentPicker.svelte";
	import SemesterPicker from "$lib/components/SemesterPicker.svelte";
	import type { ClassPeriod, Department, Schedule, Semester, SemesterScheduleSource } from "$lib/models/api";
	import type { ClassPeriodIdentifier } from "$lib/models/scheduleFiltering";
	import { persistent } from "$lib/services/persistence";
	import { doesPeriodIdentifierMatch, toIdentifier } from "$lib/services/scheduleFiltering";
	import { getAcademicYear, thisMonday } from "$lib/util/datetime-helpers";
	import { normalizeDepartment, normalizeSemester } from "$lib/util/other";
	import type { Temporal } from "@js-temporal/polyfill";
	import type { LoadedData } from "./+page";

	export let data: LoadedData;

	const departmentCode = persistent("regular:departmentCode", data.departments[0].code);
	const semester = persistent<Semester | null>("regular:semester", null);
	const allHiddenRules = persistent<ClassPeriodIdentifier<SemesterScheduleSource>[]>("regular:hiddenItems", []);

	let currentMonday = thisMonday();

	let availableDepartments: Department[] = data.departments;
	let promisedSemesters: Promise<Semester[]> = getSemesters($departmentCode, getAcademicYear(currentMonday));

	let isLoadingSemesters = false;
	let isLoadingSchedule = false;

	$: currentAcademicYear = getAcademicYear(currentMonday);
	$: loadSemesters($departmentCode, currentAcademicYear);

	let relevantHiddenRules: ClassPeriodIdentifier<SemesterScheduleSource>[];
	$: relevantHiddenRules = $allHiddenRules.filter(
		item =>
			($semester === null || item.for.semester.subdepartment === normalizeDepartment($semester.subdepartment)) &&
			item.for.academicYear === currentAcademicYear,
	);

	let scheduleLoader: ScheduleLoader;
	$: scheduleLoader = (weekStart: Temporal.PlainDate) => {
		return $semester ? getSemesterSchedule($semester, weekStart) : getBlankSchedule(weekStart);
	};

	let scheduleFilter: ScheduleFilter;
	$: scheduleFilter = (schedule: Schedule) => {
		// prettier-ignore
		const filteredPeriodPairs = [...schedule.periods.entries()]
			.filter(([_, classPeriod]) => !matchesAnyIdentifier(classPeriod, relevantHiddenRules));

		return {
			periods: new Map(filteredPeriodPairs),
			holidays: schedule.holidays,
		};
	};

	function matchesAnyIdentifier(
		classPeriod: ClassPeriod,
		identifiers: ClassPeriodIdentifier<SemesterScheduleSource>[],
	): boolean {
		return identifiers.some(identifier => doesPeriodIdentifierMatch(classPeriod, identifier));
	}

	async function loadSemesters(departmentCode: string, academicYear: number) {
		isLoadingSemesters = true;
		promisedSemesters = getSemesters(departmentCode, academicYear);
		promisedSemesters.then(() => (isLoadingSemesters = false));
	}

	function onHidePeriod(classPeriod: ClassPeriod) {
		if ($semester === null) {
			return;
		}

		$allHiddenRules.push(
			toIdentifier(classPeriod, currentAcademicYear, {
				semester: normalizeSemester($semester),
			}),
		);

		$allHiddenRules = $allHiddenRules;
	}
</script>

<CalendarViewer
	{scheduleLoader}
	{scheduleFilter}
	{onHidePeriod}
	bind:currentMonday
	bind:loadingSchedule={isLoadingSchedule}
>
	<DepartmentPicker
		departments={availableDepartments}
		bind:selectedDepartmentCode={$departmentCode}
		disabled={isLoadingSemesters}
	/>
	<SemesterPicker
		{promisedSemesters}
		bind:selectedSemester={$semester}
		disabled={isLoadingSchedule}
	/>
</CalendarViewer>
