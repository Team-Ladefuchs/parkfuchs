export const useDebounce = (func, delay = 220): any => {
	let timeoutId: number | undefined;

	return function (...args: any) {
		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			func(...args);
		}, delay) as unknown as number;
	};
};
