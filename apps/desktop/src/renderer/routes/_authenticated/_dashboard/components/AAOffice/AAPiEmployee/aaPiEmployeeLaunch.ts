export interface AASingleFlight<TResult> {
	isPending: () => boolean;
	run: (operation: () => Promise<TResult>) => Promise<TResult>;
}

export function createAASingleFlight<TResult>(): AASingleFlight<TResult> {
	let pending: Promise<TResult> | null = null;
	return {
		isPending: () => pending !== null,
		run: (operation) => {
			if (pending) return pending;
			const operationPromise = Promise.resolve().then(operation);
			const guarded = operationPromise.finally(() => {
				if (pending === guarded) pending = null;
			});
			pending = guarded;
			return guarded;
		},
	};
}
