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
			classroom: "Audit-lab, Vrbik",

			start: "13:30",
			end: "16:30",
			dayOfWeek: 3,
		},
		replacements: [
			{ start: "13:30", end: "15:00" },
			{ start: "15:00", end: "16:30" },
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
			classroom: "Audit-lab, Vrbik",

			start: "17:30",
			end: "20:30",
			dayOfWeek: 5,
		},
		replacements: [
			{
				start: "17:30",
				end: "19:00",
				professor: "Ivana Lovrić, pred.",
				note: null,
			},
			{
				start: "19:00",
				end: "20:30",
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

			className: "Programiranje u jeziku Java",
			classroom: "FSB-PCLAB 1, Strojarstvo",

			start: "18:00",
			end: "21:00",
			dayOfWeek: 1,
		},
		replacements: [
			{ start: "18:00", end: "19:30" },
			{ start: "19:30", end: "21:00" },
		],
	},
	{
		forEvent: {
			subdepartment,
			semester,
			academicYear,

			className: "Programiranje u jeziku Java",
			classroom: "FSB-PCLAB 1, Strojarstvo",

			start: "17:00",
			end: "21:30",
			dayOfWeek: 2,
		},
		replacements: [
			{ start: "17:00", end: "18:30" },
			{ start: "18:30", end: "20:00" },
			{ start: "20:00", end: "21:30" },
		],
	},
	{
		forEvent: {
			subdepartment,
			semester,
			academicYear,

			className: "Programiranje u jeziku Java",
			classroom: "CCNP, Vrbik",

			start: "16:30",
			end: "21:00",
			dayOfWeek: 4,
		},
		replacements: [
			{ start: "16:30", end: "18:00" },
			{ start: "18:00", end: "19:30" },
			{ start: "19:30", end: "21:00" },
		],
	},
	{
		forEvent: {
			subdepartment,
			semester,
			academicYear,

			className: "Programiranje u jeziku Java",
			classroom: "FSB-PCLAB 1, Strojarstvo",

			start: "16:30",
			end: "21:00",
			dayOfWeek: 5,
		},
		replacements: [
			{ start: "16:30", end: "18:00" },
			{ start: "18:00", end: "19:30" },
			{ start: "19:30", end: "21:00" },
		],
	},
];

export default PRIN_3;
