<script lang="ts">
	import { getContext } from "svelte";
	import type { TabData, TabsContext } from "$lib/tabs";

	export let title: string;

	const thisTab: TabData = { title };
	const { registerTab, selectedTab}  = getContext("tabs") as TabsContext;

	registerTab(thisTab);
</script>

<div class="tab-content" class:selected={$selectedTab === thisTab}>
	<slot></slot>
</div>

<style lang="scss">
	.tab-content {
		padding: 1rem;
		border: 1px solid #444;
		display: none;

		&.selected {
			display: block;
		}
	}
</style>
