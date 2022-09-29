<script lang="ts">
	import type { Temporal } from "@js-temporal/polyfill";
	import { browser } from "$app/environment";

	import { type ClassPeriod, type Schedule, fetchScheduleWeek, parseSchedule } from "$lib/api/schedule";
	import { fetchSemesters, parseSemesters, type Semester } from "$lib/api/semesters";
	import { supportedDepartments } from "$lib/api/departments";
	import { dateToStringHR, getAcademicYear, thisMonday } from "$lib/helpers";

	import ClassPeriodInfo from "$lib/ClassPeriodInfo.svelte";
	import Calendar from "$lib/Calendar.svelte";
	import DepartmentPicker from "$lib/DepartmentPicker.svelte";
	import { Tab, Tabs } from "$lib/tabs";
	import SemesterPicker from "$lib/SemesterPicker.svelte";

	let selectedDepartment: string = supportedDepartments[6];
	let selectedSemester: Semester | null = null;

	let availableSemesters: Semester[] = [];
	let schedule: Schedule | null = null;
	let currentMonday = thisMonday();

	$: loadSemesters(selectedDepartment);
	$: loadSchedule(currentMonday, selectedSemester);

	let selectedPeriod: ClassPeriod | null = null;
	let previewedPeriod: ClassPeriod | null = null;

	async function loadSemesters(departmentCode: string) {
		if (browser) {
			const res = await fetchSemesters(departmentCode, getAcademicYear(currentMonday));
			availableSemesters = parseSemesters(res);

			if (selectedSemester === null) {
				selectedSemester = availableSemesters[1];
			}
		}
	}

	async function loadSchedule(weekStart: Temporal.PlainDate, semester: Semester | null) {
		if (browser && semester) {
			const res = await fetchScheduleWeek(semester.subdepartment, semester.semester, weekStart);
			schedule = parseSchedule(res);
		}
	}

	function resetWeek() {
		currentMonday = thisMonday();
	}

	function cycleWeek(e: MouseEvent) {
		let element = e.currentTarget as HTMLButtonElement;
		currentMonday = currentMonday.add({ days: Number(element.dataset.delta) * 7 });
	}
</script>

<svelte:head>
	<title>TVZ Schedule</title>
</svelte:head>

<div class="container">
	<div class="panel panel--calendar">
		<div class="panel--calendar__controls">
			<div class="control-group">
				<button data-delta="-3" on:click={cycleWeek}>&lt;&lt;&lt;</button>
				<button data-delta="-2" on:click={cycleWeek}>&lt;&lt;</button>
				<button data-delta="-1" on:click={cycleWeek}>&lt;</button>
			</div>

			<button title="Go back to current week" on:click={resetWeek}>{dateToStringHR(currentMonday)} - {dateToStringHR(currentMonday.add({ days: 4 }))}</button>

			<div class="control-group">
				<button data-delta="1" on:click={cycleWeek}>&gt;</button>
				<button data-delta="2" on:click={cycleWeek}>&gt;&gt;</button>
				<button data-delta="3" on:click={cycleWeek}>&gt;&gt;&gt;</button>
			</div>
		</div>

		<Calendar {schedule} from={currentMonday} bind:selectedPeriod bind:previewedPeriod />
	</div>

	<div class="panel panel--info-preview">
		<ClassPeriodInfo classPeriod={previewedPeriod}>
			<p class="description">Put your mouse over an item in the calendar and details about it will appear here.</p>
		</ClassPeriodInfo>
	</div>

	<div class="panel panel--info-selected">
		<ClassPeriodInfo classPeriod={selectedPeriod}>
			<p class="description">Click on an item in the calendar to select it and details about it will show in here.</p>
		</ClassPeriodInfo>
	</div>

	<div class="panel panel--options">
		<Tabs>
			<Tab title="Schedule Picker">
				<div class="schedule-picker">
					<DepartmentPicker bind:departmentCode={selectedDepartment} />
					<SemesterPicker {availableSemesters} bind:semester={selectedSemester} />
				</div>
			</Tab>
			<Tab title="About">
				About
			</Tab>
		</Tabs>
	</div>
</div>

<style lang="scss">
	.container {
		max-width: 1280px;
		margin: 0 auto;

		display: grid;
		grid-template-columns: 3fr 1fr;
		grid-auto-rows: 1fr 1fr auto;
		grid-template-areas: "calendar info-preview" "calendar info-selected" "options options";
		gap: 1rem;
	}

	.panel {
		background-color: var(--clr-bg-1);
		border: 1px solid var(--clr-panel-border);
		border-radius: 0.5rem;
	}

	.panel--calendar {
		grid-area: calendar;

		display: grid;
		grid-template-rows: auto 1fr;

		&__controls {
			display: flex;
			justify-content: center;
			gap: 3rem;
			padding: 0.5rem;
		}
	}

	.control-group {
		display: flex;
		gap: 1rem;
	}

	.panel--info-selected {
		grid-area: info-selected;
		padding: 1rem;
	}

	.panel--info-preview {
		grid-area: info-preview;
		padding: 1rem;
	}

	.panel--options {
		grid-area: options;
		background-color: transparent;
		border: none;
	}

	.description {
		font-style: italic;
	}

	.schedule-picker {
		display: grid;
		gap: 1rem;
	}
</style>
