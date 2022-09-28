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
			<button class="tab-button" on:click={() => selectTab(tab)}>{tab.title}</button>
		</li>
	{/each}
</ul>

<slot></slot>

<style lang="scss">
	.tab-list {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;

		> li {
			display: block;
		}
	}

	.tab-button {
		border: 1px solid #8f8f9d;
		border-radius: 0.25rem 0.25rem 0 0;
		padding: 0.25rem 0.5rem;
	}
</style>
