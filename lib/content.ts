/* ------------------------------------------------------------------ *
 * Content model. Pages render this; nothing else holds copy.
 *
 * Every number on this site is one someone could check. Benchmark
 * figures come from a script in the corresponding repository, role
 * outcomes are the ones on the record, and where a result is a negative
 * one it is stated as a negative one.
 *
 * This file has no imports so Node can load it natively
 * (`node scripts/check-once.ts` imports it directly).
 * ------------------------------------------------------------------ */

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export type SystemSlug = "engram" | "reverie" | "whetstone" | "spindle";

/* ------------------------------------------------------------------ *
 * Figures. Every figure on the site is drawn at build time from the
 * numbers in this file — the same numbers the tables report. No chart
 * library, no illustration: the marks are generated from the data
 * below, so a figure cannot say something the benchmark did not.
 * ------------------------------------------------------------------ */

/** Ink for a mark: blue for a measured claim that held, --rule grey for a baseline, hatched/dashed --neg for a result that said no. */
export type Ink = "claim" | "base" | "neg";

export interface FigureBase {
  id: string;
  /** Tab label on the card. */
  label: string;
  /** Mono figure title. */
  title: string;
  /** Slug of the case section this figure is placed under (slugify(heading)). */
  section: string;
  /** This figure reports a failure: verdict rule, shade and series in --neg. */
  negative?: boolean;
  /** One note anchored to a mark. */
  annotation?: string;
  /** Overrides the title as the printed figcaption; "" prints none. */
  caption?: string;
}

export interface FigureBar {
  label: string;
  value: number;
  /** Printed at the end of the bar; defaults to the value. */
  display?: string;
  /** Defaults to "base". */
  ink?: Ink;
  /** An unlabelled --hairline bar drawn behind this one at another value (the literal score behind a paraphrased one). */
  ghost?: number;
  /** Draw a 3px mark instead of a bar (a 0.000 result). */
  stub?: boolean;
  /** A group label printed above the first bar of each run. */
  group?: string;
  /** No value at the bar end: the number above the figure already is it. */
  hideValue?: boolean;
}

export interface FigureSeries {
  label: string;
  points: number[];
  /** Defaults to "base". "neg" draws dashed (4 3) with hollow dots. */
  ink?: Ink;
}

export interface FigureDot {
  label: string;
  value: number;
  sd?: number;
  /** Defaults to "base". "neg" draws a hollow dot. */
  ink?: Ink;
}

export interface FigurePair {
  label: string;
  a: { label: string; value: number; display: string };
  b: { label: string; value: number; display: string; ink?: Ink };
  /** Mono ratio chip. */
  ratio?: string;
}

export interface FigureDivergingSeries {
  label: string;
  /** Signed bar. */
  primary: number;
  /** Printed at the end of the bar; defaults to String(primary). */
  display?: string;
  /** Hairline tick. */
  secondary?: number;
  ink?: Ink;
}

export type FigureSpec = FigureBase &
  (
    | {
        kind: "bars";
        max: number;
        bars: FigureBar[];
        /** Dashed reference across every track, labelled once beneath. */
        reference?: { value: number; label: string };
      }
    | {
        kind: "lines";
        x: number[];
        xLabel?: string;
        yMin: number;
        yMax: number;
        series: FigureSeries[];
        /** Dashed reference line, e.g. an encoder ceiling or break-even. */
        reference?: { value: number; label: string };
        /** Hatched region: between the reference and the first series, or below the reference. */
        shade?: "above-series" | "below-reference";
        /** Mono label placed inside the shaded region. */
        shadeLabel?: string;
        /** Hollow prediction marker. */
        marker?: { x: number; y: number; label: string };
      }
    | {
        kind: "dots";
        min: number;
        max: number;
        points: FigureDot[];
        /** Bracket between two points, by label. */
        bracket?: { from: string; to: string; label: string };
      }
    | {
        kind: "pairs";
        /** One scale across every pair; otherwise each pair has its own. */
        sharedScale?: boolean;
        pairs: FigurePair[];
      }
    | { kind: "diverging"; series: FigureDivergingSeries[]; min: number; max: number }
  );

/* ------------------------------------------------------------------ *
 * Schematics. Mechanism diagrams authored as node/edge lists on a
 * 24×8 unit grid; components/Schematic.tsx scales units to pixels.
 * `x`, `y` are the node centre in units; `w` is the width in units
 * (default 3); every node is one unit tall. Edges join node centres and
 * are clipped to the node border; `via` points are in the same units.
 * ------------------------------------------------------------------ */

export interface SchematicNode {
  id: string;
  label: string;
  x: number;
  y: number;
  w?: number;
  /** "store" = double rule, "gate" = side-ruled box. Defaults to "box". */
  kind?: "box" | "store" | "gate";
  /** A component that was refuted or removed: drawn in the hatch. */
  hatched?: boolean;
  /** Withheld, with its edges, while SPEC_DECODE_HOLD is true. */
  hold?: boolean;
}

export interface SchematicEdge {
  from: string;
  to: string;
  /** Hypotheses, oracles and references are dashed. */
  dashed?: boolean;
  label?: string;
  via?: [number, number][];
  /** Where the label goes, in grid units, when the automatic place would collide. */
  labelAt?: [number, number];
}

export interface Schematic {
  w: 24;
  h: 8;
  nodes: SchematicNode[];
  edges: SchematicEdge[];
}

/* ------------------------------------------------------------------ *
 * The ledger: every negative result on the site by name, kind and the
 * number that reports it. `id` is the global order, in page order.
 * ------------------------------------------------------------------ */

export type LedgerKind = "mechanism" | "result" | "hypothesis" | "estimate" | "bug";

export interface LedgerEntry {
  id: number;
  /** Verbatim list term or section heading. */
  term: string;
  kind: LedgerKind;
  /** The number, chosen so it appears nowhere else on the home page. */
  number?: string;
  /** When the number already lives elsewhere on the home page, a link to it instead ("see Exp. 02", "see rule 3"). */
  numberHref?: string;
  /** Case-section slug where the item is recorded. */
  anchor: string;
  /** Verbatim sentences from the write-up. */
  detail?: string;
  /** Hypothesis rows expand into expected / measured / why instead. */
  expected?: string;
  measured?: string;
  why?: string;
  /** One verbatim, contiguous fragment of the write-up, printed under the row. */
  quote?: string;
  /** Withheld from every page until the result is re-run (see SPEC_DECODE_HOLD). */
  hold?: boolean;
}

/**
 * spindle's speculative-decoding result is withheld. speculative.py runs a
 * second target forward every round (the resync/bonus write) that a standard
 * loop folds into the next verify, so tokens per target forward is halved —
 * at γ = 1 it predicts (0.707 + 1) / 2 = 0.854 against the 0.86 measured.
 * "Cannot pay at any γ" is therefore probably a property of the code, not of
 * the technique. While this is true: ledger #13, the 1.92× readout, the
 * speculation section and its figure are off every page, and the counts
 * derive from what is shown. Flip it the day the re-run lands.
 */
export const SPEC_DECODE_HOLD = true;

/** The one number a system's column leads with on the home page. */
export interface Lead {
  value: string;
  unit?: "%" | "×";
  label: string;
  /** A second caption line, set in ink — the turn. */
  after?: string;
  /** A result that said no: set in the signal red. */
  negative?: boolean;
}

export interface Outcome {
  value?: string;
  label: string;
  /** When the label names an artifact a reader would want to open. */
  href?: string;
}

export interface Readout {
  value: string;
  label: string;
  /** Rendered with .neg-rule. */
  negative?: boolean;
}

/* ------------------------------------------------------------------ *
 * Profile
 * ------------------------------------------------------------------ */

export const profile = {
  name: "Zain Ali",
  /** Lowercase wordmark used in the nav. */
  wordmark: "zain ali",
  role: "VP Engineering & Product",
  company: "Alexein AI",
  location: "California, United States",
  email: "zali.bscs22seecs@seecs.edu.pk",

  /** Metadata only: every agent startup says it, so it is not the headline. */
  pitch: "I build agents that get better with use.",

  /**
   * The conviction, not the description — his own words, verbatim from his
   * LinkedIn summary. It is the page's h1.
   */
  manifesto: "I don’t think LLMs get us to AGI. I think RL does.",
  /** The h1's three lines; check-once asserts they join back to `manifesto`. */
  manifestoLines: ["I don’t think LLMs", "get us to AGI.", "I think RL does."],

  /** The Record statement — LinkedIn summary, verbatim. */
  lives:
    "RL, world models, combinatorial search, behavioral cloning, linear algebra, neuroscience — that’s where I live.",

  /** The Record standfirst. */
  method: "I read the paper, build the system, and report what the numbers said.",

  /** The Ledger statement. */
  ledgerLine: "A portfolio of only successes is not evidence of judgement.",

  /** The Method statement. */
  discipline: "Every number on this site is one someone could check.",

  /** 16px-wide base64 WebP placeholder behind /profile.webp; generated by scripts/portrait.mjs. */
  portraitPlaceholder: "",
} as const;

export const links: Link[] = [
  { label: "GitHub", href: "https://github.com/zaineli", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zain-ali-43090a283", external: true },
  { label: "Email", href: "mailto:zali.bscs22seecs@seecs.edu.pk" },
];

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */

export interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  /** Source of truth for the outcomes. */
  points: string[];
  /** The numbers on the record; the home page prints outcomes[0] only. */
  outcomes: Outcome[];
  /** A role with no number prints this instead — his own words. */
  gloss?: string;
  glossLine?: string;
}

// Periods follow LinkedIn (Victreat Nov 2025 – May 2026, ImagineArt
// Apr – Jul 2026, Machvis Jan 2025 – Apr 2026). Vyro is ImagineArt's
// parent and the same job, so it is one row.
export const experience: Role[] = [
  {
    company: "Alexein AI",
    title: "VP Engineering & Product",
    period: "2026 —",
    location: "California, United States",
    points: [
      "Lead engineering and product for an agent platform built on reinforcement learning and world models rather than prompt pipelines.",
      "Own the technical direction across the research and serving stack, from what gets modelled to what it costs to run.",
    ],
    outcomes: [],
    // LinkedIn summary, verbatim. alexein.ai is not linked: its public page
    // ("from AGI to ASI", unattributed testimonials) does not say this yet.
    gloss: "Building the guess.",
    glossLine:
      "Agents that build a real model of the world, search through it, and get corrected by what actually happens.",
  },
  {
    company: "ImagineArt",
    title: "Machine Learning Engineer",
    period: "2026",
    location: "Islamabad, Pakistan",
    points: [
      "Designed and shipped Imagine-Sites: one prompt produces generated code, an automated GitHub commit, a live deployment, and a preview thumbnail.",
      "Evaluated DeerFlow, Hermes, OpenHands and Codex, then replaced the research-oriented agent loop with a parallel execution architecture on warm Modal sandboxes.",
      "Cut end-to-end generation latency roughly 4×: 45 → 13 minutes full-stack, 20 → 5 minutes frontend.",
    ],
    outcomes: [
      { value: "45 → 13 min", label: "full-stack generation · Imagine-Sites" },
      { value: "20 → 5 min", label: "frontend" },
    ],
  },
  {
    company: "Victreat Health Tech",
    title: "RL / Agentic Systems Engineer",
    period: "2025 — 2026",
    location: "Islamabad, Pakistan",
    points: [
      "Architected a self-evolving reinforcement-learning web crawler with dynamic policy optimisation across 10,000+ sites, reaching 84% faster extraction through continuous DOM-pattern learning.",
      "Built a GPT-4 LLM-as-judge reward system to train the RL planner, lifting extraction success from 67% to 91.3% via autonomous self-correction.",
      "Fine-tuned Meta's SAM3 for scientific-diagram segmentation on a fully synthetic dataset — Voronoi tessellations, graph layouts, topological surfaces — improving mIoU from 0.51 to 0.87 on out-of-distribution research figures.",
    ],
    outcomes: [
      { value: "67 % → 91.3 %", label: "extraction success, RL planner" },
      { value: "0.51 → 0.87", label: "mIoU, SAM3 on synthetic diagrams" },
    ],
  },
  {
    company: "Machvis Lab",
    title: "Research Assistant",
    period: "2025 — 2026",
    location: "Islamabad, Pakistan",
    points: [
      "Built the large-scale facial clustering pipeline behind the TVFace dataset — 2.6M images across 29K identities drawn from TV broadcasts.",
      "Engineered a satellite phenology pipeline predicting crop growth stages from multi-spectral imagery.",
      "Deployed CV models to edge devices at sub-100ms inference through quantisation and pruning.",
    ],
    outcomes: [
      {
      value: "2.6M images · 29K identities",
      label: "clustering pipeline behind the TVFace dataset",
      href: "https://github.com/zaineli/TVFace",
    },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Systems — built from scratch, benchmarked, written up.
 * ------------------------------------------------------------------ */

export interface Metric {
  label: string;
  value: string;
  /** Rendered in accent when this is the headline number. */
  emphasis?: boolean;
  /** A number that reports a failure. Drives .neg-rule. */
  negative?: boolean;
}

export interface SystemSection {
  heading: string;
  paragraphs?: string[];
  /** Optional results table: header row plus body rows. */
  table?: { head: string[]; rows: string[][]; caption?: string };
  /** Optional pulled-out list, e.g. negative results. */
  list?: { term: string; detail: string }[];
  /** This section reports a failure: a red top rule, and the "Said no" filter keeps it. */
  negative?: boolean;
  /** Withheld while SPEC_DECODE_HOLD is true. */
  hold?: boolean;
}

export interface System {
  slug: SystemSlug;
  name: string;
  /** Case-page subtitle; its only use on the site. */
  tagline: string;
  /** Metadata description only; never rendered. */
  pitch: string;
  /** Case-page eyebrow only. */
  year: string;
  /** The case lede. */
  abstract: string;
  /** The field this system belongs to; printed under its name. */
  thread: string;
  /** One verbatim line from the write-up. */
  verdict: string;
  /** Home page: the column's one number and its caption. */
  lead: Lead;
  /** Home page: one verbatim sentence from the write-up, under the figure. */
  homeLine: string;
  /** Home page: the column's figure. Never repeats `lead`'s value. */
  homeFigure: FigureSpec;
  /** What replaces the held claims while SPEC_DECODE_HOLD is true. */
  held?: { tagline: string; pitch: string; readout: Readout; abstract: string };
  /** The three case-page metrics. */
  metrics: Metric[];
  /** Primary and secondary readouts on the card. */
  readouts: [Readout, Readout];
  /** Mono spec line in the card foot. */
  spec: string;
  /** The two card views; each is also placed on the case page under its `section`. */
  figures: [FigureSpec, FigureSpec];
  /** Extra figures for the case page only. */
  caseFigures: FigureSpec[];
  schematic: Schematic;
  /** This system's negative results, in page order. */
  ledger: LedgerEntry[];
  repo: string;
  /** generateMetadata keywords only. */
  metaKeywords: string[];
  /** Long-form case study. */
  sections: SystemSection[];
}

const systemList: System[] = [
  {
    slug: "engram",
    name: "engram",
    tagline: "A hippocampal–neocortical memory architecture for long-horizon agents",
    pitch:
      "A hippocampal memory for agents, measured on LongMemEval-S and LoCoMo against BM25, dense and tuned hybrids: a tie with the strongest hybrid on one, the lead on the one no decision ever saw.",
    year: "2026",
    abstract:
      "Vector stores fail on agent memory in two specific ways: they cannot separate confusable near-duplicates, and they cannot answer a question whose answer was never in any single stored item. engram implements the biological account of both — dentate pattern separation, CA3 attractor completion, a conjunctive binding code, context reinstatement and a neocortical schema store built by prioritised replay. It is measured on LongMemEval-S with the official retrieval protocol and on LoCoMo, which no decision ever saw, against BM25, dense and tuned hybrid retrieval across three encoders, with paired intervals. It ties the strongest hybrid on the first and leads on the second. The gain comes from one mechanism, and the rest do nothing measurable on either benchmark; the write-up says which, and what v0.1 got wrong.",
    thread: "Memory and consolidation",
    verdict: "Expansion is injective: it can only separate what the input already distinguishes.",
    // Leads with the held-out LongMemEval number and says plainly that it is
    // a tie; the figure under it is the benchmark nothing was tuned on.
    lead: {
      value: "0.767",
      label: "recall@5 · LongMemEval-S, held out",
      after: "A tie with a tuned hybrid.",
    },
    homeLine: "The gain over a vector store is the conjunctive pathway.",
    homeFigure: {
      id: "home-engram",
      label: "home",
      title: "recall@10 · LoCoMo, never tuned on · MiniLM",
      caption: "",
      section: "locomo-never-tuned-on",
      kind: "bars",
      max: 1,
      bars: [
        { label: "dense", value: 0.507, display: "0.507" },
        { label: "BM25", value: 0.543, display: "0.543" },
        { label: "z-score hybrid", value: 0.614, display: "0.614", ink: "base" },
        { label: "engram", value: 0.64, display: "0.640", ink: "claim" },
      ],
    },
    metrics: [
      { label: "LongMemEval-S session R@5, vs tuned hybrid", value: "0.767 / 0.764", emphasis: true },
      { label: "LoCoMo recall@10, never tuned on", value: "0.640 / 0.614" },
      { label: "over v0.1, LongMemEval-S", value: "+0.120" },
    ],
    readouts: [
      { value: "0.993 → 0.907", label: "CA3 completion, 400 → 4,000 stored patterns" },
      { value: "0.114 → 0.021", label: "code overlap under neurogenesis" },
    ],
    spec: "LongMemEval-S · LoCoMo · 3 encoders · paired CIs · Python",
    figures: [
      {
        id: "longmemeval",
        label: "LongMemEval-S",
        title: "session recall@5 · LongMemEval-S, 343 held-out questions · MiniLM",
        section: "longmemeval-s-held-out",
        kind: "bars",
        max: 1,
        bars: [
          { label: "BM25, official tokens", value: 0.513, display: "0.513" },
          { label: "engram v0.1", value: 0.647, display: "0.647" },
          { label: "BM25", value: 0.673, display: "0.673" },
          { label: "dense", value: 0.691, display: "0.691" },
          { label: "RRF hybrid", value: 0.743, display: "0.743" },
          { label: "z-score hybrid", value: 0.764, display: "0.764", ink: "base" },
          { label: "engram", value: 0.767, display: "0.767", ink: "claim" },
        ],
      },
      {
        id: "encoders",
        label: "encoders",
        title: "LoCoMo recall@10 · best baseline → engram, per encoder",
        section: "locomo-never-tuned-on",
        kind: "pairs",
        sharedScale: true,
        pairs: [
          { label: "MiniLM", a: { label: "z-score hybrid", value: 0.614, display: "0.614" }, b: { label: "engram", value: 0.64, display: "0.640" }, ratio: "+0.025" },
          { label: "bge-small", a: { label: "RRF hybrid", value: 0.644, display: "0.644" }, b: { label: "engram", value: 0.68, display: "0.680" }, ratio: "+0.036" },
          { label: "e5-small", a: { label: "dense", value: 0.69, display: "0.690" }, b: { label: "engram", value: 0.693, display: "0.693" }, ratio: "+0.003" },
        ],
      },
    ],
    caseFigures: [
      {
        id: "ablation-lme",
        label: "ablation",
        title: "Δ with one change from the frozen system · bar = session R@5 · tick = turn NDCG@10 · LongMemEval-S",
        section: "what-carries-it",
        kind: "diverging",
        min: -0.15,
        max: 0.05,
        series: [
          { label: "no dense pathway", primary: -0.122, secondary: -0.066 },
          { label: "no conjunctive pathway", primary: -0.076, secondary: -0.093 },
          { label: "rank fusion", primary: -0.023, secondary: -0.018 },
          { label: "all pairs (v0.1)", primary: -0.009, secondary: -0.002 },
          { label: "terms only", primary: 0.003, secondary: 0.003 },
          { label: "BM25-weighted units", primary: 0.015, secondary: -0.005 },
          { label: "no reinstatement", primary: 0, secondary: 0 },
          { label: "after 40 cycles of sleep", primary: 0, secondary: -0.001 },
        ],
      },
      {
        id: "ablation-synthetic",
        label: "synthetic",
        title: "Δ overall with each mechanism removed · bar = literal · tick = paraphrased · synthetic, 2,314 queries",
        section: "the-synthetic-benchmark",
        kind: "diverging",
        min: -0.7,
        max: 0.05,
        series: [
          { label: "conjunctive binding", primary: -0.665, secondary: -0.09 },
          { label: "temporal reinstatement", primary: -0.315, secondary: -0.121 },
          { label: "pairs (terms only)", primary: -0.035, secondary: 0.016 },
          { label: "schema store", primary: -0.005, secondary: -0.003 },
          { label: "sleep / consolidation", primary: -0.005, secondary: -0.003 },
          { label: "dense semantic", primary: 0.002, secondary: -0.082 },
          { label: "theta context", primary: 0, secondary: 0 },
          { label: "neurogenesis", primary: 0, secondary: 0 },
        ],
      },
    ],
    schematic: {
      w: 24,
      h: 8,
      nodes: [
        { id: "episode", label: "episode", x: 2, y: 3.5 },
        { id: "encoder", label: "dense encoder", x: 6, y: 3.5 },
        { id: "dg", label: "dentate gyrus", x: 10, y: 3.5 },
        { id: "ca3", label: "CA3", x: 14, y: 3.5 },
        { id: "replay", label: "prioritised replay", x: 18, y: 3.5 },
        { id: "schema", label: "schema store", x: 22, y: 3.5, kind: "store" },
        { id: "conj", label: "conjunction index", x: 8, y: 0.8, w: 3.4, kind: "store" },
        { id: "query", label: "query", x: 14, y: 0.8 },
        { id: "lateral", label: "lateral inhibition", x: 10, y: 6.5, hatched: true },
        { id: "eviction", label: "eviction on promotion", x: 18, y: 6.5, hatched: true },
      ],
      edges: [
        { from: "episode", to: "encoder" },
        { from: "encoder", to: "dg", label: "expansion" },
        { from: "dg", to: "ca3", label: "sparse code" },
        { from: "ca3", to: "replay", label: "traces" },
        { from: "replay", to: "schema" },
        { from: "episode", to: "conj", label: "terms · pairs", via: [[2, 0.8]] },
        { from: "query", to: "conj", label: "weighted intersection" },
        { from: "dg", to: "lateral", dashed: true },
        { from: "schema", to: "eviction", dashed: true, via: [[22, 6.5]] },
        { from: "eviction", to: "ca3", dashed: true, via: [[14, 6.5]] },
      ],
    },
    ledger: [
      {
        id: 1,
        term: "Reinstatement and sleep on the public benchmarks",
        kind: "result",
        number: "0 of 470",
        anchor: "what-carries-it",
        quote: "Reinstatement and consolidation move nothing here.",
        detail:
          "LongMemEval has no \"what happened right after X\" questions (0 of 470 match the adjacency cues). Schemas are not scored, because a schema is not an evidence turn.",
      },
      {
        id: 2,
        term: "v0.1’s lead over BM25",
        kind: "bug",
        number: "−0.012",
        anchor: "what-v0-1-got-wrong",
        quote: "The old README's lead came from answer-level credit for wrong episodes",
        detail:
          "Scored by key, v0.1 on literal queries ties BM25 (0.652 against 0.664, −0.012 [−0.034, +0.011]).",
      },
      {
        id: 3,
        term: "The schema store with a lexical encoder",
        kind: "mechanism",
        number: "0.287 → 0.613",
        anchor: "things-that-did-not-work",
        quote: "Lexical centroids merge different projects, and the exemplar a schema returns need not name the modal one.",
        detail:
          "With HashingEncoder, removing the schema store raises abstraction from 0.287 to 0.613 (n = 80). With MiniLM the store helps (0.713 → 0.863).",
      },
      {
        id: 4,
        term: "Lateral inhibition in the dentate gyrus",
        kind: "mechanism",
        number: "0.1277 → 0.1284",
        anchor: "things-that-did-not-work",
        detail:
          "Random sparse projections are already near-orthogonal: Gram off-diagonal 0.020 against activation σ 1.00, about 196× below the selection margin.",
      },
      {
        id: 5,
        term: "Eviction coupled to promotion",
        kind: "mechanism",
        anchor: "things-that-did-not-work",
        quote: "catastrophic forgetting, produced by the architecture that exists to prevent it.",
        detail:
          "Releasing a trace as soon as a schema absorbed it destroyed episodic detail the moment generalisation began.",
      },
      {
        id: 6,
        term: "DG/CA3 as a ranking pathway",
        kind: "mechanism",
        number: "0.048 top-1",
        anchor: "things-that-did-not-work",
        detail: "Kept for what it is good at: storage separation and fragment completion.",
      },
    ],
    repo: "https://github.com/zaineli/engram",
    metaKeywords: ["Memory", "Neuroscience", "Retrieval", "LongMemEval", "LoCoMo", "Python"],
    sections: [
      {
        heading: "The failure it starts from",
        paragraphs: [
          "Take 125 incident reports of the form \"On {day} the {service} service suffered {fault} during the rollout.\" Mean pairwise cosine under MiniLM is 0.529 and the maximum is 0.998 — to a sentence encoder these are nearly the same sentence, because they are. Ask \"What went wrong with the {service} service on {day}?\" and dense cosine finds the exact report 4.0% of the time.",
          "The obvious fix is pattern separation: expand the embedding into a much larger, sparse population, as the dentate gyrus does. It decorrelates as advertised — inputs at cosine 0.77 produce codes overlapping at 0.220 — and it does not fix retrieval: 4.8% on the same set. Expansion is injective: it can only separate what the input already distinguishes.",
          "The finding that reframes this is a different run: with a lexical hashing encoder, dense cosine is already at the ceiling. The slot confusion is not a property of pooled vectors. It is what a semantic sentence encoder does to lexical detail, and the conjunctive pathway is how engram gets that detail back.",
        ],
      },
      {
        heading: "Conjunctive coding",
        paragraphs: [
          "CA3's recurrent network codes for combinations — this object, in this place, at this time — not for the elements separately. A conjunction is a distinct addressable unit, so auth-on-Monday is a different memory address from auth-on-Tuesday however similar the surface forms.",
          "The implementation is a sparse binding code: each content term is a unit, and so is each unordered pair of content terms fewer than four apart — the unordered-window feature of Metzler & Croft's sequential dependence model. Units hash into a 2³² space and are weighted by their own document frequency in the store, so a rare conjunction of two common words counts as rare. One sparse matrix-vector product scores every episode.",
          "On the incident reports it finds the right service and day every time, and the exact report 20% of the time with MRR 0.457 — both the ceiling, since the queries name two of three attributes and five reports are genuinely tied.",
        ],
      },
      {
        heading: "LongMemEval-S, held out",
        table: {
          head: ["metric", "BM25 official", "BM25", "dense", "RRF hybrid", "z-score hybrid", "v0.1", "engram"],
          rows: [
            ["session R@5", "0.513", "0.673", "0.691", "0.743", "0.764", "0.647", "0.767"],
            ["session NDCG@5", "0.528", "0.659", "0.611", "0.694", "0.721", "0.623", "0.699"],
            ["session R@10", "0.630", "0.758", "0.825", "0.875", "0.878", "0.799", "0.869"],
            ["turn R@10", "0.577", "0.703", "0.703", "0.767", "0.802", "0.714", "0.802"],
            ["turn NDCG@10", "0.552", "0.675", "0.622", "0.706", "0.735", "0.647", "0.716"],
          ],
          caption:
            "LongMemEval-S cleaned, official retrieval protocol, 343 test questions after a hash-defined 20% dev split carried every tuned choice. all-MiniLM-L6-v2. R@k is recall_all@k.",
        },
        paragraphs: [
          "engram ties the strongest baseline — a BM25 + dense z-score hybrid whose weight was tuned on the same dev split — on session recall@5 (+0.003, 95% interval −0.023 to +0.029) and trails it on turn NDCG@10 (−0.019, −0.034 to −0.005). It beats BM25 by +0.093 and dense retrieval by +0.076, and v0.1 by +0.120. Frozen on MiniLM's dev split and applied unchanged, the same configuration gives the same picture with bge-small and e5-small.",
          "The scorer and the BM25 baseline are reimplementations of the reference harness; a script downloads the originals at run time and confirms they agree on 300 random rankings.",
        ],
      },
      {
        heading: "LoCoMo, never tuned on",
        table: {
          head: ["encoder", "BM25", "dense", "RRF hybrid", "z-score hybrid", "engram"],
          rows: [
            ["MiniLM", "0.543", "0.507", "0.586", "0.614", "0.640"],
            ["bge-small", "0.543", "0.635", "0.644", "0.638", "0.680"],
            ["e5-small", "0.543", "0.690", "0.656", "0.636", "0.693"],
          ],
          caption:
            "Recall@10, 10 conversations, 5,882 turns, 1,535 questions in categories 1–4. Run once, with the configuration frozen on LongMemEval-S dev.",
        },
        paragraphs: [
          "The LongMemEval test split was scored more than once during development, so this is the clean check. engram is best with MiniLM (+0.025 over the z-score hybrid, conversation-cluster interval +0.005 to +0.051) and with bge-small (+0.036 over RRF), and ties dense retrieval with e5-small (+0.003).",
        ],
      },
      {
        heading: "What carries it",
        paragraphs: [
          "Without the conjunctive pathway, engram is the dense baseline to three decimals. Keeping its terms and dropping its pairs changes nothing measurable on LongMemEval-S (+0.003): on conversational memory it is a lexical channel, restoring the specificity the sentence encoder removed. BM25 weighting of units scored higher on test than the frozen choice (0.781); the dev split preferred IDF-cosine, and the dev decision stands.",
          "Reinstatement and consolidation move nothing here. LongMemEval and LoCoMo ask for evidence turns; neither asks what usually happens or what came next, which is what schemas and reinstatement are for.",
        ],
      },
      {
        heading: "The synthetic benchmark",
        table: {
          head: ["setting", "recency", "BM25", "flat vector", "hybrid RAG", "v0.1", "engram"],
          rows: [
            ["token-literal", "0.006", "0.664", "0.083", "0.270", "0.652", "0.987"],
            ["paraphrased", "0.006", "0.119", "0.057", "0.160", "0.201", "0.282"],
          ],
          caption:
            "Overall top-1, 5 seeds, 2,314 queries. The top result must be the right episode; abstraction, which has no single episode, is scored by answer.",
        },
        paragraphs: [
          "Four tasks, each built to isolate one mechanism: episodic, interference, abstraction and temporal. On literal queries v0.2 is at ceiling, so that setting is now a regression check rather than evidence. Reinstatement is the only mechanism that answers sequence questions — without it the temporal task falls from 0.981 to 0.009 — and every retrieval baseline scores about zero there, because it returns the anchor.",
        ],
      },
      {
        heading: "What v0.1 got wrong",
        negative: true,
        list: [
          {
            term: "Answer-level scoring",
            detail:
              "A query counted as solved when the top result mentioned the right project. With a 70% home-project prior a wrong episode carries it about 40% of the time, and on the temporal task the anchor itself carries it in a third of queries — exactly the 0.333 the baselines were reported at. Scored by key, v0.1's literal-query lead over BM25 is a tie.",
          },
          {
            term: "The binder's truncation",
            detail:
              "It kept the alphabetically first 24 terms, documented as \"the earliest, the topical ones\", and dropped one-character tokens, so \"week 7\" lost its 7 while \"week 14\" kept its 14.",
          },
          {
            term: "Passive decay",
            detail:
              "It deleted exactly the unconsolidated traces the rest of the system promises never to delete. No benchmark wrote enough to trigger it.",
          },
          {
            term: "Tables no script produced",
            detail:
              "The incident, dentate and CA3 tables did not reproduce from the committed scripts, and CA3 completion is not flat in store size: 0.993 with 400 stored patterns, 0.907 with 4,000.",
          },
        ],
      },
      {
        heading: "Things that did not work",
        negative: true,
        list: [
          {
            term: "The schema store with a lexical encoder",
            detail:
              "With the hashing encoder, removing the schema store raises abstraction from 0.287 to 0.613. Lexical centroids merge different projects, and the exemplar a schema returns need not name the modal one.",
          },
          {
            term: "Lateral inhibition in the dentate gyrus",
            detail:
              "Random sparse projections are already near-orthogonal: Gram off-diagonal 0.020 against activation σ 1.00, about 196× below the selection margin. It perturbs about 12% of selected units and buys no separation (mean overlap 0.1277 → 0.1284).",
          },
          {
            term: "Eviction coupled to promotion",
            detail:
              "Releasing a trace as soon as a schema absorbed it destroyed episodic detail the moment generalisation began — catastrophic forgetting, produced by the architecture that exists to prevent it. Eviction is capacity-driven, and an unconsolidated trace is never dropped.",
          },
          {
            term: "DG/CA3 as a ranking pathway",
            detail:
              "0.048 on the incident reports, no better than cosine. Kept for what it is good at: storage separation and fragment completion.",
          },
        ],
      },
    ],
  },
  {
    slug: "reverie",
    name: "reverie",
    tagline: "A discrete latent world model with planning, and why it does not work yet",
    pitch:
      "A discrete world model that passed every training metric and still could not plan. Reported exactly that way, with the oracle that proves where the gap is.",
    year: "2026",
    abstract:
      "A VQ-VAE encoder, a transformer dynamics model over discrete latents, and cross-entropy-method planning inside it — on a gridworld built to require a model rather than a reactive policy. The headline result is negative, and is reported that way: planning closes only 13.4% of the gap between random and an oracle planner running on the true simulator. The architecture is structured so that “the model is inaccurate” and “the planner is weak” are separately measurable, and they have a definite answer.",
    thread: "World models and search",
    verdict: "The shortfall is model fidelity, and the rollout curve says so independently.",
    lead: { value: "13.4", unit: "%", label: "of the random → oracle gap closed", negative: true },
    homeLine: "The shortfall is model fidelity, and the rollout curve says so independently.",
    // The oracle figure below (figures[1]), drawn on the home page as one band.
    homeFigure: {
      id: "home-reverie",
      label: "home",
      title: "episode return · random → learned model → oracle",
      section: "attributing-the-gap-with-an-oracle",
      kind: "dots",
      min: -1.5,
      max: 0,
      points: [
        { label: "random", value: -1.444, ink: "base" },
        { label: "learned-model MPC", value: -1.306, ink: "neg" },
        { label: "oracle MPC", value: -0.411, ink: "claim" },
      ],
      bracket: { from: "random", to: "oracle MPC", label: "the gap" },
    },
    metrics: [
      { label: "random → oracle gap closed", value: "13.4%", emphasis: true, negative: true },
      { label: "rollout fidelity, 1 → 12 steps", value: "0.635 → 0.530 F1", negative: true },
      { label: "hypotheses tested / refuted", value: "2 / 2", negative: true },
    ],
    readouts: [
      { value: "13.4 %", label: "of the random → oracle gap closed", negative: true },
      { value: "2 / 2", label: "hypotheses tested, refuted", negative: true },
    ],
    spec: "Tunnels · 12 × 12 grid · 7 × 7 egocentric window · 80,000 steps/s · PyTorch",
    figures: [
      {
        id: "fidelity",
        label: "fidelity",
        title: "imagined-rollout fidelity, occupancy F1 · horizon 1 → 12",
        section: "and-imagined-rollouts-still-degrade",
        negative: true,
        kind: "lines",
        x: [1, 2, 4, 6, 8, 10, 12],
        yMin: 0.4,
        yMax: 1,
        series: [
          { label: "argmax", points: [0.635, 0.694, 0.642, 0.599, 0.589, 0.534, 0.53], ink: "neg" },
          { label: "sampled", points: [0.618, 0.652, 0.6, 0.591, 0.543, 0.5, 0.448] },
        ],
        reference: { value: 0.922, label: "encoder ceiling" },
        shade: "above-series",
      },
      {
        id: "oracle",
        label: "oracle",
        title: "episode return · random → learned model → oracle",
        section: "attributing-the-gap-with-an-oracle",
        negative: true,
        kind: "dots",
        min: -1.5,
        max: 0,
        points: [
          { label: "random", value: -1.444, ink: "base" },
          { label: "learned-model MPC", value: -1.306, ink: "neg" },
          { label: "oracle MPC", value: -0.411, ink: "claim" },
        ],
        bracket: { from: "random", to: "oracle MPC", label: "the gap" },
      },
    ],
    caseFigures: [],
    schematic: {
      w: 24,
      h: 8,
      nodes: [
        { id: "tunnels", label: "Tunnels", x: 2, y: 3 },
        { id: "encoder", label: "VQ-VAE encoder", x: 6, y: 3 },
        { id: "dynamics", label: "transformer dynamics", x: 10, y: 3 },
        { id: "rollout", label: "imagined rollout (16 codes)", x: 14, y: 3, w: 3.4 },
        { id: "planner", label: "CEM planner", x: 18, y: 3 },
        { id: "action", label: "action", x: 22, y: 3 },
        { id: "sampled", label: "sampled futures", x: 11, y: 5.5, hatched: true },
        // Clear of the planner's dashed oracle edge at x = 18.
        { id: "autoregressive", label: "autoregressive within-frame", x: 15.6, y: 5.5, w: 3.2, hatched: true },
      ],
      edges: [
        { from: "tunnels", to: "encoder" },
        { from: "encoder", to: "dynamics" },
        { from: "dynamics", to: "rollout" },
        { from: "rollout", to: "planner" },
        { from: "planner", to: "action" },
        { from: "action", to: "tunnels", via: [[22, 0.8], [2, 0.8]] },
        {
          from: "planner",
          to: "tunnels",
          dashed: true,
          label: "oracle: true simulator via clone/restore",
          via: [[18, 7.2], [2, 7.2]],
        },
        { from: "rollout", to: "sampled", dashed: true },
        { from: "rollout", to: "autoregressive", dashed: true },
      ],
    },
    ledger: [
      {
        id: 7,
        term: "Planning barely beats random",
        kind: "result",
        quote: "which admits two readings with opposite fixes",
        anchor: "attributing-the-gap-with-an-oracle",
        detail:
          "Planning barely beats random, which admits two readings with opposite fixes: the model is too inaccurate, or CEM at this budget cannot solve the task even with a perfect model. The oracle settles it — the same CEM loop run against the real environment through clone/restore.",
      },
      {
        id: 8,
        term: "Imagined rollouts degrade with horizon",
        kind: "result",
        // Was "~0.27 of available fidelity lost at one step" — 0.922 − 0.635 is
        // 0.287, so the ledger prints the measured endpoints instead. The
        // write-up's own "roughly 0.27" is his sentence and his to correct.
        number: "0.635 → 0.530 F1",
        anchor: "and-imagined-rollouts-still-degrade",
        detail:
          "The encoder’s own reconstruction ceiling is 0.887–0.922, so one-step prediction already gives up roughly 0.27 of the available fidelity and the rest erodes with horizon. Reward MAE stays at 0.02–0.10 and termination agreement at 0.91–1.00 — the scalar heads are fine.",
      },
      {
        id: 9,
        term: "Sampling imagined futures should beat argmax",
        kind: "hypothesis",
        number: "F1 0.553 vs 0.604",
        anchor: "two-hypotheses-both-refuted",
        expected: "a discrete distribution can represent “left or right, equally likely”",
        measured: "argmax wins at nearly every horizon",
        why: "at 0.62 one-step fidelity the spread is model error, not the environment",
      },
      {
        id: 10,
        term: "The parallel-token shortcut is the cause",
        kind: "hypothesis",
        number: "0.538 vs 0.553, 6× slower",
        anchor: "two-hypotheses-both-refuted",
        expected: "16 codes predicted as conditionally independent explain the incoherent samples",
        measured: "autoregressive within-frame generation is worse and 6× slower",
        why: "independence was not the cause; kept behind a default-off flag",
      },
      {
        id: 11,
        term: "The model never saw a termination",
        kind: "bug",
        number: "recall 0.000 through 3,000 steps",
        anchor: "three-bugs-worth-recording",
        quote: "a model that predicted the world accurately and did not know episodes could end.",
        detail:
          "The replay sampler rejected any window containing a terminal step — the safe-looking choice, since windows must not span a reset. Windows may now end on a termination, the code loss is masked there, and 25% of each batch is forced terminal because the natural rate is 1.6%.",
      },
      {
        id: 12,
        term: "Unweighted BCE on a 1.6 % positive class",
        kind: "bug",
        number: "98.4 % accuracy, zero recall",
        anchor: "three-bugs-worth-recording",
        detail:
          "Even with terminal windows sampled, the termination head predicted “alive” unconditionally: 98.4% accuracy, zero recall. pos_weight is now 20 — deliberately short of the balanced 60, because over-correcting makes the planner see hazards everywhere and freeze.",
      },
      {
        id: 13,
        term: "Cell accuracy as a reconstruction metric",
        kind: "bug",
        number: "0.92 by predicting nothing",
        anchor: "three-bugs-worth-recording",
        detail:
          "Observations are ~92% empty, so predicting nothing scores 0.92 and the metric barely moves during training. The first encoder looked like it was at 98% when its occupancy F1 was 0.44.",
      },
    ],
    repo: "https://github.com/zaineli/reverie",
    metaKeywords: ["World models", "RL", "Planning", "PyTorch"],
    sections: [
      {
        heading: "The environment is the experiment",
        paragraphs: [
          "A world model only earns its cost when the task defeats the alternatives, so Tunnels is built around three properties. A 7×7 egocentric window on a 12×12 grid, so a reactive policy is insufficient rather than merely worse. Reward gated behind a key and a door, so a random policy solves 0.0% of episodes. Hazards that random-walk, which punish a deterministic model and make rollout fidelity worth measuring at all.",
          "The simulator runs at 80,000 steps per second on one core. That is deliberate: the bottleneck should be the model, not the environment.",
        ],
      },
      {
        heading: "The model learns everything it is asked to",
        table: {
          head: ["quantity", "value"],
          rows: [
            ["encoder occupancy F1", "0.922"],
            ["codebook usage / perplexity", "98% / 144 of 256"],
            ["next-code accuracy", "0.893"],
            ["reward MSE", "0.0007"],
            ["termination recall / precision", "1.000 / 1.000"],
          ],
        },
        paragraphs: [
          "Every head converges. Nothing in this table suggests a problem, which is exactly why the rollout measurement had to exist.",
        ],
      },
      {
        heading: "And imagined rollouts still degrade",
        negative: true,
        table: {
          head: ["horizon", "1", "2", "4", "6", "8", "10", "12"],
          rows: [
            ["F1 (argmax)", "0.635", "0.694", "0.642", "0.599", "0.589", "0.534", "0.530"],
            ["F1 (sampled)", "0.618", "0.652", "0.600", "0.591", "0.543", "0.500", "0.448"],
          ],
          caption:
            "Decoded occupancy F1 against the true simulator under identical action sequences.",
        },
        paragraphs: [
          "The encoder’s own reconstruction ceiling is 0.887–0.922, so one-step prediction already gives up roughly 0.27 of the available fidelity and the rest erodes with horizon. Reward MAE stays at 0.02–0.10 and termination agreement at 0.91–1.00 — the scalar heads are fine. It is state prediction that fails.",
        ],
      },
      {
        heading: "Attributing the gap with an oracle",
        table: {
          head: ["policy", "return", "solve rate", "s/episode"],
          rows: [
            ["random", "−1.444", "0.000", "—"],
            ["learned-model MPC", "−1.306", "0.000", "11.4"],
            ["oracle MPC (true simulator)", "−0.411", "0.100", "7.9"],
          ],
        },
        paragraphs: [
          "Planning barely beats random, which admits two readings with opposite fixes: the model is too inaccurate, or CEM at this budget cannot solve the task even with a perfect model. The oracle settles it — the same CEM loop run against the real environment through clone/restore. It is not a deployable method; it is an upper bound on the search.",
          "Random → oracle gap: +1.034. The learned model closes 13.4% of it. The oracle reaches a 10% solve rate where random reaches 0%, so the search is capable of something. The shortfall is model fidelity, and the rollout curve says so independently. Structuring the system so this question had a clean answer is the part worth keeping — a single end-to-end objective would have produced the same poor return with no way to attribute it.",
        ],
      },
      {
        heading: "Two hypotheses, both refuted",
        negative: true,
        // The README's mode table: the source of both hypotheses' numbers.
        table: {
          head: ["mode", "F1 sampled", "F1 argmax", "s/episode"],
          rows: [
            ["parallel", "0.553", "0.604", "0.07"],
            ["autoregressive", "0.538", "0.562", "0.44"],
          ],
        },
        list: [
          {
            term: "Sampling imagined futures should beat argmax",
            detail:
              "The standard argument for categorical latents: a discrete distribution can represent “left or right, equally likely”, where a regression to the mean gives a state that never occurs. Measured, argmax wins at nearly every horizon — mean F1 0.604 against 0.553. The argument assumes a calibrated model; at 0.62 one-step fidelity the spread is dominated by model error rather than environment stochasticity, so sampling adds noise on top of error.",
          },
          {
            term: "The parallel-token shortcut is the cause",
            detail:
              "The dynamics head predicts a frame’s 16 codes simultaneously, treating them as conditionally independent — which would explain incoherent samples. So I implemented autoregressive within-frame generation, drawing from the joint. It is worse (0.538 vs 0.553 sampled, 0.562 vs 0.604 argmax) and 6× slower, and argmax still beats sampling after the assumption is removed. Independence was not the cause. Kept behind a default-off flag, because the hypothesis is worth retesting at higher fidelity.",
          },
        ],
      },
      {
        heading: "Three bugs worth recording",
        negative: true,
        list: [
          {
            term: "The model never saw a termination",
            detail:
              "The replay sampler rejected any window containing a terminal step — the safe-looking choice, since windows must not span a reset. Termination recall sat at exactly 0.000 through 3,000 training steps while code accuracy climbed to 0.95: a model that predicted the world accurately and did not know episodes could end. Windows may now end on a termination, the code loss is masked there, and 25% of each batch is forced terminal because the natural rate is 1.6%.",
          },
          {
            term: "Unweighted BCE on a 1.6% positive class",
            detail:
              "Even with terminal windows sampled, the termination head predicted “alive” unconditionally: 98.4% accuracy, zero recall. pos_weight is now 20 — deliberately short of the balanced 60, because over-correcting makes the planner see hazards everywhere and freeze.",
          },
          {
            term: "Cell accuracy as a reconstruction metric",
            detail:
              "Observations are ~92% empty, so predicting nothing scores 0.92 and the metric barely moves during training. The first encoder looked like it was at 98% when its occupancy F1 was 0.44. Everything is now reported as F1, where the empty baseline is 0.0.",
          },
        ],
      },
    ],
  },
  {
    slug: "whetstone",
    name: "whetstone",
    tagline: "Auditable self-improvement, and a ledger that catches an agent gaming its own verifier",
    pitch:
      "A self-improvement loop whose ledger catches the agent gaming its own verifier: under a visible gate, 40% of accepted edits only looked like improvement.",
    year: "2026",
    abstract:
      "Self-improvement research has a measurement problem: when a language-model policy is scored by a language-model judge, “it got better” and “it learned to please the judge” cannot be told apart. whetstone moves the question to program synthesis, where correctness is decided by execution — so the verifier can be made deliberately gameable with a known amount of slack, and whether the agent exploits it becomes a measurement. The detection works. The improvement is below the experiment’s noise floor, and the noise floor is computed and reported.",
    thread: "Self-improving systems",
    verdict:
      "The ungated arm scores highest of the three — that is what noise looks like when nothing suppresses it.",
    lead: {
      value: "0.396",
      label: "hack rate, visible vs held-out gate",
      after: "Under a held-out gate, none.",
      negative: true,
    },
    homeLine: "A loop that logs “accepted, +3%” cannot tell you which 3%.",
    homeFigure: {
      id: "home-whetstone",
      label: "home",
      title: "hack rate by acceptance gate · accepted self-edits that only looked like improvement",
      caption: "accepted self-edits that only looked like improvement",
      section: "what-the-gate-is-measured-against",
      kind: "bars",
      max: 0.5,
      bars: [
        { label: "visible gate", value: 0.396, display: "0.396", ink: "neg", hideValue: true },
        { label: "no gate", value: 0.069, display: "0.069", ink: "base" },
        { label: "held-out gate", value: 0, display: "0.000", ink: "claim", stub: true },
      ],
    },
    metrics: [
      { label: "hack rate, visible vs held-out gate", value: "39.6% / 0.0%", emphasis: true },
      { label: "spurious solves at 1 example", value: "41.2%" },
      { label: "seeds needed for 80% power", value: "43 (ran 12)", negative: true },
    ],
    readouts: [
      { value: "+0.291", label: "overfit gap under the visible gate" },
      {
        value: "0.491 · 0.490 · 0.476",
        label: "held-out solve: no gate, held-out, visible",
        negative: true,
      },
    ],
    spec: "3 arms · 12 seeds · 1 visible example · skewed task generator · Python",
    figures: [
      {
        id: "hack-rate",
        label: "hack rate",
        title: "hack rate by acceptance gate · accepted self-edits that only looked like improvement",
        section: "what-the-gate-is-measured-against",
        kind: "bars",
        max: 0.5,
        bars: [
          { label: "visible gate", value: 0.396, display: "0.396", ink: "neg" },
          { label: "no gate", value: 0.069, display: "0.069", ink: "base" },
          { label: "held-out gate", value: 0, display: "0.000", ink: "claim", stub: true },
        ],
      },
      {
        id: "why-one-example",
        label: "why one example",
        title: "share of accepted solves that fit by coincidence · by visible examples",
        section: "where-reward-hacking-is-even-possible",
        kind: "bars",
        max: 0.5,
        annotation: "one example: 41 % of “solves” are spurious",
        bars: [
          { label: "1", value: 0.412, display: "41.2 %", ink: "neg" },
          { label: "2", value: 0.187, display: "18.7 %", ink: "base" },
          { label: "3", value: 0.131, display: "13.1 %", ink: "base" },
          { label: "4", value: 0.071, display: "7.1 %", ink: "base" },
          { label: "6", value: 0.029, display: "2.9 %", ink: "base" },
        ],
      },
    ],
    caseFigures: [],
    schematic: {
      w: 24,
      h: 8,
      nodes: [
        { id: "generator", label: "task generator (skewed)", x: 2, y: 3.5 },
        { id: "policy", label: "search policy (weight tables)", x: 6, y: 3.5 },
        { id: "proposal", label: "bounded proposal", x: 10, y: 3.5 },
        { id: "heldout", label: "held-out gate", x: 14, y: 1.2, kind: "gate" },
        { id: "visible", label: "visible gate", x: 14, y: 3.5, kind: "gate", hatched: true },
        { id: "nogate", label: "no gate", x: 14, y: 5.8, kind: "gate" },
        { id: "ledger", label: "ledger (both deltas)", x: 18, y: 3.5, kind: "store" },
        { id: "accept", label: "accept / reject", x: 22, y: 3.5 },
        { id: "oracle", label: "Policy.oracle", x: 6, y: 0.8 },
      ],
      edges: [
        { from: "generator", to: "policy" },
        { from: "policy", to: "proposal" },
        { from: "proposal", to: "heldout" },
        { from: "proposal", to: "visible" },
        { from: "proposal", to: "nogate" },
        { from: "heldout", to: "ledger" },
        { from: "visible", to: "ledger" },
        { from: "nogate", to: "ledger" },
        { from: "ledger", to: "accept" },
        { from: "accept", to: "policy", via: [[22, 7.5], [6, 7.5]] },
        { from: "oracle", to: "policy", dashed: true, label: "reference" },
      ],
    },
    ledger: [
      {
        id: 14,
        term: "Improvement below the noise floor",
        kind: "result",
        // Was numberHref: "#method" — the method rules left the home page in
        // round 12, so the number comes home. Lifted from this entry's own
        // detail sentence, not composed.
        number: "43 seeds for 80 % power, 12 run",
        anchor: "what-the-gate-is-measured-against",
        quote: "The solve-rate column is not significant and is not presented as if it were.",
        detail:
          "Headroom from a uniform policy to an oracle that knows the task generator is +0.029 against a per-arm standard deviation of 0.048, which needs 43 seeds for 80% power; 12 were run.",
      },
      {
        id: 15,
        term: "A power estimate from an underpowered pilot",
        kind: "estimate",
        number: "6 seeds implied 9",
        anchor: "what-the-gate-is-measured-against",
        detail:
          "The power estimate was itself worth running twice. A 6-seed pilot implied 9 seeds would suffice.",
      },
    ],
    repo: "https://github.com/zaineli/whetstone",
    metaKeywords: ["Self-improvement", "Reward hacking", "Program synthesis", "Python"],
    sections: [
      {
        heading: "Why decidable correctness is the precondition",
        paragraphs: [
          "The standard setup for studying self-improving agents — a language-model policy scored by a language-model judge — cannot answer its own central question. When the score rises there is no independent instrument to separate a policy that got better at the task from one that got better at being scored.",
          "So the domain is program synthesis from examples: a hidden program over integer lists, and the agent must find one reproducing the visible input/output pairs. Correctness is settled by execution. That makes the improvement signal exact, and — more usefully — makes it possible to build a verifier that is deliberately gameable with a known amount of slack, then measure whether the agent exploits it.",
        ],
      },
      {
        heading: "Where reward hacking is even possible",
        table: {
          head: ["visible examples", "visible solve", "held-out solve", "gap", "spurious share"],
          rows: [
            ["1", "0.728", "0.428", "0.300", "41.2%"],
            ["2", "0.642", "0.522", "0.120", "18.7%"],
            ["3", "0.587", "0.510", "0.077", "13.1%"],
            ["4", "0.594", "0.552", "0.042", "7.1%"],
            ["6", "0.584", "0.568", "0.017", "2.9%"],
          ],
          caption: "Uniform policy, 6 seeds. Specification density sets how much slack there is to game.",
        },
        paragraphs: [
          "Gaming needs a gap between what is checked and what is meant. With one visible example, 41% of everything that “solves” a task fails to reproduce held-out behaviour — the program fits by coincidence. With six, 3%.",
          "This table is also the first thing that went wrong. The initial run used four examples, where gaming barely occurs; hack rates came out near zero in every arm, and the obvious conclusion — that the gate does not matter — would have been drawn from an experiment conducted outside the regime where the phenomenon exists.",
        ],
      },
      {
        heading: "What the gate is measured against",
        table: {
          head: ["gate", "held-out solve", "Δ vs uniform", "overfit gap", "hack rate"],
          rows: [
            ["held-out", "0.490 ± 0.054", "+0.003", "+0.233", "0.000"],
            ["visible", "0.476 ± 0.047", "−0.010", "+0.291", "0.396"],
            ["none", "0.491 ± 0.044", "+0.004", "+0.251", "0.069"],
          ],
          caption: "Three arms over 12 seeds, identical but for the acceptance rule. One visible example, skewed generator.",
        },
        paragraphs: [
          "Hack rate is the fraction of accepted self-modifications that raised the visible score without raising the held-out score — a change that looks like improvement to the system and is not. Under a visible gate, 40% of everything accepted is of that kind. Under a held-out gate, none. The overfit-gap column corroborates it independently: the visible arm does not merely accept gaming, it ends measurably more overfitted (+0.291 against +0.233).",
          "The solve-rate column is not significant and is not presented as if it were. Headroom from a uniform policy to an oracle that knows the task generator is +0.029 against a per-arm standard deviation of 0.048, which needs 43 seeds for 80% power; 12 were run. Note that the ungated arm scores highest of the three — that is what noise looks like when nothing suppresses it.",
          "The power estimate was itself worth running twice. A 6-seed pilot implied 9 seeds would suffice. Twelve seeds shrank the measured headroom and held the variance, revising the requirement to 43. A power estimate taken from an underpowered pilot is not reliable, and the direction of its error is not predictable — which matters, because running the pilot and stopping there is the normal thing to do.",
        ],
      },
      {
        heading: "Design",
        list: [
          {
            term: "Bounded proposals",
            detail:
              "Every self-modification is a named edit to one weight table — reinforce an operation, a parameter, a bigram, a program length — with a clipped magnitude. Free-form self-modification is unauditable, and an unauditable change cannot be attributed when the system later gets worse. This is the discipline CONOID applies to its judge channels, for the same reason.",
          },
          {
            term: "A held-out gate",
            detail:
              "A proposal is accepted only if it improves the solve rate on examples the search never saw, on a gate set disjoint from the one that generated it, at a fixed evaluation seed so both candidates face identical search draws. Without that last detail the search’s own variance swamps a single bounded edit and the gate accepts noise.",
          },
          {
            term: "A ledger that keeps both numbers",
            detail:
              "Every proposal is recorded with its visible and held-out deltas, accepted or not. The gap between them is the reward-hacking signal, and it only exists if both are kept. A loop that logs “accepted, +3%” cannot tell you which 3%.",
          },
          {
            term: "An oracle for scale",
            detail:
              "The task generator originally sampled operations uniformly, which made a uniform search policy Bayes-optimal by construction and left the loop with nothing to find. Every arm came out flat, and the flatness looked like a finding about self-improvement. Tasks are now drawn from a skewed distribution and a Policy.oracle matches it exactly — without that reference, “+0.03” could be most of what is achievable or a rounding error.",
          },
        ],
      },
    ],
  },
  {
    slug: "spindle",
    name: "spindle",
    tagline: "An inference engine from the memory manager up, and a speculative-decoding result that did not pay",
    pitch:
      "An inference engine built from the memory manager up: 2× throughput from continuous batching, and a speculative-decoding result that did not pay — with the cost model that says why.",
    year: "2026",
    abstract:
      "An inference engine built from the memory manager up: block-paged KV cache with copy-on-write sharing, iteration-level scheduling with preemption, and lossless speculative decoding — over a from-scratch GPT-2 forward pass, because the interesting parts are exactly the parts a generate() API owns and hides. Correctness is pinned against HuggingFace: greedy output token-identical, prefill logits within 2e-3.",
    thread: "Inference engineering",
    verdict: "A latency benchmark that does not model arrival is measuring service time.",
    lead: { value: "2.05", unit: "×", label: "throughput, continuous vs static batching" },
    homeLine: "The control is more informative than the headline.",
    homeFigure: {
      id: "home-spindle",
      label: "home",
      title: "Continuous batching, and the control",
      section: "continuous-batching-and-the-control",
      kind: "bars",
      max: 2.2,
      reference: { value: 1, label: "static batching = 1×" },
      bars: [
        { label: "long-tailed generation lengths", value: 2.05, display: "2.05×", ink: "claim", hideValue: true },
        { label: "uniform generation lengths", value: 1.16, display: "1.16×", ink: "base" },
      ],
    },
    // Contiguous fragments of the tagline and pitch, and the control's own
    // label — nothing new is said while the speculative result is withheld.
    held: {
      tagline: "An inference engine from the memory manager up",
      pitch: "An inference engine built from the memory manager up: 2× throughput from continuous batching.",
      readout: { value: "1.16×", label: "the batching speed-up once generation lengths are uniform" },
      abstract:
        "An inference engine built from the memory manager up: block-paged KV cache with copy-on-write sharing, iteration-level scheduling with preemption — over a from-scratch GPT-2 forward pass, because the interesting parts are exactly the parts a generate() API owns and hides. Correctness is pinned against HuggingFace: greedy output token-identical, prefill logits within 2e-3.",
    },
    metrics: [
      { label: "continuous vs static batching", value: "2.05× throughput", emphasis: true },
      { label: "paged vs contiguous peak memory", value: "2.50× lower" },
      { label: "p99 TTFT", value: "5262 → 2447 ms" },
    ],
    readouts: [
      { value: "2.50×", label: "less peak memory, paged vs contiguous" },
      {
        value: "1.92×",
        label: "fewer target forward passes under speculation",
        negative: true,
      },
    ],
    spec: "GPT-2 124M · ~120-line forward pass · Apple M5, fp32, CPU · PyTorch",
    figures: [
      {
        id: "speculation",
        label: "speculation",
        title: "speculative decoding, wall-clock speed-up · GPT-2 draft → GPT-2-medium target",
        section: "speculative-decoding-a-negative-result-with-a-rule",
        negative: true,
        kind: "lines",
        x: [1, 2, 4, 6, 8],
        xLabel: "draft length γ",
        yMin: 0.4,
        yMax: 1.1,
        series: [{ label: "measured", points: [0.7, 0.57, 0.62, 0.63, 0.6], ink: "neg" }],
        reference: { value: 1, label: "break-even" },
        shade: "below-reference",
        shadeLabel: "slower",
        marker: { x: 2, y: 0.64, label: "cost model 0.64×" },
      },
      {
        id: "batching",
        label: "batching",
        title: "continuous vs static batching · 24 requests, long-tailed lengths",
        section: "continuous-batching-and-the-control",
        kind: "pairs",
        pairs: [
          {
            label: "throughput",
            a: { label: "static", value: 158.9, display: "158.9 tok/s" },
            b: { label: "continuous", value: 325.6, display: "325.6 tok/s", ink: "claim" },
            ratio: "2.05×",
          },
          {
            label: "TTFT p50",
            a: { label: "static", value: 2356, display: "2356 ms" },
            b: { label: "continuous", value: 1124, display: "1124 ms", ink: "claim" },
            ratio: "2.1×",
          },
          {
            label: "TTFT p99",
            a: { label: "static", value: 5262, display: "5262 ms" },
            b: { label: "continuous", value: 2447, display: "2447 ms", ink: "claim" },
            ratio: "2.15×",
          },
        ],
      },
    ],
    caseFigures: [
      {
        id: "paging",
        label: "paging",
        title: "paged vs contiguous · 64 requests, 8192 token slots, block size 16",
        section: "paging",
        kind: "pairs",
        pairs: [
          {
            label: "peak slots held",
            a: { label: "contiguous", value: 8161, display: "8161" },
            b: { label: "paged", value: 3264, display: "3264", ink: "claim" },
            ratio: "2.50×",
          },
          {
            label: "mean slot utilisation",
            a: { label: "contiguous", value: 0.574, display: "0.574" },
            b: { label: "paged", value: 0.929, display: "0.929", ink: "claim" },
            ratio: "1.62×",
          },
        ],
      },
    ],
    schematic: {
      w: 24,
      h: 8,
      nodes: [
        { id: "requests", label: "requests", x: 2, y: 3 },
        { id: "scheduler", label: "scheduler (iteration-level, preemption)", x: 6, y: 3 },
        { id: "table-a", label: "block table", x: 10, y: 1.6 },
        { id: "table-b", label: "block table", x: 10, y: 4.4 },
        { id: "pool", label: "block pool", x: 14, y: 3, kind: "store" },
        { id: "forward", label: "GPT-2 forward", x: 18, y: 3 },
        { id: "tokens", label: "tokens", x: 22, y: 3 },
        // Off the page, with their edges, until the speculative result is re-run.
        { id: "draft", label: "draft GPT-2", x: 13, y: 6.5, hatched: true, hold: SPEC_DECODE_HOLD },
        { id: "target", label: "target GPT-2-medium", x: 18, y: 6.5, hatched: true, hold: SPEC_DECODE_HOLD },
      ],
      edges: [
        { from: "requests", to: "scheduler" },
        { from: "scheduler", to: "table-a" },
        { from: "scheduler", to: "table-b" },
        { from: "table-a", to: "pool", label: "shared block, refcount", labelAt: [13.1, 1.2] },
        { from: "table-b", to: "pool" },
        { from: "pool", to: "forward" },
        { from: "forward", to: "tokens" },
        { from: "draft", to: "target", dashed: true },
        { from: "target", to: "forward", dashed: true },
      ],
    },
    ledger: [
      {
        id: 16,
        term: "Speculative decoding, slower in wall clock everywhere",
        kind: "result",
        hold: SPEC_DECODE_HOLD,
        number: "needs a draft ≥ 9× cheaper at γ = 4; this pair is 2.6×",
        anchor: "speculative-decoding-a-negative-result-with-a-rule",
        detail:
          "Rearranged, the deployment rule is c_draft/c_target < (tokens_per_target_forward − 1) / γ, which at γ=4 demands a draft at least 9× cheaper. GPT-2 → GPT-2-medium is 2.6×, so it cannot pay at any γ.",
      },
      {
        id: 17,
        term: "The cache inferred positions",
        kind: "bug",
        number: "16.4 off HuggingFace in max absolute logit",
        anchor: "two-bugs-worth-recording",
        detail:
          "Sequence length advanced on write, and to stop twelve layers advancing it twelve times it advanced only on the last — so prefill at layer 0 saw a context length of zero and every sequence attended over nothing. Output was fluent English and 16.4 off HuggingFace in max absolute logit.",
      },
      {
        id: 18,
        term: "A stale distribution in speculation",
        kind: "bug",
        anchor: "two-bugs-worth-recording",
        quote: "“the capital, of France, is Paris., and the capital” — which reads as a mediocre model rather than a broken cache.",
        detail:
          "When every proposal was accepted, the cache was already at prompt + output, so the resync had nothing to process and the next-token distribution silently kept its value from the start of the round. The bonus token was drawn from it.",
      },
    ],
    repo: "https://github.com/zaineli/spindle",
    metaKeywords: ["Inference", "Systems", "PyTorch"],
    sections: [
      {
        heading: "Why write the forward pass",
        paragraphs: [
          "The subject is memory management and scheduling. Both are owned and hidden by any generate() API — the library allocates the KV cache, decides its layout, and runs the loop — so handing it a block table is not an option. The GPT-2 forward pass is about 120 lines here; transformers is used only to fetch checkpoints and tokenize.",
          "That carries an obligation to prove correctness rather than assume it. Prefill logits match HuggingFace to 2e-3 in float32 and greedy generation is token-identical. The test suite also checks that batched decoding produces exactly the same tokens as decoding each sequence alone, which is what catches attention leaking across sequence boundaries — the most likely way a hand-written paged attention goes subtly wrong.",
        ],
      },
      {
        heading: "Paging",
        paragraphs: [
          "A contiguous per-sequence buffer must be sized at admission to prompt + max_new_tokens, because that is the only bound available then. A request that stops at 20 of a possible 192 tokens has still held all 192 slots for its entire lifetime. Blocks instead: a pool of fixed-size blocks and a per-sequence block table, so waste is bounded by the final partial block regardless of how long the sequence might have become.",
          "Reference counts give copy-on-write forking, which contiguous allocation cannot do at all. Four sequences forked from a 16-token parent hold 64 logical tokens in 16 physical ones.",
        ],
        table: {
          head: ["", "contiguous", "paged", ""],
          rows: [
            ["peak slots held", "8161", "3264", "2.50× less"],
            ["mean slot utilisation", "0.574", "0.929", "1.62×"],
            ["steps to drain", "236", "192", ""],
          ],
          caption: "64 requests replayed through both allocators, 8192 token slots, block size 16.",
        },
      },
      {
        heading: "Continuous batching, and the control",
        table: {
          head: ["", "static (batch 8)", "continuous", ""],
          rows: [
            ["throughput", "158.9 tok/s", "325.6 tok/s", "2.05×"],
            ["forward steps", "383", "246", ""],
            ["TTFT p50", "2356 ms", "1124 ms", "2.1×"],
            ["TTFT p99", "5262 ms", "2447 ms", "2.15×"],
          ],
          caption: "24 requests, GPT-2 124M, long-tailed generation lengths. Apple M5, fp32, CPU.",
        },
        paragraphs: [
          "The control is more informative than the headline. With uniform generation lengths both policies take exactly 48 forward steps and the speedup collapses to 1.16×. Continuous batching is not faster per step — a static batch finishes when its longest member finishes, and every slot freed before then is idle. Remove the length variance and there is nothing to reclaim.",
          "An earlier version of this benchmark reported static batching having better TTFT, 32 ms against 586 ms. It constructed each group's requests just before running that group, so a request in the third group had its clock started after the first two finished — not measuring the queueing delay static batching imposes. With a common arrival time the numbers invert. A latency benchmark that does not model arrival is measuring service time.",
        ],
      },
      {
        heading: "Speculative decoding: a negative result with a rule",
        negative: true,
        hold: SPEC_DECODE_HOLD,
        table: {
          head: ["γ", "acceptance", "tokens / target fwd", "wall speedup", "exact"],
          rows: [
            ["1", "0.707", "0.86", "0.70×", "yes"],
            ["2", "0.647", "1.13", "0.57×", "yes"],
            ["4", "0.511", "1.47", "0.62×", "yes"],
            ["6", "0.435", "1.71", "0.63×", "yes"],
            ["8", "0.352", "1.74", "0.60×", "yes"],
          ],
          caption: "GPT-2-medium target, GPT-2 draft, greedy, 32 tokens.",
        },
        paragraphs: [
          "Speculation does what it claims — it cuts target forward passes by up to 1.92× — and is slower in wall clock everywhere. That is not a bug; correctness holds across all 15 prompt × γ configurations. The arithmetic is speedup ≈ tokens_per_target_forward / (1 + γ · c_draft/c_target).",
          "Measured decode costs are 8.52 ms for GPT-2, 22.55 ms for medium and 46.24 ms for large, so the ratio is 0.378 for this pair and the model predicts 0.64× at γ=2 against 0.57× measured. Rearranged, the deployment rule is c_draft/c_target < (tokens_per_target_forward − 1) / γ, which at γ=4 demands a draft at least 9× cheaper. GPT-2 → GPT-2-medium is 2.6×, so it cannot pay at any γ. Production pairings clear it comfortably — a 70B target with a 1B draft sits near 0.014.",
          "The technique assumes a bandwidth-bound target and a nearly-free draft. At GPT-2 scale on CPU neither holds. Reporting the speed-up without the cost model would report a property of the hardware as a property of the technique.",
        ],
      },
      {
        heading: "Two bugs worth recording",
        negative: true,
        list: [
          {
            term: "The cache inferred positions",
            detail:
              "Sequence length advanced on write, and to stop twelve layers advancing it twelve times it advanced only on the last — so prefill at layer 0 saw a context length of zero and every sequence attended over nothing. Output was fluent English and 16.4 off HuggingFace in max absolute logit. The cache no longer infers: append takes an explicit start position, gather takes an explicit length, the runner advances once per step.",
          },
          {
            term: "A stale distribution in speculation",
            detail:
              "When every proposal was accepted, the cache was already at prompt + output, so the resync had nothing to process and the next-token distribution silently kept its value from the start of the round. The bonus token was drawn from it. The symptom was not a crash but fluent text with tokens spliced in — \"the capital, of France, is Paris., and the capital\" — which reads as a mediocre model rather than a broken cache.",
          },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Asides: work that is real and is not benchmarked. No figure, no case
 * page, no performance number — none of the CV's numbers for these survive
 * a read of the repository. They sit at the priors' size so position and
 * type say "same kind of thing, not benchmarked" without an explanatory
 * word.
 * ------------------------------------------------------------------ */

export interface Aside {
  name: string;
  /** A contiguous compression of his own README. Needs his sign-off. */
  note: string;
  repo: string;
}

export const asides: Aside[] = [
  {
    name: "VisionTactical",
    note: "first run failed; won at lower enemy speed",
    repo: "https://github.com/zaineli/vision-tactical",
  },
];

/**
 * Page order: the two numbers that held first, then the two that said no,
 * so the first red a reader meets is not the first thing under the thesis.
 * reverie — the RL thesis's own first attempt — stands under the portrait.
 * The case-page ring follows the same order.
 */
const ORDER: SystemSlug[] = ["engram", "whetstone", "spindle", "reverie"];
export const systems: System[] = ORDER.map((slug) => systemList.find((s) => s.slug === slug)!);

export const systemBySlug = (slug: string): System | undefined =>
  systems.find((s) => s.slug === slug);

/** A system's ledger as shown: held entries removed. */
export const shownLedger = (entries: LedgerEntry[]): LedgerEntry[] => entries.filter((e) => !e.hold);

/** A system's sections as shown: held sections removed. */
export const shownSections = (s: System): SystemSection[] => s.sections.filter((x) => !x.hold);

/** What the system is, in one line — the held variant while its claim is withheld. */
export const shownTagline = (s: System): string => (SPEC_DECODE_HOLD && s.held ? s.held.tagline : s.tagline);

/** The case-page readouts, with the held one swapped for its replacement. */
export const shownReadouts = (s: System): Readout[] =>
  SPEC_DECODE_HOLD && s.held ? [s.readouts[0], s.held.readout] : [...s.readouts];

/* ------------------------------------------------------------------ *
 * Publications
 * ------------------------------------------------------------------ */

export interface Publication {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  /** Omitted, not blank, for a submission whose author block is anonymised. */
  authors?: string;
  /** Each author with their own affiliation, exactly as the PDF prints them. */
  authorList?: { name: string; affiliation: string }[];
  year?: string;
  status: string;
  abstract: string;
  verdict: string;
  /** `verdict` split at its semicolon: the claim in ink, the limit in red. */
  claim?: { lead: string; rest: string };
  limit?: string;
  readout: Readout;
  figures: FigureSpec[];
  /** Verbatim margin notes beside a figure, by figure id; neg ones are red. */
  notes?: Record<string, { text: string; neg?: boolean }>;
  schematic: Schematic;
  media: {
    pdf: string;
    /** The first page as an image, for the page-as-object link. */
    page1?: string;
    openHouse: string;
    video: string;
    poster: string;
    deck: string[];
  };
  bibtex?: string;
  links?: Link[];
  /** This paper's own negative results, in the same shape systems[] ledgers use. */
  ledger?: LedgerEntry[];
  /** Case-page body, in the same heading/paragraph shape as SystemSection. */
  sections?: { heading: string; paragraphs: string[] }[];
}

const conoid: Publication = {
    slug: "conoid",
    title:
      "CONOID: Persistent Per-Skill Reputation and Multi-Channel Judge Feedback for LLM-Agent Organizations",
    shortTitle: "CONOID",
    subtitle: "Persistent per-skill reputation for LLM-agent organizations",
    authors: "Zain Ali, Muhammad Ahmed Mohsin",
    // Affiliations as the PDF's author block prints them. Stanford is his
    // co-author's affiliation, never a venue.
    authorList: [
      { name: "Zain Ali", affiliation: "Machvis Lab, NUST" },
      { name: "Muhammad Ahmed Mohsin", affiliation: "SAIL, Stanford University" },
    ],
    year: "2026",
    // The PDF's own status line, word for word. Not "under review".
    status: "Preprint. Not peer-reviewed; under continued development.",
    // The preprint's abstract, verbatim (p.1).
    abstract:
      "Frameworks for multi-agent language-model systems make it cheap to instantiate named agents and have them coordinate, but most evaluations treat each run as disposable: a team is chosen, an answer is produced, and almost no structured evidence survives into the next assignment. We study that missing persistence layer. CONOID maintains a population of agents that carry profiles, tiered memories, signed social edges, and a per-skill Beta-reputation posterior; a structured judge proposes bounded updates to those channels, and the next team is selected against the updated state. Our contribution is empirical as much as architectural, and the main result is conditional on profile quality. On a 691,200-row oracle-backed team-selection benchmark, a fixed static-role assignment is the best non-oracle policy when visible profiles are reliable (oracle regret 0.044), but a reputation-plus-exploration policy is best when profiles are weak (85.2% success vs. 75.5% for static roles; regret 0.076 vs. 0.098) or adversarially noisy (65.9% vs. 44.2%; regret 0.094 vs. 0.146), with seed-paired bootstrap intervals excluding zero. On a 2,880-row live private-evidence benchmark in which an answer is correct only if the selected team collectively holds all evidence, the same policy closes 68–71% of the random-to-oracle selection gap when evidence holders are profile-aligned, while hidden-expert discovery stays near chance. A 1,440-call coordinator replay isolates a second, separable bottleneck: schema-constrained answer aggregation drops accuracy from 0.839 to 0.586, whereas deterministic slot assembly recovers 0.992. The claim is therefore narrow: persistent per-skill reputation with explicit exploration helps team formation when profiles are incomplete or misleading; it is not a universal substitute for good profiles, and rewarding raw social cohesion can hurt.",
    // The abstract's last sentence, verbatim, split at its semicolon on the
    // home page: the claim in ink, the paper's own limit in red.
    verdict:
      "The claim is therefore narrow: persistent per-skill reputation with explicit exploration helps team formation when profiles are incomplete or misleading; it is not a universal substitute for good profiles, and rewarding raw social cohesion can hurt.",
    claim: {
      lead: "The claim is therefore narrow:",
      rest: "persistent per-skill reputation with explicit exploration helps team formation when profiles are incomplete or misleading;",
    },
    limit: "it is not a universal substitute for good profiles, and rewarding raw social cohesion can hurt.",
    readout: { value: "691,200", label: "rows in the oracle-backed benchmark" },
    // Verbatim from the preprint (p.13, p.9).
    notes: {
      "profile-quality": {
        text: "When profiles are reliable, a fixed assignment is both simpler and better, and CONOID should defer to it",
        neg: true,
      },
      aggregation: { text: "aggregation loss is an interface problem, not a team-selection problem." },
    },
    bibtex: `@misc{ali2026conoid,
  title  = {{CONOID}: Persistent Per-Skill Reputation and Multi-Channel Judge Feedback for {LLM}-Agent Organizations},
  author = {Ali, Zain and Mohsin, Muhammad Ahmed},
  year   = {2026},
  note   = {Preprint. Not peer-reviewed; under continued development.},
  howpublished = {\\url{https://zainn.me/conoid/preprint.pdf}},
  url    = {https://zainn.me/conoid/preprint.pdf}
}`,
    figures: [
      {
        id: "profile-quality",
        label: "profile quality",
        title: "success rate by profile quality · static roles vs reputation + exploration",
        section: "abstract",
        kind: "pairs",
        sharedScale: true,
        pairs: [
          // Table 2's strong-profile regime: static roles win, so the
          // reputation side is the result that said no.
          {
            label: "strong profiles",
            a: { label: "static roles", value: 93.8, display: "93.8 %" },
            b: { label: "reputation + exploration", value: 92.1, display: "92.1 %", ink: "neg" },
          },
          {
            label: "weak profiles",
            a: { label: "static roles", value: 75.5, display: "75.5 %" },
            b: { label: "reputation + exploration", value: 85.2, display: "85.2 %", ink: "claim" },
          },
          {
            label: "adversarial profiles",
            a: { label: "static roles", value: 44.2, display: "44.2 %" },
            b: { label: "reputation + exploration", value: 65.9, display: "65.9 %", ink: "claim" },
          },
        ],
      },
      {
        id: "aggregation",
        label: "aggregation",
        title: "answer aggregation · coordinator replay",
        section: "abstract",
        kind: "bars",
        max: 1,
        bars: [
          { label: "free-form coordinator", value: 0.839, display: "0.839", ink: "base" },
          { label: "schema-constrained", value: 0.586, display: "0.586", ink: "neg" },
          { label: "deterministic slot assembly", value: 0.992, display: "0.992", ink: "claim" },
        ],
      },
    ],
    schematic: {
      w: 24,
      h: 8,
      nodes: [
        { id: "population", label: "agent population", x: 1.8, y: 3.4, kind: "store" },
        { id: "assignment", label: "assignment", x: 5.4, y: 3.4 },
        { id: "task", label: "task", x: 9, y: 3.4 },
        { id: "judge", label: "structured judge", x: 12.6, y: 3.4 },
        { id: "ch-profile", label: "profile", x: 16.2, y: 0.7, w: 2.6 },
        { id: "ch-memory", label: "tiered memory", x: 16.2, y: 2.5, w: 2.6 },
        { id: "ch-social", label: "signed social edges", x: 16.2, y: 4.3, w: 2.6 },
        { id: "ch-reputation", label: "per-skill reputation", x: 16.2, y: 6.1, w: 2.6 },
        { id: "cap-profile", label: "cap", x: 19.4, y: 0.7, w: 1.4, kind: "gate" },
        { id: "cap-memory", label: "cap", x: 19.4, y: 2.5, w: 1.4, kind: "gate" },
        { id: "cap-social", label: "cap", x: 19.4, y: 4.3, w: 1.4, kind: "gate" },
        { id: "cap-reputation", label: "cap", x: 19.4, y: 6.1, w: 1.4, kind: "gate" },
        { id: "apply", label: "deterministic apply", x: 22.4, y: 3.4 },
        { id: "aggregation", label: "schema-constrained aggregation", x: 9, y: 6.1, hatched: true },
      ],
      edges: [
        { from: "population", to: "assignment", label: "static roles | reputation + exploration" },
        { from: "assignment", to: "task" },
        { from: "task", to: "judge" },
        { from: "judge", to: "ch-profile" },
        { from: "judge", to: "ch-memory" },
        { from: "judge", to: "ch-social" },
        { from: "judge", to: "ch-reputation" },
        { from: "ch-profile", to: "cap-profile" },
        { from: "ch-memory", to: "cap-memory" },
        { from: "ch-social", to: "cap-social" },
        { from: "ch-reputation", to: "cap-reputation" },
        { from: "cap-profile", to: "apply" },
        { from: "cap-memory", to: "apply" },
        { from: "cap-social", to: "apply" },
        { from: "cap-reputation", to: "apply" },
        { from: "apply", to: "population", via: [[22.4, 7.7], [1.8, 7.7]] },
        { from: "task", to: "aggregation", dashed: true },
      ],
    },
    // The open-house deck, its PDF and the promo video stay in /public but
    // off the page: their numbers contradict the preprint (ρ 0.83 vs the
    // paper's 0.78; a "+0.24" the paper never states) and the deck's market
    // claims read as a pitch, not a paper.
    media: {
      pdf: "/conoid/preprint.pdf",
      page1: "/conoid/page-1.webp",
      openHouse: "",
      video: "",
      poster: "",
      deck: [],
    },
    links: [{ label: "PDF", href: "/conoid/preprint.pdf", external: true }],
  };

/**
 * The second paper is written, checked and not published. The submission is
 * anonymous, its own footer says "Do not distribute", and there is no public
 * repository, so none of its numbers is one a reader could check — which is
 * the rule the footer of this site states. Flip this to true on the day a
 * de-anonymised preprint or the public repo carrying the 2026-04-21 PREREG
 * commit exists. Nothing else changes: the route, the ledger rows, the fact
 * registry and the count are all derived.
 */
export const PMR_PUBLIC = false;

const sheafReputation: Publication = {
  slug: "sheaf-reputation",
  title: "Sheaf Cohomology of LLM-Agent Reputation, with a Demand-Driven Entry Rule",
  shortTitle: "PMR",
  subtitle: "Three reductions of one cellular-sheaf construction",
  // authors, coauthors, venue and year are omitted, not blank: the
  // submission's author block is anonymised and its own footer contradicts
  // its year. He supplies the author line the day this goes public.
  status: "In submission",
  abstract:
    "Reputation in multi-agent systems has been formalized three times over: EigenTrust as the principal eigenvector of a row-stochastic trust matrix; beta-reputation as conjugate Bayesian aggregation of Bernoulli observations; and subjective logic as Jøsang's opinion simplex with a dedicated consensus operator. Each formalism carries its own algebra, its own papers, and its own implementations, yet all three compute a function from edge-valued observations to vertex-valued reputation. We place all three inside a single cellular-sheaf framework in the Hansen–Ghrist style: EigenTrust recovers as the null vector of a sheaf Laplacian on a constant R-sheaf (Lemma 1); beta-reputation aggregation recovers as the boundary of an edge-valued cochain in a dual cosheaf (Lemma 2); subjective-logic consensus recovers as the Jøsang-beta bijection composed with the same cosheaf boundary (Lemma 3).",
  verdict:
    "One cellular sheaf recovers EigenTrust, beta-reputation and subjective logic; the entry rule it implies moves the coverage proxy only where vocabulary drift reaches the label level, and not on LLM streams.",
  readout: {
    value: "998 / 1000",
    label: "admission decisions matched by a second implementation",
  },
  figures: [
    {
      id: "table-4",
      label: "per-stream delta",
      title: "PMR − unmet_only pass@1-proxy, by stream · 95 % paired bootstrap",
      section: "where-the-rule-pays",
      kind: "diverging",
      negative: true,
      min: -0.005,
      max: 0.025,
      // The v3 LLM stream (+0.0000, CI [+0.0000, +0.0000], 90 tasks × 30
      // seeds) is deliberately absent: a zero-width interval over 2,700
      // paired runs is a harness signature, not a null. Disclosed in prose.
      series: [
        { label: "v1 synthetic", primary: 0.022, display: "+0.0220", ink: "claim" },
        { label: "v1 replica (vocab_only)", primary: 0.0077, display: "+0.0077", ink: "claim" },
        { label: "2×2 stationary", primary: 0.0006, display: "+0.0006" },
        { label: "2×2 demand_only", primary: 0.0029, display: "+0.0029" },
        { label: "2×2 both", primary: -0.0007, display: "−0.0007", ink: "neg" },
        { label: "v1 LLM", primary: -0.0017, display: "−0.0017", ink: "neg" },
        { label: "v2_drift LLM", primary: -0.0022, display: "−0.0022", ink: "neg" },
      ],
    },
    {
      id: "amortization",
      label: "amortization",
      title: "agent inventory at equal coverage · PMR vs a spawn-per-task proxy",
      section: "where-the-rule-pays",
      kind: "pairs",
      sharedScale: true,
      annotation: "35 agents against a 1,010-agent spawn-per-task proxy at equal coverage — 28.9×",
      pairs: [
        {
          label: "equal coverage, 0.65",
          a: { label: "PMR", value: 35, display: "35 agents" },
          b: { label: "spawn-per-task, k = 2", value: 1010, display: "1,010 agents", ink: "neg" },
          ratio: "28.9×",
        },
      ],
    },
  ],
  schematic: {
    w: 24,
    h: 8,
    nodes: [
      { id: "et", label: "EigenTrust", x: 3, y: 1.5, w: 5 },
      { id: "beta", label: "beta-reputation", x: 3, y: 4, w: 5 },
      { id: "sl", label: "subjective logic", x: 3, y: 6.5, w: 5 },
      { id: "sheaf", label: "cellular sheaf F on G", x: 11, y: 4, w: 6, kind: "store" },
      { id: "btau", label: "obstruction module B_τ", x: 19, y: 2.5, w: 6 },
      { id: "pmr", label: "PMR admission", x: 19, y: 5.5, w: 6, kind: "gate" },
      { id: "rot", label: "rotation sheaf · dim H⁰ = 0", x: 11, y: 7.5, w: 6, hatched: true },
    ],
    edges: [
      { from: "et", to: "sheaf", label: "Lemma 1" },
      { from: "beta", to: "sheaf", label: "Lemma 2" },
      { from: "sl", to: "sheaf", label: "Lemma 3" },
      { from: "sheaf", to: "btau" },
      { from: "btau", to: "pmr", label: "Prop. 3", dashed: true },
      { from: "sheaf", to: "rot", label: "non-subsumption", dashed: true },
    ],
  },
  media: { pdf: "", openHouse: "", video: "", poster: "", deck: [] },
  // No `links`: Papers.tsx maps `p.links ?? []`, so omitting it is the whole
  // suppression — the row prints only the internal case-page route.
  sections: [
    {
      heading: "Where the rule pays",
      paragraphs: [
        "PMR's advantage over unmet_only requires vocab growth to register at the label level, which is a structural property of the label extractor rather than of PMR.",
        "The +0.015 floor on PMR − unmet_only pass@1-proxy was committed in experiments/PREREG.md on 2026-04-21, before any v1-LLM or v2_drift-LLM or v3-LLM run was attempted. The thresholds were not revised in response to any observed data.",
        "This synthetic replica meets the sign and significance of the v1 original (+0.022, Table 4) but not the magnitude.",
        "Three cells match the registered prediction; the fourth (both) is null rather than the expected positive, a refinement attributed to rotating-demand interference with vocab-growth signal.",
        "On v1 LLM (60 tasks, 10 seeds, 120 admission decisions), PMR and unmet_only pick identical skill sets on 67.5% of admissions. On v2_drift LLM (90 tasks, 10 seeds, 180 admissions), the agreement rises to 84.4%. In both regimes, the coverage-level delta is null with CI crossing zero.",
      ],
    },
    {
      heading: "Ablations",
      paragraphs: [
        "PMR w/o marginal gain (uniform ∆m): 0.6361, −0.0030 [−0.0070, +0.0010], CI excludes 0: False.",
        "PMR (γ = 0.75): +0.0072 [+0.0004, +0.0139]. PMR (γ = 1.0): +0.0070 [+0.0003, +0.0132]. γ = 1 is selected as the principled choice: under the slow-smooth-drift analysis, it is exactly the linear-drift-unbiased forecast coefficient.",
      ],
    },
    {
      heading: "What is not claimed",
      paragraphs: [
        "The cellular-sheaf machinery is not ours; it is imported from prior work. None of the three reductions is, taken individually, a novel mathematical object: each is a restatement modulo conventions.",
        "pass_at_1_proxy is a coverage proxy (|team ∩ R|/|R| ≥ 1), not an LLM-judged pass@1.",
        "A real head-to-head against MetaGPT, AutoAgents, DyLAN, or AgentVerse is deferred.",
      ],
    },
  ],
  ledger: [
    {
      id: 16,
      term: "The replica missed the pre-registered floor",
      kind: "estimate",
      number: "+0.0077 vs a +0.015 floor",
      anchor: "where-the-rule-pays",
    },
    {
      id: 17,
      term: "LLM-generated streams: honest null",
      kind: "result",
      number: "0 of 3",
      anchor: "where-the-rule-pays",
    },
    {
      id: 18,
      term: "Both drifts together",
      kind: "hypothesis",
      anchor: "where-the-rule-pays",
      expected: "positive",
      measured: "−0.0007 [−0.0047, +0.0032]",
      why: "rotating-demand interference with vocab-growth signal",
    },
    {
      id: 19,
      term: "Different admissions, identical coverage",
      kind: "result",
      number: "67.5 % on v1 LLM, 84.4 % on v2_drift",
      anchor: "where-the-rule-pays",
    },
    {
      id: 20,
      term: "Uniform marginal gain does not beat the baseline",
      kind: "mechanism",
      number: "−0.0030 [−0.0070, +0.0010]",
      anchor: "ablations",
    },
    {
      id: 21,
      term: "The shipped γ is not the sweep maximum",
      kind: "estimate",
      number: "+0.0070 shipped, +0.0072 at the maximum",
      anchor: "ablations",
    },
    {
      id: 22,
      term: "No head-to-head against the real frameworks",
      kind: "result",
      number: "4 frameworks named, 0 run",
      anchor: "what-is-not-claimed",
    },
    {
      id: 23,
      term: "pass@1-proxy is coverage, not pass@1",
      kind: "result",
      anchor: "what-is-not-claimed",
    },
  ],
};

export const publications: Publication[] = [conoid, ...(PMR_PUBLIC ? [sheafReputation] : [])];

/**
 * While PMR_PUBLIC is false the paper is still listed on the home page, by
 * its title, the line its own Figure 1 caption uses, and its status — and
 * nothing else: no number, no PDF, no author line, no case page. A reader
 * cannot check a manuscript they cannot read, so the listing states only
 * what needs no checking. Set PMR_LISTED to false to drop even that.
 */
export const PMR_LISTED = true;

export interface Listing {
  title: string;
  subtitle: string;
  status: string;
}

export const listings: Listing[] =
  PMR_LISTED && !PMR_PUBLIC
    ? [{ title: sheafReputation.title, subtitle: sheafReputation.subtitle, status: sheafReputation.status }]
    : [];

/** Total negative results on the site, derived from the ledgers so the numeral and the rows cannot disagree. */
export const negativeCount =
  systems.reduce((n, s) => n + shownLedger(s.ledger).length, 0) +
  publications.reduce((n, p) => n + shownLedger(p.ledger ?? []).length, 0);

const LEDGER_KIND_PLURALS: Record<LedgerKind, string> = {
  mechanism: "mechanisms",
  result: "results",
  hypothesis: "hypotheses",
  estimate: "estimates",
  bug: "bugs",
};

/** Ledger entries counted by kind, in legend order; `noun` already agrees with the count. */
export const ledgerKinds: { kind: LedgerKind; count: number; noun: string }[] = (
  ["mechanism", "result", "hypothesis", "estimate", "bug"] as LedgerKind[]
).map((kind) => {
  const count =
    systems.reduce((n, s) => n + shownLedger(s.ledger).filter((e) => e.kind === kind).length, 0) +
    publications.reduce((n, p) => n + shownLedger(p.ledger ?? []).filter((e) => e.kind === kind).length, 0);
  return { kind, count, noun: count === 1 ? kind : LEDGER_KIND_PLURALS[kind] };
});

/* ------------------------------------------------------------------ *
 * Education
 * ------------------------------------------------------------------ */

export const education = {
  school: "National University of Sciences and Technology (NUST)",
  short: "NUST",
  degree: "BS, Computer Science",
  period: "2022 — 2026",
} as const;

/* ------------------------------------------------------------------ *
 * Priors. The owner supplied these verbatim on 2026-09-23 and they are
 * reproduced as he stated them. The home page prints the ones marked
 * `home` — two national rankings with a clear denominator — on the NUST
 * row. The rest stay in the data: a MAANG reader discounts school-exam
 * ranks, and "top 15 from Pakistan" at the IMO reads as the selection camp
 * (Pakistan sends six). Mark any of them `home: true` to print it.
 * ------------------------------------------------------------------ */

export interface Prior {
  label: string;
  /** The placing. The numeral is the only part that carries. */
  rank: string;
  /** Printed on the home page's NUST row. */
  home?: boolean;
}

export const priors: Prior[] = [
  { label: "International Mathematical Olympiad", rank: "top 15 from Pakistan" },
  { label: "Engineering College Admission Test", rank: "2nd nationwide", home: true },
  { label: "NUST Entry Test", rank: "4th nationwide", home: true },
  { label: "Matriculation", rank: "3rd, 97.27 %" },
  { label: "AIESEC programming contest", rank: "2nd of 100+ universities" },
  { label: "Softec Hackathon, FAST", rank: "2nd" },
  { label: "National Science Talent Contest", rank: "qualifier" },
];

export const metaDescription =
  "Zain Ali — VP Engineering & Product at Alexein AI. Reinforcement learning, world models, and the memory and inference systems agents need to improve with use.";
