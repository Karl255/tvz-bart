<script lang="ts">
	import { getBlankSchedule, getSemesterSchedule, getSemesters } from "$lib/api";
	import CalendarViewer, { type ScheduleLoader } from "$lib/components/CalendarViewer.svelte";
	import DepartmentPicker from "$lib/components/DepartmentPicker.svelte";
	import SemesterPicker from "$lib/components/SemesterPicker.svelte";
	import type { Department, Semester } from "$lib/models/api";
	import { persistent } from "$lib/services/persistence";
	import { getAcademicYear, thisMonday } from "$lib/util/datetime-helpers";
	import type { Temporal } from "@js-temporal/polyfill";
	import type { LoadedData } from "./+page";

	export let data: LoadedData;

	const departmentCode = persistent("regular:departmentCode", data.departments[0].code);
	const semester = persistent<Semester | null>("regular:semester", null);

	let isLoadingSchedule: boolean = false;
	let currentMonday = thisMonday();

	let availableDepartments: Department[] = data.departments;

	let promisedSemesters: Promise<Semester[]> = getSemesters($departmentCode, getAcademicYear(currentMonday));

	let loadingSemesters = false;

	$: currentAcademicYear = getAcademicYear(currentMonday);
	$: loadSemesters($departmentCode, currentAcademicYear);

	let scheduleLoader: ScheduleLoader;
	$: scheduleLoader = (weekStart: Temporal.PlainDate) => {
		return $semester ? getSemesterSchedule($semester, weekStart) : getBlankSchedule(weekStart);
	};

	async function loadSemesters(departmentCode: string, academicYear: number) {
		loadingSemesters = true;
		promisedSemesters = getSemesters(departmentCode, academicYear);
		promisedSemesters.then(() => (loadingSemesters = false));
	}
</script>

<CalendarViewer
	{scheduleLoader}
	bind:currentMonday
	bind:loadingSchedule={isLoadingSchedule}
>
	<DepartmentPicker
		departments={availableDepartments}
		bind:selectedDepartmentCode={$departmentCode}
		disabled={loadingSemesters}
	/>
	<SemesterPicker
		{promisedSemesters}
		bind:selectedSemester={$semester}
		disabled={isLoadingSchedule}
	/>
</CalendarViewer>
