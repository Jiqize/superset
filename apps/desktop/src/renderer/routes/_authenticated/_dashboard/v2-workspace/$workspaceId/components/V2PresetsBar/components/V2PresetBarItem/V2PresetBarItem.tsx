import type { HostAgentConfig } from "@superset/host-service/settings";
import type { AARuntimeSessionSnapshot } from "@superset/session-protocol";
import { Button } from "@superset/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@superset/ui/context-menu";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { HotkeyId } from "renderer/hotkeys";
import { HotkeyTooltip } from "renderer/hotkeys";
import { resolveV2PresetIcon } from "renderer/lib/preset-icon";
import {
	AAEmployeeAvatar,
	AAEmployeeProfile,
	AAIcon,
} from "renderer/routes/_authenticated/_dashboard/components/AAOffice";
import type { V2TerminalPresetRow } from "renderer/routes/_authenticated/providers/CollectionsProvider/dashboardSidebarLocal";

const V2_PRESET_BAR_ITEM_TYPE = "V2_PRESET_BAR_ITEM";

interface V2PresetBarItemProps {
	preset: V2TerminalPresetRow;
	visibleIndex: number;
	hotkeyId?: HotkeyId;
	isDark: boolean;
	agents: HostAgentConfig[] | undefined;
	runtimeSnapshot?: AARuntimeSessionSnapshot;
	onAssignPreset: (preset: V2TerminalPresetRow) => Promise<boolean>;
	onEdit: (preset: V2TerminalPresetRow) => void;
	onLocalReorder: (fromIndex: number, toIndex: number) => void;
	onPersistReorder: (presetId: string, targetVisibleIndex: number) => void;
}

export function V2PresetBarItem({
	preset,
	visibleIndex,
	hotkeyId,
	isDark,
	agents,
	runtimeSnapshot,
	onAssignPreset,
	onEdit,
	onLocalReorder,
	onPersistReorder,
}: V2PresetBarItemProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const icon = resolveV2PresetIcon(preset, agents, isDark);

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: V2_PRESET_BAR_ITEM_TYPE,
			item: {
				id: preset.id,
				index: visibleIndex,
				originalIndex: visibleIndex,
			},
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		}),
		[preset.id, visibleIndex],
	);

	const [, drop] = useDrop({
		accept: V2_PRESET_BAR_ITEM_TYPE,
		hover: (item: { id: string; index: number; originalIndex: number }) => {
			if (item.index !== visibleIndex) {
				onLocalReorder(item.index, visibleIndex);
				item.index = visibleIndex;
			}
		},
		drop: (item: { id: string; index: number; originalIndex: number }) => {
			if (item.originalIndex !== item.index) {
				onPersistReorder(item.id, item.index);
			}
		},
	});

	useEffect(() => {
		drag(drop(containerRef));
	}, [drag, drop]);

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<div
					ref={containerRef}
					className={
						isDragging
							? "aa-employee-roster__item opacity-40"
							: "aa-employee-roster__item"
					}
					style={{ cursor: isDragging ? "grabbing" : "grab" }}
				>
					<HotkeyTooltip id={hotkeyId}>
						<Button
							aria-label={`Send Task Folder to ${preset.name || "default"}`}
							variant="ghost"
							size="sm"
							className="aa-employee-roster__button h-8 max-w-36 min-w-0 shrink-0 gap-1.5 rounded-md px-1.5 text-xs font-normal text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
							onClick={() => void onAssignPreset(preset)}
						>
							<AAEmployeeAvatar
								agentId={preset.agentId}
								iconSrc={icon}
								label={preset.name || "default"}
							/>
							<span className="min-w-0 truncate">
								{preset.name || "default"}
							</span>
						</Button>
					</HotkeyTooltip>
					<AAEmployeeProfile
						agentId={preset.agentId}
						name={preset.name || "default"}
						runtimeSnapshot={runtimeSnapshot}
					>
						<Button
							aria-label={`View ${preset.name || "default"} employee profile`}
							className="aa-employee-roster__profile"
							size="icon"
							title={`View ${preset.name || "default"} employee profile`}
							variant="ghost"
						>
							<AAIcon name="agents" />
						</Button>
					</AAEmployeeProfile>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={() => void onAssignPreset(preset)}>
					Send Task Folder
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem onSelect={() => onEdit(preset)}>
					Edit preset
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
