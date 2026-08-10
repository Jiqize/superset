import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";
import { Button } from "@superset/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@superset/ui/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@superset/ui/tooltip";
import { getPresetIcon } from "renderer/assets/app-icons/preset-icons";
import {
	AAEmployeeAvatar,
	AAEmployeeProfile,
	AAIcon,
} from "renderer/routes/_authenticated/_dashboard/components/AAOffice";
import type { V2TerminalPresetRow } from "renderer/routes/_authenticated/providers/CollectionsProvider/dashboardSidebarLocal";

interface BuiltinPresetBarItemProps {
	preset: V2TerminalPresetRow;
	isDark: boolean;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
	onAssignPreset: (preset: V2TerminalPresetRow) => Promise<boolean>;
	onHide: (presetId: string) => void;
}

// Built-in presets have no v2TerminalPresets row, so unlike V2PresetBarItem
// they are not draggable (nothing to persist), not editable, and "Remove"
// persists to user preferences instead of the row's pinnedToBar.
export function BuiltinPresetBarItem({
	preset,
	isDark,
	runtimeSnapshot,
	onAssignPreset,
	onHide,
}: BuiltinPresetBarItemProps) {
	const icon = getPresetIcon("superset", isDark);

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<div className="aa-employee-roster__item">
					<Tooltip delayDuration={700}>
						<TooltipTrigger asChild>
							<Button
								aria-label={`Assign current work to ${preset.name}`}
								variant="ghost"
								size="sm"
								className="aa-employee-roster__button h-8 max-w-36 min-w-0 shrink-0 gap-1.5 rounded-md px-1.5 text-xs font-normal text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
								onClick={() => void onAssignPreset(preset)}
							>
								<AAEmployeeAvatar
									agentId={preset.agentId}
									iconSrc={icon}
									label={preset.name}
								/>
								<span className="min-w-0 truncate">{preset.name}</span>
							</Button>
						</TooltipTrigger>
						{preset.description ? (
							<TooltipContent side="bottom" className="max-w-64">
								{preset.description}
							</TooltipContent>
						) : null}
					</Tooltip>
					<AAEmployeeProfile
						agentId={preset.agentId}
						name={preset.name}
						runtimeSnapshot={runtimeSnapshot}
					>
						<Button
							aria-label={`View ${preset.name} employee file`}
							className="aa-employee-roster__profile"
							size="icon"
							title={`View ${preset.name} employee file`}
							variant="ghost"
						>
							<AAIcon name="agents" />
						</Button>
					</AAEmployeeProfile>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={() => void onAssignPreset(preset)}>
					Assign current work
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem onSelect={() => onHide(preset.id)}>
					Remove preset
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
