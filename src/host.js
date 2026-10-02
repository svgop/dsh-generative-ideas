/**
 * dsh-generative-ideas — Host half.
 *
 * Roadmap ideation: generate distinct roadmap options via a headless agent
 * run, present them for comparison/simulation, export the chosen one as
 * goal.md to a workspace.
 *
 * Routes (loopback + browser-marker fenced):
 *  - POST /api/rich-ideas/generate  { focus, workspace, constraints?, horizon? }
 *  - GET  /api/rich-ideas/state     { workspaces, lastResult? }
 *  - POST /api/rich-ideas/export    { workspace, option }
 *
 * Zero runtime dependencies: node builtins only.
 */
import { execFile } from 'node:child_process'
import { writeFileSync, mkdirSync, readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'

const API_PREFIX = '/api/rich-ideas'
const ACTION_LIMIT = 100_000
const GENERATE_TIMEOUT_MS = 300_000
const DSH_HOME = process.env.DSH_HOME ?? join(homedir(), '.dsh')
const SESSIONS_DIR = join(DSH_HOME, 'sessions')
const DSH_BIN = '/opt/cli-dsh-web/node_modules/.bin/dsh'

export const name = 'dsh-generative-ideas'
export const inject = ['tools', 'webServer', 'connection']

const GENERATION_PROMPT = `You are a roadmap architect. Generate exactly 4 distinct roadmap options for the following focus.

Focus: {{FOCUS}}
Workspace: {{WORKSPACE}}
{{CONSTRAINTS}}
{{HORIZON}}
{{RESEARCH_MODE}}

Each option must take a genuinely different strategic stance (not just faster/slower variants). For each option provide:
- name: a short memorable label (like "Blitzscale DX" or "Fortress First")
- thesis: one sentence on the core bet
- phases: 3-5 phases, each with name, description, acceptance items (array of strings), and estimated effort (S/M/L)
- risks: 2-3 key risks
- effort: overall effort (S/M/L)
- differentiator: what makes this stance different from the others
{{RESEARCH_DIRECTIVE}}

Respond with ONLY a JSON array of 4 objects — no markdown fences, no commentary. The array is the entire response.`

const DEEP_RESEARCH_DIRECTIVE = `

CRITICAL — DEEP RESEARCH MODE IS ON. Before generating the options above, you MUST:
1. Search the web AGGRESSIVELY for competitors and comparable products in this space. Find and study a MINIMUM of 12 competitors or comparable implementations. For each, capture what they do differently, their approach, and their key tradeoff.
2. Search GitHub and code hosting for OPEN-SOURCE repositories doing similar things. Read their READMEs, design docs, and issue trackers for real patterns and hard-won lessons.
3. Read any .refs/ directory in the workspace for curated research references.
4. Use ALL of this research to ground your roadmap options in reality: cite specific competitors by name in the thesis and differentiator, reference real patterns in the phases, and name actual risks that competitors have encountered.

Your options should read like they were written by someone who has studied the entire competitive landscape, not someone guessing. Weave the research findings directly into each option's fields — a thesis that names what the best-in-class competitor does differently is worth more than a generic bet.`

const STANDARD_DIRECTIVE = `

Ground each option in what you know about this space — name real tools, real patterns, and real tradeoffs where you can. Do NOT generate generic options that could apply to any project.`

/** Run a headless dsh session to generate roadmap options. */
function generateRoadmaps(focus, workspace, constraints, horizon, deepResearch) {
  const prompt = GENERATION_PROMPT
    .replace('{{FOCUS}}', focus)
    .replace('{{WORKSPACE}}', workspace)
    .replace('{{CONSTRAINTS}}', constraints ? `Constraints: ${constraints}` : '')
    .replace('{{HORIZON}}', horizon ? `Horizon: ${horizon}` : '')
    .replace('{{RESEARCH_MODE}}', deepResearch ? 'DEEP RESEARCH MODE: ON' : '')
    .replace('{{RESEARCH_DIRECTIVE}}', deepResearch ? DEEP_RESEARCH_DIRECTIVE : STANDARD_DIRECTIVE)
  return new Promise((resolve, reject) => {
    execFile(DSH_BIN, ['--profile', 'headless', prompt], {
      timeout: GENERATE_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
      cwd: '/tmp',
      env: { ...process.env, DSH_HOME },
    }, (error, stdout, stderr) => {
      if (error !== null) {
        reject(new Error(`generation failed: ${stderr?.slice(0, 300) ?? error.message}`))
        return
      }
      try {
        const jsonStart = stdout.indexOf('[')
        const jsonEnd = stdout.lastIndexOf(']')
        if (jsonStart === -1 || jsonEnd === -1) throw new Error('no JSON array in output')
        const options = JSON.parse(stdout.slice(jsonStart, jsonEnd + 1))
        if (!Array.isArray(options) || options.length < 2) throw new Error(`expected 2+ options, got ${options?.length}`)
        resolve(options)
      } catch (parseError) {
        reject(new Error(`parse failed: ${parseError instanceof Error ? parseError.message : String(parseError)}`))
      }
    })
  })
}

/** List workspace slugs. */
function workspaceSlugs() {
  try {
    return readdirSync(SESSIONS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith('--') && entry.name.endsWith('--'))
      .map((entry) => entry.name.slice(2, -2))
      .sort()
  } catch {
    return []
  }
}

function slugToPath(slug) {
  const decoded = slug.replaceAll('--', '/')
  return decoded.startsWith('/') ? decoded : `/${decoded}`
}

/** Render a roadmap option as a goal.md markdown file. */
function renderGoalMd(option, focus) {
  const phases = (option.phases ?? [])
    .map((phase, i) => {
      const items = (phase.acceptanceItems ?? phase.acceptance ?? [])
        .map((item) => `- [ ] ${typeof item === 'string' ? item : item.label ?? String(item)}`)
        .join('\n')
      return `## Phase ${i + 1}: ${phase.name}\n\n${phase.description ?? ''}\n\n${items}\n`
    })
    .join('\n')
  const risks = (option.risks ?? []).map((risk) => `- ${typeof risk === 'string' ? risk : risk.description ?? String(risk)}`).join('\n')
  return `# Goal: ${option.name}

> ${option.thesis ?? focus}

**Focus:** ${focus}
**Effort:** ${option.effort ?? 'M'}
**Differentiator:** ${option.differentiator ?? ''}

## Phases

${phases}

## Risks

${risks || '- (none identified)'}

---
Generated by dsh-generative-ideas.
`
}

/** Write one JSON response. */
function writeJson(res, status, body) {
  if (res.writableEnded) return
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

/** Read a bounded JSON request body. */
async function readJsonBody(req, limit) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > limit) throw new Error('body-too-large')
    chunks.push(buffer)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw === '' ? undefined : JSON.parse(raw)
}

/**
 * Route fence: Connection's own Host/Origin + browser-authentication policy —
 * the same checks the /api channel applies, and the only check that is correct
 * under BOTH carriers (the desktop page's custom-scheme fetches carry
 * `sec-fetch-site: cross-site` and no Origin — the old local fence rejected
 * exactly that legitimate client). The loopback fence survives only as the
 * fallback when no Connection service is in scope. `guard` is reassigned in
 * apply().
 */
let guard = localGuard

function localGuard(req, res) {
  const remote = req.socket?.remoteAddress ?? ''
  const loopback = remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
  const site = req.headers['sec-fetch-site']
  const browser = site === 'same-origin' || typeof req.headers.origin === 'string'
  if (!loopback || !browser) writeJson(res, 403, { ok: false, error: 'forbidden' })
  return loopback && browser
}

function makeGuard(ctx) {
  return (req, res) => {
    const connection = ctx?.connection
    if (connection !== undefined && typeof connection.requestRejection === 'function') {
      const rejection = connection.requestRejection(req)
      if (rejection !== undefined) {
        res.writeHead(rejection, { 'content-type': 'text/plain; charset=utf-8' })
        res.end(rejection === 401 ? 'unauthorized' : 'forbidden')
        return false
      }
      return true
    }
    return localGuard(req, res)
  }
}

export function apply(ctx) {
  guard = makeGuard(ctx)
  /** Session-scoped last generation result (for panel re-open). */
  let lastResult = null
  /** Background generation state — survives panel close/reopen. */
  let generationState = { running: false, error: null, startedAt: 0 }

  ctx.effect(() => {
    const routes = [
      {
        kind: 'exact',
        path: `${API_PREFIX}/state`,
        handler: (req, res) => {
          if (req.method !== 'GET') { writeJson(res, 405, { ok: false, error: 'method-not-allowed' }); return }
          if (!guard(req, res)) return
          writeJson(res, 200, { ok: true, workspaces: workspaceSlugs(), generating: generationState.running, generateError: generationState.error, ...(lastResult !== null ? { lastResult } : {}) })
        },
      },
      {
        kind: 'exact',
        path: `${API_PREFIX}/generate`,
        handler: async (req, res) => {
          if (req.method !== 'POST') { writeJson(res, 405, { ok: false, error: 'method-not-allowed' }); return }
          if (!guard(req, res)) return
          if (!(req.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) { writeJson(res, 415, { ok: false, error: 'json-required' }); return }
          let body
          try { body = await readJsonBody(req, ACTION_LIMIT) } catch (error) {
            writeJson(res, error?.message === 'body-too-large' ? 413 : 400, { ok: false, error: error?.message ?? 'bad-request' })
            return
          }
          if (typeof body !== 'object' || body === null || typeof body.focus !== 'string' || body.focus.trim() === '') {
            writeJson(res, 400, { ok: false, error: 'focus-required' })
            return
          }
          if (generationState.running) { writeJson(res, 409, { ok: false, error: 'already-generating' }); return }
          const focus = body.focus.trim()
          const ws = body.workspace ?? ''
          generationState = { running: true, error: null, startedAt: Date.now() }
          writeJson(res, 200, { ok: true, started: true })
          generateRoadmaps(focus, ws, body.constraints ?? '', body.horizon ?? '', body.deepResearch === true)
            .then((options) => {
              lastResult = { focus, workspace: ws, at: Date.now(), options }
              generationState = { running: false, error: null, startedAt: 0 }
            })
            .catch((error) => {
              generationState = { running: false, error: error instanceof Error ? error.message : String(error), startedAt: 0 }
            })
        },
      },
      {
        kind: 'exact',
        path: `${API_PREFIX}/export`,
        handler: async (req, res) => {
          if (req.method !== 'POST') { writeJson(res, 405, { ok: false, error: 'method-not-allowed' }); return }
          if (!guard(req, res)) return
          if (!(req.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) { writeJson(res, 415, { ok: false, error: 'json-required' }); return }
          let body
          try { body = await readJsonBody(req, ACTION_LIMIT) } catch (error) {
            writeJson(res, error?.message === 'body-too-large' ? 413 : 400, { ok: false, error: error?.message ?? 'bad-request' })
            return
          }
          if (typeof body !== 'object' || body === null || typeof body.option !== 'object' || typeof body.workspace !== 'string' || body.workspace === '') {
            writeJson(res, 400, { ok: false, error: 'invalid-body' })
            return
          }
          const root = slugToPath(body.workspace)
          if (root === '/' || root.includes('..')) { writeJson(res, 400, { ok: false, error: 'invalid-workspace' }); return }
          const goalPath = join(root, 'goal.md')
          try {
            mkdirSync(dirname(goalPath), { recursive: true })
            const content = typeof body.content === 'string' && body.content.trim() !== '' ? body.content : renderGoalMd(body.option, body.focus ?? '')
            writeFileSync(goalPath, content, 'utf8')
            writeJson(res, 200, { ok: true, path: goalPath })
          } catch (error) {
            writeJson(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) })
          }
        },
      },
    ]
    const disposers = routes.map((route) => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  }, 'rich-ideas: generation + export routes')
}
