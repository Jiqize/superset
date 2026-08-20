const corePalette = [
	["canvas", "#a5a49f"],
	["shell", "#8a8984"],
	["cabinet", "#979691"],
	["workspaceWell", "#7f7e79"],
	["pane", "#c1c0ba"],
	["paneHeader", "#a8a7a1"],
	["surface", "#cbc9c3"],
	["raised", "#e4e2dc"],
	["inset", "#b5b4af"],
	["border", "#242424"],
	["borderSoft", "#5d5c58"],
	["highlight", "#f0efea"],
	["text", "#171717"],
	["textMuted", "#5f5e5a"],
	["selection", "#173267"],
	["selectionText", "#f3f1e9"],
	["working", "#e0a11b"],
	["waiting", "#4d78a8"],
	["success", "#6e9b48"],
	["error", "#9c302b"],
	["offline", "#777a7e"],
	["terminal", "#353633"],
	["briefcase", "#6d482c"],
	["briefcaseLight", "#9a6b3d"],
	["folder", "#a9783e"],
	["paper", "#e9e5d8"],
];

const semanticRoles = [
	["application.canvas", "#a5a49f"],
	["shell.surface", "#8a8984"],
	["surface.raised", "#e4e2dc"],
	["surface.inset", "#b5b4af"],
	["border.strong", "#242424"],
	["border.soft", "#5d5c58"],
	["text.primary", "#171717"],
	["text.secondary", "#5f5e5a"],
	["selection.background", "#173267"],
	["selection.text", "#f3f1e9"],
	["status.working", "#e0a11b"],
	["status.waiting", "#4d78a8"],
	["status.success", "#6e9b48"],
	["status.error", "#9c302b"],
	["status.offline", "#777a7e"],
	["object.paper", "#e9e5d8"],
	["workstation.surface", "#353633"],
	["object.briefcase", "#6d482c"],
	["object.folder", "#a9783e"],
	["focus.ring", "#173267"],
	["control.disabled", "#8d8c87"],
];

const iconNames = [
	"home",
	"briefcase",
	"folder",
	"filing-cabinet",
	"conversation",
	"agent",
	"settings",
	"terminal",
	"files",
	"changes",
	"diff",
	"approval",
	"deliverable",
	"status-idle",
	"status-working",
	"status-waiting",
	"status-success",
	"status-error",
	"status-offline",
];

const demoStates = [
	["idle", "status-idle"],
	["thinking", "status-working"],
	["working", "status-working"],
	["waiting", "status-waiting"],
	["error", "status-error"],
	["offline", "status-offline"],
];

function makeElement(tag, className, text) {
	const element = document.createElement(tag);
	if (className) element.className = className;
	if (text) element.textContent = text;
	return element;
}

function renderPalette() {
	const coreTarget = document.querySelector("#core-palette");
	for (const [name, value] of corePalette) {
		const swatch = makeElement("div", "pk-swatch", `${name}\n${value}`);
		swatch.style.backgroundColor = value;
		if (
			[
				"raised",
				"inset",
				"pane",
				"paneHeader",
				"surface",
				"highlight",
				"selectionText",
				"working",
				"paper",
				"canvas",
			].includes(name)
		) {
			swatch.classList.add("is-light");
		}
		coreTarget.append(swatch);
	}

	const roleTarget = document.querySelector("#semantic-palette");
	for (const [role, value] of semanticRoles) {
		const item = makeElement("div", "pk-role");
		const chip = makeElement("span", "pk-role__chip");
		chip.style.backgroundColor = value;
		item.append(
			chip,
			makeElement("b", "", role),
			makeElement("code", "", value),
		);
		roleTarget.append(item);
	}
}

function renderIcons() {
	const target = document.querySelector("#icon-gallery");
	for (const name of iconNames) {
		const row = makeElement("div", "pk-icon-row");
		row.append(makeElement("b", "", name));
		for (const size of [16, 20, 24, 32]) {
			const cell = makeElement("div", "pk-icon-cell");
			const image = document.createElement("img");
			image.src = `../icons/${name}.svg`;
			image.width = size;
			image.height = size;
			image.alt = `${name.replaceAll("-", " ")} icon at ${size} pixels`;
			cell.append(image);
			row.append(cell);
		}
		target.append(row);
	}
}

function setupMotionToggle() {
	const toggle = document.querySelector("#motion-toggle");
	const mediaPrefersReduced =
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
	let reduced = mediaPrefersReduced;

	const render = () => {
		document.documentElement.dataset.aaMotion = reduced ? "reduce" : "full";
		toggle.setAttribute("aria-pressed", String(reduced));
		toggle.textContent = `Reduce motion: ${reduced ? "on" : "off"}`;
	};

	toggle.addEventListener("click", () => {
		reduced = !reduced;
		render();
	});
	render();
}

function setupTabs() {
	const tabs = [...document.querySelectorAll('[role="tab"]')];
	const activate = (tab) => {
		for (const candidate of tabs) {
			const selected = candidate === tab;
			candidate.setAttribute("aria-selected", String(selected));
			candidate.tabIndex = selected ? 0 : -1;
			document.querySelector(
				`#${candidate.getAttribute("aria-controls")}`,
			).hidden = !selected;
		}
	};

	for (const [index, tab] of tabs.entries()) {
		tab.addEventListener("click", () => activate(tab));
		tab.addEventListener("keydown", (event) => {
			if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
				return;
			event.preventDefault();
			let nextIndex = index;
			if (event.key === "ArrowLeft")
				nextIndex = (index - 1 + tabs.length) % tabs.length;
			if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
			if (event.key === "Home") nextIndex = 0;
			if (event.key === "End") nextIndex = tabs.length - 1;
			activate(tabs[nextIndex]);
			tabs[nextIndex].focus();
		});
	}
}

function setupStateLab() {
	const target = document.querySelector("#state-buttons");
	const output = document.querySelector("#state-output");
	const icon = document.querySelector("#state-icon");

	for (const [state, iconName] of demoStates) {
		const button = makeElement("button", "", state);
		button.type = "button";
		button.setAttribute("aria-pressed", String(state === "idle"));
		button.addEventListener("click", () => {
			for (const candidate of target.querySelectorAll("button"))
				candidate.setAttribute("aria-pressed", "false");
			button.setAttribute("aria-pressed", "true");
			output.textContent = `Demo runtime: ${state[0].toUpperCase()}${state.slice(1)}`;
			icon.src = `../icons/${iconName}.svg`;
			icon.alt = `${state} status icon`;
			icon.classList.toggle("pk-activity", state === "working");
		});
		target.append(button);
	}
}

function setupApprovalDemo() {
	const output = document.querySelector("#approval-result");
	for (const button of document.querySelectorAll(".pk-demo-action")) {
		button.addEventListener("click", () => {
			const decision = button.dataset.decision;
			output.textContent = `Resolved demo decision: ${decision}`;
			output.style.color = decision === "approved" ? "#6e9b48" : "#9c302b";
			for (const candidate of document.querySelectorAll(".pk-demo-action"))
				candidate.disabled = true;
		});
	}
}

renderPalette();
renderIcons();
setupMotionToggle();
setupTabs();
setupStateLab();
setupApprovalDemo();
