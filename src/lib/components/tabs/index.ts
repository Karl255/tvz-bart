import type { Writable } from "svelte/store";

export { default as Tabs } from "$lib/components/tabs/Tabs.svelte";
export { default as Tab } from "$lib/components/tabs/Tab.svelte";

export type TabData = {
	title: string;
};

export type TabsContext = {
	registerTab: (tab: TabData) => void;
	selectedTab: Writable<TabData | null>;
};
