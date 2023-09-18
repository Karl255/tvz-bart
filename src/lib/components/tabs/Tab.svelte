<script lang="ts">
	import { getContext } from "svelte";
	import type { TabData, TabsContext } from "$lib/components/tabs/";

	export let title: string;

	const thisTab: TabData = { title };
	const { registerTab, selectedTab } = getContext("tabs") as TabsContext;

	registerTab(thisTab);
</script>

<div class="tab-content" class:selected={$selectedTab === thisTab}>
	<slot />
</div>

<style lang="scss">
	.tab-content {
		background-color: var(--clr-panel-bg);
		border: 1px solid var(--clr-panel-border);
		border-radius: 0 0.5rem 0.5rem;
		padding: 1rem;

		visibility: hidden;

		&.selected {
			visibility: visible;
		}
		
		:global(.tab-content) + & {
			border-radius: 0.5rem;
		}
	}
</style>
