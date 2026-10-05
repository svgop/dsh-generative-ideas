window.__ModuleLoader__.load({
	id: "dsh-generative-ideas",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		let react = require("react");
		let react_dom_client = require("react-dom/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region lib/locale.js
		const NS = "rich-ideas";
		const en = {
			"entry.label": "Ideas",
			"entry.tooltip": "Generate and compare roadmaps — pick one, export it as goal.md",
			"panel.title": "Roadmap ideation",
			"page.title": "Roadmap ideation",
			"page.intro": "Generate and compare distinct roadmap options via headless agent runs, export the pick as goal.md, and dispatch it to an agent in the chosen workspace.",
			"step.focus": "Context",
			"step.generating": "Generating",
			"step.compare": "Compare",
			"step.chosen": "Chosen",
			"steps.label": "Progress",
			"focus.label": "What are we planning?",
			"focus.placeholder": "e.g. 'Ship v2 of the product with a focus on reliability and developer experience'",
			"focus.constraints": "Constraints (optional)",
			"focus.constraintsPlaceholder": "e.g. 'no new infrastructure, 2-week deadline'",
			"focus.horizon": "Horizon",
			"horizon.sprint": "Sprint (2 weeks)",
			"horizon.quarter": "Quarter",
			"horizon.halfyear": "Half year",
			"horizon.year": "Year",
			"focus.workspace": "Target workspace",
			"focus.workspacePlaceholder": "Select a workspace…",
			"action.generate": "Generate roadmaps",
			"action.deepResearch": "Deep research — 12+ competitors, open-source repos, .refs/",
			"action.deepResearchHint": "Before generating, the agent runs aggressive web research: minimum 12 competitors, GitHub repos doing similar things, .refs/ curated research — then grounds every roadmap option in what it found.",
			"action.generating": "Generating… (30-90s)",
			"action.export": "Copy to clipboard",
			"action.download": "Download goal.md",
			"action.exported": "copied to clipboard",
			"action.downloaded": "downloaded",
			"action.close": "Close",
			"action.reroll": "Reroll",
			"action.reroll.hint": "Generate fresh options — same focus, different strategic stances",
			"action.push": "Push",
			"action.push.hint": "Regenerate with deep research forced ON — 12+ competitors, GitHub repos, .refs/",
			"action.discuss": "Discuss",
			"action.discuss.hint": "Close this panel and discuss the roadmap direction in chat instead",
			"action.newRound": "New round",
			"option.thesis": "thesis",
			"option.phases": "phases",
			"option.risks": "risks",
			"option.effort": "effort",
			"option.choose": "Choose this",
			"option.chosen": "Chosen",
			"error.generic": "failed"
		};
		const zh = {
			"entry.label": "构想",
			"entry.tooltip": "生成并对比路线图——选出最合适的，导出为 goal.md",
			"panel.title": "路线图构想",
			"page.title": "路线图构想",
			"page.intro": "通过无头 agent 运行生成并比较多个不同的路线图方案，将选中的方案导出为 goal.md 并下发给指定工作区的 agent。",
			"step.focus": "上下文",
			"step.generating": "生成中",
			"step.compare": "对比",
			"step.chosen": "已选定",
			"steps.label": "进度",
			"focus.label": "我们在规划什么？",
			"focus.placeholder": "例如：'发布产品 v2，重点关注可靠性与开发者体验'",
			"focus.constraints": "约束（可选）",
			"focus.constraintsPlaceholder": "例如：'不加新基础设施，两周截止'",
			"focus.horizon": "时间跨度",
			"horizon.sprint": "冲刺（2 周）",
			"horizon.quarter": "季度",
			"horizon.halfyear": "半年",
			"horizon.year": "年度",
			"focus.workspace": "目标工作区",
			"focus.workspacePlaceholder": "选择工作区…",
			"action.generate": "生成路线图",
			"action.deepResearch": "深度调研——12+ 竞品、开源仓库、.refs/",
			"action.deepResearchHint": "生成前 agent 先做深度网络调研：最少 12 个竞品、GitHub 同类仓库、.refs/ 已有研究——然后据此生成有据可依的路线图。",
			"action.generating": "生成中…（30-90 秒）",
			"action.export": "复制到剪贴板",
			"action.download": "下载 goal.md",
			"action.exported": "已复制到剪贴板",
			"action.downloaded": "已下载",
			"action.close": "关闭",
			"action.reroll": "重掷",
			"action.reroll.hint": "同一主题重新生成不同战略立场的选项",
			"action.push": "深挖",
			"action.push.hint": "强制开启深度调研重新生成——12+ 竞品、GitHub 仓库、.refs/",
			"action.discuss": "讨论",
			"action.discuss.hint": "关闭面板，在聊天中讨论路线图方向",
			"action.newRound": "再来一轮",
			"option.thesis": "核心押注",
			"option.phases": "阶段",
			"option.risks": "风险",
			"option.effort": "工作量",
			"option.choose": "选这个",
			"option.chosen": "已选定",
			"error.generic": "失败"
		};
		let dict = { en, zh };
		const lang = (typeof navigator !== "undefined" && /^(zh)/i.test(navigator.language ?? "")) ? "zh" : "en";
		const t = (key) => dict[lang][key] ?? dict.en[key] ?? key;
		//#endregion
		//#region lib/styles.js
		// Wave 2: layout glue only — every control is an app primitive
		// (SegmentedTabs/Input/Checkbox/Button/Tag/StateDot from
		// @deepseek-ai/dsh-client-ui-primitives). The only styled elements left
		// are the rule-4 exceptions: plain <textarea>/<select> on tokens.
		const css = `.rgi-main{height:100%;overflow:auto;box-sizing:border-box;padding:0 clamp(24px,4vw,48px) 48px;display:flex;justify-content:center;align-items:flex-start}
.rgi-page{width:100%;max-width:960px;display:flex;flex-direction:column;gap:32px}
.rgi-page,.rgi-page *{box-sizing:border-box}
/* One column, one left edge: header, stepper, body, and footer all align to
   the same 960px column (native page grammar); the page scrolls, not a body. */
.rgi-content{width:100%;display:flex;flex-direction:column}
.rgi-steps{margin-bottom:20px;max-width:560px}
/* Native pageHead — same anatomy as the app's Plugins/Tasks page headers. */
.rgi-pageHead{box-sizing:border-box;justify-content:space-between;align-items:flex-start;gap:16px;padding-top:28px;display:flex}
[data-platform=darwin] .rgi-pageHead{padding-top:calc(28px + var(--dsh-frame-top-clearance,0px))}
.rgi-pageHeadMain{flex:1;min-width:0}
.rgi-pageTitle{margin:0;font-size:20px;font-weight:500;line-height:28px;color:var(--dsw-alias-label-primary)}
.rgi-pageIntro{color:var(--dsw-alias-label-secondary);margin:4px 0 0;font-size:13px;line-height:20px}
.rgi-body{display:flex;flex-direction:column}
.rgi-field{display:flex;flex-direction:column;gap:4px;margin-bottom:14px}
.rgi-label{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px;font-weight:500}
/* Rule 4: no native primitive for textarea/select — plain elements on tokens. */
.rgi-textarea,.rgi-select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:var(--dsw-radius-md);font:inherit;font-size:13px;line-height:20px;padding:6px 10px;outline:none}
.rgi-textarea:focus,.rgi-select:focus{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary))}
.rgi-textarea{resize:vertical;min-height:56px}
.rgi-row{display:flex;gap:10px}
.rgi-row>*{flex:1}
.rgi-deepHint{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:14px;margin:2px 0 0 22px}
.rgi-generate{align-self:flex-start;min-width:220px;margin-top:14px}
.rgi-genState{display:flex;flex-direction:column;align-items:center;gap:12px;padding:40px 0}
.rgi-genText{color:var(--dsw-alias-label-secondary);font-size:14px;line-height:20px}
.rgi-genSub{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px}
.rgi-options{display:flex;flex-direction:column;gap:8px}
/* Option cards — native in-page card grammar. */
.rgi-option{border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-xl);background:transparent;cursor:pointer;margin:0;padding:0;text-align:left}
.rgi-option:hover{background:var(--dsw-alias-interactive-bg-hover)}
.rgi-optionOn{border-color:var(--dsw-alias-state-business-primary)}
.rgi-optionHead{display:flex;align-items:center;gap:8px;padding:12px 14px 6px}
.rgi-optionName{font-size:14px;font-weight:500;line-height:20px;color:var(--dsw-alias-label-primary);flex:1}
.rgi-optionThesis{padding:0 14px 8px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:18px}
.rgi-optionPhases{padding:0 14px 8px;display:flex;flex-wrap:wrap;gap:4px}
.rgi-optionRisks{padding:0 14px 10px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px}
.rgi-optionFooter{display:flex;justify-content:flex-end;padding:0 14px 10px}
.rgi-newRound{margin-top:12px}
.rgi-footer{display:flex;align-items:center;gap:8px;border-top:1px solid var(--dsw-alias-border-l1);padding:12px 0 0;margin-top:16px}
.rgi-status{flex:1;align-self:center;min-width:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rgi-statusErr{color:var(--dsw-alias-state-error-primary)}
.rgi-statusOk{color:var(--dsw-alias-state-success-primary)}`;
		const tagId = "dsh-generative-ideas/panel.css";
		if (typeof document !== "undefined" && document.querySelector(`style[data-plugin-css="${tagId}"]`) === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-generative-ideas";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region lib/panel-slot.js
		// Sanctioned surface (0.1.6+): sidebar.panellist row + keyed main panel,
		// mirroring the built-in Plugins entry. The shell owns the row chrome;
		// no DOM grafting into React-managed sidebar rows.
		const PANEL_ID = "generative-ideas";
		const ICON_PATHS = '<path d="M8 1.5a3 3 0 0 1 3 3c0 .8-.3 1.5-.8 2-.5.6-.7 1.2-.7 2v.5h-3v-.5c0-.8-.2-1.4-.7-2-.5-.5-.8-1.2-.8-2a3 3 0 0 1 3-3z"/><path d="M6.5 11.5h3M7 13.5h2"/>';
		function PanelIcon({ size }) {
			return (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 16 16", width: size ?? 18, height: size ?? 18,
				fill: "none", stroke: "currentColor", strokeWidth: 1.3,
				strokeLinecap: "round", strokeLinejoin: "round",
				"aria-hidden": true,
				dangerouslySetInnerHTML: { __html: ICON_PATHS },
			});
		}
		function MainPanel() {
			return (0, react_jsx_runtime.jsx)("div", {
				className: "rgi-main",
				children: (0, react_jsx_runtime.jsx)(IdeasPanel, { onClose: () => {}, onGeneratingChange: () => {} })
			});
		}
		//#endregion
		//#region lib/api.js
		const API = "/api/rich-ideas";
		async function api(path, init) {
			const res = await fetch(`${API}${path}`, init);
			const body = await res.json().catch(() => ({ ok: false, error: "bad-host-response" }));
			if (!res.ok || body.ok !== true) throw new Error(body.error ?? `HTTP ${res.status}`);
			return body;
		}
		async function fetchState() { return api("/state", { cache: "no-store" }) }
		async function generate(body) {
			return api("/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
		}
		async function pollState() {
			return api("/state", { cache: "no-store" })
		}
		async function exportGoal(body) {
			return api("/export", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
		}
		//#endregion
		//#region lib/panel.js
		const STEPS = ["focus", "generating", "compare", "chosen"];
		const HORIZONS = [
			{ value: "sprint", key: "horizon.sprint" },
			{ value: "quarter", key: "horizon.quarter" },
			{ value: "halfyear", key: "horizon.halfyear" },
			{ value: "year", key: "horizon.year" }
		];
		function Stepper({ step, onJump }) {
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.SegmentedTabs, {
				className: "rgi-steps",
				label: t("steps.label"),
				items: STEPS.map((name) => ({ id: `rgi-tab-${name}`, value: name, label: t(`step.${name}`) })),
				value: step,
				onChange: onJump
			});
		}

		function OptionCard({ option, chosen, onChoose }) {
			const phases = option.phases ?? [];
			const risks = (option.risks ?? []).map((r) => typeof r === "string" ? r : r.description ?? String(r)).join(" · ");
			return (0, react_jsx_runtime.jsxs)("div", {
				className: chosen ? "rgi-option rgi-optionOn" : "rgi-option",
				onClick: () => onChoose(option),
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: "rgi-optionHead",
						children: [
							(0, react_jsx_runtime.jsx)("span", { className: "rgi-optionName", children: option.name }),
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, { tone: "info", children: `${t("option.effort")}: ${option.effort ?? "M"}` })
						]
					}),
					(0, react_jsx_runtime.jsx)("div", { className: "rgi-optionThesis", children: option.thesis }),
					phases.length > 0 ? (0, react_jsx_runtime.jsx)("div", {
						className: "rgi-optionPhases",
						children: phases.map((phase, i) => (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, { tone: "neutral", children: `${i + 1}. ${phase.name}` }, i))
					}) : null,
					risks !== "" ? (0, react_jsx_runtime.jsx)("div", { className: "rgi-optionRisks", children: `${t("option.risks")}: ${risks}` }) : null,
					(0, react_jsx_runtime.jsx)("div", {
						className: "rgi-optionFooter",
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: chosen ? "primary" : "ghost",
							size: "sm",
							icon: chosen ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutlineRegular, { size: 12 }) : null,
							onClick: (event) => { event.stopPropagation(); onChoose(option); },
							children: chosen ? t("option.chosen") : t("option.choose")
						})
					})
				]
			});
		}

		function IdeasPanel({ onClose, onGeneratingChange }) {
			const [step, setStep] = (0, react.useState)("focus");
			const [state, setState] = (0, react.useState)(null);
			const [focus, setFocus] = (0, react.useState)("");
			const [constraints, setConstraints] = (0, react.useState)("");
			const [horizon, setHorizon] = (0, react.useState)("quarter");
			const [workspace, setWorkspace] = (0, react.useState)("");
			const [options, setOptions] = (0, react.useState)(null);
			const [chosen, setChosen] = (0, react.useState)(null);
			const [status, setStatus] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [deepResearch, setDeepResearch] = (0, react.useState)(true);

			(0, react.useEffect)(() => {
				fetchState().then((body) => {
					setState(body);
					if (body.generating) { setStep("generating"); return; }
					if (body.lastResult?.options?.length > 0) {
						setOptions(body.lastResult.options);
						setFocus(body.lastResult.focus ?? "");
						setWorkspace(body.lastResult.workspace ?? "");
						setStep("compare");
					}
				}).catch(() => {});
			}, []);

			const startGeneration = () => {
				setStep("generating");
				setStatus(null);
				setBusy(true);
				generate({ focus, workspace, constraints, horizon, deepResearch }).catch((cause) => {
					setStatus({ kind: "error", text: `${t("error.generic")}: ${cause instanceof Error ? cause.message : String(cause)}` });
					setStep("focus");
				}).finally(() => setBusy(false));
			};
			(0, react.useEffect)(() => { onGeneratingChange?.(step === "generating"); }, [step, onGeneratingChange]);
			// Poll while generating — the host runs the generation as a background
			// job, so the panel can close and reopen without losing it.
			(0, react.useEffect)(() => {
				if (step !== "generating") return;
				const timer = window.setInterval(() => {
					pollState().then((body) => {
						if (body.generating) return;
						window.clearInterval(timer);
						if (body.generateError) {
							setStatus({ kind: "error", text: `${t("error.generic")}: ${body.generateError}` });
							setStep("focus");
						} else if (body.lastResult?.options) {
							setOptions(body.lastResult.options);
							setFocus(body.lastResult.focus ?? focus);
							setStep("compare");
						}
					}).catch(() => {});
				}, 3000);
				return () => window.clearInterval(timer);
			}, [step]);

			// Step jumping (SegmentedTabs onChange): the tabs are the wizard's
			// indicator, and a click may only land where the wizard's state
			// already holds. "generating" is an async state entered by
			// startGeneration alone — never by hand. Back to "focus" repeats the
			// "New round" reset; "compare"/"chosen" are valid once options/a pick
			// exist. Every other click is a no-op.
			const jumpTo = (next) => {
				if (busy || next === step || step === "generating" || next === "generating") return;
				if (next === "focus") {
					setStep("focus"); setOptions(null); setChosen(null); setStatus(null);
					return;
				}
				if (next === "compare" && options !== null) { setStep("compare"); return; }
				if (next === "chosen" && chosen !== null) { setStep("chosen"); return; }
			};

			const goalContent = () => {
				if (chosen === null) return "";
				const phaseText = (chosen.phases ?? []).map((phase, i) => {
					const items = (phase.acceptanceItems ?? phase.acceptance ?? []).map((item) => "- [ ] " + (typeof item === "string" ? item : item.label ?? String(item))).join("\n");
					return "## Phase " + (i + 1) + ": " + phase.name + "\n\n" + (phase.description ?? "") + "\n\n" + items + "\n";
				}).join("\n");
				const riskText = (chosen.risks ?? []).map((r) => "- " + (typeof r === "string" ? r : r.description ?? String(r))).join("\n");
				return "# Goal: " + chosen.name + "\n\n> " + (chosen.thesis ?? focus) + "\n\n**Focus:** " + focus + "\n**Effort:** " + (chosen.effort ?? "M") + "\n**Differentiator:** " + (chosen.differentiator ?? "") + "\n\n## Phases\n\n" + phaseText + "\n## Risks\n\n" + (riskText || "- (none identified)") + "\n\n---\nGenerated by dsh-generative-ideas.\n";
			};
			const copyToClipboard = () => {
				if (chosen === null) return;
				const content = goalContent();
				if (navigator.clipboard) navigator.clipboard.writeText(content).then(() => setStatus({ kind: "ok", text: t("action.exported") }));
				else { const ta = document.createElement("textarea"); ta.value = content; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); setStatus({ kind: "ok", text: t("action.exported") }); }
			};
			const downloadGoal = () => {
				if (chosen === null) return;
				const blob = new Blob([goalContent()], { type: "text/markdown" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url; a.download = "goal.md"; a.click();
				URL.revokeObjectURL(url);
				setStatus({ kind: "ok", text: t("action.downloaded") });
				setStep("chosen");
			};

			return (0, react_jsx_runtime.jsxs)("div", {
				className: "rgi-page",
				children: [
					(0, react_jsx_runtime.jsx)("div", {
						className: "rgi-pageHead",
						children: (0, react_jsx_runtime.jsxs)("div", {
							className: "rgi-pageHeadMain",
							children: [
								(0, react_jsx_runtime.jsx)("h1", { className: "rgi-pageTitle", children: t("page.title") }),
								(0, react_jsx_runtime.jsx)("p", { className: "rgi-pageIntro", children: t("page.intro") })
							]
						})
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "rgi-content",
						"aria-label": t("panel.title"),
						children: [
							(0, react_jsx_runtime.jsx)(Stepper, { step, onJump: jumpTo }),
							(0, react_jsx_runtime.jsx)("div", {
								className: "rgi-body",
								children: step === "focus" ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
									children: [
										(0, react_jsx_runtime.jsxs)("div", {
											className: "rgi-field",
											children: [
												(0, react_jsx_runtime.jsx)("label", { className: "rgi-label", children: t("focus.label") }),
												(0, react_jsx_runtime.jsx)("textarea", {
													className: "rgi-textarea",
													placeholder: t("focus.placeholder"),
													value: focus,
													onChange: (event) => setFocus(event.target.value)
												})
											]
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: "rgi-row",
											children: [
												(0, react_jsx_runtime.jsxs)("div", {
													className: "rgi-field",
													children: [
														(0, react_jsx_runtime.jsx)("label", { className: "rgi-label", children: t("focus.workspace") }),
														(0, react_jsx_runtime.jsxs)("select", {
															className: "rgi-select",
															value: workspace,
															onChange: (event) => setWorkspace(event.target.value),
															children: [
																(0, react_jsx_runtime.jsx)("option", { value: "", disabled: true, children: t("focus.workspacePlaceholder") }),
																...(state?.workspaces ?? []).map((slug) => (0, react_jsx_runtime.jsx)("option", { value: slug, children: slug }, slug))
															]
														})
													]
												}),
												(0, react_jsx_runtime.jsxs)("div", {
													className: "rgi-field",
													children: [
														(0, react_jsx_runtime.jsx)("label", { className: "rgi-label", children: t("focus.horizon") }),
														(0, react_jsx_runtime.jsx)("select", {
															className: "rgi-select",
															value: horizon,
															onChange: (event) => setHorizon(event.target.value),
															children: HORIZONS.map((h) => (0, react_jsx_runtime.jsx)("option", { value: h.value, children: t(h.key) }, h.value))
														})
													]
												})
											]
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: "rgi-field",
											children: [
												(0, react_jsx_runtime.jsx)("label", { className: "rgi-label", children: t("focus.constraints") }),
												(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
													placeholder: t("focus.constraintsPlaceholder"),
													value: constraints,
													onChange: (event) => setConstraints(event.target.value)
												})
											]
										}),
										(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Checkbox, {
											checked: deepResearch,
											onChange: (checked) => setDeepResearch(checked),
											label: t("action.deepResearch")
										}),
										(0, react_jsx_runtime.jsx)("div", { className: "rgi-deepHint", children: t("action.deepResearchHint") }),
										(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "primary",
											className: "rgi-generate",
											disabled: focus.trim() === "" || workspace === "",
											onClick: startGeneration,
											children: deepResearch ? "[Research] " + t("action.generate") : t("action.generate")
										})
									]
								}) : step === "generating" ? (0, react_jsx_runtime.jsxs)("div", {
									className: "rgi-genState",
									children: [
										(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: "ongoing", size: 28 }),
										(0, react_jsx_runtime.jsx)("span", { className: "rgi-genText", children: t("action.generating") }),
										(0, react_jsx_runtime.jsx)("span", { className: "rgi-genSub", children: focus })
									]
								}) : step === "compare" || step === "chosen" ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
									children: [
										(0, react_jsx_runtime.jsx)("div", {
											className: "rgi-options",
											children: (options ?? []).map((option, index) => (0, react_jsx_runtime.jsx)(OptionCard, {
												option,
												chosen: chosen?.name === option.name,
												onChoose: (pick) => { setChosen(pick); setStatus(null); }
											}, `${option.name}-${index}`))
										}),
										step === "chosen" ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "ghost",
											className: "rgi-newRound",
											onClick: () => { setStep("focus"); setOptions(null); setChosen(null); setStatus(null); },
											children: t("action.newRound")
										}) : null
									]
								}) : null
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "rgi-footer",
								children: [
									(0, react_jsx_runtime.jsx)("span", { className: status?.kind === "error" ? "rgi-status rgi-statusErr" : status?.kind === "ok" ? "rgi-status rgi-statusOk" : "rgi-status", role: status?.kind === "error" ? "alert" : "status", children: status?.text ?? "" }),
									step === "compare" ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
										children: [
											(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "ghost",
												title: t("action.reroll.hint"),
												disabled: busy,
												onClick: () => { setChosen(null); startGeneration(); },
												children: t("action.reroll")
											}),
											(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "ghost",
												title: t("action.push.hint"),
												disabled: busy,
												onClick: () => { setChosen(null); setDeepResearch(true); startGeneration(); },
												children: t("action.push")
											}),
											(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "ghost",
												title: t("action.discuss.hint"),
												onClick: onClose,
												children: t("action.discuss")
											})
										]
									}) : null,
									chosen !== null && step !== "chosen" ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
										children: [
											(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "ghost",
												disabled: busy,
												onClick: copyToClipboard,
												children: t("action.export")
											}),
											(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "primary",
												disabled: busy,
												onClick: downloadGoal,
												children: t("action.download")
											})
										]
									}) : null
								]
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region lib/index.js
		const inject = ["locale", "slots"];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { en, zh }), "rich-ideas: dictionaries");

			// Sidebar + panel ride the sanctioned slots (see lib/panel-slot.js):
			// the shell owns the row chrome and panel selection; the generating
			// pulse lives inside the panel itself in hosted mode.
			ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: PANEL_ID,
				locale: NS,
			}, MainPanel));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: PANEL_ID,
				order: 30,
				label: () => t("entry.label"),
				locale: NS,
			}, PanelIcon));

			return () => {};
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
