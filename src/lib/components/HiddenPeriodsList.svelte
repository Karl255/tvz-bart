<script lang="ts">
	import type { ClassPeriodIdentifier } from "$lib/services/scheduleFiltering";

	export let hiddenItems: ClassPeriodIdentifier[];
	export let onUnhideItem: (identifier: ClassPeriodIdentifier) => void;
</script>

{#each hiddenItems as item}
	<p on:click={() => onUnhideItem(item)}>{item.className}</p>
{/each}

<style lang="scss">
	
</style>
