import PocketBase from "pocketbase";

// PocketBase is bound to localhost in deployments (Nix module default), so
// only the port may vary per environment.
const HOST = "127.0.0.1";
const PORT = process.env.DB_PORT ?? "8090";

export function getDBHost() {
	return `http://${HOST}:${PORT}`;
}

export function createPocketBaseClient(options: { autoCancellation: boolean }) {
	const pocketBase = new PocketBase(getDBHost());
	pocketBase.autoCancellation(options.autoCancellation);
	return pocketBase;
}
