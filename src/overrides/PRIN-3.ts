import type { Override } from "$lib/overrides";

const subdepartment = "PRIN";
const semester = 3;
const academicYear = 2022;

const PRIN_3: Override[] = [
	{
		forEvent: {
			subdepartment,
			semester,
			academicYear,

			className: "Algoritmi i strukture podataka",
			classroom: "FSB-PCLAB 2, Strojarstvo",

			start: "09:00",
			end: "12:00",
			dayOfWeek: 1,
		},
		replacements: [
			{
				start: "09:00",
				end: "10:30",
				professor: "Ivana Lovrić, pred.", // replace professor (as noted in the note)
				note: null, // remove note
			},
			{
				start: "10:30",
				end: "12:00",
				professor: "Ivana Lovrić, pred.",
				note: null,
			},
		],
	},
	{
		forEvent: {
			subdepartment,
			semester,
			academicYear,

			className: "Algoritmi i strukture podataka",
			classroom: "ALLPC, Vrbik",

			start: "11:30",
			end: "14:30",
			dayOfWeek: 4,
		},
		replacements: [
			{ start: "11:30", end: "13:00" },
			{ start: "13:00", end: "14:30" },
		],
	},
	{
		forEvent: {
			subdepartment,
			semester,
			academicYear,

			className: "Algoritmi i strukture podataka",
			classroom: "CCNA, Vrbik",

			start: "11:30",
			end: "14:30",
			dayOfWeek: 4,
		},
		replacements: [
			{ start: "11:30", end: "13:00" },
			{ start: "13:00", end: "14:30" },
		],
	},
	{
		forEvent: {
			subdepartment,
			semester,
			academicYear,

			className: "Algoritmi i strukture podataka",
			classroom: "ALLPC, Vrbik",

			start: "17:00",
			end: "20:00",
			dayOfWeek: 5,
		},
		replacements: [
			{
				start: "17:00",
				end: "18:30",
				professor: "Ivana Lovrić, pred.",
				note: null,
			},
			{
				start: "18:30",
				end: "20:00",
				professor: "Ivana Lovrić, pred.",
				note: null,
			},
		],
	},
];

export default PRIN_3;
