import {
	createServerEntry,
	createStartHandler,
	defaultStreamHandler,
} from "@tanstack/react-start/server";
import { withDisconnectHandling } from "@/server/disconnect";

export default createServerEntry({
	fetch: withDisconnectHandling(createStartHandler(defaultStreamHandler)),
});
