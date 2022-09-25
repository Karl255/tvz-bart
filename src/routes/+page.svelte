<script lang="ts">
	import fetchScheduleWeek from "$lib/scheduleFetcher";
	import parseSchedule from "$lib/scheduleParser";
	import type { ClassPeriod, Schedule } from "$lib/types/schedule";
	import ClassPeriodInfo from "$lib/ClassPeriodInfo.svelte";
	import Calendar from "$lib/Calendar.svelte";
	import { Temporal } from "@js-temporal/polyfill";
	import { dateToStringHR, getThisWeeksMonday } from "$lib/helpers";
	import { browser } from "$app/environment";
	import DepartmentPicker from "$lib/DepartmentPicker.svelte";

	let selectedPeriod: ClassPeriod | null = null;
	let previewedPeriod: ClassPeriod | null = null;

	let selectedDepartment: string = "RAC";
	let schedule: Schedule | null = null;
	let currentMonday = thisMonday();
	
	if (browser) {
		fetch(currentMonday, selectedDepartment);
	}

	async function fetch(weekStart: Temporal.PlainDate, department: string) {
		let apiResult = await fetchScheduleWeek(department, 2, weekStart);
		schedule = parseSchedule(apiResult);
	}

	function thisMonday() {
		return getThisWeeksMonday(Temporal.PlainDate.from("2022-06-09") /*Temporal.Now.plainDateISO()*/);
	}
	
	function resetWeek() {
		currentMonday = thisMonday();
		fetch(currentMonday, selectedDepartment);
	}

	function cycleWeek(e: MouseEvent) {
		let element = e.currentTarget as HTMLButtonElement;
		currentMonday = currentMonday.add({ days: Number(element.dataset.delta) * 7 });
		fetch(currentMonday, selectedDepartment);
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
	
	function onDepartmentPicked(d: string) {
		selectedDepartment = d;
		fetch(currentMonday, d);
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

			<button title="Go back to current week" on:click={resetWeek}>{dateToStringHR(currentMonday)}</button>

			<button data-delta="1" on:click={cycleWeek}>&gt;</button>
			<button data-delta="2" on:click={cycleWeek}>&gt;&gt;</button>
			<button data-delta="3" on:click={cycleWeek}>&gt;&gt;&gt;</button>
		</div>
		
		<Calendar {schedule} from={currentMonday} {onPeriodSelect} {onPeriodPreview} {onPeriodPreviewNone} />
	</div>

	<div class="panel panel--info">
		<ClassPeriodInfo classPeriod={selectedPeriod} />
	</div>

	<div class="panel panel--info-preview">
		<ClassPeriodInfo classPeriod={previewedPeriod} />
	</div>

	<div class="panel panel--options">
		<DepartmentPicker {onDepartmentPicked} />
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
