import { Tooltip, TooltipContent, TooltipTrigger } from "@superset/ui/tooltip";
import { cn } from "@superset/ui/utils";
import type { KeyboardEvent } from "react";
import { useHotkeyDisplay } from "renderer/hotkeys";
import {
	AA_FILE_CABINET_PANEL_ID,
	AAIcon,
	type AAIconName,
	getAAFileCabinetTabId,
} from "renderer/routes/_authenticated/_dashboard/components/AAOffice";
import { getSidebarHeaderTabButtonClassName } from "renderer/screens/main/components/WorkspaceView/RightSidebar/headerTabStyles";
import type { SidebarTabDefinition } from "../../types";

interface SidebarHeaderProps {
	tabs: SidebarTabDefinition[];
	activeTab: string;
	onTabChange: (id: string) => void;
	compact?: boolean;
	aaOffice?: boolean;
}

export function SidebarHeader({
	tabs,
	activeTab,
	onTabChange,
	compact,
	aaOffice = false,
}: SidebarHeaderProps) {
	const actions = tabs.find((t) => t.id === activeTab)?.actions;
	const filesShortcut = useHotkeyDisplay("AA_OPEN_FILES");
	const changesShortcut = useHotkeyDisplay("TOGGLE_SIDEBAR");
	const focusAATab = (index: number) => {
		const tab = tabs[index];
		if (!tab) return;
		onTabChange(tab.id);
		requestAnimationFrame(() => {
			document.getElementById(getAAFileCabinetTabId(tab.id))?.focus();
		});
	};
	const handleAATabKeyDown = (
		event: KeyboardEvent<HTMLButtonElement>,
		index: number,
	) => {
		if (!aaOffice || tabs.length < 2) return;
		let nextIndex: number | null = null;
		switch (event.key) {
			case "ArrowLeft":
				nextIndex = (index - 1 + tabs.length) % tabs.length;
				break;
			case "ArrowRight":
				nextIndex = (index + 1) % tabs.length;
				break;
			case "Home":
				nextIndex = 0;
				break;
			case "End":
				nextIndex = tabs.length - 1;
				break;
			default:
				return;
		}
		event.preventDefault();
		focusAATab(nextIndex);
	};

	return (
		<div
			aria-label="File Cabinet views"
			className={cn(
				"flex h-10 shrink-0 items-stretch",
				aaOffice && "aa-file-cabinet__tabs",
			)}
			role="tablist"
		>
			<div className="flex min-w-0 flex-1 items-center h-full overflow-hidden">
				{tabs.map((tab, index) => {
					const isActive = activeTab === tab.id;
					const badge =
						typeof tab.badge === "number" && tab.badge > 0
							? formatBadgeCount(tab.badge)
							: null;
					const label = badge ? `${tab.label} (${badge})` : tab.label;
					const shortcut =
						tab.id === "files"
							? filesShortcut.text
							: tab.id === "changes"
								? changesShortcut.text
								: "";
					const accessibleLabel = shortcut ? `${label} · ${shortcut}` : label;
					const aaIconName = aaOffice ? getAAIconName(tab.id) : null;
					const btn = (
						<button
							key={tab.id}
							type="button"
							onClick={() => onTabChange(tab.id)}
							onKeyDown={(event) => handleAATabKeyDown(event, index)}
							aria-label={accessibleLabel}
							aria-controls={AA_FILE_CABINET_PANEL_ID}
							aria-selected={isActive}
							id={getAAFileCabinetTabId(tab.id)}
							role="tab"
							tabIndex={isActive ? 0 : -1}
							title={accessibleLabel}
							className={cn(
								getSidebarHeaderTabButtonClassName({
									isActive,
									compact,
									inverted: true,
								}),
								"relative flex-1 justify-center",
								aaOffice && "aa-file-cabinet__tab",
								// The resizable panel already draws the sidebar's left edge.
								index === 0 && "border-l-transparent",
							)}
							data-active={isActive || undefined}
						>
							{aaIconName ? (
								<AAIcon name={aaIconName} />
							) : (
								tab.icon && <tab.icon className="size-3" />
							)}
							{!compact && tab.label}
							{badge && (
								<span
									aria-hidden="true"
									className={cn(
										"shrink-0 rounded-full bg-muted px-1.5 text-[10px] font-medium leading-4 tabular-nums text-muted-foreground",
										isActive && "bg-background/80 text-foreground",
										compact &&
											"absolute right-1 top-1 min-w-3 px-1 text-[9px] leading-3",
									)}
								>
									{badge}
								</span>
							)}
						</button>
					);

					if (compact) {
						return (
							<Tooltip key={tab.id}>
								<TooltipTrigger asChild>{btn}</TooltipTrigger>
								<TooltipContent side="bottom">{accessibleLabel}</TooltipContent>
							</Tooltip>
						);
					}

					return btn;
				})}
			</div>
			{actions && (
				<div
					className={cn(
						"flex shrink-0 items-center h-10 pr-2 gap-0.5",
						aaOffice && "aa-file-cabinet__actions",
					)}
				>
					{actions}
				</div>
			)}
		</div>
	);
}

function formatBadgeCount(count: number): string {
	return count > 99 ? "99+" : String(count);
}

function getAAIconName(tabId: string): AAIconName | null {
	switch (tabId) {
		case "files":
			return "folder";
		case "changes":
			return "changes";
		case "review":
			return "review";
		default:
			return null;
	}
}
