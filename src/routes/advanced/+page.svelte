<script lang="ts">
	import { getBlankSchedule } from "$lib/api";
	import { getCustomSchedule } from "$lib/api/customSchedule";
	import CalendarViewer, { type ScheduleFilter, type ScheduleLoader } from "$lib/components/CalendarViewer.svelte";
	import TemporaryNavigation from "$lib/components/TemporaryNavigation.svelte";
	import { Tabs } from "$lib/components/tabs";
	import Tab from "$lib/components/tabs/Tab.svelte";
	import { profRuleBookmarklet } from "$lib/constants/bookmarlets";
	import { examples } from "$lib/constants/customQueryExamples";
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
						return filter.values.some(acceptedValue => value.includes(acceptedValue));
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
</script>

<CalendarViewer
	{scheduleLoader}
	{scheduleFilter}
	{onHidePeriod}
>
	<TemporaryNavigation slot="aside" />

	<svelte:fragment slot="below">
		<Tabs>
			<Tab title="Upit">
				<!-- prettier-ignore -->
				<section class="schedule-picker">
					<h2 class="sr-only">Upit za raspored</h2>

					<textarea
						bind:value={queryInput}
						contenteditable="true"
						class:error={scheduleFetchQuery === null && queryInput !== ""}
						autocorrect="off"
					></textarea>
				</section>
			</Tab>

			<Tab title="Upute">
				<section class="instructions">
					<h1 class="sr-only">Upute</h1>
					<p>
						Upit se sastoji od jednog ili više 'izraza', od kojih ima dvije vrste: izrazi dohvaćanja i
						izrazi filtriranja. Sve nakon <code>##</code> se ignorira. Redoslijed je nebitan.
					</p>
					<p>Popis izraza (<code>&lt;&gt;</code> označuje parametar):</p>

					<section>
						<h2 class="rule monospace">semester:&lt;odjel&gt;</h2>
						<p>
							Dohvaća raspored za dan odjel, kao što su <code>PRIN-4</code>,
							<code>ELO|ELO ABC-2</code>, <code>IID-6</code>, <code>SPECRAC1-1</code> itd.
						</p>
					</section>

					<section>
						<h2 class="rule monospace">subject:&lt;ID predmeta&gt;</h2>
						<p>
							Dohvaća raspored za dan ID predmeta. ID predmeta možete dobiti iz URL-a stranice predmeta na
							moj.tvz.hr.
						</p>
					</section>

					<section>
						<h2 class="rule monospace">prof:&lt;korisničko ime&gt;:&lt;hash&gt;</h2>
						<p>
							Dohvaća raspored za dane parametre. Dobivanje korisničkog imena i hash-a profesora je malo
							zeznuto, stoga sam napravio ovaj <a href={profRuleBookmarklet}>bookmarklet</a> kao pomoć pri
							tome. Stavite bookmarklet u bookmarkove, otvorite profil nastavnika na moj.tvz.hr, otvorite raspored
							te pokrenite bookmarklet da vam izvuće parametre.
						</p>
					</section>

					<section>
						<h2 class="rule monospace">
							filter:&lt;polje&gt;:&lt;vrijednost 1&gt;|&lt;vrijednost 2&gt;|...
						</h2>
						<p>
							Sačuva samo stavke koje sadrže barem jednu od navedenih vrijednosti u navedenom polju.
							Dostupna polja: courseNames, className, professor, classroom, group, note i više.
						</p>
					</section>
				</section>
			</Tab>

			<Tab title="Primjeri upita">
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
	textarea {
		width: 100%;
		min-height: 16rem;
		resize: vertical;

		&:focus {
			outline: none;
		}
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
		max-height: calc(1rem + 1.4 * 10.5rem);

		text-align: left;
		white-space: pre;
		text-overflow: ellipsis;
		overflow-x: hidden;
		overflow-y: hidden;

		cursor: pointer;
		transition: background-color 100ms ease-out;

		&:hover {
			background-color: var(--clr-element);
		}

		position: relative;
		&::after {
			content: "";
			position: absolute;
			inset: auto 0 0 0;
			height: 1rem;
			background-image: linear-gradient(to top, var(--clr-panel-bg), transparent);
		}
	}

	.rule {
		border: 1px solid var(--clr-element);
		border-left: 0.375rem solid var(--clr-element-border);

		width: fit-content;
		padding: 0.25rem 0.5rem;
	}
</style>
