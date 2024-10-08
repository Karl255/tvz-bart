<script lang="ts">
	import { segregatePeriods, periodsFilterByDate } from "$lib/components/timetable/timetable";
	import type { ClassPeriod, Holiday, Schedule } from "$lib/models/api";
	import { dateToStringHr } from "$lib/util/datetime-helpers";
	import { Temporal } from "@js-temporal/polyfill";
	import TimetableItem from "./TimetableItem.svelte";

	const fromHour = 7;
	const toHour = 22;
	const hourRange = toHour - fromHour;

	export let selectedPeriod: ClassPeriod | null = null;
	export let previewedPeriod: ClassPeriod | null = null;

	export let schedule: Schedule | null;
	export let from: Temporal.PlainDate;

	let days = 5;

	let timetableDays: (ClassPeriod[] | Holiday | null)[] = Array(days).map(() => null);

	$: {
		if (schedule) {
			createDays(schedule);
		} else {
			timetableDays = Array(days).map(() => null);
		}
	}

	function createDays(s: Schedule) {
		let newDays: (ClassPeriod[] | Holiday | null)[] = [];
		let d = from;

		for (let i = 0; i < days; i++) {
			const ds = d.toString({ calendarName: "never" });

			if (s.holidays.has(ds)) {
				newDays.push(s.holidays.get(ds)!);
			} else {
				newDays.push(periodsFilterByDate([...s.periods.values()], d));
			}

			d = d.add(new Temporal.Duration(0, 0, 0, 1)); // +1 day
		}

		timetableDays = newDays;
	}

	function selectPeriod(classPeriod: ClassPeriod | null) {
		selectedPeriod = classPeriod;
	}

	function previewPeriod(classPeriod: ClassPeriod | null) {
		previewedPeriod = classPeriod;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- prettier-ignore -->
<div
	class="timetable"
	style:--days={days}
	style:--from-hour={fromHour}
	style:--to-hour={toHour}
	style:--hour-range={hourRange}
	on:click={() => selectPeriod(null)}
>
	{#each ["Vrijeme", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"] as title, index}
		{#if index <= days}
			<div class="timetable__header" class:relative={index === days}>
				{title}
				
				{#if index === days}
					<button class="btn show-saturday" on:click={() => (days = days == 5 ? 6 : 5)}>
						{days == 5 ? ">>" : "<<"}
					</button>
				{/if}
			</div>
		{/if}
	{/each}

	{#each [...Array(hourRange).keys()].map(x => x) as i}
		<div class="timetable__timestamp" style:grid-row={2 + i}>
			{i + 7}:00
		</div>
	{/each}

	{#each [...Array(hourRange - 1).keys()] as i}
		<div class="timetable__dashed-line" style:grid-row={3 + i}></div>
	{/each}

	{#key schedule}
		{#each timetableDays as day, i}
			<div class="timetable__day" style:grid-column={i + 2}>
				{#if day}
					{#if "title" in day}
						<p class="timetable__holiday">
							{dateToStringHr(day.date)}
							<br />
							{day.title}
						</p>
					{:else}
						{#each segregatePeriods(day) as item (item)}
							<TimetableItem
								classPeriod={item}
								onSelect={() => selectPeriod(item)}
								selected={item.id === selectedPeriod?.id}
								on:mouseenter={() => previewPeriod(item)}
								on:mouseleave={() => previewPeriod(null)}
							/>
						{/each}
					{/if}
				{/if}
			</div>
		{/each}
	{/key}
</div>

<style lang="scss">
	.timetable {
		display: grid;
		grid-template-columns: auto repeat(var(--days), 1fr);
		grid-template-rows: auto repeat(var(--hour-range), minmax(60px, 1fr));
		--gridline-color: var(--clr-panel-border);
	}

	.timetable__header {
		grid-row: 1;

		padding: 0.5rem;
		border-top: 1px solid var(--gridline-color);
		border-bottom: 1px solid var(--gridline-color);

		text-align: center;
		font-weight: 600;

		& + & {
			border-left: 1px solid var(--gridline-color);
		}
	}

	.timetable__timestamp {
		grid-column: 1;
		padding-right: 0.25rem;
		text-align: right;
	}

	.timetable__dashed-line {
		grid-column: 1 / -1;
		border-top: 1px dashed var(--gridline-color);
	}

	.timetable__day {
		grid-row: 2 / -1;
		border-left: 1px solid var(--gridline-color);

		display: grid;
		grid-auto-columns: 1fr;
	}

	.timetable__holiday {
		place-self: center;
		text-align: center;
		font-weight: 600;
		color: #f3361d;
	}

	.show-saturday {
		position: absolute;
		right: 4px;
		top: 50%;
		translate: 0 -50%;

		font-weight: normal;
	}

	.relative {
		position: relative;
	}
</style>
