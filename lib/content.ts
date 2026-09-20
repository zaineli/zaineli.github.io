/* ------------------------------------------------------------------ *
 * Content model. Pages render this; nothing else holds copy.
 *
 * Every number on this site is one someone could check. Benchmark
 * figures come from a script in the corresponding repository, role
 * outcomes are the ones on the record, and where a result is a negative
 * one it is stated as a negative one.
 * ------------------------------------------------------------------ */

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export const profile = {
  name: "Zain Ali",
  /** Lowercase wordmark used in the nav. */
  wordmark: "zain ali",
  role: "VP Engineering & Product",
  company: "Alexein AI",
  location: "California, United States",
  email: "zali.bscs22seecs@seecs.edu.pk",

  /** One line under the name. */
  standfirst: "Reinforcement learning, world models, and the memory and inference systems agents need to improve with use.",

  /** Two paragraphs. The first says what the work is; the second, how it is done. */
  bio: [
    "I build the parts of an agent that persist. Most agent systems are stateless: a team is assembled, an answer is produced, and nothing about what worked survives into the next run. My work is on the layer underneath that — per-skill reputation that conditions future decisions, memory architectures modelled on hippocampal consolidation rather than on a vector index, and the inference machinery that makes any of it affordable to run.",
    "I read the paper and then build the system, and I report what the measurements actually said. Several of the results below are negative: a mechanism that turned out to be a no-op, a technique that reduces work by 1.9× and is still slower in wall clock. Those are in the write-ups with the numbers that show it, because a portfolio of only successes is not evidence of judgement.",
  ],

  focus: ["Reinforcement learning", "World models", "Memory architectures", "Recursive self-improvement", "Inference engineering"],
} as const;

export const links: Link[] = [
  { label: "GitHub", href: "https://github.com/zaineli", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zain-ali-43090a283", external: true },
  { label: "Email", href: "mailto:zali.bscs22seecs@seecs.edu.pk" },
];

/* ------------------------------------------------------------------ *
 * Research interests — thematic, not a keyword list.
 * ------------------------------------------------------------------ */

export interface Interest {
  title: string;
  tag: string;
  body: string;
}

export const interests: Interest[] = [
  {
    title: "Memory and consolidation",
    tag: "Hippocampal architectures · agent persistence",
    body: "Flat vector stores fail on long-horizon agent memory in two diagnosable ways: they cannot separate confusable near-duplicates, and they cannot answer a question whose answer was never inside any single stored item. Both have a well-studied biological solution — pattern separation, conjunctive coding, and a slow store built by replay rather than by writing. I am interested in which parts of that account are load-bearing when you actually implement them, and which turn out to be decoration.",
  },
  {
    title: "World models and search",
    tag: "Reinforcement learning · planning · abduction",
    body: "I do not think scaling language models alone gets us to general capability. What seems to be missing is the thing people do without effort: build a model of the situation, search through it, and revise when the world disagrees. That is abduction, and it is closer to what reinforcement learning with a learned world model is reaching for than to next-token prediction. My interest is in agents that carry an explicit model of their environment and are corrected by outcomes rather than by preference labels.",
  },
  {
    title: "Self-improving systems",
    tag: "Reputation · structured critique · recursive self-improvement",
    body: "Self-improvement is usually framed as free-form reflection, which is hard to audit and easy to game. I work on the alternative: treat it as a bounded state transition. A structured judge proposes deltas to typed channels — profile, memory, social graph, per-skill reputation — each committed by a deterministic apply rule under explicit caps, so the update is inspectable and an adversarial agent cannot inflate its own standing. This is the subject of CONOID.",
  },
  {
    title: "Inference engineering",
    tag: "Paged attention · scheduling · speculative decoding",
    body: "Serving is where research either becomes affordable or does not ship. The interesting constraints are memory-side: KV cache allocation decides batch size, batch size decides throughput, and the scheduling policy decides whether tail latency is bounded. I am interested in the cost models that tell you in advance whether a technique will pay — several do not, at the scale you are actually running.",
  },
];

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */

export interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  /** Short framing line, rendered above the bullets. */
  summary?: string;
  points: string[];
  stack?: string[];
}

export const experience: Role[] = [
  {
    company: "Alexein AI",
    title: "VP Engineering & Product",
    period: "Jul 2026 — Present",
    location: "California, United States",
    summary:
      "Architecting agents that build a model of the world, search through it, and get corrected by what actually happens — rather than larger language models.",
    points: [
      "Lead engineering and product for an agent platform built on reinforcement learning and world models rather than prompt pipelines.",
      "Own the technical direction across the research and serving stack, from what gets modelled to what it costs to run.",
    ],
    stack: ["RL", "World models", "Search", "Behavioural cloning"],
  },
  {
    company: "ImagineArt",
    title: "Machine Learning Engineer",
    period: "Apr 2026 — Jul 2026",
    location: "Islamabad, Pakistan",
    summary:
      "Shipped Imagine-Sites, a prompt-to-app builder inside Chatly's Omni-Agent, and rebuilt the execution pipeline underneath it.",
    points: [
      "Designed and shipped Imagine-Sites: one prompt produces generated code, an automated GitHub commit, a live deployment, and a preview thumbnail.",
      "Evaluated DeerFlow, Hermes, OpenHands and Codex, then replaced the research-oriented agent loop with a parallel execution architecture on warm Modal sandboxes.",
      "Cut end-to-end generation latency roughly 4×: 45 → 13 minutes full-stack, 20 → 5 minutes frontend.",
    ],
    stack: ["Agent orchestration", "Modal", "TypeScript", "CI/CD"],
  },
  {
    company: "Victreat Health Tech",
    title: "RL / Agentic Systems Engineer",
    period: "Nov 2025 — May 2026",
    location: "Islamabad, Pakistan",
    summary:
      "Built a self-evolving extraction system trained against an LLM-as-judge reward, and a segmentation model trained entirely on synthetic data.",
    points: [
      "Architected a self-evolving reinforcement-learning web crawler with dynamic policy optimisation across 10,000+ sites, reaching 84% faster extraction through continuous DOM-pattern learning.",
      "Built a GPT-4 LLM-as-judge reward system to train the RL planner, lifting extraction success from 67% to 91.3% via autonomous self-correction.",
      "Fine-tuned Meta's SAM3 for scientific-diagram segmentation on a fully synthetic dataset — Voronoi tessellations, graph layouts, topological surfaces — improving mIoU from 0.51 to 0.87 on out-of-distribution research figures.",
    ],
    stack: ["PyTorch", "RL", "LLM-as-judge", "SAM3"],
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
}

export interface SystemSection {
  heading: string;
  paragraphs?: string[];
  /** Optional results table: header row plus body rows. */
  table?: { head: string[]; rows: string[][]; caption?: string };
  /** Optional pulled-out list, e.g. negative results. */
  list?: { term: string; detail: string }[];
}

export interface System {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  /** One-paragraph abstract for the index. */
  abstract: string;
  /** Headline numbers shown on the card. */
  metrics: Metric[];
  repo: string;
  tags: string[];
  /** Long-form case study. */
  sections: SystemSection[];
}

export const systems: System[] = [
  {
    slug: "engram",
    name: "engram",
    tagline: "A hippocampal–neocortical memory architecture for long-horizon agents",
    year: "2026",
    abstract:
      "Vector stores fail on agent memory in two specific ways: they cannot separate confusable near-duplicates, and they cannot answer a question whose answer was never in any single stored item. engram implements the biological account of both — dentate pattern separation, CA3 conjunctive coding and attractor completion, and a neocortical schema store built by prioritised replay. Benchmarked against flat-vector, BM25 and hybrid RAG on 800 episodes and 466 queries, with every mechanism separately ablated.",
    metrics: [
      { label: "top-1 vs flat vector", value: "0.790 / 0.330", emphasis: true },
      { label: "conjunctive binding Δ", value: "−0.358 ablated" },
      { label: "CA3 recall @ 90% cue deletion", value: "1.000" },
    ],
    repo: "https://github.com/zaineli/engram",
    tags: ["Memory", "Neuroscience", "Retrieval", "Python"],
    sections: [
      {
        heading: "The failure it starts from",
        paragraphs: [
          "Take 125 incident reports of the form \"On {day} the {service} service suffered {fault} during the rollout.\" Mean pairwise cosine across the set is 0.465 and the maximum is 0.998 — to a sentence encoder these are nearly the same sentence, because they are. Ask \"What went wrong with the auth service on Monday?\" and dense cosine retrieves the right episode 4.0% of the time.",
          "The obvious fix is pattern separation: expand the embedding into a much larger, sparse population, as the dentate gyrus does. It works exactly as advertised — inputs at cosine 0.82 produce codes overlapping at 0.232 — and it does not fix retrieval. Measured on the same set it reaches 5.6%, within noise of cosine.",
          "That result is the most useful thing the project turned up. Expansion is injective: it can only separate what the input already distinguishes. A pooled vector represents the frame, not which value filled which slot. Stacking more expansion would have looked sophisticated and done nothing.",
        ],
      },
      {
        heading: "Conjunctive coding",
        paragraphs: [
          "CA3's recurrent network codes for combinations — this object, in this place, at this time — not for the elements separately. A conjunction is a distinct addressable unit, so auth-on-Monday is a different memory address from auth-on-Tuesday however similar the surface forms.",
          "The implementation is a sparse binding code: every unordered subset of content terms up to a given arity hashes to one unit in a 2¹⁶ binary space. A query naming auth and Monday activates the unit for that pair, which is active for exactly the episodes containing both. Retrieval becomes set intersection in conjunction space rather than angle comparison in embedding space.",
          "Top-1 goes 0.040 → 0.200 and MRR 0.165 → 0.457. Both are the ceiling for that query set: the queries name two of three attributes, five episodes are genuinely tied, and 0.457 is exactly the expected MRR of a uniform draw within a tied group of five. The pathway narrows to the correct equivalence class and then stops, because the question does not contain the answer.",
        ],
      },
      {
        heading: "Results",
        table: {
          head: ["task", "recency", "bm25", "flat-vector", "hybrid-rag", "engram"],
          rows: [
            ["episodic", "0.160", "1.000", "0.440", "0.553", "0.807"],
            ["interference", "0.187", "1.000", "0.200", "0.513", "0.867"],
            ["abstraction", "0.188", "0.500", "0.500", "0.500", "0.875"],
            ["temporal", "0.173", "0.333", "0.333", "0.333", "0.687"],
            ["overall", "0.174", "0.768", "0.330", "0.468", "0.790"],
          ],
          caption:
            "Top-1 accuracy, k=5, 800 episodes / 466 queries, all-MiniLM-L6-v2. Token-literal queries.",
        },
        paragraphs: [
          "BM25 scores 1.000 on the first two tasks and deserves to — \"week 14\", \"Saturday\" and \"Priya\" appear verbatim in the target. Reporting only this setting would be measuring a string index and calling it memory. Rewriting the queries as paraphrases, with referents unchanged, costs BM25 more than half its accuracy (0.768 → 0.354) while engram leads at 0.448. Leading in both settings is the claim; dominance in either is not.",
        ],
      },
      {
        heading: "What the ablation said",
        table: {
          head: ["removed", "Δ literal", "Δ paraphrased", "verdict"],
          rows: [
            ["conjunctive binding", "−0.358", "−0.084", "carries the system"],
            ["temporal reinstatement", "−0.114", "−0.017", "only thing answering sequence"],
            ["sleep / consolidation", "−0.013", "−0.006", "builds the schemas"],
            ["schema store", "−0.006", "−0.002", "−0.187 on abstraction alone"],
            ["semantic (dense)", "+0.009", "−0.028", "robustness, not accuracy"],
            ["theta context", "0.000", "0.000", "opt-in; needs explicit scope"],
            ["neurogenesis", "0.000", "0.000", "storage-side, measured separately"],
          ],
        },
        paragraphs: [
          "Removing the dense semantic pathway improves the token-literal score and degrades the paraphrased one. It is a robustness mechanism, not an accuracy one — a reason to keep it and a reason not to weight it highly. Theta context and neurogenesis move nothing here; neurogenesis is storage-side and measured directly instead, where it takes mean code overlap from 0.232 to 0.019 and population coverage from 16% to 74%.",
        ],
      },
      {
        heading: "Things that did not work",
        list: [
          {
            term: "Lateral inhibition in the dentate gyrus",
            detail:
              "Random sparse projections are already near-orthogonal. Measured Gram off-diagonal 0.020 against activation σ 1.00 — about 200× below the selection margin. It perturbs ~12% of selected units and buys no separation at all (0.2229 → 0.2255, marginally worse). Kept behind a default-zero flag, since it becomes relevant if the projection is ever learned.",
          },
          {
            term: "Eviction coupled to promotion",
            detail:
              "An early version released the hippocampal trace as soon as a schema absorbed it. A schema answers what usually happens and can never answer what happened on Tuesday, so this destroyed episodic detail at the exact moment generalisation began — catastrophic forgetting produced by the architecture that exists to prevent it. Eviction is now capacity-driven and never drops an unconsolidated trace.",
          },
          {
            term: "DG/CA3 as a ranking pathway",
            detail:
              "0.056 top-1, no better than cosine. Retained for what it is good at: storage separation, and completion from a degraded code — 100% recovery from 90% cue deletion, flat from 400 to 4,000 stored patterns.",
          },
        ],
      },
    ],
  },
  {
    slug: "spindle",
    name: "spindle",
    tagline: "A paged-attention inference engine with continuous batching and speculative decoding",
    year: "2026",
    abstract:
      "An inference engine built from the memory manager up: block-paged KV cache with copy-on-write sharing, iteration-level scheduling with preemption, and lossless speculative decoding — over a from-scratch GPT-2 forward pass, because the interesting parts are exactly the parts a generate() API owns and hides. Correctness is pinned against HuggingFace: greedy output token-identical, prefill logits within 2e-3.",
    metrics: [
      { label: "continuous vs static batching", value: "2.05× throughput", emphasis: true },
      { label: "paged vs contiguous peak memory", value: "2.50× lower" },
      { label: "p99 TTFT", value: "5262 → 2447 ms" },
    ],
    repo: "https://github.com/zaineli/spindle",
    tags: ["Inference", "Systems", "PyTorch", "CUDA-adjacent"],
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

export const systemBySlug = (slug: string): System | undefined =>
  systems.find((s) => s.slug === slug);

/* ------------------------------------------------------------------ *
 * Publications
 * ------------------------------------------------------------------ */

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  status: string;
  abstract: string;
  links?: Link[];
  /** Shown when there is no public link yet. */
  note?: string;
}

export const publications: Publication[] = [
  {
    title:
      "CONOID: Persistent Per-Skill Reputation and Multi-Channel Judge Feedback for LLM-Agent Organizations",
    authors: "Zain Ali, Muhammad Ahmed Mohsin",
    venue: "Machvis Lab, NUST · SAIL, Stanford",
    year: "2026",
    status: "Preprint · under review",
    abstract:
      "Multi-agent frameworks make it cheap to instantiate agents and have them coordinate, but treat each run as disposable — almost no structured evidence survives into the next assignment. CONOID maintains a persistent agent population carrying profiles, tiered memories, signed social edges, and a per-skill Beta-reputation posterior, updated by a structured judge under per-channel guardrails. On a 691,200-row oracle-backed benchmark, static role assignment is the best non-oracle policy when profiles are reliable, while reputation-plus-exploration wins when profiles are weak (85.2% vs 75.5%) or adversarially noisy (65.9% vs 44.2%). A separate coordinator replay isolates answer aggregation as a distinct failure mode: schema-constrained aggregation drops accuracy from 0.839 to 0.586 where deterministic slot assembly recovers 0.992.",
    // No public PDF in the repo yet. Drop the preprint at
    // public/conoid/preprint.pdf and replace this with:
    //   links: [{ label: "PDF", href: "/conoid/preprint.pdf", external: true }],
    note: "Preprint available on request",
  },
];

/* ------------------------------------------------------------------ *
 * Education
 * ------------------------------------------------------------------ */

export const education = {
  school: "National University of Sciences and Technology (NUST)",
  degree: "BS, Computer Science",
  period: "2020 — 2024",
} as const;

export const metaDescription =
  "Zain Ali — VP Engineering & Product at Alexein AI. Reinforcement learning, world models, and the memory and inference systems agents need to improve with use.";
