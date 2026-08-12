import { cn } from "@superset/ui/utils";
import { type ReactNode, useId } from "react";
import { resolveAAApplicationPagePresentation } from "./aaApplicationPagePresentation";

interface AAApplicationPageProps {
	children: ReactNode;
	pathname: string;
	settings?: boolean;
}

export function AAApplicationPage({
	children,
	pathname,
	settings = false,
}: AAApplicationPageProps) {
	const presentation = resolveAAApplicationPagePresentation(pathname);
	const labelId = useId();
	if (!presentation) return children;

	return (
		<section
			aria-labelledby={labelId}
			className={cn(
				"aa-application-page",
				settings && "aa-application-page--settings",
			)}
			data-aa-page={presentation.route}
		>
			<header className="aa-application-page__header">
				<span className="aa-application-page__eyebrow">
					{presentation.eyebrow}
				</span>
				<h1 id={labelId} className="aa-application-page__title">
					{presentation.title}
				</h1>
				<span className="aa-application-page__description">
					{presentation.description}
				</span>
			</header>
			<div className="aa-application-page__body">{children}</div>
		</section>
	);
}
