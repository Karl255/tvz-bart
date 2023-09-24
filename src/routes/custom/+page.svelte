<script lang="ts">
	import { getBlankSchedule } from "$lib/api";
	import { getCustomSchedule } from "$lib/api/customSchedule";
	import CalendarViewer, { type ScheduleFilter, type ScheduleLoader } from "$lib/components/CalendarViewer.svelte";
	import Tab from "$lib/components/tabs/Tab.svelte";
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
		<h2>Multi-schedule query</h2>

		<textarea
			bind:value={queryInput}
			contenteditable="true"
			class:error={scheduleMultiQuery === null}
		></textarea>
	</section>

	<svelte:fragment slot="tabs">
		<Tab title="How to use">
			<p>The multi-schedule query consists of multiple rules, one per line. These are all existing rules:</p>
			<ul class="monospace">
				<li>semester:&lt;semester code&gt;</li>
				<li>subject:&lt;subjectId&gt;</li>
				<li>user:&lt;username&gt;:&lt;hash&gt;</li>
			</ul>

			<p>Examples:</p>
			<p class="example monospace">semester:PRIN-4</p>
			<p class="example monospace">
				user:datar:d41018c10e02845c8df0b26a14b474cc<br />
				user:zkovacev1:5bc68e965457ff369dff510e8ccbcea5
			</p>
		</Tab>
	</svelte:fragment>
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

	.monospace {
		font-family: monospace;
	}

	.example {
		border-left: 4px solid var(--clr-panel-border);
		margin-left: 0.25rem;
		padding-left: 0.75rem;

		margin-block: 0.5rem;
		padding-block: 0.25rem;
	}
</style>
