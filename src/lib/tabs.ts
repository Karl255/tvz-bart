import type { Writable } from "svelte/store";

export { default as Tabs } from "$lib/Tabs.svelte";
export { default as Tab } from "$lib/Tab.svelte";

export type TabData = {
	title: string;
};

export type TabsContext = {
	registerTab: (tab: TabData) => void;
	selectedTab: Writable<TabData | null>;
};
