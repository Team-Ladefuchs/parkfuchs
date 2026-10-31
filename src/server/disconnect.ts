export function withDisconnectHandling<TOptions>(
	handler: (request: Request, options: TOptions) => Response | Promise<Response>,
) {
	return async (request: Request, options: TOptions): Promise<Response> => {
		try {
			return await handler(request, options);
		} catch (error) {
			// Start logs uncaught errors as 500s. A disconnected client cannot
			// receive a response, but still needs a quiet end to its request.
			if (
				request.signal.aborted &&
				(error === request.signal.reason ||
					(error instanceof Error && error.name === "AbortError"))
			) {
				return new Response(null, { status: 499 });
			}
			throw error;
		}
	};
}
