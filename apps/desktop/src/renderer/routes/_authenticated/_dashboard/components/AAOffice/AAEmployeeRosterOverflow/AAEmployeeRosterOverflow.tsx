import {
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	getAAEmployeeRosterOverflowState,
	getAAEmployeeRosterScrollDistance,
} from "./aaEmployeeRosterOverflowPresentation";

interface AAEmployeeRosterOverflowProps {
	children: ReactNode;
}

const INITIAL_OVERFLOW_STATE = {
	canScrollLeft: false,
	canScrollRight: false,
	hasOverflow: false,
};

export function AAEmployeeRosterOverflow({
	children,
}: AAEmployeeRosterOverflowProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [overflow, setOverflow] = useState(INITIAL_OVERFLOW_STATE);

	const updateOverflow = useCallback(() => {
		const root = rootRef.current;
		const viewport = viewportRef.current;
		const content = contentRef.current;
		if (!root || !viewport || !content) return;

		const next = getAAEmployeeRosterOverflowState({
			containerWidth: root.clientWidth,
			contentWidth: content.scrollWidth,
			scrollLeft: viewport.scrollLeft,
			viewportWidth: viewport.clientWidth,
		});
		setOverflow((current) =>
			current.canScrollLeft === next.canScrollLeft &&
			current.canScrollRight === next.canScrollRight &&
			current.hasOverflow === next.hasOverflow
				? current
				: next,
		);
	}, []);

	useLayoutEffect(() => {
		updateOverflow();
		const root = rootRef.current;
		const viewport = viewportRef.current;
		const content = contentRef.current;
		if (!root || !viewport || !content) return;

		const resizeObserver = new ResizeObserver(updateOverflow);
		resizeObserver.observe(root);
		resizeObserver.observe(viewport);
		resizeObserver.observe(content);
		return () => resizeObserver.disconnect();
	}, [updateOverflow]);

	const scrollByGroup = useCallback((direction: -1 | 1) => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		viewport.scrollBy({
			behavior: prefersReducedMotion() ? "auto" : "smooth",
			left: direction * getAAEmployeeRosterScrollDistance(viewport.clientWidth),
		});
	}, []);

	const handleViewportKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			if (event.target !== event.currentTarget) return;
			switch (event.key) {
				case "ArrowLeft":
					event.preventDefault();
					scrollByGroup(-1);
					break;
				case "ArrowRight":
					event.preventDefault();
					scrollByGroup(1);
					break;
				case "Home":
					event.preventDefault();
					viewportRef.current?.scrollTo({ left: 0 });
					break;
				case "End":
					event.preventDefault();
					viewportRef.current?.scrollTo({
						left: viewportRef.current.scrollWidth,
					});
					break;
			}
		},
		[scrollByGroup],
	);

	return (
		<div
			className="aa-employee-roster__overflow"
			data-can-scroll-left={overflow.canScrollLeft}
			data-can-scroll-right={overflow.canScrollRight}
			data-overflow={overflow.hasOverflow}
			ref={rootRef}
		>
			{overflow.hasOverflow ? (
				overflow.canScrollLeft ? (
					<RosterScrollButton
						direction="left"
						onClick={() => scrollByGroup(-1)}
					/>
				) : (
					<span
						aria-hidden="true"
						className="aa-employee-roster__scroll-slot"
					/>
				)
			) : null}
			<section
				aria-label="Employee roster"
				className="aa-employee-roster__viewport"
				onKeyDown={handleViewportKeyDown}
				onScroll={updateOverflow}
				ref={viewportRef}
				tabIndex={overflow.hasOverflow ? 0 : -1}
			>
				<div className="aa-employee-roster__content" ref={contentRef}>
					{children}
				</div>
			</section>
			{overflow.hasOverflow ? (
				overflow.canScrollRight ? (
					<RosterScrollButton
						direction="right"
						onClick={() => scrollByGroup(1)}
					/>
				) : (
					<span
						aria-hidden="true"
						className="aa-employee-roster__scroll-slot"
					/>
				)
			) : null}
		</div>
	);
}

function RosterScrollButton({
	direction,
	onClick,
}: {
	direction: "left" | "right";
	onClick: () => void;
}) {
	const label = `Scroll employee roster ${direction}`;
	return (
		<button
			aria-label={label}
			className="aa-employee-roster__scroll-button"
			title={label}
			type="button"
			onClick={onClick}
		>
			<svg aria-hidden="true" shapeRendering="crispEdges" viewBox="0 0 12 12">
				<path
					d="M8 1H6v2H4v2H2v2h2v2h2v2h2V9H6V7h4V5H6V3h2z"
					fill="currentColor"
					transform={direction === "right" ? "rotate(180 6 6)" : undefined}
				/>
			</svg>
		</button>
	);
}

function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
