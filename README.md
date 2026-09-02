# GenSoC, Explained

An interactive, beginner-oriented review of:

> **GenSoC: A Multi-Agent-Assisted SoC Generation Methodology Leveraging Open-Source Hardware**
> Peiran Yan, Qinzhe Zhi, Lifeng Liu, Tianyu Jia — Peking University
> ISLPED 2025 · DOI [10.1109/ISLPED65674.2025.11261756](https://doi.org/10.1109/ISLPED65674.2025.11261756)

The site teaches the paper to a programmer with no chip-design background — starting at "what is a
CPU?" and ending at how the paper's state-machine signal comparison method locates a bug in
generated RTL.

**Live site:** https://pepaps.github.io/Gensoc/

---

## What's in here

| | |
|---|---|
| 22 pages | Background → method → evaluation → critique → reproduction guide |
| 6 interactive diagrams | Clickable SoC explorer, agent handoff, FSM animator, VALID/READY waveform editor, 21-phase pipeline stepper, Fig. 5 debugging walkthrough |
| 2 charts | Recreations of the paper's Fig. 7 and Fig. 8 |
| 60+ glossary terms | Every acronym, defined once, surfaced as hover tooltips site-wide |
| [`docs/PAPER_REVIEW.md`](docs/PAPER_REVIEW.md) | The same review as a standalone written document |

## The rule this project is built around

Every substantive statement on the site carries one of four provenance labels, rendered by a single
shared component ([`src/components/Claim.tsx`](src/components/Claim.tsx)):

| Label | Meaning |
|---|---|
| **From paper** | The paper states this. A section, table or figure is cited. |
| **Background** | Domain knowledge added by this review so the paper makes sense. Not a claim about GenSoC. |
| **Inference** | This review's reading. Reasonable, but the paper does not say it outright. |
| **Not specified** | A question the paper leaves open — named, not filled in with a guess. |

Consequences that shaped the code:

- **No invented facts.** No fabricated RTL, agent prompts, MetaGPT class structures, benchmark
  numbers or section citations. Where the paper is silent, the site says so.
- **Every number is traceable.** All quantitative claims live in
  [`src/data/paperResults.ts`](src/data/paperResults.ts), each tied to a specific table or figure.
  Nothing is estimated by eye off a chart.
- **Normalized values stay normalized.** The 27.18× and 29.67× figures are ratios. The site never
  presents them as measured joules, and the charts are labelled accordingly.
- **Terminology is centralised.** Definitions exist only in
  [`src/data/glossary.ts`](src/data/glossary.ts) and are surfaced through the `<T>` component. No
  page hand-writes a definition.
- **No figures are reproduced.** Every diagram is an original drawing explaining the same concept.

## Local development

Requires Node 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the built output locally
npm run typecheck  # types only
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds and publishes `dist/` to GitHub Pages.

One-time repository setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### The base path

This is the failure mode to watch for. The site is served from a *project* page
(`https://pepaps.github.io/Gensoc/`), so Vite's `base` must be `/Gensoc/` or every asset 404s
against the domain root. It is set in [`vite.config.ts`](vite.config.ts) and overridable:

```bash
BASE_PATH=/ npm run build          # user/org page, or a custom domain
BASE_PATH=/other-name/ npm run build   # if the repository is renamed
```

Routing uses `HashRouter` deliberately. GitHub Pages serves static files only, so a deep link such
as `/pipeline` on a `BrowserRouter` would 404 before React ever loaded. Hash routing avoids that
without a `404.html` redirect shim.

## Project structure

```
src/
├── components/
│   ├── Claim.tsx           provenance labels — the project's core device
│   ├── charts/             Recharts recreations of Fig. 7 and Fig. 8
│   ├── diagrams/           original SVG diagrams + shared primitives
│   ├── glossary/Term.tsx   the <T> hover-tooltip component
│   ├── interactive/        FSM animator, handshake editor, steppers, IP selector
│   └── navigation/         layout, sidebar, theme toggle, prev/next
├── data/                   ← all facts live here, no exceptions
│   ├── glossary.ts         60+ terms
│   ├── paperResults.ts     every number, tied to its table or figure
│   ├── ipLibrary.ts        Table I + the Example 1 selection reasoning
│   ├── pipelineSteps.ts    the 21 phases and the agent handoffs
│   ├── agents.ts           the three agents and the IP description levels
│   ├── critique.ts         novelty claims and limitations
│   ├── reproduction.ts     the ten-level beginner ladder
│   ├── references.ts       paper bibliography, kept separate from background sources
│   └── nav.ts              site structure
├── pages/                  one file per route
└── styles/global.css       design tokens, light + dark
```

## Accessibility and theming

- Light, dark and system themes. The full palette is defined on bare `:root`, with dark redefined
  for both `prefers-color-scheme` and an explicit `data-theme` toggle — no colour is defined only
  inside a media query.
- Glossary tooltips are `<button>` elements, so they work by keyboard and touch as well as hover.
- Wide tables and diagrams scroll inside their own containers; the page body never scrolls
  horizontally.
- `prefers-reduced-motion` is respected.

## Licence and attribution

Site content and code: [MIT](LICENSE).

This is an independent educational review. It is not affiliated with the authors, Peking University,
or IEEE, and it reproduces none of the paper's figures or text beyond short quotations for the
purpose of commentary. Please read the original paper — it is four pages, and this site is not a
substitute for it.
