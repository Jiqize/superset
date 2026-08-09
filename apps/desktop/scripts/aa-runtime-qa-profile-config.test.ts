import { describe, expect, it } from "bun:test";
import {
	applyAARuntimeQaEnvironment,
	resolveAARuntimeQaProfile,
} from "./aa-runtime-qa-profile-config";

describe("AA runtime QA profile configuration", () => {
	it("isolates Superset state, Electron user data, and diagnostic ports", () => {
		const profile = resolveAARuntimeQaProfile({
			profileRoot: "/repo/.superset/qa-profiles/aa-runtime-v0.1",
			vitePort: 13_305,
			notificationsPort: 13_306,
			cdpPort: 19_323,
		});

		expect(profile).toEqual({
			profileRoot: "/repo/.superset/qa-profiles/aa-runtime-v0.1",
			supersetHomeDir:
				"/repo/.superset/qa-profiles/aa-runtime-v0.1/superset-home",
			electronUserDataDir:
				"/repo/.superset/qa-profiles/aa-runtime-v0.1/electron-user-data",
			vitePort: 13_305,
			notificationsPort: 13_306,
			cdpPort: 19_323,
		});
	});

	it("applies the isolated profile after repository dotenv values", () => {
		const env: Record<string, string | undefined> = {
			AA_RUNTIME_QA_PROFILE_DIR: "/repo/.superset/qa-profiles/aa-runtime-v0.1",
			AA_RUNTIME_QA_VITE_PORT: "13305",
			AA_RUNTIME_QA_NOTIFICATIONS_PORT: "13306",
			AA_RUNTIME_QA_CDP_PORT: "19323",
			SUPERSET_HOME_DIR: "/shared/profile",
			DESKTOP_VITE_PORT: "3005",
			DESKTOP_NOTIFICATIONS_PORT: "3006",
		};

		const profile = applyAARuntimeQaEnvironment(env);

		expect(profile?.profileRoot).toContain("aa-runtime-v0.1");
		expect(env.SUPERSET_HOME_DIR).toEndWith("/superset-home");
		expect(env.DESKTOP_VITE_PORT).toBe("13305");
		expect(env.DESKTOP_NOTIFICATIONS_PORT).toBe("13306");
		expect(env.RENDERER_REMOTE_DEBUG_PORT).toBe("19323");
		expect(env.SUPERSET_WORKSPACE_NAME).toBe("aa-runtime-qa");
		expect(env.NEXT_PUBLIC_ELECTRIC_URL).toBe("http://localhost:3012");
	});

	it("uses the repository-supported desktop port when no override is supplied", () => {
		const env: Record<string, string | undefined> = {
			AA_RUNTIME_QA_PROFILE_DIR: "/repo/.superset/qa-profiles/aa-runtime-v0.1",
		};

		const profile = applyAARuntimeQaEnvironment(env);

		expect(profile?.vitePort).toBe(3005);
		expect(env.DESKTOP_VITE_PORT).toBe("3005");
	});

	it("rejects relative roots and colliding ports", () => {
		expect(() =>
			resolveAARuntimeQaProfile({
				profileRoot: "relative/profile",
				vitePort: 13_305,
				notificationsPort: 13_306,
				cdpPort: 19_323,
			}),
		).toThrow("absolute");
		expect(() =>
			resolveAARuntimeQaProfile({
				profileRoot: "/tmp/qa-profile",
				vitePort: 13_305,
				notificationsPort: 13_305,
				cdpPort: 19_323,
			}),
		).toThrow("distinct");
	});
});
