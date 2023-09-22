import type { Writable } from "svelte/store";

export { default as Tabs } from "$lib/components/tabs/Tabs.svelte";
export { default as Tab } from "$lib/components/tabs/Tab.svelte";

export interface TabData {
	title: string;
}

export interface TabsContext {
	registerTab: (tab: TabData) => void;
	refreshTabData: () => void;
	selectedTab: Writable<TabData | null>;
}
