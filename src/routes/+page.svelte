<script lang="ts">
	import { getSemesters, getSemesterSchedule } from "$lib/api";
	import type { Temporal } from "@js-temporal/polyfill";

	import type { ClassPeriod, Department, Semester, SemesterScheduleSource, SourcedSchedule } from "$lib/models/api";
	import { dateToStringHr, getAcademicYear, thisMonday } from "$lib/util/datetime-helpers";

	import ClassPeriodInfo from "$lib/components/ClassPeriodInfo.svelte";
	import DepartmentPicker from "$lib/components/DepartmentPicker.svelte";
	import SemesterPicker from "$lib/components/SemesterPicker.svelte";
	import { Tab, Tabs } from "$lib/components/tabs/";
	import { Timetable } from "$lib/components/timetable";
	import { loadSettings, saveSettings } from "$lib/services/settings";

	import HiddenPeriodsList from "$lib/components/HiddenPeriodsList.svelte";
	import type { ClassPeriodIdentifier } from "$lib/models/scheduleFiltering";
	import { defaultSettings, type Settings } from "$lib/models/settings";
	import { identifierEquals, toIdentifier } from "$lib/services/scheduleFiltering";
	import { normalizeDepartment } from "$lib/util/other";
	import type { LoadedData } from "./+page";

	type PageSchedule = SourcedSchedule<SemesterScheduleSource>;

	export let data: LoadedData;

	let currentSettings: Settings = loadSettings();
	let autoSavePrevious = currentSettings.autoSave;

	let currentMonday = thisMonday();
	let availableDepartments: Department[] = data.departments;

	let promisedSemesters: Promise<Semester[]> = getSemesters(
		currentSettings.departmentCode,
		getAcademicYear(currentMonday),
	);

	let schedule: PageSchedule | null = null;
	let allHiddenPeriods: ClassPeriodIdentifier[] = []; // TODO: read from localStorage
	$: filteredHiddenPeriods = filterHiddenPeriods(
		allHiddenPeriods,
		currentSettings.semester.subdepartment,
		currentAcademicYear,
	);

	let selectedPeriod: ClassPeriod | null = null;
	let previewedPeriod: ClassPeriod | null = null;

	$: ({
		autoSave: settingsAutoSave,
		departmentCode: settingsDepartmentCode,
		semester: settingsSemester,
	} = currentSettings);

	$: {
		if (settingsAutoSave || autoSavePrevious) {
			saveSettings(currentSettings);
			autoSavePrevious = currentSettings.autoSave;
		}
	}

	let loadingSemesters = false;
	let loadingSchedule = false;

	$: currentAcademicYear = getAcademicYear(currentMonday);
	$: loadSemesters(settingsDepartmentCode, currentAcademicYear);
	$: loadSchedule(settingsSemester, currentMonday);

	$: hiddenItemsTitleHint = filteredHiddenPeriods.length > 0 ? ` (${filteredHiddenPeriods.length})` : "";

	async function loadSemesters(departmentCode: string, academicYear: number) {
		loadingSemesters = true;
		promisedSemesters = getSemesters(departmentCode, academicYear);
		promisedSemesters.then(() => (loadingSemesters = false));
	}

	async function loadSchedule(semester: Semester, weekStart: Temporal.PlainDate) {
		if (schedule && scheduleIsFor(schedule, semester, weekStart)) {
			return;
		}

		loadingSchedule = true;

		let promise = getSemesterSchedule(semester, weekStart);
		promise.then(() => (loadingSchedule = false));

		schedule = await promise;
		selectedPeriod = null;
	}

	function scheduleIsFor(schedule: PageSchedule, semester: Semester, weekStart: Temporal.PlainDate): boolean {
		return (
			schedule.for.semester.subdepartment === semester.subdepartment &&
			schedule.for.semester.semester === semester.semester &&
			schedule.for.weekStart.equals(weekStart)
		);
	}

	function resetWeek() {
		currentMonday = thisMonday();
	}

	function cycleWeek(delta: number) {
		currentMonday = currentMonday.add({ days: delta * 7 });
	}

	function resetSettings() {
		currentSettings = defaultSettings;
	}

	function manualSave() {
		saveSettings(currentSettings);
	}

	function filterHiddenPeriods(
		items: ClassPeriodIdentifier[],
		subdepartment: string,
		academicYear: number,
	): ClassPeriodIdentifier[] {
		return items.filter(
			items =>
				items.semester.subdepartment === normalizeDepartment(subdepartment) &&
				items.academicYear === academicYear,
		);
	}

	function hidePeriod(classPeriod: ClassPeriod) {
		if (selectedPeriod === classPeriod) {
			selectedPeriod = null;
		}

		allHiddenPeriods.push(toIdentifier(classPeriod, currentSettings.semester, currentAcademicYear));
		allHiddenPeriods = allHiddenPeriods;
	}

	function unhidePeriod(toUnhide: ClassPeriodIdentifier) {
		allHiddenPeriods = allHiddenPeriods.filter(hidden => !identifierEquals(hidden, toUnhide));
	}
</script>

<svelte:head>
	<title>TVZ Schedule</title>
</svelte:head>

<div class="container">
	<div class="panel panel--calendar">
		<div class="panel--calendar__controls">
			<!-- prettier-ignore -->
			<div class="control-group">
				<button class="btn" on:click={() => cycleWeek(-3)} disabled={loadingSchedule}>&lt;&lt;&lt;</button>
				<button class="btn" on:click={() => cycleWeek(-2)} disabled={loadingSchedule}>&lt;&lt;</button>
				<button class="btn" on:click={() => cycleWeek(-1)} disabled={loadingSchedule}>&lt;</button>
			</div>

			<button
				class="date-button"
				title="Go back to current week"
				on:click={resetWeek}
				disabled={loadingSchedule}
			>
				{dateToStringHr(currentMonday)} - {dateToStringHr(currentMonday.add({ days: 4 }))}
			</button>

			<!-- prettier-ignore -->
			<div class="control-group">
				<button class="btn" on:click={() => cycleWeek(1)} disabled={loadingSchedule}>&gt;</button>
				<button class="btn" on:click={() => cycleWeek(2)} disabled={loadingSchedule}>&gt;&gt;</button>
				<button class="btn" on:click={() => cycleWeek(3)} disabled={loadingSchedule}>&gt;&gt;&gt;</button>
			</div>
		</div>

		<Timetable
			{schedule}
			hiddenPeriods={filteredHiddenPeriods}
			from={currentMonday}
			bind:selectedPeriod
			bind:previewedPeriod
		/>
	</div>

	<div class="panel panel--info-preview"></div>

	<div class="panel panel--info-selected">
		<ClassPeriodInfo
			classPeriod={selectedPeriod ?? previewedPeriod}
			hide={hidePeriod}
		>
			<p class="description">Hover over an item or click on it. Details about it items will appear here.</p>
		</ClassPeriodInfo>
	</div>

	<div class="panel panel--options">
		<Tabs>
			<Tab title="Schedule picker">
				<DepartmentPicker
					departments={availableDepartments}
					bind:selectedDepartmentCode={currentSettings.departmentCode}
					disabled={loadingSemesters}
				/>
				<SemesterPicker
					{promisedSemesters}
					bind:selectedSemester={currentSettings.semester}
					disabled={loadingSchedule}
				/>
			</Tab>

			<Tab title="Settings">
				<div class="settings-controls">
					<div>
						<input
							type="checkbox"
							name="autosave"
							bind:checked={currentSettings.autoSave}
						/>
						<label for="autosave">Auto-save</label>
					</div>

					<!-- prettier-ignore -->
					<button class="btn" on:click={manualSave}>Save settings</button>
					<!-- prettier-ignore -->
					<button class="btn" on:click={resetSettings}>Reset settings</button>

					<p>
						Settings include the selected department and semester as well as user-set overrides (added in a
						future version).
					</p>
				</div>
			</Tab>

			<Tab title="Hidden items {hiddenItemsTitleHint}">
				<HiddenPeriodsList
					hiddenItems={filteredHiddenPeriods}
					onUnhideItem={unhidePeriod}
				/>
			</Tab>

			<Tab title="About">About</Tab>
		</Tabs>
	</div>
</div>

<style lang="scss">
	.container {
		max-width: 1600px;
		margin: 0 auto;

		display: grid;
		grid-template-columns: 4fr 1fr;
		grid-auto-rows: 1fr 1fr auto;
		grid-template-areas: "calendar info-preview" "calendar info-selected" "options options";
		gap: 1rem;
	}

	.panel {
		background-color: var(--clr-panel-bg);
		border: 1px solid var(--clr-panel-border);
		border-radius: 0.5rem;
	}

	.panel--calendar {
		grid-area: calendar;

		display: grid;
		grid-template-rows: auto 1fr;

		&__controls {
			display: flex;
			justify-content: center;
			gap: 3rem;
			padding: 0.5rem;
		}
	}

	.control-group {
		display: flex;
		gap: 1rem;
	}

	.date-button {
		background-color: transparent;
		border: none;

		font-weight: 600;
		cursor: pointer;
		position: relative;

		&::after {
			content: "";
			position: absolute;
			inset: auto 0 0 0;
			height: 0.125rem;
			border-radius: 100px;

			background-color: var(--clr-element-border);
			transition: height 100ms ease-out;
		}

		&:disabled::after {
			opacity: 0.75;
		}

		&:enabled:hover::after {
			height: 0.25rem;
		}
	}

	.panel--info-selected {
		grid-area: info-selected;
		padding: 1rem;
	}

	.panel--info-preview {
		grid-area: info-preview;
		padding: 1rem;
	}

	.panel--options {
		grid-area: options;
		background-color: transparent;
		border: none;
	}

	.description {
		font-style: italic;
	}

	.settings-controls {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 1rem;
	}
</style>
