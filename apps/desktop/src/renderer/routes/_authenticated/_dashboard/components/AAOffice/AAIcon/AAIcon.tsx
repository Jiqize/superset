import { cn } from "@superset/ui/utils";
import type { SVGProps } from "react";

export type AAIconName =
	| "agents"
	| "archive"
	| "automations"
	| "briefcase"
	| "changes"
	| "folder"
	| "home"
	| "pull-requests"
	| "review"
	| "sessions"
	| "settings"
	| "tasks"
	| "terminal";

interface AAIconProps extends SVGProps<SVGSVGElement> {
	name: AAIconName;
}

export function AAIcon({ name, className, ...props }: AAIconProps) {
	return (
		<svg
			aria-hidden="true"
			className={cn("aa-pixel-icon", className)}
			fill="none"
			shapeRendering="crispEdges"
			viewBox="0 0 24 24"
			{...props}
		>
			{renderIcon(name)}
		</svg>
	);
}

function renderIcon(name: AAIconName) {
	switch (name) {
		case "home":
			return (
				<path
					fill="currentColor"
					d="M3 10h2V8h2V6h2V4h6v2h2v2h2v2h2v11h-7v-7h-4v7H3zm4 1v8h1v-7h8v7h1v-8l-5-5z"
				/>
			);
		case "briefcase":
			return (
				<>
					<path
						fill="currentColor"
						d="M3 8h18v12H3zM8 4h8v2h2v3h-2V7H8v2H6V6h2z"
					/>
					<path fill="var(--aa-paper)" d="M11 12h2v4h-2z" />
				</>
			);
		case "archive":
			return (
				<>
					<path fill="currentColor" d="M5 3h14v18H5z" />
					<path fill="var(--aa-paper)" d="M7 5h10v6H7zm0 8h10v6H7z" />
					<path fill="currentColor" d="M10 7h4v2h-4zm0 8h4v2h-4z" />
				</>
			);
		case "sessions":
			return (
				<>
					<path fill="currentColor" d="M3 4h18v13h-8l-5 4v-4H3z" />
					<path fill="var(--aa-paper)" d="M5 6h14v9h-7l-2 2v-2H5z" />
					<path fill="currentColor" d="M7 10h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
				</>
			);
		case "agents":
			return (
				<>
					<path
						fill="currentColor"
						d="M7 5h10v2h2v12h-2v2H7v-2H5V7h2zm4-3h2v3h-2z"
					/>
					<path
						fill="var(--aa-paper)"
						d="M8 9h3v3H8zm5 0h3v3h-3zm-3 6h5v2h-5z"
					/>
				</>
			);
		case "tasks":
			return (
				<>
					<path fill="currentColor" d="M4 3h16v19H4z" />
					<path fill="var(--aa-paper)" d="M6 5h12v15H6z" />
					<path
						fill="currentColor"
						d="M8 8h2v2H8zm4 0h4v2h-4zm-4 4h2v2H8zm4 0h4v2h-4zm-4 4h2v2H8zm4 0h4v2h-4z"
					/>
				</>
			);
		case "automations":
			return (
				<>
					<path fill="currentColor" d="M3 5h7v6H3zm11 0h7v6h-7zM8 15h8v7H8z" />
					<path fill="currentColor" d="M9 8h6v2H9zm2 2h2v6h-2z" />
					<path
						fill="var(--aa-paper)"
						d="M5 7h3v2H5zm11 0h3v2h-3zm-6 10h4v3h-4z"
					/>
				</>
			);
		case "pull-requests":
			return (
				<>
					<path
						fill="currentColor"
						d="M5 3h4v4H5zm10 14h4v4h-4zM5 9h2v12H5zm10-6h2v12h-2z"
					/>
					<path fill="currentColor" d="M7 16h9v2H7zM12 6h5v2h-5z" />
					<path fill="currentColor" d="m10 4 4 3-4 3z" />
				</>
			);
		case "settings":
			return (
				<path
					fill="currentColor"
					d="M9 2h6v3h3l2-2 3 3-2 2v3h3v5h-3v3l2 2-3 3-2-2h-3v3H9v-3H6l-2 2-3-3 2-2v-3H0v-5h3V8L1 6l3-3 2 2h3zm3 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4"
				/>
			);
		case "folder":
			return (
				<>
					<path fill="currentColor" d="M2 6h8l2 2h10v13H2z" />
					<path fill="var(--aa-paper)" d="M4 9h7l2 2h7v8H4z" />
				</>
			);
		case "terminal":
			return (
				<>
					<path fill="currentColor" d="M2 3h20v16H2zm5 18h10v2H7z" />
					<path fill="#202923" d="M4 5h16v12H4z" />
					<path
						fill="var(--aa-success)"
						d="m6 8 3 3-3 3v-2l1-1-1-1zm5 5h5v2h-5z"
					/>
				</>
			);
		case "changes":
			return (
				<>
					<path fill="currentColor" d="M6 3h13v17H6zM3 6h2v15h11v2H3z" />
					<path fill="var(--aa-paper)" d="M8 5h9v13H8z" />
					<path fill="currentColor" d="M10 8h5v2h-5zm0 4h5v2h-5z" />
				</>
			);
		case "review":
			return (
				<>
					<path fill="currentColor" d="M5 2h12l3 3v17H5z" />
					<path fill="var(--aa-paper)" d="M7 4h9v3h2v13H7z" />
					<path
						fill="currentColor"
						d="M9 10h6v2H9zm0 4h3v2H9zm4 1 1 1 3-4 1 1-4 6-2-3z"
					/>
				</>
			);
	}
}
