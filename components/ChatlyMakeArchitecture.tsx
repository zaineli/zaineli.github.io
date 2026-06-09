import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Chatly Make (charon-make) — system architecture, distilled from the
 * internal spec into a presentable, theme-aware layered diagram.
 * High-level on purpose: components + flow, not internal paths/secrets.
 * ------------------------------------------------------------------ */

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-border-subtle bg-bg px-2 py-[3px] font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
      {children}
    </span>
  );
}

function Node({
  title,
  meta,
  children,
  accent = false,
  className = "",
}: {
  title: string;
  meta?: string;
  children?: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-[var(--radius-md)] border bg-bg-elevated px-4 py-3 ${
        accent ? "border-[var(--accent)]/45" : "border-border-default"
      } ${className}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="t-meta text-fg">{title}</h4>
        {meta && <span className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">{meta}</span>}
      </div>
      {children && <div className="mt-1.5 text-[12.5px] leading-[1.5] text-fg-muted">{children}</div>}
    </div>
  );
}

/** A labelled horizontal band: mono index/label on the left, nodes on the right. */
function Lane({ no, label, children }: { no: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-6">
      <div className="flex shrink-0 items-center gap-2 md:w-[124px] md:flex-col md:items-start md:gap-1.5 md:pt-1">
        <span className="font-[family-name:var(--font-dm-mono)] text-[10px] tracking-[0.28em] text-fg-subtle">{no}</span>
        <span className="t-eyebrow text-[11px] text-fg-muted">{label}</span>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function FlowDown() {
  return (
    <div className="flex items-center gap-3 py-0.5 md:pl-[124px] md:pr-0" aria-hidden="true">
      <span className="text-fg-subtle">↓</span>
      <span className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}

export default function ChatlyMakeArchitecture() {
  return (
    <figure className="w-full">
      <figcaption className="mb-4 flex flex-col gap-1">
        <span className="t-mono-xs text-fg-subtle">System Architecture</span>
        <span className="t-body text-fg-muted">
          <span className="text-fg">charon-make</span>: a stateless agent that turns a prompt into a committed, deployed app.
          The loop stores nothing: each turn is a pure function from payload to an SSE stream.
        </span>
      </figcaption>

      <div
        className="rounded-[var(--radius-lg)] border border-border-default bg-bg-muted p-5 sm:p-7"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex flex-col gap-3">
          {/* 01 — Client & edge */}
          <Lane no="01" label="Client & Edge">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1.6fr] sm:items-center">
              <Node title="Browser · Frontend" meta="Next.js">
                Streams tokens, files, and previews over SSE / WebSocket.
              </Node>
              <span className="hidden text-center text-fg-subtle sm:block">→</span>
              <Node title="nginx" meta=":443">
                Routes <span className="text-fg">/api/langgraph</span> → engine,{" "}
                <span className="text-fg">/api</span> → gateway, static → frontend.
              </Node>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Node title="Engine · FastAPI" meta=":2024">
                LangGraph-compatible run surface. Streams the agent loop as Server-Sent Events.
              </Node>
              <Node title="Gateway · FastAPI" meta=":8000">
                Auth, threads, projects, and connector OAuth.
              </Node>
            </div>
          </Lane>

          <FlowDown />

          {/* 02 — The agent loop */}
          <Lane no="02" label="Agent Loop">
            <div
              className="rounded-[var(--radius-md)] border border-[var(--accent)]/35 p-4"
              style={{ background: "color-mix(in oklab, var(--accent) 5%, transparent)" }}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="t-meta text-fg">run_agent_loop()</span>
                <Tag>pure function · payload → SSE</Tag>
                <Tag>stateless</Tag>
              </div>

              <p className="mb-2 font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                Turn setup · once
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Node title="Warm sandbox" accent meta="cache 600s">
                  Acquire a Modal sandbox; reuse the warm one within the TTL.
                </Node>
                <Node title="Concurrent Haiku" accent>
                  Title + skill detection fire in parallel at setup.
                </Node>
                <Node title="Cacheable prompt" accent meta="~80% off">
                  Byte-exact system blocks hit Anthropic's prompt cache on later turns.
                </Node>
              </div>

              <p className="mb-2 mt-4 font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                Reason ⇄ act · while iterating
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Node title="Claude Sonnet 4.6 stream" accent meta="3 retries">
                  Reasons over tools + full history; streams tokens and tool calls.
                </Node>
                <Node title="Tool dispatch" accent>
                  read · edit (lazy-diff) · run · glob · supabase · connector · github_push · subagents.
                </Node>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-[var(--radius-sm)] border border-border-subtle bg-bg px-3 py-2 text-[12px] text-fg-muted">
                <span className="text-fg-subtle">per tool</span>
                <span className="text-fg-subtle">·</span>
                pre-hook <span className="text-fg-subtle">(security)</span>
                <span className="text-[var(--accent)]">→</span> sandbox exec
                <span className="text-[var(--accent)]">→</span> post-hook <span className="text-fg-subtle">(tsc&nbsp;--noEmit)</span>
                <span className="text-[var(--accent)]">→</span> secret redaction
                <span className="text-[var(--accent)]">→</span> SSE
              </div>

              <p className="mb-2 mt-4 font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                On finish
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Node title="Git auto-commit" accent>
                  Haiku writes the commit message; bash commits the diff.
                </Node>
                <Node title="Thumbnail" accent>
                  Playwright screenshots the live preview → Cloudflare R2.
                </Node>
                <Node title="Done" accent meta="usage">
                  Emits token usage; the loop exits.
                </Node>
              </div>
            </div>
          </Lane>

          <FlowDown />

          {/* 03 — Execution */}
          <Lane no="03" label="Execution">
            <Node title="Modal Sandbox · remote" meta="tunnels :3000 · :8080">
              <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span><span className="text-fg">/mnt/user-data</span> ↔ Cloudflare R2 (synced mount)</span>
                <span><span className="text-fg">/workspace</span>: local NVMe (node_modules, .next)</span>
                <span><span className="text-fg">/git</span>: repo, never synced</span>
              </span>
            </Node>
          </Lane>

          <FlowDown />

          {/* 04 — Integrations */}
          <Lane no="04" label="Integrations">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Node title="Anthropic">Sonnet 4.6 (reasoning + codegen) · Haiku (titles, skills, commits).</Node>
              <Node title="Composio">Generic connectors: Gmail, Slack, GitHub, Supabase…</Node>
              <Node title="GitHub">Bespoke push; auto-creates the repo.</Node>
              <Node title="Cloudflare R2">Object storage + preview thumbnails.</Node>
              <Node title="Postgres">Thread metadata + artifact registry.</Node>
              <Node title="Supabase">Per-thread project: DB, auth, storage.</Node>
            </div>
          </Lane>
        </div>

        {/* cross-cutting footer */}
        <div className="mt-5 flex flex-col gap-2 border-t border-border-subtle pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[12.5px] text-fg-muted">
            <span className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-[0.16em] text-fg-subtle">Security · 5 layers</span>
            <span className="ml-2">prompt rules · pre-hooks · output redaction · injection wrapping · SSE contract</span>
          </span>
          <span className="text-[12.5px] text-fg-muted">
            <span className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-[0.16em] text-fg-subtle">Stateless</span>
            <span className="ml-2">full history per turn · Haiku compaction</span>
          </span>
        </div>
      </div>
    </figure>
  );
}
