<script lang="ts">
	import fetchSchedule from "$lib/fetchSchedule";
	import parseSchedule from "$lib/apiParser";
	import type { Schedule } from "$lib/types/api";
	import ClassPeriodInfo from "$lib/ClassPeriodInfo.svelte";
	import Calendar from "$lib/Calendar.svelte";
	import { Temporal } from "@js-temporal/polyfill";

	let schedule: Schedule | null = null;
	let from = Temporal.PlainDate.from("2022-06-06");
	let to = Temporal.PlainDate.from("2022-06-12");

	$: infoSample = schedule?.workdays.values().next().value.values().next().value;

	async function fetch() {
		let apiResult = await fetchSchedule("RAC", 2, from, to);
		schedule = parseSchedule(apiResult);
	}
</script>

<svelte:head>
	<title>TVZ Schedule</title>
</svelte:head>

<div class="container">
	<div class="panel panel--calendar">
		<Calendar {schedule} {from} />
	</div>

	<div class="panel panel--info">
		<ClassPeriodInfo classPeriod={infoSample} />
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
		grid-auto-rows: auto;
		grid-template-areas: "calendar info" "options options";
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

	.panel--options {
		grid-area: options;
		padding: 1rem;
	}
</style>
