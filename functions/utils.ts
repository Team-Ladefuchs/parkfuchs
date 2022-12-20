export function isValidUrl(text: string): boolean {
	try {
		new URL(text);
		return true;
	} catch (_) {}
	return false;
}

export function formatLink(input: string): string {
	try {
		const url = new URL(input);
		return url.host.replace("www.", "");
	} catch (error) {}
	return "";
}
