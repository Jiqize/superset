import type { ReactNode } from "react";

interface AAWindowFrameProps {
	children: ReactNode;
	footer: ReactNode;
}

export function AAWindowFrame({ children, footer }: AAWindowFrameProps) {
	return (
		<section aria-label="AA Terminal Office" className="aa-window-frame">
			<div className="aa-window-frame__workarea">{children}</div>
			{footer}
		</section>
	);
}
