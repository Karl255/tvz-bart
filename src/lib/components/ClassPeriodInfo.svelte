<script lang="ts">
	import type { ClassPeriod } from "$lib/api";

	export let classPeriod: ClassPeriod | null = null;
</script>

{#if classPeriod}
	<!-- <p><b>ID:</b> {classPeriod.id}</p> -->
	<!-- <p><b>Color:</b> {classPeriod.apiColor}</p> -->
	<p>{classPeriod.start.toString({ smallestUnit: "minutes" })} - {classPeriod.end.toString({ smallestUnit: "minutes" })}</p>
	<p><strong>{classPeriod.className}</strong></p>
	<p>{classPeriod.classType}</p>
	<p>{classPeriod.classroom}</p>

	{#if classPeriod.group || classPeriod.note}
		<br>
	{/if}

	{#if classPeriod.group}
		<p><b>Grupa:</b> {classPeriod.group}</p>
	{/if}

	{#if classPeriod.note}
		<p><b>Napomena:</b> {classPeriod.note}</p>
	{/if}

	<br>

	<p>{classPeriod.professor}</p>
	<p><strong>{classPeriod.courseName}</strong></p>
{:else}
	<slot />
{/if}
