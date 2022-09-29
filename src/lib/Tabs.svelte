<script lang="ts">
	import { onDestroy, setContext } from "svelte";
	import { writable, type Writable } from "svelte/store";
	import type { TabData, TabsContext } from "$lib/tabs";

	let tabs: TabData[] = [];
	const selectedTab = writable<TabData | null>(null);

	setContext<TabsContext>("tabs", {
		registerTab: (tab: TabData) => {
			if (!tabs.find(t => t === tab)) {
				tabs.push(tab);
				tabs = tabs;
				selectedTab.update(value => value ?? tab);
			}
			
			onDestroy(() => {
				const i = tabs.indexOf(tab);
				tabs.splice(i, 1);
				selectedTab.update(value => value === tab ? tabs[i - 1] ?? tabs[i] ?? null : value);
			});
		},

		selectedTab
	});
		
	function selectTab(tab: TabData) {
		selectedTab.set(tab);
	}
</script>

<ul class="tab-list">
	{#each tabs as tab}
		<li>
			<button class="tab-button" class:selected={$selectedTab === tab} on:click={() => selectTab(tab)}>{tab.title}</button>
		</li>
	{/each}
</ul>

<slot></slot>

<style lang="scss">
	.tab-list {
		display: flex;
		list-style: none;
		margin: 0 0 -1px 0;
		padding: 0;

		> li {
			display: block;
		}
	}

	.tab-button {
		background-color: var(--clr-bg-1);
		border: 1px solid var(--clr-panel-border);
		border-radius: 0.25rem 0.25rem 0 0;
		padding: 0.5rem 0.75rem;

		display: block;
		
		&:hover {
			background-color: var(--clr-panel-border);
		}
		
		&.selected {
			border-bottom-color: var(--clr-bg-1);
			cursor: default;
			pointer-events: none;
		}
	}
</style>
