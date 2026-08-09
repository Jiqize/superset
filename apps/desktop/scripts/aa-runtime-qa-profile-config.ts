import { isAbsolute, join, resolve } from "node:path";

export const AA_RUNTIME_QA_PROFILE_ENV = "AA_RUNTIME_QA_PROFILE_DIR";
export const AA_RUNTIME_QA_VITE_PORT_ENV = "AA_RUNTIME_QA_VITE_PORT";
export const AA_RUNTIME_QA_NOTIFICATIONS_PORT_ENV =
	"AA_RUNTIME_QA_NOTIFICATIONS_PORT";
export const AA_RUNTIME_QA_CDP_PORT_ENV = "AA_RUNTIME_QA_CDP_PORT";
export const AA_RUNTIME_QA_ELECTRIC_URL_ENV = "AA_RUNTIME_QA_ELECTRIC_URL";

export interface AARuntimeQaProfile {
	profileRoot: string;
	supersetHomeDir: string;
	electronUserDataDir: string;
	vitePort: number;
	notificationsPort: number;
	cdpPort: number;
}

export function resolveAARuntimeQaProfile({
	profileRoot,
	vitePort,
	notificationsPort,
	cdpPort,
}: {
	profileRoot: string;
	vitePort: number;
	notificationsPort: number;
	cdpPort: number;
}): AARuntimeQaProfile {
	if (!isAbsolute(profileRoot)) {
		throw new Error("AA runtime QA profile root must be absolute");
	}
	const ports = [vitePort, notificationsPort, cdpPort];
	if (
		ports.some((port) => !Number.isInteger(port) || port < 1 || port > 65_535)
	) {
		throw new Error("AA runtime QA profile ports must be valid TCP ports");
	}
	if (new Set(ports).size !== ports.length) {
		throw new Error("AA runtime QA profile ports must be distinct");
	}

	const normalizedRoot = resolve(profileRoot);
	return {
		profileRoot: normalizedRoot,
		supersetHomeDir: join(normalizedRoot, "superset-home"),
		electronUserDataDir: join(normalizedRoot, "electron-user-data"),
		vitePort,
		notificationsPort,
		cdpPort,
	};
}

export function applyAARuntimeQaEnvironment(
	env: Record<string, string | undefined>,
): AARuntimeQaProfile | null {
	const profileRoot = env[AA_RUNTIME_QA_PROFILE_ENV]?.trim();
	if (!profileRoot) return null;

	const profile = resolveAARuntimeQaProfile({
		profileRoot,
		vitePort: parsePort(env[AA_RUNTIME_QA_VITE_PORT_ENV], 3005),
		notificationsPort: parsePort(
			env[AA_RUNTIME_QA_NOTIFICATIONS_PORT_ENV],
			13_306,
		),
		cdpPort: parsePort(env[AA_RUNTIME_QA_CDP_PORT_ENV], 19_323),
	});
	env.SUPERSET_HOME_DIR = profile.supersetHomeDir;
	env.DESKTOP_VITE_PORT = String(profile.vitePort);
	env.DESKTOP_NOTIFICATIONS_PORT = String(profile.notificationsPort);
	env.RENDERER_REMOTE_DEBUG_PORT = String(profile.cdpPort);
	env.SUPERSET_WORKSPACE_NAME = "aa-runtime-qa";
	env.NEXT_PUBLIC_ELECTRIC_URL =
		env[AA_RUNTIME_QA_ELECTRIC_URL_ENV]?.trim() || "http://localhost:3012";
	return profile;
}

function parsePort(value: string | undefined, fallback: number): number {
	if (!value?.trim()) return fallback;
	return Number(value);
}
