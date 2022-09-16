<script lang="ts">
	import fetchSchedule from "$lib/fetchSchedule";
	import parseSchedule from "$lib/apiParser";
	import type { ClassPeriod, Schedule } from "$lib/types/api";
	import ClassPeriodInfo from "$lib/ClassPeriodInfo.svelte";
	import Calendar from "$lib/Calendar.svelte";
	import { Temporal } from "@js-temporal/polyfill";

	let schedule: Schedule | null = null;
	let from = Temporal.PlainDate.from("2022-06-06");
	let to = Temporal.PlainDate.from("2022-06-12");

	let selectedPeriod: ClassPeriod | null = null;
	let previewedPeriod: ClassPeriod | null = null;

	async function fetch() {
		let apiResult = await fetchSchedule("RAC", 2, from, to);
		schedule = parseSchedule(apiResult);
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
