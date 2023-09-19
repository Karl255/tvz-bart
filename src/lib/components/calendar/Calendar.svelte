<script lang="ts">
	import { Temporal } from "@js-temporal/polyfill";
	import type { ClassPeriod, Holiday, Schedule } from "$lib/api";
	import { dateToStringHR, segregatePeriods as segregateItems, workdaysFilterByDate } from "$lib/util/helpers";
	import CalendarItem from "./CalendarItem.svelte";

	const fromHour = 7;
	const toHour = 22;
	const hourRange = toHour - fromHour;

	export let selectedPeriod: ClassPeriod | null;
	export let previewedPeriod: ClassPeriod | null;

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

<!-- prettier-ignore -->
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

	{#each [...Array(hourRange - 1).keys()] as i}
		<div class="calendar__dashed-line" style="grid-row: {3 + i}"></div>
	{/each}

	{#key schedule}
		{#each calendarDays as day, i}
			<div class="calendar__day" style="grid-column: {i + 2}">
				{#if day}
					{#if "title" in day}
						<p class="calendar__holiday">
							{dateToStringHR(day.date)}
							<br />
							{day.title}
						</p>
					{:else}
						{#each segregateItems(day) as item}
							<CalendarItem
								classPeriod={item}
								on:click={onPeriodSelect}
								on:mouseenter={onPeriodPreview}
								on:mouseleave={onPeriodPreviewNone}
							/>
						{/each}
					{/if}
				{/if}
			</div>
		{/each}
	{/key}
</div>

<style lang="scss">
	.calendar {
		display: grid;
		grid-template-columns: auto repeat(5, 1fr);
		grid-template-rows: auto repeat(var(--hour-range), minmax(60px, 1fr));
		--gridline-color: var(--clr-panel-border);
	}

	.calendar__header {
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

	.calendar__timestamp {
		grid-column: 1;
		padding-right: 0.25rem;
		text-align: right;
	}

	.calendar__dashed-line {
		grid-column: 1 / -1;
		border-top: 1px dashed var(--gridline-color);
	}

	.calendar__day {
		grid-row: 2 / -1;
		border-left: 1px solid var(--gridline-color);

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
