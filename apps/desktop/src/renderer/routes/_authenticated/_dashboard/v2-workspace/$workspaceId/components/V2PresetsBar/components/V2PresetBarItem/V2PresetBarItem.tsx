import type { HostAgentConfig } from "@superset/host-service/settings";
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
import { AAEmployeeAvatar } from "renderer/routes/_authenticated/_dashboard/components/AAOffice";
import type { V2TerminalPresetRow } from "renderer/routes/_authenticated/providers/CollectionsProvider/dashboardSidebarLocal";

const V2_PRESET_BAR_ITEM_TYPE = "V2_PRESET_BAR_ITEM";

interface V2PresetBarItemProps {
	preset: V2TerminalPresetRow;
	visibleIndex: number;
	hotkeyId?: HotkeyId;
	isDark: boolean;
	agents: HostAgentConfig[] | undefined;
	onExecutePreset: (preset: V2TerminalPresetRow) => void;
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
	onExecutePreset,
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
							aria-label={`Run employee preset: ${preset.name || "default"}`}
							variant="ghost"
							size="sm"
							className="aa-employee-roster__button h-8 max-w-36 min-w-0 shrink-0 gap-1.5 rounded-md px-1.5 text-xs font-normal text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
							onClick={() => onExecutePreset(preset)}
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
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={() => onExecutePreset(preset)}>
					Run preset
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem onSelect={() => onEdit(preset)}>
					Edit preset
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
