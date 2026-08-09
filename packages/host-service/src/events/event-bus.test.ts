import { describe, expect, it, mock } from "bun:test";
import type { DetectedPort } from "@superset/port-scanner";
import {
	AA_RUNTIME_CONTRACT_VERSION,
	createAARuntimeCapabilities,
} from "@superset/session-protocol";
import type { HostDb } from "../db";
import { portManager } from "../ports/port-manager";
import type { WorkspaceFilesystemManager } from "../runtime/filesystem";
import { EventBus } from "./event-bus";
import type { GitWatcher } from "./git-watcher";

function createEventBus(): EventBus {
	return new EventBus({
		db: {} as unknown as HostDb,
		filesystem: {
			resolveWorkspaceRoot: () => "/tmp/missing-workspace",
		} as unknown as WorkspaceFilesystemManager,
		gitWatcher: {
			onChanged: () => () => {},
		} as unknown as GitWatcher,
	});
}

describe("EventBus port events", () => {
	it("broadcasts port changes from the shared port manager and removes listeners on close", () => {
		const eventBus = createEventBus();
		const sentMessages: string[] = [];
		const socket = {
			readyState: 1,
			send(data: string) {
				sentMessages.push(data);
			},
			close() {},
		};
		const port: DetectedPort = {
			port: 5173,
			pid: 123,
			processName: "vite",
			terminalId: "terminal-1",
			workspaceId: "workspace-1",
			detectedAt: 1_700_000_000_000,
			address: "127.0.0.1",
		};

		eventBus.handleOpen(socket);
		eventBus.start();
		eventBus.start();
		portManager.emit("port:add", port);

		expect(sentMessages).toHaveLength(1);
		const message = JSON.parse(sentMessages[0] ?? "{}");
		expect(message).toMatchObject({
			type: "port:changed",
			workspaceId: "workspace-1",
			eventType: "add",
			port,
			label: null,
		});
		expect(typeof message.occurredAt).toBe("number");

		portManager.emit("port:remove", port);
		expect(sentMessages).toHaveLength(2);
		expect(JSON.parse(sentMessages[1] ?? "{}")).toMatchObject({
			type: "port:changed",
			workspaceId: "workspace-1",
			eventType: "remove",
			port,
			label: null,
		});

		eventBus.close();
		portManager.emit("port:add", port);
		expect(sentMessages).toHaveLength(2);
	});
});

describe("EventBus AA runtime events", () => {
	it("broadcasts validated registry changes and notifies host terminal listeners", () => {
		const eventBus = createEventBus();
		const sentMessages: string[] = [];
		const terminalListener = mock(() => {});
		const removeTerminalListener =
			eventBus.onTerminalLifecycle(terminalListener);
		const socket = {
			readyState: 1,
			send(data: string) {
				sentMessages.push(data);
			},
			close() {},
		};
		const snapshot = {
			contractVersion: AA_RUNTIME_CONTRACT_VERSION,
			sessionKey: "aa:pi:native-session",
			runtime: "pi" as const,
			agentId: "pi",
			workspaceId: "workspace-1",
			transport: { kind: "terminal" as const, terminalId: "terminal-1" },
			nativeSessionId: "native-session",
			nativeTurnId: null,
			model: null,
			reasoning: null,
			state: "idle" as const,
			stateReason: "session_attached",
			capabilities: createAARuntimeCapabilities(),
			resume: {
				canResume: true,
				mechanism: "pi_session" as const,
				lastConfirmedAt: 100,
			},
			epoch: "epoch-1",
			lastSequence: 1,
			observedAt: 100,
		};

		eventBus.handleOpen(socket);
		eventBus.broadcastAARuntimeChanged({
			workspaceId: "workspace-1",
			snapshot,
			event: null,
			occurredAt: 100,
		});
		eventBus.broadcastTerminalLifecycle({
			workspaceId: "workspace-1",
			terminalId: "terminal-1",
			eventType: "exit",
			exitCode: 1,
			signal: 0,
			occurredAt: 200,
		});

		expect(JSON.parse(sentMessages[0] ?? "{}")).toEqual({
			type: "aa-runtime:changed",
			workspaceId: "workspace-1",
			snapshot,
			event: null,
			occurredAt: 100,
		});
		expect(terminalListener).toHaveBeenCalledWith({
			workspaceId: "workspace-1",
			terminalId: "terminal-1",
			eventType: "exit",
			exitCode: 1,
			signal: 0,
			occurredAt: 200,
		});

		removeTerminalListener();
		eventBus.broadcastTerminalLifecycle({
			workspaceId: "workspace-1",
			terminalId: "terminal-1",
			eventType: "exit",
			exitCode: 0,
			signal: 0,
			occurredAt: 300,
		});
		expect(terminalListener).toHaveBeenCalledTimes(1);
	});
});
