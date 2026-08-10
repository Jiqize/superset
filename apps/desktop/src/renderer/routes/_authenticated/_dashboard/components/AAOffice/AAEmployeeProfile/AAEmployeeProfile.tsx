import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";
import { Popover, PopoverContent, PopoverTrigger } from "@superset/ui/popover";
import type { ReactElement } from "react";
import { AAEmployeeProfileCard } from "./AAEmployeeProfileCard";
import { resolveAAEmployeeProfilePresentation } from "./aaEmployeeProfilePresentation";

interface AAEmployeeProfileProps {
	agentId?: string | null;
	children: ReactElement;
	name: string;
	resumeAvailable?: boolean;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
	side?: "top" | "right" | "bottom" | "left";
}

export function AAEmployeeProfile({
	agentId,
	children,
	name,
	resumeAvailable,
	runtimeSnapshot,
	side = "bottom",
}: AAEmployeeProfileProps) {
	const presentation = resolveAAEmployeeProfilePresentation({
		agentId,
		name,
		resumeAvailable,
		runtimeSnapshot,
	});

	return (
		<Popover modal={false}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				align="end"
				aria-label={`${presentation.employeeName} employee file`}
				className="aa-employee-profile"
				side={side}
				sideOffset={6}
			>
				<AAEmployeeProfileCard presentation={presentation} />
			</PopoverContent>
		</Popover>
	);
}
