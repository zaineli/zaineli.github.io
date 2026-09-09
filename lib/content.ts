/* ------------------------------------------------------------------ *
 * Content model for the portfolio. Edit text here; pages render it.
 * Every project below has real assets in /public and is grounded in
 * source docs (Conoid deck, the PDC report) and GitHub READMEs.
 * ------------------------------------------------------------------ */

export interface SocialLink {
  label: string;
  href: string;
  cursor?: string;
}

/** Real media for cards, case-study heroes, and in-section figures. */
export type Media =
  | { kind: "image"; src: string; alt: string; fit?: "cover" | "contain" }
  | {
      kind: "video";
      src: string;
      poster?: string;
      /** true => a player with controls (no autoplay); else an ambient muted loop */
      controls?: boolean;
      fit?: "cover" | "contain";
    };

export const profile = {
  /** lowercase handle wordmark (parallels amanhsn's "amanhsn") */
  wordmark: "zaineli",
  tagline: "product engineer",
  /** display name, rendered UPPERCASE via CSS */
  name: "zain ali",
  role: "Product Engineer",
  company: "Chatly",
  companyParent: "Vyro.ai",
  location: "Islamabad, Pakistan",
  email: "zain.ali@imagine.art",

  /** Portrait — public/profile.png. */
  photo: "/profile.png",

  /** Quick-signal focus areas, shown as a mono line under the hero bio. */
  focus: ["Agentic AI", "Multi-Agent Systems", "Distributed Systems", "Applied Maths"],

  /** Hero bio — swarm/multi-agent identity, researcher+builder, speed, current proof */
  heroBio:
    "I build AI swarms: multi-agent systems that perceive, decide, and act on their own. Researcher and builder. I read the paper, then ship the system, where rigorous maths and distributed systems meet agentic AI. Right now I'm building two things. Chatly Make, the app builder inside Vyro.ai's Omni-Agent, and Conoid, the Internet of Evolving Agents.",

  /** Compressed meta description for <head> */
  metaDescription:
    "Zain Ali. Product Engineer at Chatly (Vyro.ai). I build AI swarms: multi-agent systems, agentic AI, and the distributed infrastructure behind them. I build Conoid, the Internet of Evolving Agents.",

  socials: {
    github: { label: "GitHub", href: "https://github.com/zaineli", cursor: "GitHub" },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/zain-ali-43090a283/",
      cursor: "LinkedIn",
    },
    cv: { label: "CV", href: "/Zain_Ali_CV.pdf", cursor: "Résumé" }, // drop your PDF in /public
    email: { label: "Email", href: "mailto:zali.bscs22seecs@seecs.edu.pk", cursor: "Say hi" },
  } satisfies Record<string, SocialLink>,
};

/** "Get in Touch" nav CTA */
export const contactCTA: SocialLink = {
  label: "Get in Touch",
  href: "https://www.linkedin.com/in/zain-ali-43090a283/",
  cursor: "Say hi",
};

/* ------------------------------------------------------------------ *
 * EXPERIENCE — the ledger (descending).
 * ------------------------------------------------------------------ */
export interface ExperienceRow {
  year: string;
  company: string;
  role: string;
}

export const experience: ExperienceRow[] = [
  { year: "2026", company: "Chatly (Vyro.ai)", role: "Product Engineer" },
  { year: "2026", company: "Conoid", role: "R&D Engineer" },
  { year: "2025", company: "Victreat", role: "Agentic Systems Engineer" },
  { year: "2024", company: "MachVIS Lab, NUST", role: "ML Research Engineer" },
  { year: "2022", company: "NUST SEECS", role: "B.Sc. Computer Science" },
];

/* ------------------------------------------------------------------ *
 * PROJECT CARDS (home). All six have real media and link to an
 * internal /work/[slug] case study; external links live inside.
 * ------------------------------------------------------------------ */
export interface ProjectCard {
  slug: string;
  name: string;
  year: string;
  role: string;
  scope: string[];
  device: string;
  tools: string[];
  /** P1 = definitional, P2 = what I did / what happened */
  body: [string, string];
  /** "Link" row in the meta table + the card destination */
  href: string;
  linkLabel: string;
  /** true => internal /work/[slug] case study exists */
  internal: boolean;
  /** real card visual */
  media?: Media;
  /** accent hues for the fallback placeholder visual */
  hueFrom: string;
  hueTo: string;
}

export const projects: ProjectCard[] = [
  {
    slug: "conoid",
    name: "Conoid",
    year: "2026",
    role: "R&D Engineer",
    scope: ["Multi-Agent Systems", "Reputation & Trust", "Memory", "Evaluation"],
    device: "Agent Infrastructure · SDK",
    tools: ["Python", "Beta-Bernoulli", "LLM-as-Judge", "LangGraph"],
    body: [
      "Conoid is the Internet of Evolving Agents. A drop-in SDK that turns any stateless agent stack (LangGraph, CrewAI, AutoGen) into a persistent organization where agents carry per-skill reputation, three-tier memory, and a collaboration history that builds across tasks.",
      "Every framework spins up a crew, solves a task, and throws the crew away. Nothing learns. Nothing remembers. Nothing earns trust. Conoid is the first protocol to update four channels of agent identity (profile, memory, social edges, reputation) from a single judge call. On AgentsNet it beats the published baseline by +0.24 at N=100.",
    ],
    href: "/work/conoid",
    linkLabel: "Read case study",
    internal: true,
    media: { kind: "video", src: "/conoid/conoid.mp4", poster: "/conoid/conoid-poster.jpg" },
    hueFrom: "#3399ff",
    hueTo: "#0a9d4a",
  },
  {
    slug: "chatly-make",
    name: "Chatly Make",
    year: "2026",
    role: "Product Engineer",
    scope: ["Agentic Codegen", "Full-Stack Generation", "Build Pipeline", "Modal Sandboxes"],
    device: "Web · Chatly (Vyro.ai)",
    tools: ["TypeScript", "Modal", "LLM Orchestration", "Pipelines", "Deploy"],
    body: [
      "Chatly Make is the Lovable-style app builder inside Chatly's Omni-Agent: one prompt becomes generated code, a GitHub commit, a live deploy, and a preview thumbnail. I designed its architecture, first on ByteDance's DeerFlow, then on NousResearch's Hermes.",
      "Both were long-horizon research/agent harnesses. The wrong shape for shipping code fast. I replaced the open-ended loop with a pipeline over warm Modal sandboxes, generated independent files in parallel, and overlapped the long-tail steps. End to end (code, commit, deploy, thumbnail) dropped from ~45 min to ~13 min for full-stack and ~20 min to ~5 min for frontend. About 4×.",
    ],
    href: "/work/chatly-make",
    linkLabel: "Read case study",
    internal: true,
    media: {
      kind: "image",
      src: "/omni-agent/generated-webpage1.png",
      alt: "A full portfolio site generated, committed, and deployed by Chatly Make",
    },
    hueFrom: "#0080ff",
    hueTo: "#7c3aed",
  },
  {
    slug: "vision-tactical",
    name: "VisionTactical",
    year: "2025",
    role: "Agentic AI",
    scope: ["Vision-Language Models", "Multi-Agent Systems", "Game AI"],
    device: "Autonomous Agent",
    tools: ["Python", "Ursina", "Mistral 3.1", "DeepSeek V3"],
    body: [
      "Two off-the-shelf LLMs play a 3D first-person shooter on the same inputs a person gets: pixels in, keys and mouse out. A vision model reads the frame and sets strategy; a text model reads the game state and picks the next move. No reinforcement learning, no training of any kind.",
      "I built the whole stack: the FPS in Ursina, the JSON state schema, and the perceive, decide, act loop on top. Screen in through MSS, keys and mouse out through pynput. In one clip a single enemy demolishes it. In the next, same models, no retraining, it reads the fight differently and wins.",
    ],
    href: "/work/vision-tactical",
    linkLabel: "Read case study",
    internal: true,
    media: {
      kind: "video",
      src: "/vision-tactical/win-web.mp4",
      poster: "/vision-tactical/win-poster.jpg",
    },
    hueFrom: "#8b5cf6",
    hueTo: "#ec4899",
  },
  {
    slug: "tvface",
    name: "TVFace",
    year: "2024",
    role: "ML Research",
    scope: ["Computer Vision", "Dataset", "Facial Recognition", "Fairness"],
    device: "Dataset · Springer",
    tools: ["Python", "PyTorch", "Clustering"],
    body: [
      "Most public face datasets are small, curated, or demographically skewed. TVFace is television: 2,609,210 faces mined from broadcasts across 22 networks, so the data carries the real long tail. Pose, lighting, expression, the same person aging over time.",
      "Built at NUST's MachVIS Lab, where I worked as an ML Research Engineer: 2,609,210 faces across 28,955 identities at 224×224, with probabilistic age, gender, ethnicity, expression, and head-pose labels. Ships a PyTorch loader and a research-only license. Published in Springer's Pattern Analysis and Applications, 2025.",
    ],
    href: "/work/tvface",
    linkLabel: "Read case study",
    internal: true,
    media: {
      kind: "image",
      src: "/tvface/cover-image.png",
      alt: "TVFace: a montage of faces from the 2.6M-image dataset",
    },
    hueFrom: "#10b981",
    hueTo: "#0ea5e9",
  },
];

/* ------------------------------------------------------------------ *
 * CASE STUDIES — the 01–09 narrative spine for internal /work pages.
 * ------------------------------------------------------------------ */
export interface CaseDecision {
  title: string;
  items: string[];
}
export interface CaseShipped {
  title: string;
  caption: string;
}
export interface CaseStat {
  label: string;
  value: string;
}
export interface CaseFigure {
  media: Media;
  caption?: string;
  /** CSS aspect-ratio for the frame, e.g. "16 / 9" (default), "16 / 10". */
  ratio?: string;
  /** span the full width of the 2-col figure grid */
  wide?: boolean;
  /** white plate + inner padding — for white-background charts/diagrams so they
   *  read as clean framed figures on the dark theme instead of floating. */
  plate?: "light";
}
export interface CaseSection {
  no: string;
  kicker: string;
  heading: string;
  body?: string[];
  decisions?: CaseDecision[];
  shipped?: CaseShipped[];
  stats?: CaseStat[];
  maxims?: string[];
  roadmap?: string[];
  figures?: CaseFigure[];
}
export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  scope: string[];
  device: string;
  tools: string[];
  links?: SocialLink[];
  heroMedia?: Media;
  /** draft => shows an editor note banner; flip to false when finalized */
  draft?: boolean;
  hueFrom: string;
  hueTo: string;
  sections: CaseSection[];
}

export const caseStudies: Record<string, CaseStudy> = {
  /* ============================= CHATLY MAKE ============================= */
  "chatly-make": {
    slug: "chatly-make",
    title: "Chatly Make",
    tagline: "One prompt becomes a deployed, committed, thumbnailed app. I cut the round trip ~4× by replacing the agent loop with a pipeline.",
    year: "2026",
    role: "Product Engineer",
    scope: ["Agentic Codegen", "Full-Stack Generation", "Build Pipeline", "Modal Sandboxes"],
    device: "Web · Chatly (Vyro.ai)",
    tools: ["TypeScript", "Modal", "LLM Orchestration", "Pipelines", "GitHub", "Deploy"],
    links: [
      { label: "chatly.com", href: "https://chatly.com", cursor: "Visit Chatly" },
      { label: "DeerFlow: built on first", href: "https://github.com/bytedance/deer-flow", cursor: "ByteDance DeerFlow" },
      { label: "Hermes: then tried", href: "https://github.com/NousResearch/hermes-agent", cursor: "Hermes Agent" },
    ],
    draft: false,
    hueFrom: "#0080ff",
    hueTo: "#7c3aed",
    heroMedia: {
      kind: "image",
      src: "/omni-agent/backend-interface-for-testing.png",
      alt: "The Chatly Make builder: the agent's steps on the left, the spec it filled in the middle, a live preview of the generated site on the right",
    },
    sections: [
      {
        no: "01",
        kicker: "Context",
        heading: "What Chatly Make is, and where it sits",
        body: [
          "I'm a Product Engineer at Chatly (Vyro.ai). Chatly Make is the part of Chatly's Omni-Agent that turns a single prompt into a running app: it generates the code, commits it to GitHub, deploys the app, makes a preview thumbnail, and wires up connectors. Same spirit as Lovable or bolt.new. Prompt in, deployed app out.",
          "To be clear about scope: I designed and built Make, the app-builder slice, not all of Omni-Agent. Internally it's charon-make. The first DeerFlow-based attempt was charon-df-agent-v1 (the “df” is DeerFlow).",
        ],
        figures: [
          {
            media: { kind: "image", src: "/omni-agent/generated-webpage3.png", alt: "A full site (hero, projects, about, footer) generated and deployed by Chatly Make" },
            caption: "What one prompt produces: a complete site (design system, sections, copy) generated, committed, and deployed in a single run.",
            ratio: "16 / 9",
            wide: true,
          },
        ],
      },
      {
        no: "02",
        kicker: "The Problem",
        heading: "Shipping an app is not writing a report",
        body: [
          "The first builds were slow: ~45 minutes end to end for a full-stack app, ~20 minutes for frontend-only. That clock covers everything: code generation, GitHub commits, deploy, and thumbnail. For a product meant to feel like “prompt to live app,” 45 minutes isn't a wait. It's an abandon.",
        ],
        decisions: [
          {
            title: "Where the time went: engineering reasoning, not instrumented attribution",
            items: [
              "Serialized plan, act, observe loop: one model round trip per micro-step, so wall-clock grows roughly linearly with step count. An app touching dozens of files pays that tax dozens of times.",
              "Cold environments: install and build ran in ad-hoc per-run containers, re-paying the base-image pull and a cold npm/pnpm install every single time.",
              "Sequential everything: independent files generated one at a time; commit, deploy, and headless-browser thumbnailing all ran back-to-back at the end, latencies stacking instead of overlapping.",
              "Full-context regeneration: the growing transcript got re-sent each step, so per-step latency climbed as the model re-read code it had already written.",
            ],
          },
        ],
      },
      {
        no: "03",
        kicker: "Approach",
        heading: "DeerFlow first, then Hermes. Both the wrong shape",
        body: [
          "I built Make on ByteDance's DeerFlow first. DeerFlow is a deep-research framework: a Coordinator, Planner, Researcher, Coder, Reporter graph tuned for search → read → synthesize → write, with a human-in-the-loop plan-approval gate before execution. Its “Coder” runs Python inside a research flow. It isn't there to scaffold, build, and deploy a real codebase, and the deliverable is a document, not an app. So even simple builds inherited planning overhead, search machinery, and an approval stall that does nothing for autonomous codegen.",
          "Then I tried Hermes: NousResearch's agent framework, the self-improving multi-backend harness, not their LLM models. Better on paper: parallel subagents, a Modal execution backend. But it's still a general long-horizon agent harness. The open-ended loop and per-step inference tax remained, and the defaults are tuned for autonomous task-running, not the tight scaffold → build → preview loop app generation needs.",
          "The honest read: the bottleneck wasn't either framework's quality. An app builder is a mostly-deterministic delivery pipeline wearing an agent costume. So I stopped bending a research harness toward codegen and designed for the actual job.",
        ],
      },
      {
        no: "04",
        kicker: "Architecture",
        heading: "A pipeline, warm Modal sandboxes, and overlap",
        body: [
          "I replaced the open-ended loop with an explicit, mostly-deterministic pipeline: scaffold → generate files → install/build → commit → deploy → thumbnail. The model is invoked a bounded number of times for generation instead of once per micro-step, which kills the per-step inference tax and the “should I loop back?” overhead that dominated the research loops.",
        ],
        decisions: [
          {
            title: "The redesign. PR titles: “Add pipeline”, “Use modal proxy”",
            items: [
              "Warm Modal sandboxes through a thin proxy: build, install, and deploy run in pre-warmed, isolated Linux environments instead of cold per-run Docker. Image-layer cache, a warmed node_modules, and a warm pool mean each app stops re-paying the multi-minute cold install. Untrusted generated code stays sandboxed.",
              "Execute as you generate: dependency install starts the moment package.json is known, overlapping with continued component generation; coherent files get written and committed while later files are still being produced.",
              "Parallel codegen: files with no data dependency (separate components, routes, configs) generate concurrently, collapsing a sum of sequential generations toward the cost of the slowest batch.",
              "Overlapped long tail: thumbnail/screenshot work kicks off on deploy-readiness in a separate worker, so it doesn't block the user-facing deploy. The research/report roles and approval gates are stripped entirely.",
            ],
          },
        ],
      },
      {
        no: "05",
        kicker: "The Numbers",
        heading: "About 4×, end to end",
        body: [
          "Every figure is full end-to-end wall-clock: code generation + GitHub commits + deploy + thumbnail, not just generation.",
        ],
        stats: [
          { label: "Full-stack app", value: "~45 min → ~13 min" },
          { label: "Frontend-only", value: "~20 min → ~5 min" },
          { label: "End-to-end", value: "~4× faster" },
          { label: "The clock covers", value: "codegen + commit + deploy + thumbnail" },
          { label: "Shipped in", value: "37 commits · 11 PRs · 1 month" },
        ],
        figures: [
          {
            media: { kind: "image", src: "/omni-agent/contribution.png", alt: "GitHub contribution activity on Vyro-ai/charon-make: 37 commits and 11 pull requests, 10 merged" },
            caption: "The work behind the numbers. Vyro-ai/charon-make: 37 commits, 11 PRs (10 merged) in a month. Two of them: “Use modal proxy” and “Add pipeline.”",
            ratio: "4 / 5",
            plate: "light",
          },
        ],
      },
      {
        no: "06",
        kicker: "What I Learned",
        heading: "Portable lessons",
        maxims: [
          "Match the harness to the job. An app builder is a delivery pipeline, not a research agent.",
          "Every step that calls the model is on the critical path. Bound the calls; let determinism carry the rest.",
          "Warm beats clever. A pre-warmed, cached sandbox erases more wall-clock than any prompt trick.",
          "Overlap is free speed: generate, commit, build, and thumbnail want to run concurrently, not in line.",
        ],
      },
    ],
  },

  /* ============================== CONOID ============================== */
  conoid: {
    slug: "conoid",
    title: "Conoid",
    tagline: "The Internet of Evolving Agents. One judge call updates four channels of agent identity at once. The first protocol that does.",
    year: "2026",
    role: "R&D Engineer",
    scope: ["Multi-Agent Systems", "Bayesian Reputation", "Hierarchical Memory", "Evaluation"],
    device: "Agent Infrastructure · SDK",
    tools: ["Python", "Beta-Bernoulli", "LLM-as-Judge", "LangGraph", "Submodular Optimization"],
    links: [
      { label: "Pitch deck (PDF)", href: "/conoid/open-house.pdf", cursor: "Open deck" },
    ],
    draft: false,
    hueFrom: "#3399ff",
    hueTo: "#0a9d4a",
    heroMedia: { kind: "video", src: "/conoid/conoid.mp4", poster: "/conoid/conoid-poster.jpg" },
    sections: [
      {
        no: "01",
        kicker: "Context",
        heading: "An agent economy built on quicksand.",
        body: [
          "The agent economy is a $10.9B market in 2026 racing to $52.6B by 2030, and it's built on stateless workers. Gartner expects 40% of agentic-AI projects to be cancelled by 2027; 88% never reach production; frontier agents finish real CRM workflows below 55%.",
          "Every framework (LangGraph, CrewAI, AutoGen) spins up a crew, solves a task, and throws the crew away. Nothing learns. Nothing remembers. Nothing earns trust. Conoid is the Internet of Evolving Agents: networks that compound intelligence the way great organizations compound human expertise.",
        ],
      },
      {
        no: "02",
        kicker: "The Problem",
        heading: "Agent crews are amnesiacs.",
        body: [
          "Statelessness isn't a missing feature; it's the ceiling. Without memory and a notion of who to trust, collaboration can't compound, and shared knowledge has no defense against a confidently wrong agent.",
        ],
        decisions: [
          {
            title: "Three failures to fix",
            items: [
              "Ephemerality: experience evaporates between tasks.",
              "No trust model: every agent's claim is weighted the same, however unreliable.",
              "Hallucination contagion: one wrong answer can poison shared organizational knowledge.",
            ],
          },
        ],
      },
      {
        no: "03",
        kicker: "Approach",
        heading: "A drop-in SDK that wraps any agent stack.",
        body: [
          "Conoid is the missing intelligence layer. It wraps an existing agent stack and converts a fragile pipeline of prompts into a persistent organization with reputation, memory, and a proven collaboration history.",
          "Where every framework sells orchestration, Conoid sells the only thing that compounds: a system that gets measurably better every time it runs.",
        ],
        figures: [
          {
            media: { kind: "video", src: "/conoid/conoid-demo.mp4", poster: "/conoid/conoid-poster.jpg", controls: true },
            caption: "Mission Control: the org worldview, live trust graph, and run health for a running agent organization.",
            wide: true,
          },
        ],
      },
      {
        no: "04",
        kicker: "Architecture",
        heading: "An episode lifecycle, and what happens inside one subtask.",
        body: [
          "A task runs as an episode: reputation decays-then-adds at the start (λ = 0.99), a Planner-Critic loop decomposes it into a DAG over 30 skill weights, each node runs a subtask loop, and an outcome closes the episode.",
          "Inside a subtask: a submodular, reputation-conditioned team forms with a (1 − 1/e) ≈ 0.632 greedy bound; a Magentic-One ledger executes (m = 3 agents, MCP tools, retry R = 2, swap T_max = 3); teammates give peer testimony (Yu & Singh, β_w = 0.1); and a single Critic Judge (k = 2 paired Latin-square, length-residualised, drawn disjoint from the agent pool) emits one call that updates four channels at once.",
        ],
        decisions: [
          {
            title: "Four-channel judge loop",
            items: [
              "One judge call → four simultaneous structured updates: profile · memory · social edges · reputation.",
              "Bias defenses baked in: Wang 2023 (BPC) kills position bias, Dubois 2024 (LC) kills verbosity, a disjoint judge kills self-preference.",
            ],
          },
          {
            title: "Reputation-conditioned team formation",
            items: [
              "Per-skill Beta-posterior reputation as a first-class gating signal in k-agent team formation.",
              "A structural anti-oligarchy guarantee no prior system has: strong agents can't monopolise the org.",
            ],
          },
        ],
        figures: [
          {
            media: { kind: "image", src: "/conoid/deck/slide-06.png", alt: "Conoid episode lifecycle diagram" },
            caption: "Episode lifecycle: decay-then-add → task → Planner-Critic decomposition → DAG → subtask loop → outcome.",
          },
          {
            media: { kind: "image", src: "/conoid/deck/slide-07.png", alt: "Conoid inside-one-subtask diagram" },
            caption: "Inside one subtask: team form → execute → peer testimony → critic judge → four-channel JSON.",
          },
          {
            media: { kind: "image", src: "/conoid/deck/slide-08.png", alt: "Conoid four-channel commit diagram with per-channel caps" },
            caption: "Four channels, committed from one judge call (profile, memory, edges, reputation), each with hard caps and a SHA-256-chained audit trail anyone can verify.",
            wide: true,
          },
        ],
      },
      {
        no: "05",
        kicker: "Research Contribution",
        heading: "The first system to update four channels of identity per judge call.",
        body: [
          "Across every adjacent system in the literature (RepuNet, AgentNet, SiriuS, G-Memory, Hyperagents, Evolving Orchestration, Agent-as-a-Judge), each updates exactly one channel of agent identity per judge call. Conoid updates four, on persistent agents, with the bias defenses above. That, plus per-skill Beta-posterior reputation as a gating signal with an anti-oligarchy guarantee, is the contribution.",
        ],
        figures: [
          {
            media: { kind: "image", src: "/conoid/deck/slide-09.png", alt: "Conoid vs CrewAI, MetaGPT, AutoGen comparison table" },
            caption: "Conoid is the only platform where agents accumulate reputation, social-graph, multi-tier memory, intent refinement, post-task evolution, and referral chains.",
            wide: true,
          },
        ],
      },
      {
        no: "06",
        kicker: "Evaluation",
        heading: "Measured, ablated, and stress-tested adversarially.",
        body: [
          "Three studies, each isolating a different claim: that the rep-gate scales, that every identity channel earns its place, and that the design resists reward-hacking.",
        ],
        stats: [
          { label: "AgentsNet", value: "+0.24 vs baseline at N=100" },
          { label: "Rep-gate lift", value: "+0.02 → +0.11, grows with N" },
          { label: "Top channel", value: "Reputation, d = 1.42 (2× next)" },
          { label: "Adversary held", value: "within +0.05 of cold-start" },
        ],
        figures: [
          {
            media: { kind: "image", src: "/conoid/deck/slide-10.png", alt: "AgentsNet leader-election evaluation chart" },
            caption: "AgentsNet leader-election: the full Internet-of-Agents beats the published baseline by +0.24 at N=100; the rep-gate's contribution grows monotonically with the pool.",
          },
          {
            media: { kind: "image", src: "/conoid/deck/slide-11.png", alt: "Per-channel leave-one-out ablation chart" },
            caption: "Per-channel leave-one-out (N=32, Wilcoxon + Holm): removing any channel hurts; reputation (d=1.42) is 2× the next; NO_JUDGE drops a further 0.14.",
          },
          {
            media: { kind: "image", src: "/conoid/deck/slide-12.png", alt: "Adversarial reward-hacking probe charts" },
            caption: "Adversarial reward-hacking (GhostInTheRubric, 50 episodes): naive scalar reputation is gamed to ρ=0.83; multi-channel + Yu-&-Singh credibility holds the adversary within +0.05 of the cold-start prior.",
            wide: true,
          },
        ],
      },
      {
        no: "07",
        kicker: "The Opportunity",
        heading: "Selling the layer that compounds.",
        body: [
          "Conoid sits in the execution layer of AI systems. It moves the variables that matter in production: task success rate, cost per task, and reliance on human supervision. It ships as B2B SaaS priced on deployed agents and task volume. First design partners came through published research and academic credibility (Stanford & NUST affiliations).",
        ],
        figures: [
          {
            media: { kind: "image", src: "/conoid/deck/slide-13.png", alt: "Conoid business model slide" },
            caption: "The model: B2B SaaS, priced on deployed agents and task volume. Usage-aligned, value-linked.",
          },
          {
            media: { kind: "image", src: "/conoid/deck/slide-15.png", alt: "Conoid go-to-market slide" },
            caption: "Go-to-market: land teams hitting the stateless ceiling, prove it in scoped paid pilots, expand on published benchmarks.",
          },
          {
            media: { kind: "image", src: "/conoid/deck/slide-14.png", alt: "Conoid market sizing slide" },
            caption: "The AI-agents market grows from $7.63B today to $182.97B by 2033 (49.6% CAGR). TAM $122.8B · SAM $4.14B · SOM $216M.",
            wide: true,
          },
        ],
      },
      {
        no: "08",
        kicker: "What I Learned",
        heading: "Portable lessons",
        maxims: [
          "Memory is the difference between a tool and a teammate.",
          "Trust must be earned, decayed, and bounded.",
          "One judge can do four jobs, if you defend it from its own biases.",
        ],
      },
      {
        no: "09",
        kicker: "What's Next",
        heading: "The roadmap",
        roadmap: [
          "Publish the peer-reviewed benchmarks behind the four-channel result.",
          "Scale the evaluation to larger agent populations.",
          "Harden the reputation system against new adversarial strategies.",
          "Open the platform to external agents. The Internet of Agents, for real.",
        ],
      },
    ],
  },

  /* ========================== VISION-TACTICAL ========================== */
  "vision-tactical": {
    slug: "vision-tactical",
    title: "VisionTactical",
    tagline: "Two off-the-shelf LLMs play a 3D shooter on sight alone. No RL, no training, zero gradient steps.",
    year: "2025",
    role: "Agentic AI · Game Engineering",
    scope: ["Vision-Language Models", "Multi-Agent Systems", "Game AI"],
    device: "Autonomous Agent",
    tools: ["Python", "Ursina", "Mistral 3.1", "DeepSeek V3", "Pynput", "MSS"],
    links: [
      { label: "github.com/zaineli/vision-tactical", href: "https://github.com/zaineli/vision-tactical", cursor: "View code" },
    ],
    draft: false,
    hueFrom: "#8b5cf6",
    hueTo: "#ec4899",
    heroMedia: {
      kind: "video",
      src: "/vision-tactical/win-web.mp4",
      poster: "/vision-tactical/win-poster.jpg",
    },
    sections: [
      {
        no: "01",
        kicker: "Context",
        heading: "Human perception, robotically.",
        body: [
          "VisionTactical is an autonomous agent that plays a custom 3D first-person shooter. It tests a simple idea: can off-the-shelf language models play a real-time game using nothing but sight and reasoning, with no reinforcement learning and no training at all?",
          "I built the game and the agents. The game is a 3D FPS in Ursina; the agents sit on top, perceiving the world through screenshots and JSON state and acting through simulated keyboard and mouse.",
        ],
      },
      {
        no: "02",
        kicker: "The Problem",
        heading: "Real-time play, zero training budget.",
        body: [
          "Game-playing agents usually mean reinforcement learning: millions of frames, reward shaping, and a policy that only works in the world it trained on. I wanted the opposite: generality over a training loop, and a real-time control budget that two LLM calls have to fit inside.",
        ],
      },
      {
        no: "03",
        kicker: "Approach",
        heading: "A Commander and a Lieutenant.",
        body: [
          "Two roles. The Commander (Mistral 3.1), a vision model, looks at the screen and sets strategy from what it sees. The Lieutenant (DeepSeek V3), a text model, reads structured game state and turns the Commander's intent into the next concrete move.",
          "The loop is deliberately simple: capture the screen and state, ask the Commander what's happening and what to do, ask the Lieutenant for the action, execute it with keyboard and mouse, repeat.",
        ],
        figures: [
          {
            media: { kind: "image", src: "/vision-tactical/diagram.png", alt: "VisionTactical AI-driven game system architecture", fit: "contain" },
            caption: "System architecture: a Ursina game environment, screenshot + JSON state capture, the Commander/Lieutenant decision layer, and pynput action execution.",
            ratio: "4 / 3",
          },
        ],
      },
      {
        no: "04",
        kicker: "Key Decisions",
        heading: "What shaped it",
        decisions: [
          {
            title: "Split sight from tactics",
            items: [
              "A vision model owns perception and strategy; a text model owns precise actions on structured state.",
              "Each model does what it's best at, and neither has to do both.",
            ],
          },
          {
            title: "Own the whole stack",
            items: [
              "I built the 3D game in Ursina so the agents had a world to act in, and the state schema they read.",
              "Screenshots via MSS, control via pynput. The agent uses the same inputs a human would.",
            ],
          },
          {
            title: "No RL, on purpose",
            items: [
              "No reward shaping, no training run, no fine-tune. Only prompting and a tight loop.",
              "The bet: frontier models already have enough world-model to adapt in-context.",
            ],
          },
        ],
      },
      {
        no: "05",
        kicker: "Craft Moment",
        heading: "Lose, then adapt, then win.",
        body: [
          "The whole thesis lives in two clips. First the agent gets demolished by a single enemy: the loop runs, but the strategy is wrong. Then, with the same models and no retraining, it reads the situation differently and wins. Adaptation without a single gradient step.",
        ],
        figures: [
          {
            media: { kind: "video", src: "/vision-tactical/fail-web.mp4", poster: "/vision-tactical/win-poster.jpg" },
            caption: "Attempt one: outplayed.",
          },
          {
            media: { kind: "video", src: "/vision-tactical/win-web.mp4", poster: "/vision-tactical/win-poster.jpg" },
            caption: "Attempt two: adapts and wins.",
          },
        ],
      },
      {
        no: "06",
        kicker: "What Shipped",
        heading: "The system",
        shipped: [
          { title: "Custom 3D FPS", caption: "A first-person shooter built in Python + Ursina, with a clean state schema." },
          { title: "Commander (vision)", caption: "Mistral 3.1 reads the screen and sets strategy." },
          { title: "Lieutenant (text)", caption: "DeepSeek V3 turns intent into the next keyboard/mouse action." },
          { title: "Perceive-act loop", caption: "MSS screen capture in, pynput control out. Open-sourced under MIT." },
        ],
        figures: [
          {
            media: { kind: "video", src: "/vision-tactical/walls-web.mp4", poster: "/vision-tactical/win-poster.jpg" },
            caption: "The arena, built in Ursina: a low-poly FPS with deployable cover and a live enemy. The world the agents actually play in.",
            wide: true,
          },
        ],
      },
      {
        no: "07",
        kicker: "Outcome",
        heading: "Where it landed",
        body: [
          "A working proof that two prompted models, split by role, can play a real-time 3D game and adapt across attempts. Built end to end, game included.",
        ],
        stats: [
          { label: "Training", value: "None, prompting only" },
          { label: "Agents", value: "Vision + text, 2 roles" },
          { label: "Code", value: "Open source · MIT" },
        ],
      },
      {
        no: "08",
        kicker: "What I Learned",
        heading: "Portable lessons",
        maxims: [
          "Split the problem by what each model is best at.",
          "Perception plus reasoning can replace a training loop.",
          "Give an agent the same controls a human has, and it adapts.",
        ],
      },
    ],
  },

  /* ============================ SYNAPSEGRAPH ============================ */
  synapsegraph: {
    slug: "synapsegraph",
    title: "SynapseGraph",
    tagline: "Ask for a company, get a full research report. Eight agents, four analysts at once, every node streamed as it fires.",
    year: "2025",
    role: "Agentic Platform Engineering",
    scope: ["Multi-Agent Orchestration", "LangGraph", "Real-time Streaming", "RAG"],
    device: "Research Platform",
    tools: ["FastAPI", "LangGraph", "Gemini 2.0 Flash", "GPT-4.1-mini", "React", "MongoDB", "WebSocket"],
    links: [
      { label: "github.com/zaineli/SynapseGraph", href: "https://github.com/zaineli/SynapseGraph", cursor: "View code" },
    ],
    draft: false,
    hueFrom: "#06b6d4",
    hueTo: "#3b82f6",
    heroMedia: {
      kind: "image",
      src: "/synapse-graph/app.png",
      alt: "SynapseGraph: curation and generated research queries for a company report",
    },
    sections: [
      {
        no: "01",
        kicker: "Context",
        heading: "A research analyst, as a graph of agents.",
        body: [
          "SynapseGraph generates a comprehensive company research report on demand. Instead of one model trying to do everything, it runs a pipeline of specialists (company, industry, financial, and news analysts) that gather sources in parallel, then hand off to a collector, curator, and editor that synthesize a final briefing.",
        ],
      },
      {
        no: "02",
        kicker: "The Problem",
        heading: "One model, one shot, no provenance.",
        body: [
          "Ask a single LLM for a company report and you get a confident blob: no division of labour, no source filtering, and no way to watch it reason. Research is parallel and multi-source by nature. The architecture should be too.",
        ],
      },
      {
        no: "03",
        kicker: "Approach",
        heading: "A LangGraph DAG with live progress.",
        body: [
          "The system is a LangGraph DAG over a FastAPI backend. A grounding step fans out to four analyst agents; their findings converge on a collector, then a curator, an enricher, a briefing writer, and an editor. A React front end subscribes over WebSocket and renders progress as each node fires.",
          "Two models, split by job: Gemini 2.0 Flash handles synthesis, GPT-4.1-mini handles formatting. Sources are kept or dropped by a relevance score before they ever reach the report.",
        ],
        figures: [
          {
            media: { kind: "image", src: "/synapse-graph/diagram.png", alt: "SynapseGraph agent DAG", fit: "contain" },
            caption: "The agent graph: grounding → financial / news / industry / company analysts → collector → curator → enricher → briefing → editor.",
            ratio: "4 / 3",
          },
        ],
      },
      {
        no: "04",
        kicker: "Key Decisions",
        heading: "What shaped it",
        decisions: [
          {
            title: "Specialists over a generalist",
            items: [
              "Four analyst agents, each with a single lens: company, industry, financial, news.",
              "A collector / curator / editor chain turns their raw findings into one coherent briefing.",
            ],
          },
          {
            title: "Stream the work",
            items: [
              "WebSocket progress so the user watches the report build node by node, not a spinner.",
              "Live updates and download when the editor finishes.",
            ],
          },
          {
            title: "Filter before you synthesize",
            items: [
              "Relevance scoring drops weak sources before synthesis, so the report stays grounded.",
              "Right model for the right job: Gemini 2.0 Flash to synthesize, GPT-4.1-mini to format.",
            ],
          },
        ],
      },
      {
        no: "05",
        kicker: "What Shipped",
        heading: "The platform",
        shipped: [
          { title: "Eight-node agent graph", caption: "Grounding, four analysts, collector, curator, enricher, briefing, editor." },
          { title: "Real-time streaming UI", caption: "A React front end that renders progress over WebSocket." },
          { title: "Relevance-scored RAG", caption: "Sources filtered by a minimum relevance threshold before synthesis." },
          { title: "Containerized", caption: "FastAPI + MongoDB, Dockerized, with cloud-deploy configs. Apache-2.0." },
        ],
      },
      {
        no: "06",
        kicker: "Outcome",
        heading: "Where it landed",
        body: [
          "An end-to-end agentic research tool: type a company, watch a crew of agents assemble the report live, and download a synthesized briefing. Open-sourced under Apache-2.0.",
        ],
        stats: [
          { label: "Agents", value: "8-node LangGraph DAG" },
          { label: "Models", value: "Gemini 2.0 Flash + GPT-4.1-mini" },
          { label: "Code", value: "Open source · Apache-2.0" },
        ],
      },
      {
        no: "07",
        kicker: "What I Learned",
        heading: "Portable lessons",
        maxims: [
          "Decompose by lens; let specialists do one thing well.",
          "Stream the process. Provenance and progress build trust.",
          "Filter sources before synthesis, not after.",
        ],
      },
    ],
  },

  /* =========================== DISTRIBUTED-ML =========================== */
  "distributed-ml": {
    slug: "distributed-ml",
    title: "Distributed ML Platform",
    tagline: "100 sensors, three models, one stream, no batch. Sub-300ms end to end, on a pipeline that sustains 700+ msg/s.",
    year: "2025",
    role: "Distributed Systems + ML",
    scope: ["Stream Processing", "Distributed ML", "Real-time Analytics"],
    device: "Data Platform",
    tools: ["Apache Kafka", "Apache Spark", "Elasticsearch", "Kibana", "Docker", "PySpark MLlib"],
    links: [
      { label: "github.com/zaineli/distributed-ml-platform", href: "https://github.com/zaineli/distributed-ml-platform", cursor: "View code" },
      { label: "Project report (PDF)", href: "/distributed-ml-platform/ZainAli_AliAbbas_PDC_Project.pdf", cursor: "Read report" },
    ],
    draft: false,
    hueFrom: "#f59e0b",
    hueTo: "#10b981",
    heroMedia: {
      kind: "image",
      src: "/distributed-ml-platform/fig/architecture.png",
      alt: "Distributed ML Platform system architecture",
      fit: "contain",
    },
    sections: [
      {
        no: "01",
        kicker: "Context",
        heading: "Sensor data, end to end, in real time.",
        body: [
          "A distributed machine-learning inference and analytics platform for real-time IoT sensor data, built for NUST's Parallel & Distributed Computing course with Ali Abbas. Data is ingested, processed, scored by ML models, and visualized, all as a streaming pipeline.",
          "It combines Apache Kafka for ingestion, Apache Spark Structured Streaming for distributed processing and inference, three MLlib models for analytics, and Elasticsearch + Kibana for live dashboards.",
        ],
      },
      {
        no: "02",
        kicker: "The Problem",
        heading: "Volume, velocity, and the need for answers now.",
        body: [
          "IoT sensor networks generate more data, faster, than traditional systems handle: millions of points per second, real-time latency requirements, heterogeneous formats, and a need to turn it all into actionable insight. The architecture has to be horizontally scalable and fault-tolerant from the start.",
        ],
      },
      {
        no: "03",
        kicker: "Architecture",
        heading: "Kafka → Spark → Elasticsearch → Kibana.",
        body: [
          "Sensors publish to Kafka, which partitions and replicates for throughput and fault tolerance. Spark Structured Streaming consumes the topics and runs three models in parallel across worker nodes. Scored records land in Elasticsearch (sharded for parallel indexing) and surface in Kibana dashboards. The whole stack is containerized with Docker Compose.",
        ],
        decisions: [
          {
            title: "Three models, one stream",
            items: [
              "StatusFlagPredictor: a Random Forest classifier for operational status (95.2%, <10ms).",
              "TemperatureAnomalyDetector: Logistic Regression for anomalies (92.1%, <5ms).",
              "HumidityRegressor: a Gradient-Boosted Tree regressor (RMSE 2.3, <15ms).",
            ],
          },
          {
            title: "Parallel and fault-tolerant by design",
            items: [
              "Data parallelism via Kafka partitioning, Spark RDDs, and Elasticsearch sharding.",
              "Reliability via Kafka replication, Spark checkpointing, and Elasticsearch replicas.",
            ],
          },
        ],
        figures: [
          {
            media: { kind: "image", src: "/distributed-ml-platform/fig/conceptual_overview.png", alt: "Distributed ML Platform conceptual overview: collection, streaming, analytics, storage, and visualization layers", fit: "contain" },
            caption: "The conceptual stack: collection → streaming → parallel analytics → storage → visualization, with fault tolerance and horizontal scaling at every layer.",
            ratio: "16 / 9",
            plate: "light",
          },
          {
            media: { kind: "image", src: "/distributed-ml-platform/fig/throughput.png", alt: "Throughput vs sensor-count chart", fit: "contain" },
            caption: "Throughput scales with sensor count: Kafka ingestion to ~1,000 msg/s; the full ML pipeline sustains ~700 msg/s.",
            ratio: "16 / 9",
            plate: "light",
          },
        ],
      },
      {
        no: "04",
        kicker: "Performance",
        heading: "What it sustained.",
        body: [
          "Deployed on a 4-node cluster (8 cores, 16GB RAM each) with 100 simulated sensors at 1 message/second, the platform held linear scalability and sub-second latency end to end.",
        ],
        stats: [
          { label: "Full pipeline", value: "700+ msg/s" },
          { label: "End-to-end latency", value: "< 300ms" },
          { label: "Status accuracy", value: "95.2%" },
          { label: "Anomaly accuracy", value: "92.1%" },
          { label: "Inference", value: "< 15ms" },
          { label: "Cluster", value: "4 nodes · 32 cores" },
        ],
      },
      {
        no: "05",
        kicker: "What Shipped",
        heading: "The platform",
        shipped: [
          { title: "Streaming pipeline", caption: "Kafka ingestion into Spark Structured Streaming with checkpointing." },
          { title: "Parallel ML inference", caption: "Three MLlib models scored on every record across worker nodes." },
          { title: "Searchable store", caption: "Elasticsearch with sharding and replicas for fast, redundant indexing." },
          { title: "Live dashboards", caption: "Kibana views for sensor overview, anomalies, and alert history." },
        ],
        figures: [
          {
            media: { kind: "image", src: "/distributed-ml-platform/fig/elastic_dashboard.png", alt: "Live Kibana dashboard with sensor map, throughput timeline, and anomaly stream", fit: "contain" },
            caption: "The live Kibana dashboard: sensor map, throughput over time, and the anomaly/alert stream, updating as scored records land in Elasticsearch.",
            wide: true,
            plate: "light",
          },
        ],
      },
      {
        no: "06",
        kicker: "What I Learned",
        heading: "Portable lessons",
        maxims: [
          "Kafka partition sizing decides your throughput ceiling.",
          "Model complexity is a latency budget. Spend it deliberately.",
          "Make the pipeline fault-tolerant before you make it fast.",
        ],
      },
    ],
  },

  /* =============================== TVFACE =============================== */
  tvface: {
    slug: "tvface",
    title: "TVFace",
    tagline: "2,609,210 faces, 28,955 identities, mined from 22 TV networks. The largest public facial-clustering dataset.",
    year: "2024",
    role: "ML Research Engineer · MachVIS Lab",
    scope: ["Computer Vision", "Dataset", "Facial Recognition", "Demographic Fairness"],
    device: "Dataset · Springer publication",
    tools: ["Python", "PyTorch", "Clustering", "Face Detection"],
    links: [
      { label: "github.com/zaineli/TVFace", href: "https://github.com/zaineli/TVFace", cursor: "View repo" },
      { label: "Paper (Springer)", href: "https://doi.org/10.1007/s10044-025-01464-3", cursor: "Read paper" },
      { label: "TVFace Challenge 2026 (PDF)", href: "/tvface/Competition.pdf", cursor: "View challenge" },
      { label: "MachVIS Lab", href: "https://vision.seecs.edu.pk/", cursor: "Visit lab" },
    ],
    draft: false,
    hueFrom: "#10b981",
    hueTo: "#0ea5e9",
    heroMedia: {
      kind: "image",
      src: "/tvface/cover-image.png",
      alt: "TVFace: a montage of faces from the dataset",
    },
    sections: [
      {
        no: "01",
        kicker: "Context",
        heading: "Real faces, at real scale.",
        body: [
          "TVFace is a large-scale facial-recognition and clustering dataset built at NUST's MachVIS lab: 2,609,210 high-resolution face images of 28,955 unique individuals, extracted from broadcasts across 22 global television networks.",
          "Because the source is live television, the data captures genuine real-world conditions (pose, lighting, expression, and aging over time) instead of the clean, frontal images most datasets rely on.",
        ],
      },
      {
        no: "02",
        kicker: "The Problem",
        heading: "Benchmarks that don't look like the world.",
        body: [
          "Facial-recognition research needs scale, diversity, and a realistic long tail. Most public datasets are small, curated, or demographically skewed. Without a benchmark that mirrors real distributions, it's hard to study unsupervised clustering, large-scale recognition, or demographic fairness honestly.",
        ],
      },
      {
        no: "03",
        kicker: "Approach",
        heading: "Mine broadcasts, annotate probabilistically.",
        body: [
          "Faces were detected and clustered from television broadcasts into a natural long-tail distribution, from 10 to 21,983 images per identity, at 224×224 resolution. Each identity carries probabilistic demographic annotations: age, gender, ethnicity (7 groups), expression (7 categories), and head pose.",
          "The dataset ships with a PyTorch-compatible loader and an ethics-first usage framework: research-only, non-commercial, with explicit privacy and bias-mitigation requirements.",
        ],
      },
      {
        no: "04",
        kicker: "By the Numbers",
        heading: "The scale of it.",
        stats: [
          { label: "Images", value: "2,609,210" },
          { label: "Identities", value: "28,955" },
          { label: "Per identity", value: "10 to 21,983" },
          { label: "Networks", value: "22 worldwide" },
          { label: "Resolution", value: "224 × 224" },
          { label: "Size", value: "65 GB" },
        ],
        figures: [
          {
            media: { kind: "image", src: "/tvface/age-distribution.png", alt: "TVFace age-distribution bar chart", fit: "contain" },
            caption: "Age skews working-age: the 20 to 29 and 30 to 39 bands hold ~675k and ~654k images, tapering to 17,347 at 70+.",
            ratio: "16 / 10",
            plate: "light",
          },
          {
            media: { kind: "image", src: "/tvface/ethnic-distribution.png", alt: "TVFace ethnicity-distribution pie chart", fit: "contain" },
            caption: "Ethnicity, measured and published: White 52.5%, Middle Eastern 18.0%, Black 11.1%, East Asian 9.4%, plus Indian, Latino, and SE Asian.",
            ratio: "16 / 10",
            plate: "light",
          },
          {
            media: { kind: "image", src: "/tvface/expression-distribution.png", alt: "TVFace expression-distribution bar chart", fit: "contain" },
            caption: "Expression in real broadcast faces: Neutral dominates at 39.4%, with Sad and Happy near 17% each. Nothing posed, nothing staged.",
            ratio: "16 / 10",
            wide: true,
            plate: "light",
          },
        ],
      },
      {
        no: "05",
        kicker: "What Shipped",
        heading: "The release",
        shipped: [
          { title: "The dataset", caption: "2.6M annotated face images across 28,955 identities, released for research." },
          { title: "Demographic labels", caption: "Probabilistic age, gender, ethnicity, expression, and head-pose annotations." },
          { title: "PyTorch loader", caption: "A TVFaceDataset class for drop-in use in recognition and clustering pipelines." },
          { title: "Peer-reviewed", caption: "Published in Springer's Pattern Analysis and Applications (2025)." },
        ],
      },
      {
        no: "06",
        kicker: "Outcome",
        heading: "Where it landed",
        body: [
          "A research resource for unsupervised facial clustering, large-scale recognition, and demographic-fairness analysis. Built at MachVIS and published in Springer's Pattern Analysis and Applications, under a Creative Commons non-commercial license.",
          "It now anchors the TVFace Challenge 2026, a public clustering-and-retrieval competition built on the dataset.",
        ],
        stats: [
          { label: "Venue", value: "Pattern Analysis & Applications" },
          { label: "Year", value: "2025" },
          { label: "License", value: "CC BY-NC 4.0 · research only" },
        ],
      },
      {
        no: "07",
        kicker: "What I Learned",
        heading: "Portable lessons",
        maxims: [
          "Real-world distributions beat clean ones for honest benchmarks.",
          "A long tail is a feature, not a defect, when you study recognition.",
          "Scale and ethics have to ship together.",
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ *
 * PLAYGROUND — smaller builds & experiments. Every link resolves to a
 * real public repo (verified from GitHub).
 * ------------------------------------------------------------------ */
export interface PlaygroundItem {
  name: string;
  blurb: string;
  href: string;
  tag: string;
  /** true => internal case-study route (/work/[slug]); else an external repo link */
  internal?: boolean;
}
export const playground: PlaygroundItem[] = [
  {
    name: "SynapseGraph",
    blurb:
      "A multi-agent platform that writes a full company research report on demand: eight LangGraph nodes over FastAPI, four analysts gathering sources in parallel, streamed node by node over WebSocket. Gemini 2.0 Flash synthesizes; GPT-4.1-mini formats.",
    href: "/work/synapsegraph",
    tag: "Agents",
    internal: true,
  },
  {
    name: "Distributed ML Platform",
    blurb:
      "Real-time IoT analytics: Kafka into Spark Structured Streaming running three ML models in parallel, results in Elasticsearch for a live Kibana dashboard. A 4-node, 32-core cluster sustains 700+ msg/s, under 300ms end to end.",
    href: "/work/distributed-ml",
    tag: "Systems",
    internal: true,
  },
  {
    name: "Reverse Proxy from scratch",
    blurb:
      "No NGINX, no Traefik. A reverse proxy built from the ground up: a Node.js cluster with self-healing workers, YAML-driven routing, round-robin load balancing, health checks, and Redis-backed caching + rate limiting.",
    href: "https://github.com/zaineli/ReverseProxy",
    tag: "Systems",
  },
  {
    name: "Distributed Web Crawler",
    blurb:
      "Drop URLs into a React UI; they fan out through AWS SQS to containerized ECS Fargate workers, land in S3, and scale on queue depth, all watched by CloudWatch. Fully serverless, pay-per-use.",
    href: "https://github.com/zaineli/Distributed-Web-Crawler-Content-Analyzer",
    tag: "Cloud",
  },
  {
    name: "SAM for Scientific Charts",
    blurb:
      "A synthetic-data generator for fine-tuning Segment Anything: programmatically renders jittered bar charts, volcano and Voronoi diagrams as paired RGB images + segmentation masks, with bounding boxes and point prompts.",
    href: "https://github.com/zaineli/finetune_SAM3",
    tag: "ML",
  },
  {
    name: "Self-Driving Car",
    blurb:
      "A neural network built from scratch, no ML libraries, that learns to follow lanes, dodge obstacles, and pick its way through intersections. A Canvas sim renders the network's decisions live.",
    href: "https://github.com/zaineli/Self-Driving-Car",
    tag: "ML",
  },
  {
    name: "AlgoScribe",
    blurb:
      "A React code editor that animates algorithms as they run. Write JavaScript; watch trees and data structures move. Built with CodeMirror, Firebase, and a custom renderer.",
    href: "https://github.com/zaineli/AlgoScribe",
    tag: "Tooling",
  },
  {
    name: "Handwritten Signature Extraction",
    blurb:
      "Biometric signature analysis by recursive quadtree decomposition. Centroids, edge density, aspect ratios, and slant angles become stable features for verification and writer ID.",
    href: "https://github.com/zaineli/HandWritten-Signature-Extraction",
    tag: "CV",
  },
];
