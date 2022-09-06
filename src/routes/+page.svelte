<script lang="ts">
	import fetchSchedule from "$lib/fetchSchedule";
	import parseSchedule from "$lib/apiParser";
	import type { Schedule } from "$lib/types/api";

	let schedule: Schedule | null = null;

	async function fetch() {
		let apiResult = await fetchSchedule("RAC", 2, new Date("2022-06-06"), new Date("2022-06-12"));
		schedule = parseSchedule(apiResult);
	}
</script>

<svelte:head>
	<title>TVZ Schedule</title>
</svelte:head>

<h1>TVZ Schedule</h1>

<button on:click={fetch}>Click</button>

{#if schedule}
	{#each schedule.holidays as item}
		<p>{JSON.stringify(item)}</p>
	{/each}

	{#each [...schedule.workdays] as v}
		<p>{JSON.stringify(v)}</p>
	{/each}
{/if}
