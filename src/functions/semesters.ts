import type { Handler } from "@netlify/functions";
import { makeForwardingHandler } from "../functions-lib/functions-helpers";
import endpoints from "../functions-lib/endpoints";

const handler: Handler = makeForwardingHandler(endpoints.semesters);

export { handler };
