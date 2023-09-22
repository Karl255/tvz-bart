<script lang="ts">
	import type { Temporal } from "@js-temporal/polyfill";

	import {
		getSemesters,
		getWeekSchedule,
		type ClassPeriod,
		type Department,
		type Schedule,
		type Semester,
	} from "$lib/api";
	import { dateToStringHr, getAcademicYear, thisMonday } from "$lib/util/datetime-helpers";

	import ClassPeriodInfo from "$lib/components/ClassPeriodInfo.svelte";
	import DepartmentPicker from "$lib/components/DepartmentPicker.svelte";
	import SemesterPicker from "$lib/components/SemesterPicker.svelte";
	import { Tab, Tabs } from "$lib/components/tabs/";
	import { Timetable } from "$lib/components/timetable";
	import { defaultSettings, loadSettings, saveSettings, type Settings } from "$lib/settings";

	import type { LoadedData } from "./+page";

	export let data: LoadedData;

	let currentSettings: Settings = loadSettings();
	let autoSavePrevious = currentSettings.autoSave;

	let currentMonday = thisMonday();
	let availableDepartments: Department[] = data.departments;

	let promisedSemesters: Promise<Semester[]> = getSemesters(
		currentSettings.departmentCode,
		getAcademicYear(currentMonday),
	);

	let schedule: Schedule | null = null;

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
	$: loadSchedule(currentMonday, settingsSemester);

	async function loadSemesters(departmentCode: string, academicYear: number) {
		loadingSemesters = true;
		promisedSemesters = getSemesters(departmentCode, academicYear);
		promisedSemesters.then(() => (loadingSemesters = false));
	}

	async function loadSchedule(weekStart: Temporal.PlainDate, semester: Semester) {
		loadingSchedule = true;

		let promise = getWeekSchedule(semester.subdepartment, semester.semester, weekStart);
		promise.then(() => (loadingSchedule = false));

		schedule = await promise;
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
			from={currentMonday}
			bind:selectedPeriod
			bind:previewedPeriod
		/>
	</div>

	<div class="panel panel--info-preview"></div>

	<div class="panel panel--info-selected">
		<ClassPeriodInfo classPeriod={selectedPeriod ?? previewedPeriod}>
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
