<script
	lang="ts"
	context="module"
>
	export type ScheduleLoader = (weekStart: Temporal.PlainDate) => Promise<SourcedSchedule<BaseScheduleSource>>;
	export type ScheduleFilter = (schedule: Schedule) => Schedule;
</script>

<script lang="ts">
	import type { Temporal } from "@js-temporal/polyfill";

	import type { BaseScheduleSource, ClassPeriod, Schedule, SourcedSchedule } from "$lib/models/api";
	import { dateToStringHr, thisMonday } from "$lib/util/datetime-helpers";

	import ClassPeriodInfo from "$lib/components/ClassPeriodInfo.svelte";
	import { Tab, Tabs } from "$lib/components/tabs/";
	import { Timetable } from "$lib/components/timetable";
	import { loadSettings, saveSettings } from "$lib/services/settings";

	import { defaultSettings, type Settings } from "$lib/models/settings";

	export let scheduleLoader: ScheduleLoader;
	export let scheduleFilter: ScheduleFilter;
	export let onHidePeriod: (ClassPeriod: ClassPeriod) => void;

	// TODO: remove any persistance from this component
	let currentSettings: Settings = loadSettings();
	let autoSavePrevious = currentSettings.autoSave;

	export let currentMonday = thisMonday();

	let schedule: Schedule | null = null;
	let filteredSchedule: Schedule | null;
	$: filteredSchedule = schedule && scheduleFilter(schedule);

	let selectedPeriod: ClassPeriod | null = null;
	let previewedPeriod: ClassPeriod | null = null;

	$: ({ autoSave: settingsAutoSave } = currentSettings);

	$: {
		if (settingsAutoSave || autoSavePrevious) {
			saveSettings(currentSettings);
			autoSavePrevious = currentSettings.autoSave;
		}
	}

	export let loadingSchedule = false;

	$: loadSchedule(scheduleLoader, currentMonday);

	async function loadSchedule(scheduleLoader: ScheduleLoader, weekStart: Temporal.PlainDate) {
		loadingSchedule = true;

		let promise = scheduleLoader(weekStart);
		promise.then(() => (loadingSchedule = false));

		schedule = await promise;
		selectedPeriod = null;
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

	function hidePeriod(classPeriod: ClassPeriod) {
		if (selectedPeriod === classPeriod) {
			selectedPeriod = null;
		}

		onHidePeriod(classPeriod);
	}

	// function unhidePeriod(_toUnhide: ClassPeriodIdentifier<BaseScheduleSource>) {
	// 	allHiddenPeriods2 = allHiddenPeriods2.filter(hidden => !identifierEquals(hidden, toUnhide));
	// }
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
			schedule={filteredSchedule}
			from={currentMonday}
			bind:selectedPeriod
			bind:previewedPeriod
		/>
	</div>

	<div class="panel panel--aside">
		<slot name="aside" />
	</div>

	<div class="panel panel--info">
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
				<slot name="schedule-picker" />
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

			<slot name="tabs" />
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

	.panel--aside {
		grid-area: info-preview;
		padding: 1rem;
	}

	.panel--info {
		grid-area: info-selected;
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
