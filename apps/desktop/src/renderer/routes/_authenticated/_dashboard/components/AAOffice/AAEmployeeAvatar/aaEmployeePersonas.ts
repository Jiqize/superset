export type AAEmployeePersonaId =
	| "claude"
	| "codex"
	| "copilot"
	| "generic"
	| "grok"
	| "kimi"
	| "mistral"
	| "opencode"
	| "pi"
	| "superset";

export type AAEmployeeHair =
	| "cap"
	| "crop"
	| "fringe"
	| "parted"
	| "short"
	| "spiked"
	| "swept"
	| "wave";

export type AAEmployeeEyewear = "none" | "round" | "square";
export type AAEmployeeJacket =
	| "charcoal"
	| "navy"
	| "olive"
	| "slate"
	| "umber";
export type AAEmployeeAccent = "blue" | "brass" | "charcoal" | "paper";

export interface AAEmployeePersona {
	accent: AAEmployeeAccent;
	badge: string;
	eyewear: AAEmployeeEyewear;
	hair: AAEmployeeHair;
	id: AAEmployeePersonaId;
	jacket: AAEmployeeJacket;
}

export const AA_EMPLOYEE_PERSONAS = {
	claude: {
		accent: "paper",
		badge: "C",
		eyewear: "none",
		hair: "parted",
		id: "claude",
		jacket: "umber",
	},
	codex: {
		accent: "paper",
		badge: "X",
		eyewear: "square",
		hair: "crop",
		id: "codex",
		jacket: "navy",
	},
	copilot: {
		accent: "blue",
		badge: "P",
		eyewear: "none",
		hair: "cap",
		id: "copilot",
		jacket: "slate",
	},
	generic: {
		accent: "paper",
		badge: "?",
		eyewear: "none",
		hair: "crop",
		id: "generic",
		jacket: "slate",
	},
	grok: {
		accent: "blue",
		badge: "G",
		eyewear: "none",
		hair: "spiked",
		id: "grok",
		jacket: "charcoal",
	},
	kimi: {
		accent: "paper",
		badge: "K",
		eyewear: "round",
		hair: "short",
		id: "kimi",
		jacket: "olive",
	},
	mistral: {
		accent: "brass",
		badge: "M",
		eyewear: "square",
		hair: "fringe",
		id: "mistral",
		jacket: "umber",
	},
	opencode: {
		accent: "brass",
		badge: "O",
		eyewear: "round",
		hair: "wave",
		id: "opencode",
		jacket: "slate",
	},
	pi: {
		accent: "brass",
		badge: "π",
		eyewear: "round",
		hair: "swept",
		id: "pi",
		jacket: "navy",
	},
	superset: {
		accent: "paper",
		badge: "S",
		eyewear: "square",
		hair: "parted",
		id: "superset",
		jacket: "charcoal",
	},
} as const satisfies Record<AAEmployeePersonaId, AAEmployeePersona>;

const PERSONA_RULES: ReadonlyArray<{
	aliases: readonly string[];
	persona: AAEmployeePersonaId;
}> = [
	{ persona: "claude", aliases: ["claude", "claude code", "anthropic claude"] },
	{ persona: "codex", aliases: ["codex", "openai codex"] },
	{ persona: "opencode", aliases: ["opencode", "open code"] },
	{ persona: "grok", aliases: ["grok", "xai grok"] },
	{ persona: "copilot", aliases: ["copilot", "github copilot"] },
	{ persona: "mistral", aliases: ["mistral", "mistral vibe"] },
	{ persona: "kimi", aliases: ["kimi", "kimi code"] },
	{ persona: "superset", aliases: ["superset", "superset cli"] },
	{ persona: "pi", aliases: ["pi", "pi coding agent"] },
];

interface ResolveAAEmployeePersonaInput {
	agentId?: string | null;
	name: string;
}

export function resolveAAEmployeePersona({
	agentId,
	name,
}: ResolveAAEmployeePersonaInput): AAEmployeePersona {
	const candidates = [agentId, name]
		.filter((value): value is string => Boolean(value?.trim()))
		.map(normalizeIdentity);

	for (const rule of PERSONA_RULES) {
		if (
			candidates.some((candidate) =>
				rule.aliases.some((alias) => containsAlias(candidate, alias)),
			)
		) {
			return AA_EMPLOYEE_PERSONAS[rule.persona];
		}
	}

	return AA_EMPLOYEE_PERSONAS.generic;
}

function normalizeIdentity(value: string): string {
	return value
		.toLocaleLowerCase()
		.replace(/[^a-z0-9π]+/g, " ")
		.trim();
}

function containsAlias(candidate: string, alias: string): boolean {
	return ` ${candidate} `.includes(` ${normalizeIdentity(alias)} `);
}
