import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

// Browser extensions (e.g. LanguageTool) inject attributes such as
// `data-lt-installed` onto <html> before React hydrates, triggering an
// attribute-only hydration diff. React recovers fine and logs to
// console.error in dev/prod; filter exactly that message so extension noise
// does not spam the console, while real recoverable errors stay visible.
const originalConsoleError = console.error;

console.error = (...args) => {
	const first = args[0];

	if (typeof first === "string" && first.includes("A tree hydrated but")) {
		return;
	}

	originalConsoleError(...args);
};

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<StartClient />
		</StrictMode>
	);
});
