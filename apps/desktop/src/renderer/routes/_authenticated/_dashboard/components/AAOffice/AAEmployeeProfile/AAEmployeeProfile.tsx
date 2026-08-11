import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";
import { Popover, PopoverContent, PopoverTrigger } from "@superset/ui/popover";
import { type ReactElement, useCallback, useRef, useState } from "react";
import { useHotkey } from "renderer/hotkeys";
import {
	captureAATerminalFocus,
	restoreAAWorkflowFocus,
} from "../aaDailyWorkflowFocus";
import { AAEmployeeProfileCard } from "./AAEmployeeProfileCard";
import { resolveAAEmployeeProfilePresentation } from "./aaEmployeeProfilePresentation";

interface AAEmployeeProfileProps {
	agentId?: string | null;
	children: ReactElement;
	name: string;
	dailyWorkflowShortcut?: boolean;
	resumeAvailable?: boolean;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
	side?: "top" | "right" | "bottom" | "left";
}

export function AAEmployeeProfile({
	agentId,
	children,
	name,
	dailyWorkflowShortcut = false,
	resumeAvailable,
	runtimeSnapshot,
	side = "bottom",
}: AAEmployeeProfileProps) {
	const [open, setOpen] = useState(false);
	const returnFocusRef =
		useRef<ReturnType<typeof captureAATerminalFocus>>(null);
	const presentation = resolveAAEmployeeProfilePresentation({
		agentId,
		name,
		resumeAvailable,
		runtimeSnapshot,
	});
	const rememberTerminalFocus = useCallback(() => {
		returnFocusRef.current = captureAATerminalFocus();
	}, []);

	useHotkey(
		"AA_OPEN_EMPLOYEE_PROFILE",
		() => {
			rememberTerminalFocus();
			setOpen(true);
		},
		{ enabled: dailyWorkflowShortcut },
	);

	return (
		<Popover modal={false} open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild onPointerDownCapture={rememberTerminalFocus}>
				{children}
			</PopoverTrigger>
			<PopoverContent
				align="end"
				aria-label={`${presentation.employeeName} employee profile`}
				className="aa-employee-profile"
				side={side}
				sideOffset={6}
				onCloseAutoFocus={(event) => {
					if (!returnFocusRef.current?.isConnected) return;
					event.preventDefault();
					restoreAAWorkflowFocus(returnFocusRef.current);
					returnFocusRef.current = null;
				}}
			>
				<AAEmployeeProfileCard presentation={presentation} />
			</PopoverContent>
		</Popover>
	);
}
