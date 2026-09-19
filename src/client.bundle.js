window.__ModuleLoader__.load({
	id: "dsh-generative-ideas",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		let react = require("react");
		let react_dom_client = require("react-dom/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region lib/locale.js
		const NS = "rich-ideas";
		const en = {
			"entry.label": "Ideas",
			"entry.tooltip": "Generate and compare roadmaps — pick one, export it as goal.md",
			"panel.title": "Roadmap ideation",
			"step.focus": "Context",
			"step.generating": "Generating",
			"step.compare": "Compare",
			"step.chosen": "Chosen",
			"focus.label": "What are we planning?",
			"focus.placeholder": "e.g. 'Ship v2 of the product with a focus on reliability and developer experience'",
			"focus.constraints": "Constraints (optional)",
			"focus.constraintsPlaceholder": "e.g. 'no new infrastructure, 2-week deadline'",
			"focus.horizon": "Horizon",
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
			"step.focus": "上下文",
			"step.generating": "生成中",
			"step.compare": "对比",
			"step.chosen": "已选定",
			"focus.label": "我们在规划什么？",
			"focus.placeholder": "例如：'发布产品 v2，重点关注可靠性与开发者体验'",
			"focus.constraints": "约束（可选）",
			"focus.constraintsPlaceholder": "例如：'不加新基础设施，两周截止'",
			"focus.horizon": "时间跨度",
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
		const css = `.rgi-entry{appearance:none;display:flex;align-items:center;gap:8px;width:100%;height:36px;padding:0 10px;font:inherit;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);background:0 0;border:none;border-radius:8px;cursor:pointer;text-align:left}
.rgi-entry:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.rgi-entry[data-generating="true"] .rgi-entryIcon{color:var(--dsw-alias-state-business-primary);animation:rgi-entry-pulse 1.5s ease-in-out infinite}
@keyframes rgi-entry-pulse{0%,100%{opacity:1}50%{opacity:.4}}
.rgi-entry[data-active="true"]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.rgi-entryIcon{justify-content:center;align-items:center;width:24px;height:24px;display:inline-flex;flex:none;color:var(--dsw-alias-label-tertiary)}
.rgi-entryLabel{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rgi-scrim{position:fixed;inset:0;z-index:90;background:color-mix(in srgb, var(--dsw-alias-bg-mask-2, rgba(0,0,0,.45)) 100%, transparent);display:flex;align-items:center;justify-content:center;padding:24px}
.rgi-card{width:100%;max-width:720px;max-height:min(85vh,680px);border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:12px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 24px var(--dsw-alias-bg-mask-2, rgba(0,0,0,.35))}
.rgi-card,.rgi-card *{box-sizing:border-box}
.rgi-head{display:flex;align-items:baseline;gap:8px;padding:14px 16px 10px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.rgi-title{font-size:14px;font-weight:500;line-height:20px;color:var(--dsw-alias-label-primary);flex:1}
.rgi-close{flex:none;width:28px;height:28px;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:999px;font-size:16px}
.rgi-close:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.rgi-stepper{display:flex;border-bottom:1px solid var(--dsw-alias-border-l1)}
.rgi-step{flex:1;text-align:center;padding:7px 0;font-size:12px;line-height:16px;color:var(--dsw-alias-label-caption);border-bottom:2px solid transparent}
.rgi-stepOn{color:var(--dsw-alias-state-business-primary);border-bottom-color:var(--dsw-alias-state-business-primary);font-weight:500}
.rgi-stepDone{color:var(--dsw-alias-state-success-primary)}
.rgi-body{flex:1;min-height:0;overflow-y:auto;padding:16px;scrollbar-width:none}
.rgi-body::-webkit-scrollbar{display:none}
.rgi-field{display:flex;flex-direction:column;gap:4px;margin-bottom:14px}
.rgi-label{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px;font-weight:500}
.rgi-input,.rgi-textarea,.rgi-select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:8px;font:inherit;font-size:13px;line-height:20px;padding:6px 10px;outline:none}
.rgi-input:focus,.rgi-textarea:focus,.rgi-select:focus{border-color:var(--dsw-alias-state-business-primary)}
.rgi-textarea{resize:vertical;min-height:56px}
.rgi-row{display:flex;gap:10px}
.rgi-row>*{flex:1}
.rgi-generate{width:100%;padding:10px;background:var(--dsw-alias-state-business-primary);color:#fff;border:none;border-radius:8px;font:inherit;font-size:14px;font-weight:500;cursor:pointer}
.rgi-generate:hover:not(:disabled){opacity:.9}
.rgi-deepToggle{display:flex;align-items:center;gap:8px;padding:8px 0 4px;cursor:pointer;user-select:none}
.rgi-deepCheckbox{width:16px;height:16px;accent-color:var(--dsw-alias-state-business-primary)}
.rgi-deepLabel{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:18px}
.rgi-deepHint{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:14px;margin-left:24px}
.rgi-generate:disabled{opacity:.5;cursor:default}
.rgi-genState{display:flex;flex-direction:column;align-items:center;gap:12px;padding:40px 0}
.rgi-genSpinner{width:28px;height:28px;border-radius:50%;border:3px solid var(--dsw-alias-interactive-bg-hover);border-top-color:var(--dsw-alias-state-business-primary);animation:rgi-spin 1s linear infinite}
@keyframes rgi-spin{to{transform:rotate(360deg)}}
.rgi-genText{color:var(--dsw-alias-label-secondary);font-size:14px;line-height:20px}
.rgi-genSub{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px}
.rgi-options{display:flex;flex-direction:column;gap:0}
.rgi-option{border:1px solid var(--dsw-alias-border-l1);border-radius:0;margin:0;padding:0;cursor:pointer;background:var(--dsw-alias-bg-base)}
.rgi-option+.rgi-option{border-top:none}
.rgi-option:first-child{border-radius:8px 8px 0 0}
.rgi-option:last-child{border-radius:0 0 8px 8px}
.rgi-option:hover{background:var(--dsw-alias-interactive-bg-hover)}
.rgi-optionOn{border-color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 5%, var(--dsw-alias-bg-base))}
.rgi-optionHead{display:flex;align-items:baseline;gap:8px;padding:12px 14px 6px}
.rgi-optionName{font-size:15px;font-weight:600;line-height:20px;color:var(--dsw-alias-label-primary);flex:1}
.rgi-optionEffort{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-interactive-bg-hover);border-radius:999px;padding:1px 8px;flex:none}
.rgi-optionThesis{padding:0 14px 8px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:18px}
.rgi-optionPhases{padding:0 14px 8px;display:flex;flex-wrap:wrap;gap:4px}
.rgi-phaseChip{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-interactive-bg-hover);border-radius:4px;padding:1px 6px}
.rgi-optionRisks{padding:0 14px 10px;color:var(--dsw-alias-label-caption);font-size:12px;line-height:16px}
.rgi-optionFooter{display:flex;justify-content:flex-end;padding:0 14px 10px}
.rgi-chooseBtn{background:0 0;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:4px 12px;font:inherit;font-size:12px;line-height:16px;color:var(--dsw-alias-label-secondary);cursor:pointer}
.rgi-chooseBtn:hover{border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-state-business-primary)}
.rgi-chooseBtnOn{border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-state-business-primary);font-weight:500}
.rgi-footer{display:flex;align-items:stretch;border-top:1px solid var(--dsw-alias-border-l1)}
.rgi-status{flex:1;align-self:center;min-width:0;padding:0 12px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rgi-statusErr{color:var(--dsw-alias-state-error-primary)}
.rgi-statusOk{color:var(--dsw-alias-state-success-primary)}
.rgi-actionBtn{appearance:none;background:0 0;border:none;border-left:1px solid var(--dsw-alias-border-l1);padding:9px 18px;font:inherit;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);cursor:pointer}
.rgi-actionBtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.rgi-actionBtn:disabled{opacity:.45;cursor:default}
.rgi-actionPrimary{color:var(--dsw-alias-state-business-primary);font-weight:500}
.rgi-preActions{display:flex;align-items:stretch;flex:none;border-left:1px solid var(--dsw-alias-border-l1)}
.rgi-preBtn{appearance:none;background:0 0;border:none;border-left:1px solid var(--dsw-alias-border-l1);padding:9px 14px;font:inherit;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);cursor:pointer}
.rgi-preBtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.rgi-preBtn:disabled{opacity:.45;cursor:default}
/* Hosted main-panel mode (sidebar.panellist + main slots). */
.rgi-main{height:100%;overflow:auto;box-sizing:border-box;background:var(--dsw-specific-sidebar-fill);padding:24px;display:flex;justify-content:center;align-items:flex-start}
.rgi-main .rgi-scrim{position:static;z-index:auto;background:0 0;padding:0;display:flex;flex-direction:column;width:100%;max-width:860px;height:100%}
.rgi-main .rgi-card{flex:1;min-height:0;max-height:none;box-shadow:none}
.rgi-main .rgi-close{display:none}`;
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
		function Stepper({ step }) {
			return (0, react_jsx_runtime.jsx)("div", {
				className: "rgi-stepper",
				children: STEPS.map((name, index) => {
					const active = STEPS.indexOf(step);
					return (0, react_jsx_runtime.jsx)("span", {
						className: index === active ? "rgi-step rgi-stepOn" : index < active ? "rgi-step rgi-stepDone" : "rgi-step",
						children: t(`step.${name}`)
					}, name)
				})
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
							(0, react_jsx_runtime.jsx)("span", { className: "rgi-optionEffort", children: `${t("option.effort")}: ${option.effort ?? "M"}` })
						]
					}),
					(0, react_jsx_runtime.jsx)("div", { className: "rgi-optionThesis", children: option.thesis }),
					phases.length > 0 ? (0, react_jsx_runtime.jsx)("div", {
						className: "rgi-optionPhases",
						children: phases.map((phase, i) => (0, react_jsx_runtime.jsx)("span", { className: "rgi-phaseChip", children: `${i + 1}. ${phase.name}` }, i))
					}) : null,
					risks !== "" ? (0, react_jsx_runtime.jsx)("div", { className: "rgi-optionRisks", children: `${t("option.risks")}: ${risks}` }) : null,
					(0, react_jsx_runtime.jsx)("div", {
						className: "rgi-optionFooter",
						children: (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: chosen ? "rgi-chooseBtn rgi-chooseBtnOn" : "rgi-chooseBtn",
							onClick: (event) => { event.stopPropagation(); onChoose(option); },
							children: chosen ? `\u2713 ${t("option.chosen")}` : t("option.choose")
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
				className: "rgi-scrim",
				onClick: (event) => { if (event.target === event.currentTarget) onClose(); },
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: "rgi-card",
						"aria-label": t("panel.title"),
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: "rgi-head",
								children: [
									(0, react_jsx_runtime.jsx)("span", { className: "rgi-title", children: t("panel.title") }),
									(0, react_jsx_runtime.jsx)("button", { type: "button", className: "rgi-close", "aria-label": t("action.close"), onClick: onClose, children: "\u00d7" })
								]
							}),
							(0, react_jsx_runtime.jsx)(Stepper, { step }),
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
														(0, react_jsx_runtime.jsxs)("select", {
															className: "rgi-select",
															value: horizon,
															onChange: (event) => setHorizon(event.target.value),
															children: [
																(0, react_jsx_runtime.jsx)("option", { value: "sprint", children: "Sprint (2 weeks)" }),
																(0, react_jsx_runtime.jsx)("option", { value: "quarter", children: "Quarter" }),
																(0, react_jsx_runtime.jsx)("option", { value: "halfyear", children: "Half year" }),
																(0, react_jsx_runtime.jsx)("option", { value: "year", children: "Year" })
															]
														})
													]
												})
											]
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: "rgi-field",
											children: [
												(0, react_jsx_runtime.jsx)("label", { className: "rgi-label", children: t("focus.constraints") }),
												(0, react_jsx_runtime.jsx)("input", {
													type: "text",
													className: "rgi-input",
													placeholder: t("focus.constraintsPlaceholder"),
													value: constraints,
													onChange: (event) => setConstraints(event.target.value)
												})
											]
										}),
										(0, react_jsx_runtime.jsxs)("label", {
											className: "rgi-deepToggle",
											children: [
												(0, react_jsx_runtime.jsx)("input", {
													type: "checkbox",
													className: "rgi-deepCheckbox",
													checked: deepResearch,
													onChange: (event) => setDeepResearch(event.target.checked)
												}),
												(0, react_jsx_runtime.jsx)("span", { className: "rgi-deepLabel", children: t("action.deepResearch") })
											]
										}),
										(0, react_jsx_runtime.jsx)("div", { className: "rgi-deepHint", children: t("action.deepResearchHint") }),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "rgi-generate",
											disabled: focus.trim() === "" || workspace === "",
											onClick: startGeneration,
											children: deepResearch ? "[Research] " + t("action.generate") : t("action.generate")
										})
									]
								}) : step === "generating" ? (0, react_jsx_runtime.jsxs)("div", {
									className: "rgi-genState",
									children: [
										(0, react_jsx_runtime.jsx)("div", { className: "rgi-genSpinner" }),
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
										step === "chosen" ? (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "rgi-chooseBtn",
											style: { marginTop: 12 },
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
								step === "compare" ? (0, react_jsx_runtime.jsxs)("div", {
									className: "rgi-preActions",
									children: [
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "rgi-preBtn",
											title: t("action.reroll.hint"),
											disabled: busy,
											onClick: () => { setChosen(null); startGeneration(); },
											children: t("action.reroll")
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "rgi-preBtn",
											title: t("action.push.hint"),
											disabled: busy,
											onClick: () => { setChosen(null); setDeepResearch(true); startGeneration(); },
											children: t("action.push")
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "rgi-preBtn",
											title: t("action.discuss.hint"),
											onClick: onClose,
											children: t("action.discuss")
										})
									]
								}) : null,
									chosen !== null && step !== "chosen" ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
										children: [
											(0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "rgi-actionBtn",
												disabled: busy,
												onClick: copyToClipboard,
												children: t("action.export")
											}),
											(0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "rgi-actionBtn rgi-actionPrimary",
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
