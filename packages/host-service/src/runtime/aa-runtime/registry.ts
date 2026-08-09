import {
	type AARuntimeEventEnvelope,
	type AARuntimeId,
	type AARuntimeSessionSnapshot,
	classifyAARuntimeEventOrder,
	createAARuntimeCapabilities,
	parseAARuntimeEvent,
} from "@superset/session-protocol";

export type AARuntimeIngestResult =
	| { status: "accepted" }
	| { status: "duplicate" | "stale" | "quarantined"; reason: string };

export interface AARuntimeListFilter {
	workspaceId?: string;
	runtime?: AARuntimeId;
}

export interface AARuntimeRegistryChange {
	event: AARuntimeEventEnvelope | null;
	snapshot: AARuntimeSessionSnapshot;
}

export interface AARuntimeResumeExpectation {
	nativeSessionId: string;
	runtime: AARuntimeId;
	terminalId: string;
	workspaceId: string;
}

interface RegistrySession {
	snapshot: AARuntimeSessionSnapshot;
	events: AARuntimeEventEnvelope[];
	eventIds: Set<string>;
}

const MAX_EVENTS_PER_SESSION = 256;

export class AARuntimeRegistry {
	private readonly sessions = new Map<string, RegistrySession>();
	private readonly resumeExpectations = new Map<
		string,
		AARuntimeResumeExpectation & { registeredAt: number }
	>();
	private readonly blockedResumeTerminals = new Set<string>();
	private readonly subscribers = new Set<
		(change: AARuntimeRegistryChange) => void
	>();

	ingest(input: unknown): AARuntimeIngestResult {
		const event = sanitizeEventForRetention(parseAARuntimeEvent(input));
		if (event.terminalId && this.blockedResumeTerminals.has(event.terminalId)) {
			return {
				status: "quarantined",
				reason: "terminal is blocked after resume identity mismatch",
			};
		}
		const resumeExpectation = event.terminalId
			? this.resumeExpectations.get(event.terminalId)
			: undefined;
		if (resumeExpectation) {
			const expectedSessionKey = createSessionKey(
				resumeExpectation.runtime,
				resumeExpectation.nativeSessionId,
			);
			const matches =
				event.kind === "snapshot" &&
				event.sequence === 1 &&
				event.runtime === resumeExpectation.runtime &&
				event.workspaceId === resumeExpectation.workspaceId &&
				event.nativeSessionId === resumeExpectation.nativeSessionId &&
				event.sessionKey === expectedSessionKey;
			if (!matches) {
				this.recordResumeMismatch(event, resumeExpectation, expectedSessionKey);
				return {
					status: "quarantined",
					reason: "resume native session identity mismatch",
				};
			}
			this.resumeExpectations.delete(resumeExpectation.terminalId);
		}
		const current = this.sessions.get(event.sessionKey);
		if (!current) {
			if (event.kind !== "snapshot" || event.sequence !== 1) {
				return {
					status: "quarantined",
					reason: "a new runtime session must begin with snapshot sequence 1",
				};
			}
			this.startSession(event);
			return { status: "accepted" };
		}

		if (current.eventIds.has(event.eventId)) {
			return { status: "duplicate", reason: "eventId already ingested" };
		}

		const order = classifyAARuntimeEventOrder(current.snapshot, event);
		if (order === "duplicate") {
			return {
				status: "duplicate",
				reason: "event position already ingested",
			};
		}
		if (order === "stale") {
			return { status: "stale", reason: "event predates current snapshot" };
		}
		if (order === "gap") {
			this.markSessionUnknown(
				current,
				"event_gap_quarantined",
				event.occurredAt,
			);
			return {
				status: "quarantined",
				reason: "event sequence is not gapless for the active epoch",
			};
		}
		if (order === "new_epoch") {
			if (event.kind !== "snapshot") {
				this.markSessionUnknown(
					current,
					"new_epoch_without_snapshot",
					event.occurredAt,
				);
				return {
					status: "quarantined",
					reason: "a new epoch must begin with a snapshot",
				};
			}
			this.startSession(event);
			return { status: "accepted" };
		}

		current.snapshot = applyEvent(current.snapshot, event);
		this.retainEvent(current, event);
		this.emit({ event, snapshot: current.snapshot });
		return { status: "accepted" };
	}

	get(sessionKey: string): AARuntimeSessionSnapshot | undefined {
		const snapshot = this.sessions.get(sessionKey)?.snapshot;
		return snapshot ? structuredClone(snapshot) : undefined;
	}

	findByTerminal(terminalId: string): AARuntimeSessionSnapshot | undefined {
		let latest: AARuntimeSessionSnapshot | undefined;
		for (const { snapshot } of this.sessions.values()) {
			if (snapshot.transport.terminalId !== terminalId) continue;
			if (!latest || snapshot.observedAt > latest.observedAt) latest = snapshot;
		}
		return latest ? structuredClone(latest) : undefined;
	}

	list(filter: AARuntimeListFilter = {}): AARuntimeSessionSnapshot[] {
		return [...this.sessions.values()]
			.map((session) => session.snapshot)
			.filter(
				(snapshot) =>
					(!filter.workspaceId ||
						snapshot.workspaceId === filter.workspaceId) &&
					(!filter.runtime || snapshot.runtime === filter.runtime),
			)
			.sort((left, right) => right.observedAt - left.observedAt)
			.map((snapshot) => structuredClone(snapshot));
	}

	listEvents(sessionKey: string, limit = 100): AARuntimeEventEnvelope[] {
		const events = this.sessions.get(sessionKey)?.events ?? [];
		return events
			.slice(-Math.max(0, limit))
			.map((event) => structuredClone(event));
	}

	expectResume(
		expectation: AARuntimeResumeExpectation,
		requestedAt = Date.now(),
	): void {
		this.blockedResumeTerminals.delete(expectation.terminalId);
		this.resumeExpectations.set(expectation.terminalId, {
			...expectation,
			registeredAt: requestedAt,
		});
		const sessionKey = createSessionKey(
			expectation.runtime,
			expectation.nativeSessionId,
		);
		const previous = this.sessions.get(sessionKey)?.snapshot;
		const snapshot: AARuntimeSessionSnapshot = {
			contractVersion: "0.1",
			sessionKey,
			runtime: expectation.runtime,
			agentId: previous?.agentId ?? expectation.runtime,
			workspaceId: expectation.workspaceId,
			transport: {
				kind: expectation.runtime === "pi" ? "terminal" : "acp",
				terminalId: expectation.terminalId,
			},
			nativeSessionId: expectation.nativeSessionId,
			nativeTurnId: null,
			model: previous?.model ?? null,
			reasoning: previous?.reasoning ?? null,
			state: "starting",
			stateReason: "resume_requested",
			capabilities: previous?.capabilities ?? createAARuntimeCapabilities(),
			resume: {
				canResume: false,
				mechanism: null,
				lastConfirmedAt: null,
			},
			epoch: `resume-pending-${requestedAt}`,
			lastSequence: 0,
			observedAt: requestedAt,
		};
		this.sessions.set(sessionKey, {
			snapshot,
			events: [],
			eventIds: new Set(),
		});
		this.emit({ event: null, snapshot });
	}

	clearResumeExpectation(terminalId: string): void {
		this.resumeExpectations.delete(terminalId);
		this.blockedResumeTerminals.delete(terminalId);
	}

	expireResumeExpectation(
		terminalId: string,
		occurredAt = Date.now(),
	): boolean {
		return this.recordUnconfirmedResumeFailure(terminalId, occurredAt);
	}

	markTerminalOffline(terminalId: string, occurredAt = Date.now()): boolean {
		if (this.recordUnconfirmedResumeFailure(terminalId, occurredAt))
			return true;
		let changed = false;
		for (const session of this.sessions.values()) {
			const { snapshot } = session;
			if (
				snapshot.transport.terminalId !== terminalId ||
				snapshot.state === "ended" ||
				snapshot.state === "offline"
			) {
				continue;
			}
			session.snapshot = {
				...snapshot,
				state: "offline",
				stateReason: "terminal_process_lost",
				observedAt: Math.max(snapshot.observedAt, occurredAt),
			};
			this.emit({ event: null, snapshot: session.snapshot });
			changed = true;
		}
		return changed;
	}

	subscribe(listener: (change: AARuntimeRegistryChange) => void): () => void {
		this.subscribers.add(listener);
		return () => this.subscribers.delete(listener);
	}

	private startSession(event: AARuntimeEventEnvelope<"snapshot">): void {
		const snapshot = structuredClone(event.payload.snapshot);
		const session: RegistrySession = {
			snapshot,
			events: [],
			eventIds: new Set(),
		};
		this.sessions.set(event.sessionKey, session);
		this.retainEvent(session, event);
		this.emit({ event, snapshot });
	}

	private retainEvent(
		session: RegistrySession,
		event: AARuntimeEventEnvelope,
	): void {
		session.events.push(structuredClone(event));
		session.eventIds.add(event.eventId);
		while (session.events.length > MAX_EVENTS_PER_SESSION) {
			const removed = session.events.shift();
			if (removed) session.eventIds.delete(removed.eventId);
		}
	}

	private markSessionUnknown(
		session: RegistrySession,
		stateReason: string,
		occurredAt: number,
	): void {
		session.snapshot = {
			...session.snapshot,
			state: "unknown",
			stateReason,
			observedAt: Math.max(session.snapshot.observedAt, occurredAt),
		};
		this.emit({ event: null, snapshot: session.snapshot });
	}

	private recordResumeMismatch(
		event: AARuntimeEventEnvelope,
		expectation: AARuntimeResumeExpectation & { registeredAt: number },
		expectedSessionKey: string,
	): void {
		this.resumeExpectations.delete(expectation.terminalId);
		this.blockedResumeTerminals.add(expectation.terminalId);
		const incomingSnapshot =
			event.kind === "snapshot" ? event.payload.snapshot : undefined;
		const snapshot: AARuntimeSessionSnapshot = {
			contractVersion: event.contractVersion,
			sessionKey: expectedSessionKey,
			runtime: expectation.runtime,
			agentId: expectation.runtime,
			workspaceId: expectation.workspaceId,
			transport: {
				kind: expectation.runtime === "pi" ? "terminal" : "acp",
				terminalId: expectation.terminalId,
			},
			nativeSessionId: expectation.nativeSessionId,
			nativeTurnId: null,
			model: null,
			reasoning: null,
			state: "error",
			stateReason: "resume_identity_mismatch",
			capabilities:
				incomingSnapshot?.capabilities ?? createAARuntimeCapabilities(),
			resume: {
				canResume: false,
				mechanism: null,
				lastConfirmedAt: null,
			},
			epoch: event.epoch,
			lastSequence: event.sequence,
			observedAt: event.occurredAt,
		};
		const session: RegistrySession = {
			snapshot,
			events: [],
			eventIds: new Set(),
		};
		this.sessions.set(expectedSessionKey, session);
		this.emit({ event: null, snapshot });
	}

	private recordUnconfirmedResumeFailure(
		terminalId: string,
		occurredAt: number,
	): boolean {
		const expectation = this.resumeExpectations.get(terminalId);
		if (!expectation) return false;
		this.resumeExpectations.delete(terminalId);
		this.blockedResumeTerminals.add(terminalId);
		const sessionKey = createSessionKey(
			expectation.runtime,
			expectation.nativeSessionId,
		);
		const snapshot: AARuntimeSessionSnapshot = {
			contractVersion: "0.1",
			sessionKey,
			runtime: expectation.runtime,
			agentId: expectation.runtime,
			workspaceId: expectation.workspaceId,
			transport: {
				kind: expectation.runtime === "pi" ? "terminal" : "acp",
				terminalId,
			},
			nativeSessionId: expectation.nativeSessionId,
			nativeTurnId: null,
			model: null,
			reasoning: null,
			state: "error",
			stateReason: "resume_identity_not_confirmed",
			capabilities: createAARuntimeCapabilities(),
			resume: {
				canResume: false,
				mechanism: null,
				lastConfirmedAt: null,
			},
			epoch: `resume-pending-${expectation.registeredAt}`,
			lastSequence: 0,
			observedAt: occurredAt,
		};
		this.sessions.set(sessionKey, {
			snapshot,
			events: [],
			eventIds: new Set(),
		});
		this.emit({ event: null, snapshot });
		return true;
	}

	private emit(change: AARuntimeRegistryChange): void {
		const safeChange = structuredClone(change);
		for (const subscriber of this.subscribers) subscriber(safeChange);
	}
}

function sanitizeEventForRetention(
	event: AARuntimeEventEnvelope,
): AARuntimeEventEnvelope {
	if (event.kind !== "message.delta") return event;
	return {
		...event,
		payload: {
			channel: event.payload.channel,
			content: { type: event.payload.content.type },
		},
	};
}

function createSessionKey(
	runtime: AARuntimeId,
	nativeSessionId: string,
): string {
	return `aa:${runtime}:${nativeSessionId}`;
}

function applyEvent(
	current: AARuntimeSessionSnapshot,
	event: AARuntimeEventEnvelope,
): AARuntimeSessionSnapshot {
	const next: AARuntimeSessionSnapshot = {
		...current,
		lastSequence: event.sequence,
		observedAt: event.occurredAt,
	};

	switch (event.kind) {
		case "snapshot":
			return structuredClone(event.payload.snapshot);
		case "session.started":
			return {
				...next,
				state: "idle",
				stateReason: `session_${event.payload.reason}`,
			};
		case "session.offline":
			return {
				...next,
				state: "offline",
				stateReason: "session_offline",
				resume: { ...next.resume, canResume: event.payload.resumable },
			};
		case "session.ended":
			return {
				...next,
				state: "ended",
				stateReason: event.payload.reason,
				resume: { ...next.resume, canResume: false },
			};
		case "turn.started":
			return { ...next, state: "working", stateReason: "turn_started" };
		case "turn.settled":
			return { ...next, state: "idle", stateReason: "turn_settled" };
		case "permission.requested":
			return {
				...next,
				state: "waiting_permission",
				stateReason: "permission_requested",
			};
		case "permission.resolved":
		case "user_input.resolved":
			return { ...next, state: "working", stateReason: event.kind };
		case "user_input.requested":
			return {
				...next,
				state: "waiting_user",
				stateReason: "user_input_requested",
			};
		case "model.changed":
			return {
				...next,
				model: event.payload.model,
				capabilities: {
					...next.capabilities,
					modelRead: { support: "available", reason: null },
				},
			};
		case "reasoning.changed":
			return {
				...next,
				reasoning: event.payload.reasoning,
				capabilities: {
					...next.capabilities,
					reasoningRead: { support: "available", reason: null },
				},
			};
		case "cancel.requested":
			return { ...next, state: "cancelling", stateReason: "cancel_requested" };
		case "cancel.settled":
			return {
				...next,
				state: event.payload.outcome === "failed" ? "error" : "idle",
				stateReason: `cancel_${event.payload.outcome}`,
			};
		case "runtime.error":
			return { ...next, state: "error", stateReason: event.payload.message };
		case "tool.started":
		case "tool.progress":
		case "tool.finished":
		case "message.delta":
			return next;
	}
}
