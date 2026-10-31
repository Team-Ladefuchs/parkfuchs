import assert from "node:assert/strict";
import { test } from "node:test";
import { withDisconnectHandling } from "@/server/disconnect";

test("client disconnect returns an empty 499 response", async () => {
	const controller = new AbortController();
	const request = new Request("http://localhost/", { signal: controller.signal });
	const handler = withDisconnectHandling(() => {
		controller.abort(new DOMException("The connection was closed.", "AbortError"));
		throw request.signal.reason;
	});
	const response = await handler(request, undefined);
	assert.equal(response.status, 499);
	assert.equal(response.body, null);
});

test("disconnect with a non-Error abort reason is handled", async () => {
	const controller = new AbortController();
	controller.abort("connection closed");
	const handler = withDisconnectHandling(() => Promise.reject(controller.signal.reason));
	const response = await handler(new Request("http://localhost/", {
		signal: controller.signal,
	}), undefined);
	assert.equal(response.status, 499);
});

test("an unrelated error is rethrown even after a disconnect", async () => {
	const controller = new AbortController();
	controller.abort();
	const error = new Error("Rendering failed");
	const handler = withDisconnectHandling(() => { throw error; });
	await assert.rejects(handler(new Request("http://localhost/", {
		signal: controller.signal,
	}), undefined), (actual) => actual === error);
});

test("an AbortError on a connected request is rethrown", async () => {
	const error = new DOMException("Upstream request aborted", "AbortError");
	const handler = withDisconnectHandling(() => Promise.reject(error));
	await assert.rejects(handler(new Request("http://localhost/"), undefined),
		(actual) => actual === error);
});

test("successful requests preserve their options and response", async () => {
	const response = new Response("ok");
	const options = { context: "request context" };
	const request = new Request("http://localhost/");
	const handler = withDisconnectHandling((actualRequest, actualOptions: typeof options) => {
		assert.equal(actualRequest, request);
		assert.equal(actualOptions, options);
		return response;
	});
	assert.equal(await handler(request, options), response);
});
