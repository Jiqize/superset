export const AA_PI_REASONING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
] as const;

export type AAPiReasoningLevel = (typeof AA_PI_REASONING_LEVELS)[number];
export type AAHairStateName =
	| "full"
	| "trimmed"
	| "receding"
	| "sparse"
	| "bald";

export interface AAReasoningPresentation {
	hairState: AAHairStateName;
	label: string;
	level: AAPiReasoningLevel;
}

const REASONING_PRESENTATION: Record<
	AAPiReasoningLevel,
	AAReasoningPresentation
> = {
	off: { hairState: "full", label: "OFF", level: "off" },
	minimal: { hairState: "full", label: "MINIMAL", level: "minimal" },
	low: { hairState: "trimmed", label: "LOW", level: "low" },
	medium: { hairState: "receding", label: "MEDIUM", level: "medium" },
	high: { hairState: "sparse", label: "HIGH", level: "high" },
	xhigh: { hairState: "bald", label: "XHIGH", level: "xhigh" },
	max: { hairState: "bald", label: "MAX", level: "max" },
};

export function getAAReasoningPresentation(
	value: string | null | undefined,
): AAReasoningPresentation | null {
	const normalized = value?.trim().toLowerCase();
	if (!normalized || !isAAPiReasoningLevel(normalized)) return null;
	return REASONING_PRESENTATION[normalized];
}

function isAAPiReasoningLevel(value: string): value is AAPiReasoningLevel {
	return AA_PI_REASONING_LEVELS.some((level) => level === value);
}
