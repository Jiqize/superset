import type { ReactNode } from "react";
import { useAAAgentStatus } from "../AAAgentStatus";
import { AAIcon } from "../AAIcon";
import { AAStatusLight } from "../AAStatusLight";

interface AATerminalFrameProps {
	children: ReactNode;
	terminalId: string;
}

export function AATerminalFrame({
	children,
	terminalId,
}: AATerminalFrameProps) {
	const { binding, state } = useAAAgentStatus();
	const isPiWorkstation = binding?.terminalId === terminalId;

	return (
		<div
			className="aa-terminal-frame"
			data-agent-state={isPiWorkstation ? state : undefined}
		>
			<div className="aa-terminal-frame__console">
				<span className="aa-terminal-frame__label">
					<AAIcon name="terminal" />
					{isPiWorkstation ? "PI WORKSTATION" : "LOCAL TERMINAL"}
				</span>
				<span className="aa-terminal-frame__signal">
					<AAStatusLight
						tone={isPiWorkstation ? toneForPiState(state) : "idle"}
					/>
					{isPiWorkstation ? state.toUpperCase() : "SESSION"}
				</span>
			</div>
			<div className="aa-terminal-frame__viewport">{children}</div>
		</div>
	);
}

function toneForPiState(
	state: ReturnType<typeof useAAAgentStatus>["state"],
): "attention" | "error" | "idle" | "offline" | "success" | "working" {
	switch (state) {
		case "thinking":
		case "working":
			return "working";
		case "waiting":
			return "attention";
		case "error":
			return "error";
		case "offline":
			return "offline";
		case "idle":
			return "success";
	}
}
