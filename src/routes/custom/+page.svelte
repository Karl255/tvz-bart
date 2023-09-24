<script lang="ts">
	import { getBlankSchedule } from "$lib/api";
	import { getCustomSchedule } from "$lib/api/customSchedule";
	import CalendarViewer, { type ScheduleFilter, type ScheduleLoader } from "$lib/components/CalendarViewer.svelte";
	import type { ClassPeriod } from "$lib/models/api";
	import type { ScheduleQuery } from "$lib/models/scheduleQuery";
	import { parseMultiScheduleQuery } from "$lib/services/scheduleQuery";
	import type { Temporal } from "@js-temporal/polyfill";

	let queryInput: string;
	$: scheduleMultiQuery = parseMultiScheduleQuery(queryInput);
	$: if (scheduleMultiQuery !== null) {
		createLoader(scheduleMultiQuery);
	}

	let scheduleLoader: ScheduleLoader;
	scheduleLoader = () => getBlankSchedule();

	let scheduleFilter: ScheduleFilter;
	scheduleFilter = s => s;

	function createLoader(multiQuery: ScheduleQuery[]) {
		scheduleLoader = (weekStart: Temporal.PlainDate) => getCustomSchedule(multiQuery, weekStart);
	}

	function onHidePeriod(_classPeriod: ClassPeriod) {}
</script>

<CalendarViewer
	{scheduleLoader}
	{scheduleFilter}
	{onHidePeriod}
>
	<!-- prettier-ignore -->
	<section slot="schedule-picker" class="schedule-picker">
		<h2>Schedule query</h2>

		<textarea
			bind:value={queryInput}
			contenteditable="true"
			class:error={scheduleMultiQuery === null}
		></textarea>
	</section>
</CalendarViewer>

<style lang="scss">
	.schedule-picker > * {
		margin-bottom: 1rem;
	}

	textarea {
		min-height: 8rem;
		min-width: 32rem;
	}

	.error {
		border-color: red;
	}
</style>
