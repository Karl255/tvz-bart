import { Temporal } from "@js-temporal/polyfill";
import type { Override } from "$lib/overrides";
import PRIN_3 from "$overrides/PRIN-3";

export default <Override[]> [
	...PRIN_3,
].map(o => {
	o.forEvent.start = Temporal.PlainTime.from(o.forEvent.start);
	o.forEvent.end = Temporal.PlainTime.from(o.forEvent.end);

	return o;
});
