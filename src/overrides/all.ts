import { Temporal } from "@js-temporal/polyfill";
import type { Override } from "$lib/overrides";

export default ([] as Override[]).map(o => {
	o.forEvent.start = Temporal.PlainTime.from(o.forEvent.start);
	o.forEvent.end = Temporal.PlainTime.from(o.forEvent.end);

	return o;
});
