#!/usr/bin/env bun

import {
	chmodSync,
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
import { createServer } from "node:net";
import { join, relative, resolve } from "node:path";
import {
	AA_RUNTIME_QA_CDP_PORT_ENV,
	AA_RUNTIME_QA_NOTIFICATIONS_PORT_ENV,
	AA_RUNTIME_QA_PROFILE_ENV,
	AA_RUNTIME_QA_VITE_PORT_ENV,
	resolveAARuntimeQaProfile,
} from "./aa-runtime-qa-profile-config";

const REPO_ROOT = resolve(import.meta.dirname, "../../..");
const PROFILE_BASE = join(REPO_ROOT, ".superset", "qa-profiles");
const MARKER_NAME = ".aa-runtime-qa-profile.json";
const PID_NAME = "launcher.pid";

type Command = "prepare" | "start" | "status" | "clean";

interface Options {
	command: Command;
	profileName: string;
	vitePort: number;
	notificationsPort: number;
	cdpPort: number;
}

interface ProfileMarker {
	kind: "aa-runtime-qa-profile";
	profileName: string;
	version: 1;
}

function parseOptions(argv: string[]): Options {
	const command = (argv[0] ?? "status") as Command;
	if (!["prepare", "start", "status", "clean"].includes(command)) {
		throw new Error(`Unknown command: ${command}`);
	}
	const options: Options = {
		command,
		profileName: "phase-3c",
		vitePort: 3005,
		notificationsPort: 13_306,
		cdpPort: 19_323,
	};
	for (let index = 1; index < argv.length; index += 1) {
		const argument = argv[index];
		const next = () => {
			const value = argv[++index];
			if (!value) throw new Error(`Missing value after ${argument}`);
			return value;
		};
		switch (argument) {
			case "--profile":
				options.profileName = next();
				break;
			case "--vite-port":
				options.vitePort = Number(next());
				break;
			case "--notifications-port":
				options.notificationsPort = Number(next());
				break;
			case "--cdp-port":
				options.cdpPort = Number(next());
				break;
			default:
				throw new Error(`Unknown option: ${argument}`);
		}
	}
	if (!/^[a-z0-9][a-z0-9-]{0,48}$/.test(options.profileName)) {
		throw new Error(
			"Profile name must contain only lowercase letters, digits, and hyphens",
		);
	}
	return options;
}

function markerPath(profileRoot: string): string {
	return join(profileRoot, MARKER_NAME);
}

function pidPath(profileRoot: string): string {
	return join(profileRoot, PID_NAME);
}

function assertManagedProfileRoot(profileRoot: string): void {
	const scopedPath = relative(PROFILE_BASE, profileRoot);
	if (
		!scopedPath ||
		scopedPath.startsWith("..") ||
		scopedPath.includes("/../")
	) {
		throw new Error(
			"Refusing profile operation outside the repository QA profile directory",
		);
	}
}

function prepareProfile(
	profileRoot: string,
	profileName: string,
	supersetHomeDir: string,
	electronUserDataDir: string,
): void {
	assertManagedProfileRoot(profileRoot);
	mkdirSync(supersetHomeDir, { recursive: true, mode: 0o700 });
	mkdirSync(electronUserDataDir, { recursive: true, mode: 0o700 });
	const marker: ProfileMarker = {
		kind: "aa-runtime-qa-profile",
		profileName,
		version: 1,
	};
	writeFileSync(
		markerPath(profileRoot),
		`${JSON.stringify(marker, null, 2)}\n`,
		{
			mode: 0o600,
		},
	);
	chmodSync(profileRoot, 0o700);
}

function readMarker(profileRoot: string): ProfileMarker | null {
	if (!existsSync(markerPath(profileRoot))) return null;
	try {
		const marker = JSON.parse(
			readFileSync(markerPath(profileRoot), "utf8"),
		) as Partial<ProfileMarker>;
		if (
			marker.kind !== "aa-runtime-qa-profile" ||
			marker.version !== 1 ||
			typeof marker.profileName !== "string"
		) {
			return null;
		}
		return marker as ProfileMarker;
	} catch {
		return null;
	}
}

function readLiveLauncherPid(profileRoot: string): number | null {
	if (!existsSync(pidPath(profileRoot))) return null;
	const pid = Number(readFileSync(pidPath(profileRoot), "utf8").trim());
	if (!Number.isInteger(pid) || pid < 1) return null;
	try {
		process.kill(pid, 0);
		return pid;
	} catch {
		return null;
	}
}

async function assertPortsAvailable(ports: readonly number[]): Promise<void> {
	for (const port of ports) {
		await new Promise<void>((resolveAvailable, rejectUnavailable) => {
			const server = createServer();
			server.unref();
			server.once("error", () => {
				rejectUnavailable(new Error(`QA port ${port} is already in use`));
			});
			server.listen(port, "127.0.0.1", () => {
				server.close(() => resolveAvailable());
			});
		});
	}
}

async function main(): Promise<void> {
	const options = parseOptions(process.argv.slice(2));
	const profile = resolveAARuntimeQaProfile({
		profileRoot: join(PROFILE_BASE, options.profileName),
		vitePort: options.vitePort,
		notificationsPort: options.notificationsPort,
		cdpPort: options.cdpPort,
	});
	assertManagedProfileRoot(profile.profileRoot);

	if (options.command === "prepare") {
		prepareProfile(
			profile.profileRoot,
			options.profileName,
			profile.supersetHomeDir,
			profile.electronUserDataDir,
		);
		console.log(
			`Prepared disposable AA runtime QA profile: ${options.profileName}`,
		);
		return;
	}

	if (options.command === "status") {
		console.log(
			JSON.stringify(
				{
					profile: options.profileName,
					prepared: Boolean(readMarker(profile.profileRoot)),
					runningPid: readLiveLauncherPid(profile.profileRoot),
					vitePort: profile.vitePort,
					notificationsPort: profile.notificationsPort,
					cdpPort: profile.cdpPort,
				},
				null,
				2,
			),
		);
		return;
	}

	if (options.command === "clean") {
		const marker = readMarker(profile.profileRoot);
		if (!marker || marker.profileName !== options.profileName) {
			throw new Error("Refusing to clean an unmarked or mismatched QA profile");
		}
		const livePid = readLiveLauncherPid(profile.profileRoot);
		if (livePid) {
			throw new Error(`Stop QA launcher ${livePid} before cleanup`);
		}
		rmSync(profile.profileRoot, { recursive: true, force: false });
		console.log(
			`Removed disposable AA runtime QA profile: ${options.profileName}`,
		);
		return;
	}

	prepareProfile(
		profile.profileRoot,
		options.profileName,
		profile.supersetHomeDir,
		profile.electronUserDataDir,
	);
	const livePid = readLiveLauncherPid(profile.profileRoot);
	if (livePid)
		throw new Error(`QA profile is already running under PID ${livePid}`);
	await assertPortsAvailable([
		profile.vitePort,
		profile.notificationsPort,
		profile.cdpPort,
	]);
	writeFileSync(pidPath(profile.profileRoot), `${process.pid}\n`, {
		mode: 0o600,
	});

	const child = Bun.spawn(["bun", "run", "--cwd", "apps/desktop", "dev"], {
		cwd: REPO_ROOT,
		env: {
			...process.env,
			[AA_RUNTIME_QA_PROFILE_ENV]: profile.profileRoot,
			[AA_RUNTIME_QA_VITE_PORT_ENV]: String(profile.vitePort),
			[AA_RUNTIME_QA_NOTIFICATIONS_PORT_ENV]: String(profile.notificationsPort),
			[AA_RUNTIME_QA_CDP_PORT_ENV]: String(profile.cdpPort),
		},
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	});
	const forwardSignal = (signal: NodeJS.Signals) => child.kill(signal);
	process.once("SIGINT", () => forwardSignal("SIGINT"));
	process.once("SIGTERM", () => forwardSignal("SIGTERM"));
	try {
		const exitCode = await child.exited;
		if (exitCode !== 0 && exitCode !== 130 && exitCode !== 143) {
			throw new Error(`AA runtime QA desktop exited with code ${exitCode}`);
		}
	} finally {
		if (existsSync(pidPath(profile.profileRoot))) {
			unlinkSync(pidPath(profile.profileRoot));
		}
	}
}

await main();
