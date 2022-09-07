export function leading0(x: number, digits: number): string {
	return x.toString().padStart(digits, "0");
}
