<script lang="ts">
	import { fetchSchedule } from "$lib/fetchSchedule";
	
	let result: Array<Object> = [];
	
	async function fetch() {
		result = await fetchSchedule("RAC", 2, new Date("2022-06-06"), new Date("2022-06-12"))
	}
</script>

<svelte:head>
	<title>TVZ Schedule</title>
</svelte:head>

<h1>TVZ Schedule</h1>

<button on:click={fetch}>Click</button>

{#each result as item}
	<p>{ JSON.stringify(item) }</p>
{/each}
