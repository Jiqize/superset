#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const portableRoot = join(repoRoot, "docs/aa/portable");
const manifestPath = join(portableRoot, "asset-manifest.json");
const failures = [];
const checks = [];

function pass(message) {
	checks.push(message);
}

function fail(message) {
	failures.push(message);
}

function assert(condition, message) {
	if (condition) pass(message);
	else fail(message);
}

function read(path) {
	return readFileSync(path, "utf8");
}

function walk(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		return entry.isDirectory() ? walk(path) : [path];
	});
}

function portablePath(path) {
	return relative(portableRoot, path).split(sep).join("/");
}

function parseJson(path) {
	try {
		return JSON.parse(read(path));
	} catch (error) {
		fail(
			`${portablePath(path)} parses as JSON: ${error instanceof Error ? error.message : String(error)}`,
		);
		return undefined;
	}
}

assert(existsSync(manifestPath), "portable asset manifest exists");
const manifest = parseJson(manifestPath);
if (manifest === undefined) {
	console.error(failures.join("\n"));
	process.exit(1);
}

const allPortableFiles = walk(portableRoot);
for (const path of allPortableFiles.filter(
	(candidate) => extname(candidate) === ".json",
)) {
	if (path === manifestPath) continue;
	if (parseJson(path) !== undefined)
		pass(`${portablePath(path)} parses as JSON`);
}

const declaredFiles = [
	...manifest.assets.map((asset) => asset.path),
	...manifest.requiredRuntimeFiles,
	...manifest.requiredDocuments,
];
for (const path of declaredFiles) {
	assert(existsSync(join(portableRoot, path)), `manifest file exists: ${path}`);
}

const assetIds = manifest.assets.map((asset) => asset.id);
const assetPaths = manifest.assets.map((asset) => asset.path);
assert(
	new Set(assetIds).size === assetIds.length,
	"manifest asset ids are unique",
);
assert(
	new Set(assetPaths).size === assetPaths.length,
	"manifest asset paths are unique",
);
assert(
	manifest.assets.filter((asset) => asset.kind === "icon").length === 19,
	"manifest contains 19 required icons",
);
assert(
	manifest.assets.filter((asset) => asset.kind === "worker-reference")
		.length === 5,
	"manifest contains 5 worker reference sheets",
);
assert(
	manifest.license?.declared === false,
	"manifest does not prematurely declare an independent license",
);

const svgPaths = allPortableFiles.filter((path) => extname(path) === ".svg");
const manifestSvgPaths = new Set(
	assetPaths.filter((path) => extname(path) === ".svg"),
);
assert(
	svgPaths.length === manifestSvgPaths.size,
	"every portable SVG is represented exactly once in the manifest",
);

const rootSvgIds = [];
const xmllintProbe = spawnSync("xmllint", ["--version"], { encoding: "utf8" });
assert(xmllintProbe.status === 0, "xmllint is available for XML validation");

for (const path of svgPaths) {
	const rel = portablePath(path);
	const source = read(path);
	const asset = manifest.assets.find((candidate) => candidate.path === rel);
	assert(asset !== undefined, `SVG has manifest record: ${rel}`);
	assert(
		!lstatSync(path).isSymbolicLink(),
		`SVG is a regular local file: ${rel}`,
	);

	if (xmllintProbe.status === 0) {
		const result = spawnSync("xmllint", ["--noout", path], {
			encoding: "utf8",
		});
		assert(
			result.status === 0,
			`SVG/XML parses: ${rel}${result.stderr ? ` (${result.stderr.trim()})` : ""}`,
		);
	}

	const root = source.match(/<svg\b[^>]*>/)?.[0];
	const viewBox = root?.match(/\bviewBox="([^"]+)"/)?.[1];
	const rootId = root?.match(/\bid="([^"]+)"/)?.[1];
	if (rootId !== undefined) rootSvgIds.push(rootId);
	assert(root !== undefined, `SVG has a root element: ${rel}`);
	assert(rootId !== undefined, `SVG has a root asset id: ${rel}`);
	assert(
		viewBox?.split(/\s+/).every((part) => /^-?\d+$/.test(part)),
		`SVG viewBox uses integer coordinates: ${rel}`,
	);
	assert(
		asset === undefined || viewBox === asset.viewBox,
		`SVG viewBox matches manifest: ${rel}`,
	);
	assert(
		/shape-rendering="crispEdges"/.test(root ?? ""),
		`SVG requests crisp-edge rendering: ${rel}`,
	);
	assert(
		/<title\b[^>]*>[^<]+<\/title>/.test(source),
		`SVG has title metadata: ${rel}`,
	);
	assert(
		/<desc\b[^>]*>[^<]+<\/desc>/.test(source),
		`SVG has description metadata: ${rel}`,
	);
	assert(
		!/<(?:text|image|foreignObject)\b/i.test(source),
		`SVG is text/font/image independent: ${rel}`,
	);
	assert(
		!/(?:href|src)="(?:https?:|\/\/)/i.test(source),
		`SVG has no remote asset dependency: ${rel}`,
	);

	if (asset?.kind === "icon") {
		assert(viewBox === "0 0 24 24", `icon uses the 24-unit grid: ${rel}`);
		assert(
			JSON.stringify(asset.sizes) === JSON.stringify([16, 20, 24, 32]),
			`icon declares all supported sizes: ${rel}`,
		);
	}
	if (asset?.kind === "worker-reference") {
		assert(
			JSON.stringify(asset.sizes) === JSON.stringify([24, 32, 48]),
			`worker sheet declares all supported sizes: ${rel}`,
		);
	}
}
assert(
	new Set(rootSvgIds).size === rootSvgIds.length,
	"root SVG asset ids are unique",
);

const semantic = parseJson(join(portableRoot, "tokens/semantic.tokens.json"));
const supersetMap = parseJson(
	join(portableRoot, "tokens/superset.mapping.json"),
);
const dshMap = parseJson(join(portableRoot, "tokens/dsh.mapping.json"));

if (
	semantic !== undefined &&
	supersetMap !== undefined &&
	dshMap !== undefined
) {
	const semanticKeys = Object.keys(semantic.tokens).sort();
	for (const [name, mapping] of [
		["Superset", supersetMap.mappings],
		["DSH", dshMap.mappings],
	]) {
		assert(
			JSON.stringify(Object.keys(mapping).sort()) ===
				JSON.stringify(semanticKeys),
			`${name} mapping covers every semantic token and no extras`,
		);
		for (const key of semanticKeys) {
			const entry = mapping[key];
			assert(
				entry?.status === "supported" || entry?.status === "unsupported",
				`${name} mapping has explicit status: ${key}`,
			);
			if (entry?.status === "supported")
				assert(
					typeof entry.target === "string" && entry.target.length > 0,
					`${name} supported mapping has target: ${key}`,
				);
			if (entry?.status === "unsupported")
				assert(
					typeof entry.reason === "string" && entry.reason.length > 0,
					`${name} unsupported mapping explains gap: ${key}`,
				);
		}
	}

	const verifiedDshAliases = new Set([
		"--dsw-alias-bg-base",
		"--dsw-specific-sidebar-fill",
		"--dsw-alias-bg-layer-1",
		"--dsw-alias-bg-layer-2",
		"--dsw-alias-border-l2",
		"--dsw-alias-border-l1",
		"--dsw-alias-label-primary",
		"--dsw-alias-label-secondary",
		"--dsw-specific-sidebar-nav-item-active",
		"--dsw-alias-label-primary-foreground",
		"--dsw-alias-state-warn-primary",
		"--dsw-alias-state-success-primary",
		"--dsw-alias-state-error-primary",
		"--dsw-alias-brand-primary",
		"--dsw-alias-label-dimmed",
	]);
	for (const [key, entry] of Object.entries(dshMap.mappings)) {
		if (entry.status === "supported")
			assert(
				verifiedDshAliases.has(entry.target),
				`DSH mapping uses verified alias only: ${key}`,
			);
	}
}

const runtimeFiles = new Set([
	manifestPath,
	...manifest.assets.map((asset) => join(portableRoot, asset.path)),
	...manifest.requiredRuntimeFiles.map((path) => join(portableRoot, path)),
]);
const forbiddenRuntimePatterns = [
	[/@superset\//i, "Superset application module"],
	[/\belectron\b/i, "Electron"],
	[/\btrpc\b/i, "tRPC"],
	[
		/@tanstack\/(?:react-router|router|react-query|query|db)/i,
		"TanStack application data/router module",
	],
	[/(?:pi[-_ ]runtime|pi[-_ ]bridge)/i, "Pi Runtime bridge"],
	[/\bxterm\b/i, "xterm"],
	[/\.aa-office(?:-|\b)/i, "Superset-specific AA CSS class"],
	[
		/(?:OfficialBrand|deepseek[-_ ](?:logo|wordmark)|(?:logo|wordmark)[-_ ]deepseek|fish[-_ ]logo)/i,
		"DeepSeek official brand asset",
	],
];

for (const path of runtimeFiles) {
	const rel = portablePath(path);
	const source = read(path).replaceAll("http://www.w3.org/2000/svg", "");
	for (const [pattern, label] of forbiddenRuntimePatterns) {
		assert(
			!pattern.test(source),
			`runtime asset has no ${label} reference: ${rel}`,
		);
	}
	assert(
		!/https?:\/\//i.test(source),
		`runtime asset has no remote network resource: ${rel}`,
	);
}

const htmlPath = join(portableRoot, "gallery/index.html");
const cssPath = join(portableRoot, "gallery/aa-portable.css");
const jsPath = join(portableRoot, "gallery/gallery.js");
const html = read(htmlPath);
const css = read(cssPath);
const js = read(jsPath);

assert(/<!doctype html>/i.test(html), "gallery declares HTML document type");
assert(
	/<html\b[^>]*\blang="[^"]+"/i.test(html),
	"gallery declares document language",
);
assert(/<title>[^<]+<\/title>/i.test(html), "gallery has a document title");
assert(
	/<main\b[^>]*\bid="main-content"/i.test(html),
	"gallery has a main landmark",
);
assert(
	/<h1>[^<]+<\/h1>/i.test(html),
	"gallery has one visible primary heading",
);
assert(/href="#main-content"/.test(html), "gallery has a keyboard skip link");
assert(
	/STATIC GALLERY · DEMO DATA/.test(html),
	"gallery labels data as static demo content",
);
assert(
	/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css),
	"gallery CSS honors system reduced-motion preference",
);
assert(
	/data-aa-motion="reduce"/.test(css),
	"gallery CSS honors explicit reduced-motion mode",
);
assert(
	/aria-pressed/.test(js) && /aaMotion/.test(js),
	"gallery script exposes reduced-motion toggle state",
);
assert(
	!/(?:^|\n)\s*(?:import|export)\s/m.test(js),
	"gallery JavaScript has no module import/export dependency",
);
assert(
	!/\brequire\s*\(/.test(js),
	"gallery JavaScript has no CommonJS dependency",
);

for (const imageTag of html.match(/<img\b[^>]*>/gi) ?? []) {
	assert(
		/\balt="[^"]*"/.test(imageTag),
		`static gallery image has alt attribute: ${imageTag.slice(0, 80)}`,
	);
}
for (const buttonTag of html.match(/<button\b[\s\S]*?<\/button>/gi) ?? []) {
	const text = buttonTag
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	assert(
		text.length > 0 || /aria-label="[^"]+"/.test(buttonTag),
		`static gallery button has an accessible name: ${buttonTag.slice(0, 80)}`,
	);
}
assert(
	/image\.alt\s*=/.test(js),
	"generated icon gallery images receive accessible alternatives",
);
assert(
	/aria-live="polite"/.test(html),
	"interactive demo changes have a polite live region",
);

for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
	const target = match[1];
	assert(
		target.startsWith(".") || target.startsWith("#"),
		`gallery resource/navigation is local: ${target}`,
	);
	if (target.startsWith(".") && !target.includes("#")) {
		assert(
			existsSync(resolve(join(portableRoot, "gallery"), target)),
			`gallery local resource exists: ${target}`,
		);
	}
}

const provenancePath = join(portableRoot, "AA-ASSET-PROVENANCE.md");
const provenance = read(provenancePath);
const aaOfficeRoot = join(
	repoRoot,
	"apps/desktop/src/renderer/routes/_authenticated/_dashboard/components/AAOffice",
);
const aaOfficeFiles = walk(aaOfficeRoot)
	.map((path) => relative(aaOfficeRoot, path).split(sep).join("/"))
	.sort();
assert(
	aaOfficeFiles.length === 114,
	"source inventory baseline contains 114 AAOffice files",
);
for (const path of aaOfficeFiles)
	assert(
		provenance.includes(path),
		`provenance covers AAOffice source: ${path}`,
	);

const designRoot = join(repoRoot, "docs/aa/design");
for (const path of walk(designRoot)) {
	const rel = relative(repoRoot, path).split(sep).join("/");
	assert(provenance.includes(rel), `provenance covers design source: ${rel}`);
}

const visualNamePattern =
	/(CHECKPOINT|DECISION|AUDIT|DESIGN-SYSTEM|PUNCH-LIST|PHASE-4C)/;
const visualDocs = walk(join(repoRoot, "docs/aa"))
	.filter(
		(path) => path.startsWith(join(repoRoot, "docs/aa/portable")) === false,
	)
	.filter(
		(path) =>
			path !== join(repoRoot, "docs/aa/AA-PORTABLE-UI-KIT-V0.1-CHECKPOINT.md"),
	)
	.filter((path) => visualNamePattern.test(path))
	.filter((path) => extname(path) === ".md");
assert(
	visualDocs.length === 19,
	"source inventory baseline contains 19 Phase 1–4C visual decision/checkpoint documents",
);
for (const path of visualDocs) {
	const rel = relative(repoRoot, path).split(sep).join("/");
	assert(
		provenance.includes(rel),
		`provenance covers visual decision/checkpoint: ${rel}`,
	);
}
assert(
	provenance.includes("| AA-original | 23 |"),
	"provenance declares 23 AA-original records",
);
assert(
	provenance.includes("| Superset-adapted | 114 |"),
	"provenance declares 114 Superset-adapted records",
);
assert(
	provenance.includes("| third-party | 0 |"),
	"provenance declares zero copied third-party records",
);
assert(
	provenance.includes("| unknown | 0 |"),
	"provenance declares zero unknown records",
);

const allowedChangedPaths = [
	"docs/aa/portable/",
	"docs/aa/dsh/",
	"docs/aa/PHASE-5A-AA-PORTABLE-UI-ASSET-EXTRACTION-REPORT.md",
	"docs/aa/AA-PORTABLE-UI-KIT-V0.1-CHECKPOINT.md",
	"scripts/aa/",
];
let changedPaths = [];
try {
	changedPaths = execFileSync(
		"git",
		["ls-files", "--modified", "--others", "--exclude-standard"],
		{
			cwd: repoRoot,
			encoding: "utf8",
		},
	)
		.trim()
		.split("\n")
		.filter(Boolean);
} catch (error) {
	fail(
		`git changed-file listing available for frozen-area audit: ${error instanceof Error ? error.message : String(error)}`,
	);
}
for (const path of changedPaths) {
	assert(
		allowedChangedPaths.some(
			(allowed) => path === allowed || path.startsWith(allowed),
		),
		`changed path stays inside Phase 5A scope: ${path}`,
	);
}

const sensitivePatterns = [
	[/\/(?:Users|home)\/[^\s`"']+/i, "absolute user/home path"],
	[/\bAKIA[0-9A-Z]{16}\b/, "AWS access key"],
	[/\bsk-[A-Za-z0-9_-]{20,}\b/, "API key-like secret"],
	[/\bBearer\s+[A-Za-z0-9._~+/-]{16,}={0,2}\b/i, "bearer token"],
	[/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, "email address"],
];
for (const rel of changedPaths) {
	const path = join(repoRoot, rel);
	if (!existsSync(path) || lstatSync(path).isDirectory()) continue;
	if (
		![".css", ".html", ".js", ".json", ".md", ".mjs", ".svg"].includes(
			extname(path),
		)
	)
		continue;
	const source = read(path);
	for (const [pattern, label] of sensitivePatterns)
		assert(!pattern.test(source), `changed file has no ${label}: ${rel}`);
}

if (failures.length > 0) {
	console.error(
		`AA portable audit failed (${failures.length} failure${failures.length === 1 ? "" : "s"}):`,
	);
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.log("AA portable audit passed");
console.log(`checks=${checks.length}`);
console.log(
	`json=${allPortableFiles.filter((path) => extname(path) === ".json").length}`,
);
console.log(`svg=${svgPaths.length}`);
console.log(`assets=${manifest.assets.length}`);
console.log(`semanticTokens=${Object.keys(semantic.tokens).length}`);
console.log(
	`sourceInventory=${aaOfficeFiles.length + walk(designRoot).length + visualDocs.length}`,
);
