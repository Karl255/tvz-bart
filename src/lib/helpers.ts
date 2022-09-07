export function leading0(x: number, digits: number): string {
	return x.toString().padStart(digits, "0");
}

export function dateToStringHHMM(date: Date): string {
	return `${leading0(date.getHours(), 2)}:${leading0(date.getMinutes(), 2)}`;
}
