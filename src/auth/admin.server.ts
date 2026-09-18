import {
	getRequestHeader,
	getRequestUrl,
	setResponseHeader,
} from "@tanstack/react-start/server";
import { type AuthRecord, type RecordModel } from "pocketbase";
import type PocketBase from "pocketbase";
import { createPocketBaseClient } from "@/db/pocketbase.server";

const cookieName = "pb_auth";
const cookieMaxAge = 60 * 60 * 24 * 7;

function createPocketBase() {
	return createPocketBaseClient({ autoCancellation: false });
}

export function assertSameOrigin() {
	// Browsers declare their request context with Sec-Fetch-Site; anything
	// declared as cross-site/cross-origin is rejected. Header-less requests
	// (SSR in-process calls, non-browsers) fall through to the Origin check.
	const secFetchSite = getRequestHeader("sec-fetch-site");
	if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site") {
		throw new Error("CSRF");
	}

	const origin = getRequestHeader("origin");
	if (!origin) return;

	try {
		if (new URL(origin).origin !== getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin) {
			throw new Error("CSRF");
		}
	} catch {
		throw new Error("CSRF");
	}
}

function cookieOptions() {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: "/",
		maxAge: cookieMaxAge,
	};
}

function persistAuthCookie(pocketBase: PocketBase) {
	setResponseHeader(
		"Set-Cookie",
		pocketBase.authStore.exportToCookie(cookieOptions(), cookieName),
	);
}

function clearAuthCookie(pocketBase: PocketBase) {
	pocketBase.authStore.clear();
	setResponseHeader(
		"Set-Cookie",
		pocketBase.authStore.exportToCookie(
			{ ...cookieOptions(), maxAge: 0 },
			cookieName,
		),
	);
}

function restorePocketBase(): PocketBase {
	const pocketBase = createPocketBase();
	const cookie = getRequestHeader("cookie");

	if (cookie) {
		pocketBase.authStore.loadFromCookie(cookie, cookieName);
	}

	return pocketBase;
}

export async function getAdminPocketBase(): Promise<PocketBase | null> {
	const pocketBase = await restorePocketBase();

	if (!pocketBase.authStore.isValid) {
		return null;
	}

	try {
		await pocketBase.collection("_superusers").authRefresh<AuthRecord>();
	} catch {
		clearAuthCookie(pocketBase);
		return null;
	}

	if (!pocketBase.authStore.isSuperuser) {
		clearAuthCookie(pocketBase);
		return null;
	}

	persistAuthCookie(pocketBase);
	return pocketBase;
}

export async function requireAdminPocketBase(): Promise<{
	pocketBase: PocketBase;
	admin: RecordModel;
}> {
	const pocketBase = await getAdminPocketBase();
	const admin = pocketBase?.authStore.record;

	if (!pocketBase || !admin) {
		throw new Error("UNAUTHORIZED");
	}

	return {
		pocketBase,
		admin,
	};
}

export async function loginAdmin(email: string, password: string) {
	assertSameOrigin();
	const pocketBase = createPocketBase();

	try {
		await pocketBase
			.collection("_superusers")
			.authWithPassword<AuthRecord>(email, password);
	} catch {
		throw new Error("Anmeldung fehlgeschlagen.");
	}

	if (!pocketBase.authStore.isSuperuser || !pocketBase.authStore.record) {
		clearAuthCookie(pocketBase);
		throw new Error("Anmeldung fehlgeschlagen.");
	}

	persistAuthCookie(pocketBase);

	return {
		id: pocketBase.authStore.record.id,
		email: pocketBase.authStore.record.email,
		displayName: getAdminDisplayName(pocketBase.authStore.record),
	};
}

export async function logoutAdmin() {
	assertSameOrigin();
	const pocketBase = await restorePocketBase();
	clearAuthCookie(pocketBase);
}

export async function getAdminSession() {
	const pocketBase = await getAdminPocketBase();

	if (!pocketBase || !pocketBase.authStore.record) {
		return { authenticated: false as const };
	}

	return {
		authenticated: true as const,
		id: pocketBase.authStore.record.id,
		email: pocketBase.authStore.record.email,
		displayName: getAdminDisplayName(pocketBase.authStore.record),
	};
}

function getAdminDisplayName(admin: AuthRecord) {
	if (!admin) return "";

	const name = typeof admin.name === "string" ? admin.name.trim() : "";
	const username = typeof admin.username === "string" ? admin.username.trim() : "";
	return name || username || admin.email;
}
