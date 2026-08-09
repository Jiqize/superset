import type { HarnessKind } from "@superset/session-protocol";

/** Process boundary consumed by the existing AcpSessionManager. */
export interface AcpAdapterProcessDescriptor {
	harness: HarnessKind;
	command: string;
	args: readonly string[];
	/** Claude-specific permission mode normalization is not protocol-generic. */
	forceDefaultPermissionMode: boolean;
}
