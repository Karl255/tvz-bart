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
	import { Timetable } from "$lib/components/timetable";

	export let scheduleLoader: ScheduleLoader;
	export let scheduleFilter: ScheduleFilter;
	export let onHidePeriod: (ClassPeriod: ClassPeriod) => void;

	export let currentMonday = thisMonday();

	let schedule: Schedule | null = null;
	let filteredSchedule: Schedule | null;
	$: filteredSchedule = schedule && scheduleFilter(schedule);

	let selectedPeriod: ClassPeriod | null = null;
	let previewedPeriod: ClassPeriod | null = null;

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

	function hidePeriod(classPeriod: ClassPeriod) {
		if (selectedPeriod === classPeriod) {
			selectedPeriod = null;
		}

		onHidePeriod(classPeriod);
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
			schedule={filteredSchedule}
			from={currentMonday}
			bind:selectedPeriod
			bind:previewedPeriod
		/>
	</div>

	{#if $$slots.aside}
		<div class="panel panel--aside">
			<slot name="aside" />
		</div>
	{/if}

	<div class="panel panel--info">
		<ClassPeriodInfo
			classPeriod={selectedPeriod ?? previewedPeriod}
			hide={hidePeriod}
		>
			<p class="description">
				Stavi miš na stavku u rasporedu ili klikni na nju i detalji će se prikazati ovdje.
			</p>
		</ClassPeriodInfo>
	</div>

	{#if $$slots.below}
		<div class="panel panel--options">
			<slot name="below" />
		</div>
	{/if}
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
</style>
