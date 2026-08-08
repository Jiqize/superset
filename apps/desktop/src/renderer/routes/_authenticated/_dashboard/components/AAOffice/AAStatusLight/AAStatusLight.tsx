import { cn } from "@superset/ui/utils";

export type AAStatusTone =
	| "attention"
	| "error"
	| "idle"
	| "offline"
	| "success"
	| "working";

interface AAStatusLightProps {
	className?: string;
	tone: AAStatusTone;
}

export function AAStatusLight({ className, tone }: AAStatusLightProps) {
	return (
		<span
			aria-hidden="true"
			className={cn("aa-status-light", `aa-status-light--${tone}`, className)}
		/>
	);
}
