<script lang="ts">
	import { getBlankSchedule } from "$lib/api";
	import { getCustomSchedule } from "$lib/api/customSchedule";
	import CalendarViewer, { type ScheduleFilter, type ScheduleLoader } from "$lib/components/CalendarViewer.svelte";
	import TemporaryNavigation from "$lib/components/TemporaryNavigation.svelte";
	import { Tabs } from "$lib/components/tabs";
	import Tab from "$lib/components/tabs/Tab.svelte";
	import type { ClassPeriod, Schedule } from "$lib/models/api";
	import type { ScheduleFetchRule, ScheduleFilterRule } from "$lib/models/scheduleQuery";
	import { parseQuery } from "$lib/services/scheduleQuery";
	import type { Temporal } from "@js-temporal/polyfill";

	let queryInput: string = "";
	$: [scheduleFetchQuery, scheduleFilterQuery] = parseQuery(queryInput);

	$: if (scheduleFetchQuery) {
		createLoader(scheduleFetchQuery);
	}

	$: if (scheduleFilterQuery) {
		createFilter(scheduleFilterQuery);
	}

	let isScheduleLoading = false;

	let scheduleLoader: ScheduleLoader;
	scheduleLoader = () => getBlankSchedule();

	let scheduleFilter: ScheduleFilter;
	scheduleFilter = s => s;

	function createLoader(fetchQuery: ScheduleFetchRule[]) {
		scheduleLoader = (weekStart: Temporal.PlainDate) => {
			isScheduleLoading = true;

			const promise = getCustomSchedule(fetchQuery, weekStart);
			promise.then(() => (isScheduleLoading = false));

			return promise;
		};
	}

	function createFilter(filterQuery: ScheduleFilterRule[]) {
		scheduleFilter = (schedule: Schedule): Schedule => {
			// prettier-ignore
			const filteredPeriodPairs = [...schedule.periods.entries()]
				.filter(([_, classPeriod]) => passesAllFilters(classPeriod, filterQuery));

			return {
				periods: new Map(filteredPeriodPairs),
				holidays: schedule.holidays,
			};
		};

		function passesAllFilters(classPeriod: ClassPeriod, filters: ScheduleFilterRule[]): boolean {
			return filters.every(filter => {
				if (Object.hasOwn(classPeriod, filter.field)) {
					const value = (classPeriod as unknown as Record<string, unknown>)[filter.field];

					if (typeof value === "string") {
						return value.includes(filter.value);
					} else {
						// prettier-ignore
						console.log(`Can only filter by string values. Found non-string value in field '${filter.field}'.`);
						return true;
					}
				} else {
					console.log(`Unknown classPeriod field '${filter.field}'. Ignoring.`);
					return true;
				}
			});
		}
	}

	function onHidePeriod(_classPeriod: ClassPeriod) {}

	function setQuery(queryString: string) {
		queryInput = queryString;
	}

	const examples = [
		"semester:PRIN-4",
		"## Davor Cafuta, Dunja Bjelobrk Knežević\nprof:datar:d41018c10e02845c8df0b26a14b474cc\nprof:dbjelobr:f8abccb17b3f898ebf234a26651a7c78",
	];
</script>

<CalendarViewer
	{scheduleLoader}
	{scheduleFilter}
	{onHidePeriod}
>
	<TemporaryNavigation slot="aside" />

	<svelte:fragment slot="below">
		<Tabs>
			<Tab title="Schedule picker">
				<!-- prettier-ignore -->
				<section class="schedule-picker">
					<h2>Multi-schedule query</h2>

					<textarea
						bind:value={queryInput}
						contenteditable="true"
						class:error={scheduleFetchQuery === null && queryInput !== ""}
					></textarea>
				</section>
			</Tab>

			<Tab title="Instruction">
				<section class="instructions">
					<h1 class="sr-only">Instructions</h1>
					<p>
						The multi-schedule query consists of multiple "rules" - one per line - of which there's 2 types:
						fetch and filter rules. Everything after a <code>##</code> until the end of the line is ignored.
					</p>
					<p>The following rules exist (<code>&lt;&gt;</code> denotes a parameter):</p>

					<section>
						<h2 class="rule monospace">semester:&lt;semester code&gt;</h2>
						<p>
							Gets the schedule for the specified semester code - such as <code>PRIN-4</code>,
							<code>ELO|ELO ABC-2</code>, <code>IID-6</code>, <code>SPECRAC1-1</code> etc.
						</p>
					</section>

					<section>
						<h2 class="rule monospace">subject:&lt;subject ID&gt;</h2>
						<p>
							Gets the schedule for the given subject ID. You can get the subject ID from the URL on
							moj.tvz.hr.
						</p>
					</section>

					<section>
						<h2 class="rule monospace">prof:&lt;username&gt;:&lt;hash&gt;</h2>
						<p>
							Gets the schedule for the specified professor. Getting the username and hash is a little
							tricky, so I've created this <a href="TODO">bookmarklet</a> to aid with that. Put the bookmarklet
							into your bookmarks and run it on a professor's schedule page. It will extract the needed parameters
							and show them in a popup.
						</p>
						<p>
							What is that hash? I don't know, but the API requires it. Cafuta programmed this after all.
						</p>
					</section>

					<section>
						<h2 class="rule monospace">filter:&lt;field&gt;:&lt;value&gt;</h2>
						<p>
							Filters all schedule items by the specified value in the specified field. This performs a
							simple substring search. Available fields: courseNames, className, professor, classroom,
							group, note and more.
						</p>
					</section>
				</section>
			</Tab>

			<Tab title="Example queries">
				<div class="examples">
					{#each examples as example}
						<button
							class="example-btn monospace"
							on:click={() => setQuery(example)}
							disabled={isScheduleLoading}
						>
							{example}
						</button>
					{/each}
				</div>
			</Tab>
		</Tabs>
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

	.instructions {
		max-width: 100ch;

		* + * {
			margin-top: 1rem;
		}

		* + section {
			margin-top: 2rem;
		}
	}

	.examples {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		gap: 2rem;
	}

	.example-btn {
		background-color: transparent;
		border: none;

		border-radius: 0.25rem;
		padding: 0.5rem;

		text-align: left;
		white-space: pre;
		cursor: pointer;
		transition: background-color 100ms ease-out;

		&:hover {
			background-color: var(--clr-element);
		}
	}

	.rule {
		border: 1px solid var(--clr-element);
		border-left: 0.375rem solid var(--clr-element-border);

		width: fit-content;
		padding: 0.25rem 0.5rem;
	}
</style>
