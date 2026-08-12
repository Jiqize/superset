import type { HostAgentConfig } from "@superset/host-service/settings";
import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";
import { Button } from "@superset/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@superset/ui/tooltip";
import { AAEmployeeAvatar } from "../AAEmployeeAvatar";
import { AAEmployeeProfile } from "../AAEmployeeProfile";
import { AAIcon } from "../AAIcon";
import type { AAPiEmployeeAvailability } from "./aaPiEmployeePresentation";
import { getAAPiEmployeeAccessibleName } from "./aaPiEmployeePresentation";

interface AAPiEmployeeRosterItemProps {
	availability: AAPiEmployeeAvailability;
	config: HostAgentConfig | null;
	isLaunching: boolean;
	onActivate: () => void;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
}

function getStatusLabel(availability: AAPiEmployeeAvailability): string {
	switch (availability) {
		case "available":
			return "PRIMARY";
		case "setup-required":
			return "SETUP REQUIRED";
		case "unavailable":
			return "SETUP UNAVAILABLE";
		case "checking":
			return "CHECKING SETUP";
	}
}

export function AAPiEmployeeRosterItem({
	availability,
	config,
	isLaunching,
	onActivate,
	runtimeSnapshot,
}: AAPiEmployeeRosterItemProps) {
	const statusLabel = isLaunching
		? "HANDING TO PI"
		: getStatusLabel(availability);
	const disabled = availability === "checking" || isLaunching;
	const tooltip =
		availability === "available"
			? "PI · PRIMARY TIER 1 · Send this Task Folder to a new Pi conversation"
			: availability === "setup-required"
				? "PI · SETUP REQUIRED · Open Agent settings"
				: availability === "checking"
					? "PI · Checking the current Host configuration"
					: "PI · Setup status unavailable · Open Agent settings";

	return (
		<div
			className="aa-employee-roster__item aa-pi-employee"
			data-availability={availability}
			data-launching={isLaunching || undefined}
		>
			<Tooltip delayDuration={500}>
				<TooltipTrigger asChild>
					<Button
						aria-busy={isLaunching || undefined}
						aria-label={getAAPiEmployeeAccessibleName(
							availability,
							isLaunching,
						)}
						className="aa-employee-roster__button aa-pi-employee__button h-8 min-w-0 shrink-0 gap-1.5 rounded-none px-1.5"
						disabled={disabled}
						onClick={onActivate}
						size="sm"
						variant="ghost"
					>
						<AAEmployeeAvatar agentId="pi" label="Pi" />
						<span className="aa-pi-employee__copy">
							<strong>PI</strong>
							<small>{statusLabel}</small>
						</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="max-w-72" side="bottom">
					{tooltip}
				</TooltipContent>
			</Tooltip>
			{availability === "available" && config ? (
				<AAEmployeeProfile
					agentId={config.id}
					name="Pi"
					runtimeSnapshot={runtimeSnapshot}
				>
					<Button
						aria-label="View Pi primary Tier 1 employee profile"
						className="aa-employee-roster__profile"
						size="icon"
						title="View Pi primary Tier 1 employee profile"
						variant="ghost"
					>
						<AAIcon name="agents" />
					</Button>
				</AAEmployeeProfile>
			) : null}
		</div>
	);
}
