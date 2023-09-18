<script lang="ts">
	import type { Temporal } from "@js-temporal/polyfill";
	import { browser } from "$app/environment";

	import { fetchScheduleWeek, parseSchedule, fetchSemesters, parseSemesters, type Semester, type Schedule, type ClassPeriod } from "$lib/api";
	import { dateToStringHR, getAcademicYear, thisMonday } from "$lib/util/helpers";

	import ClassPeriodInfo from "$lib/components/ClassPeriodInfo.svelte";
	import Calendar from "$lib/components/Calendar.svelte";
	import DepartmentPicker from "$lib/components/DepartmentPicker.svelte";
	import { Tab, Tabs } from "$lib/components/tabs/";
	import SemesterPicker from "$lib/components/SemesterPicker.svelte";
	import { defaultSettings, loadSettings, saveSettings, type Settings } from "$lib/settings";

	import { applyOverrides } from "$lib/overrides";
	import builtinOverrides from "$overrides/all";

	let currentSettings: Settings = browser ? loadSettings() : defaultSettings;
	let autoSavePrevious = currentSettings.autoSave;

	$: {
		if (browser && (currentSettings.autoSave || autoSavePrevious)) {
			saveSettings(currentSettings);
			autoSavePrevious = currentSettings.autoSave;
		}
	}

	let availableSemesters: Semester[] = [];
	let schedule: Schedule | null = null;
	let currentMonday = thisMonday();

	$: loadSemesters(currentSettings.departmentCode);
	$: loadSchedule(currentMonday, currentSettings.semester, currentSettings.useBuiltinOverrides);

	let selectedPeriod: ClassPeriod | null = null;
	let previewedPeriod: ClassPeriod | null = null;

	async function loadSemesters(departmentCode: string) {
		if (browser) {
			const res = await fetchSemesters(departmentCode, getAcademicYear(currentMonday));
			availableSemesters = parseSemesters(res);
		}
	}

	async function loadSchedule(weekStart: Temporal.PlainDate, semester: Semester | null, useBuiltinOverrides: boolean) {
		if (browser && semester) {
			const res = await fetchScheduleWeek(semester.subdepartment, semester.semester, weekStart);

			let scheduleTemp = parseSchedule(res);

			if (useBuiltinOverrides) {
				scheduleTemp = applyOverrides(scheduleTemp, getAcademicYear(weekStart), semester, builtinOverrides);
			}

			schedule = scheduleTemp;
		}
	}

	function resetWeek() {
		currentMonday = thisMonday();
	}

	function cycleWeek(e: MouseEvent) {
		const element = e.currentTarget as HTMLButtonElement;
		currentMonday = currentMonday.add({ days: Number(element.dataset.delta) * 7 });
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
			<div class="control-group">
				<button class="btn" data-delta="-3" on:click={cycleWeek}>&lt;&lt;&lt;</button>
				<button class="btn" data-delta="-2" on:click={cycleWeek}>&lt;&lt;</button>
				<button class="btn" data-delta="-1" on:click={cycleWeek}>&lt;</button>
			</div>

			<button class="date-button" title="Go back to current week" on:click={resetWeek}>{dateToStringHR(currentMonday)} - {dateToStringHR(currentMonday.add({ days: 4 }))}</button>

			<div class="control-group">
				<button class="btn" data-delta="1" on:click={cycleWeek}>&gt;</button>
				<button class="btn" data-delta="2" on:click={cycleWeek}>&gt;&gt;</button>
				<button class="btn" data-delta="3" on:click={cycleWeek}>&gt;&gt;&gt;</button>
			</div>
		</div>

		<Calendar {schedule} from={currentMonday} bind:selectedPeriod bind:previewedPeriod />
	</div>

	<div class="panel panel--info-preview">
		<ClassPeriodInfo classPeriod={previewedPeriod}>
			<p class="description">Put your mouse over an item in the calendar and details about it will appear here.</p>
		</ClassPeriodInfo>
	</div>

	<div class="panel panel--info-selected">
		<ClassPeriodInfo classPeriod={selectedPeriod}>
			<p class="description">Click on an item in the calendar to select it and details about it will show in here.</p>
		</ClassPeriodInfo>
	</div>

	<div class="panel panel--options">
		<Tabs>
			<Tab title="Schedule picker">
				<DepartmentPicker bind:departmentCode={currentSettings.departmentCode} />
				<SemesterPicker {availableSemesters} bind:semester={currentSettings.semester} />
			</Tab>

			<Tab title="Settings">
				<div class="settings-controls">
					<div>
						<input type="checkbox" name="use-builtin-overrides" bind:checked={currentSettings.useBuiltinOverrides}>
						<label for="use-builtin-overrides">Use built-in overrides</label>
					</div>
					<div>
						<input type="checkbox" name="autosave" bind:checked={currentSettings.autoSave}>
						<label for="autosave">Auto-save</label>
					</div>
					<button class="btn" on:click={manualSave}>Save settings</button>
					<button class="btn" on:click={resetSettings}>Reset settings</button>
					<p>Settings include the selected department and semester as well as user-set overrides (added in a future version).</p>
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

		&:hover::after {
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
