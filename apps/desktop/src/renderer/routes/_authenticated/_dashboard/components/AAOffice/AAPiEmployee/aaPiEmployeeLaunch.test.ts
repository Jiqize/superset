import { describe, expect, it } from "bun:test";
import { createAASingleFlight } from "./aaPiEmployeeLaunch";

describe("AA Pi employee single-flight launch", () => {
	it("coalesces concurrent activation into exactly one launch", async () => {
		let resolveLaunch: ((result: boolean) => void) | undefined;
		let launchCount = 0;
		const launch = new Promise<boolean>((resolve) => {
			resolveLaunch = resolve;
		});
		const gate = createAASingleFlight<boolean>();
		const operation = () => {
			launchCount += 1;
			return launch;
		};

		const first = gate.run(operation);
		const second = gate.run(operation);
		expect(first).toBe(second);
		expect(gate.isPending()).toBe(true);
		await Promise.resolve();
		expect(launchCount).toBe(1);

		resolveLaunch?.(true);
		expect(await first).toBe(true);
		expect(gate.isPending()).toBe(false);
	});

	it("allows a later explicit launch after the first settles", async () => {
		let launchCount = 0;
		const gate = createAASingleFlight<boolean>();
		await gate.run(async () => {
			launchCount += 1;
			return true;
		});
		await gate.run(async () => {
			launchCount += 1;
			return true;
		});
		expect(launchCount).toBe(2);
	});
});
