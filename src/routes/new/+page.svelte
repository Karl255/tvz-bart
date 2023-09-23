<script lang="ts">
	import { getSemesterSchedule, getSemesters } from "$lib/api";
	import DepartmentPicker from "$lib/components/DepartmentPicker.svelte";
	import CalendarViewer, { type ScheduleLoader } from "$lib/components/CalendarViewer.svelte";
	import SemesterPicker from "$lib/components/SemesterPicker.svelte";
	import type { Department, Semester } from "$lib/models/api";
	import type { Settings } from "$lib/models/settings";
	import { loadSettings } from "$lib/services/settings";
	import { getAcademicYear, thisMonday } from "$lib/util/datetime-helpers";
	import type { Temporal } from "@js-temporal/polyfill";
	import type { LoadedData } from "./+page";

	export let data: LoadedData;

	let isLoadingSchedule: boolean = false;
	let currentSettings: Settings = loadSettings();
	let currentMonday = thisMonday();

	let availableDepartments: Department[] = data.departments;

	let promisedSemesters: Promise<Semester[]> = getSemesters(
		currentSettings.departmentCode,
		getAcademicYear(currentMonday),
	);

	$: ({ departmentCode: settingsDepartmentCode, semester: settingsSemester } = currentSettings);

	let loadingSemesters = false;

	$: currentAcademicYear = getAcademicYear(currentMonday);
	$: loadSemesters(settingsDepartmentCode, currentAcademicYear);

	$: scheduleLoader = ((weekStart: Temporal.PlainDate) => {
		return getSemesterSchedule(settingsSemester, weekStart);
	}) as ScheduleLoader;

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
		bind:selectedDepartmentCode={currentSettings.departmentCode}
		disabled={loadingSemesters}
	/>
	<SemesterPicker
		{promisedSemesters}
		bind:selectedSemester={currentSettings.semester}
		disabled={isLoadingSchedule}
	/>
</CalendarViewer>
