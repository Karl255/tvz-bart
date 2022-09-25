<script lang="ts">
	import fetchScheduleWeek from "$lib/fetcher";
	import parseSchedule from "$lib/apiParser";
	import type { ClassPeriod, Schedule } from "$lib/types/api";
	import ClassPeriodInfo from "$lib/ClassPeriodInfo.svelte";
	import Calendar from "$lib/Calendar.svelte";
	import { Temporal } from "@js-temporal/polyfill";
	import { getThisWeeksMonday } from "$lib/helpers";

	let schedule: Schedule | null = null;
	let today = Temporal.PlainDate.from("2022-06-09") //Temporal.Now.plainDateISO();
	$: from = getThisWeeksMonday(today);

	let selectedPeriod: ClassPeriod | null = null;
	let previewedPeriod: ClassPeriod | null = null;

	async function fetch() {
		let apiResult = await fetchScheduleWeek("RAC", 2, from);
		schedule = parseSchedule(apiResult);
	}

	function currentWeek() {
		today = Temporal.PlainDate.from("2022-06-09") //Temporal.Now.plainDateISO();
		fetch();
	}

	function cycleWeek(e: MouseEvent) {
		let element = e.currentTarget as HTMLButtonElement;
		from = from.add({ days: Number(element.dataset.delta) * 7 });
		fetch();
	}
	
	function onPeriodSelect(e: MouseEvent) {
		if (schedule) {
			let element = e.currentTarget as HTMLDivElement;
			selectedPeriod = schedule.workdays.get(Number(element.dataset.id))!;
		}
	}

	function onPeriodPreview(e: MouseEvent) {
		if (schedule) {
			let element = e.currentTarget as HTMLDivElement;
			previewedPeriod = schedule.workdays.get(Number(element.dataset.id))!;
		}
	}

	function onPeriodPreviewNone() {
		previewedPeriod = null;
	}
</script>

<svelte:head>
	<title>TVZ Schedule</title>
</svelte:head>

<div class="container">
	<div class="panel panel--calendar">
		<div class="panel--calendar__controls">
			<button data-delta="-3" on:click={cycleWeek}>&lt;&lt;&lt;</button>
			<button data-delta="-2" on:click={cycleWeek}>&lt;&lt;</button>
			<button data-delta="-1" on:click={cycleWeek}>&lt;</button>

			<button title="Go back to current week" on:click={currentWeek}>{from.toString()}</button>

			<button data-delta="1" on:click={cycleWeek}>&gt;</button>
			<button data-delta="2" on:click={cycleWeek}>&gt;&gt;</button>
			<button data-delta="3" on:click={cycleWeek}>&gt;&gt;&gt;</button>
		</div>
		
		<Calendar {schedule} {from} {onPeriodSelect} {onPeriodPreview} {onPeriodPreviewNone} />
	</div>

	<div class="panel panel--info">
		<ClassPeriodInfo classPeriod={selectedPeriod} />
	</div>

	<div class="panel panel--info-preview">
		<ClassPeriodInfo classPeriod={previewedPeriod} />
	</div>

	<div class="panel panel--options">
		<button on:click={fetch}>Get schedule</button>
	</div>
</div>

<style lang="scss">
	.container {
		max-width: 1280px;
		margin: 0 auto;

		display: grid;
		grid-template-columns: 3fr 1fr;
		grid-auto-rows: 1fr 1fr auto;
		grid-template-areas: "calendar info" "calendar info-preview" "options options";
		gap: 1rem;
	}

	.panel {
		border: 1px solid #444;
	}

	.panel--calendar {
		grid-area: calendar;

		display: grid;
		grid-template-rows: auto 1fr;

		&__controls {
			display: flex;
			justify-content: space-between;
			padding: 0.5rem;
		}
	}

	.panel--info {
		grid-area: info;
		padding: 1rem;
	}

	.panel--info-preview {
		grid-area: info-preview;
		padding: 1rem;
	}

	.panel--options {
		grid-area: options;
		padding: 1rem;
	}
</style>
