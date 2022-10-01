import type { Override } from "$lib/overrides";

export default <Override[]>[
	{
		forEvent: {
			subdepartment: "PRIN",
			semester: 3,
			academicYear: 2022,
			
			className: "Algoritmi i strukture podataka",
			classroom: "FSB-PCLAB 2, Strojarstvo",

			start: "09:00",
			end: "12:00",
			dayOfWeek: 1
		},
		replacements: [
			{
				start: "09:00",
				end: "10:30",

				courseName: "~",
				professor: "~",
				classType: "~",
				classroom: "~",
				group: "~",
				note: "~"
			},
			{
				start: "10:30",
				end: "12:00",

				courseName: "~",
				professor: "~",
				classType: "~",
				classroom: "~",
				group: "~",
				note: "~"
			},
		]
	},
	{
		forEvent: {
			subdepartment: "PRIN",
			semester: 3,
			academicYear: 2022,
			
			className: "Algoritmi i strukture podataka",
			classroom: "ALLPC, Vrbik",

			start: "11:30",
			end: "14:30",
			dayOfWeek: 4
		},
		replacements: [
			{
				start: "11:30",
				end: "13:00",

				courseName: "~",
				professor: "~",
				classType: "~",
				classroom: "~",
				group: "~",
				note: "~"
			},
			{
				start: "13:00",
				end: "14:30",

				courseName: "~",
				professor: "~",
				classType: "~",
				classroom: "~",
				group: "~",
				note: "~"
			},
		]
	},
	{
		forEvent: {
			subdepartment: "PRIN",
			semester: 3,
			academicYear: 2022,
			
			className: "Algoritmi i strukture podataka",
			classroom: "CCNA, Vrbik",

			start: "11:30",
			end: "14:30",
			dayOfWeek: 4
		},
		replacements: [
			{
				start: "11:30",
				end: "13:00",

				courseName: "~",
				professor: "~",
				classType: "~",
				classroom: "~",
				group: "~",
				note: "~"
			},
			{
				start: "13:00",
				end: "14:30",

				courseName: "~",
				professor: "~",
				classType: "~",
				classroom: "~",
				group: "~",
				note: "~"
			},
		]
	},
];
