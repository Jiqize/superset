import { cn } from "@superset/ui/utils";
import type { ReactNode } from "react";
import { AANavigationRail } from "../AANavigationRail";
import "../aa-office.css";
import {
	isAAApplicationShellRoute,
	resolveAAApplicationRoute,
} from "./aaApplicationShellPresentation";

interface AAApplicationShellProps {
	children: ReactNode;
	enabled: boolean;
	pathname: string;
}

export function AAApplicationShell({
	children,
	enabled,
	pathname,
}: AAApplicationShellProps) {
	const active = enabled && isAAApplicationShellRoute(pathname);
	if (!active) return children;

	return (
		<div
			className={cn("aa-office-shell", "aa-application-shell")}
			data-aa-route={resolveAAApplicationRoute(pathname)}
		>
			<AANavigationRail pathname={pathname} />
			<div className="aa-application-shell__content">{children}</div>
		</div>
	);
}
