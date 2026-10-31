import assert from "node:assert/strict";
import { test } from "node:test";
import { setTimeout } from "node:timers/promises";
import {
	autocomplete,
	getEnabledInboxCities,
	pocketBaseInstance,
	search,
} from "@/db/city.server";

test("shared city client completes overlapping collection queries", async (t) => {
	const pocketBase = await pocketBaseInstance();
	const beforeSend = pocketBase.beforeSend;
	const cities = [
		{ id: "berlin", name: "Berlin", postcodes: ["10115"] },
		{ id: "bernau", name: "Bernau", postcodes: ["16321"] },
	];
	const inboxCity = {
		id: "inbox-berlin",
		city: "berlin",
		approved: true,
		expand: { city: cities[0] },
	};

	// Exercise the real SDK cancellation logic without a running database.
	pocketBase.beforeSend = (url, options) => ({
		url,
		options: {
			...options,
			fetch: async (_url, init) => {
				await setTimeout(10, undefined, { signal: init?.signal ?? undefined });
				const items = new URL(url).pathname.includes("/cityRepo/")
					? cities
					: [inboxCity];
				return Response.json({
					page: 1,
					perPage: 16,
					totalItems: items.length,
					totalPages: 1,
					items,
				});
			},
		},
	});

	try {
		await t.test("city lists and searches do not cancel each other", async () => {
			const results = await Promise.all([
				getEnabledInboxCities(),
				getEnabledInboxCities(),
				search("Berlin", 16),
				search("10115, Berlin", 16),
			]);
			for (const result of results) {
				assert.equal(result.length, 1);
				assert.equal(result[0]?.cityRef.id, "berlin");
			}
		});

		await t.test("parallel autocomplete existence checks all complete", async () => {
			const results = await autocomplete("Ber", 16);
			assert.equal(results.length, 2);
			assert.deepEqual(results.map((city) => city.exists), [true, true]);
		});
	} finally {
		pocketBase.beforeSend = beforeSend;
	}
});
