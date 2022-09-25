<script lang="ts">
	import { Temporal } from "@js-temporal/polyfill";
	import CalendarItem from "./CalendarItem.svelte";
	import { dateToStringHR, segregatePeriods as segregateItems, workdaysFilterByDate } from "./helpers";
	import type { ClassPeriod, Holiday, Schedule } from "./types/api";

	const fromHour = 7;
	const toHour = 22;
	const hourRange = toHour - fromHour;

	export let onPeriodSelect: (e: MouseEvent) => void;
	export let onPeriodPreview: (e: MouseEvent) => void;
	export let onPeriodPreviewNone: () => void;

	export let schedule: Schedule | null;
	export let from: Temporal.PlainDate;
	let calendarDays: (ClassPeriod[] | Holiday | null)[] = [null, null, null, null, null];

	$: {
		if (schedule) {
			let newDays: (ClassPeriod[] | Holiday | null)[] = [];
			let d = from;

			for (let i = 0; i < 5; i++) {
				const ds = d.toString({ calendarName: "never" });

				if (schedule.holidays.has(ds)) {
					newDays.push(schedule.holidays.get(ds)!);
				} else {
					newDays.push(workdaysFilterByDate(schedule, d));
				}

				d = d.add(new Temporal.Duration(0, 0, 0, 1)); // +1 day
			}

			calendarDays = newDays;
		}
	}
</script>

<div class="calendar" style="--from-hour: {fromHour}; --to-hour: {toHour}; --hour-range: {hourRange}">
	{#each ["Time", "Pon", "Uto", "Sri", "Čet", "Pet"] as title}
		<div class="calendar__header">
			{title}
		</div>
	{/each}

	{#each [...Array(hourRange).keys()].map(x => x) as i}
		<div class="calendar__timestamp" style="grid-row: {2 + i}">
			{i + 7}:00
		</div>
	{/each}

	{#each [...Array(hourRange).keys()] as i}
		<div class="calendar__dashed-line" style="grid-row: {2 + i}"></div>
	{/each}

	{#each calendarDays as day, i}
		<div class="calendar__day" style="grid-column: {i + 2}">
			{#if day}
				{#if "title" in day}
					<p class="calendar__holiday">
						{ dateToStringHR(day.date) }
						<br />
						{ day.title }
					</p>
				{:else}
					{#each segregateItems(day) as item}
						<CalendarItem classPeriod={item} on:click={onPeriodSelect} on:mouseenter={onPeriodPreview} on:mouseleave={onPeriodPreviewNone} />
					{/each}
				{/if}
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.calendar {
		display: grid;
		grid-template-columns: auto repeat(5, 1fr);
		grid-template-rows: auto repeat(var(--hour-range), minmax(60px, 1fr));
	}

	.calendar__header {
		grid-row: 1;

		padding: 0.5rem;
		border-right: 1px solid #444;
		border-bottom: 1px solid #444;

		text-align: center;
		font-weight: 600;
	}

	.calendar__timestamp {
		grid-column: 1;

		border-right: 1px solid #444;
		padding-right: 0.2rem;

		text-align: right;
	}

	.calendar__dashed-line {
		grid-column: 1 / -1;
		border-bottom: 1px dashed #444;
	}

	.calendar__day {
		grid-row: 2 / -1;
		border-right: 1px solid #444;
		
		display: grid;
		grid-auto-columns: 1fr;
	}
	
	.calendar__holiday {
		place-self: center;
		text-align: center;
		font-weight: 600;
		color: #f3361d;
	}
</style>
