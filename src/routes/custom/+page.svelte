<script lang="ts">
	import { getBlankSchedule } from "$lib/api";
	import { getCustomSchedule } from "$lib/api/customSchedule";
	import CalendarViewer, { type ScheduleFilter, type ScheduleLoader } from "$lib/components/CalendarViewer.svelte";
	import TemporaryNavigation from "$lib/components/TemporaryNavigation.svelte";
	import { Tabs } from "$lib/components/tabs";
	import Tab from "$lib/components/tabs/Tab.svelte";
	import type { ClassPeriod } from "$lib/models/api";
	import type { ScheduleQuery } from "$lib/models/scheduleQuery";
	import { parseQuery } from "$lib/services/scheduleQuery";
	import type { Temporal } from "@js-temporal/polyfill";

	let queryInput: string = "";
	$: query = parseQuery(queryInput);
	$: if (query !== null) {
		createLoader(query);
	}

	let isScheduleLoading = false;

	let scheduleLoader: ScheduleLoader;
	scheduleLoader = () => getBlankSchedule();

	let scheduleFilter: ScheduleFilter;
	scheduleFilter = s => s;

	function createLoader(multiQuery: ScheduleQuery[]) {
		scheduleLoader = (weekStart: Temporal.PlainDate) => {
			isScheduleLoading = true;

			const promise = getCustomSchedule(multiQuery, weekStart);
			promise.then(() => (isScheduleLoading = false));

			return promise;
		};
	}

	function onHidePeriod(_classPeriod: ClassPeriod) {}

	function setQuery(queryString: string) {
		queryInput = queryString;
	}

	const examples = [
		"semester:PRIN-4",
		"# Davor Cafuta, Žekljo Kovačević\nuser:datar:d41018c10e02845c8df0b26a14b474cc\nuser:zkovacev1:5bc68e965457ff369dff510e8ccbcea5",
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
						class:error={query === null && queryInput !== ""}
					></textarea>
				</section>
			</Tab>

			<Tab title="How to use">
				<section class="instructions">
					<h1>
						The multi-schedule query consists of multiple rules, one per line. Lines starting with <code
							>#</code
						> are ignored. The following rules exist:
					</h1>

					<section>
						<h2 class="h2 rule monospace">semester:&lt;semester code&gt;</h2>
					</section>

					<section>
						<h2 class="h2 rule monospace">subject:&lt;subject ID&gt;</h2>
						<p>You can get the subject ID from the URL on moj.tvz.hr</p>
					</section>

					<section>
						<h2 class="h2 rule monospace">user:&lt;username&gt;:&lt;hash&gt;</h2>
						<!-- prettier-ignore -->
						<p>
							Getting the username and hash is a little tricky, but I've created this <a href="TODO">bookmarklet</a>
							to aid with that. Put the bookmarklet into your bookmarks and run it on professor's schedule
							page. A popup will extract the parameters and give you the correct rule.
						</p>
						<p>
							What is that hash? I don't know, but the API requires it. Cafuta programmed this after all.
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
