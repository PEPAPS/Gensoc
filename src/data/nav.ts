export type NavItem = { path: string; label: string; short?: string };
export type NavGroup = { group: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    group: 'Start here',
    items: [
      { path: '/', label: 'Home' },
      { path: '/tldr', label: 'The paper in 2 minutes', short: '2-minute version' },
      { path: '/problem', label: 'The problem' },
    ],
  },
  {
    group: 'Background',
    items: [
      { path: '/basics', label: 'Hardware basics' },
      { path: '/protocols', label: 'Buses & protocols' },
      { path: '/rtl', label: 'RTL, simulation & synthesis' },
    ],
  },
  {
    group: 'How GenSoC works',
    items: [
      { path: '/gensoc', label: 'What is GenSoC?' },
      { path: '/architecture', label: 'Architecture overview' },
      { path: '/agents/ip-library-manager', label: 'Agent 1 — IP Library Manager', short: 'Agent 1 — Manager' },
      { path: '/agents/soc-integrator', label: 'Agent 2 — SoC Integrator', short: 'Agent 2 — Integrator' },
      { path: '/agents/soc-validator', label: 'Agent 3 — SoC Validator', short: 'Agent 3 — Validator' },
      { path: '/pipeline', label: 'End-to-end pipeline' },
      { path: '/verification', label: 'Verification deep dive' },
    ],
  },
  {
    group: 'Evaluation',
    items: [
      { path: '/cases/edge-ai', label: 'Case A — Edge AI' },
      { path: '/cases/mobile', label: 'Case B — Mobile computing', short: 'Case B — Mobile' },
      { path: '/setup', label: 'Experimental setup' },
      { path: '/results', label: 'Results' },
      { path: '/interpretation', label: 'What the results mean' },
    ],
  },
  {
    group: 'Reading it critically',
    items: [
      { path: '/limitations', label: 'Limitations & open questions', short: 'Limitations' },
      { path: '/reproduce', label: 'Beginner reproduction guide', short: 'Reproduction guide' },
    ],
  },
  {
    group: 'Reference',
    items: [
      { path: '/figures', label: 'Paper figures explained' },
      { path: '/glossary', label: 'Glossary' },
      { path: '/references', label: 'References' },
    ],
  },
];

export const flatNav: NavItem[] = navGroups.flatMap((g) => g.items);

export function neighbours(path: string) {
  const i = flatNav.findIndex((n) => n.path === path);
  return {
    prev: i > 0 ? flatNav[i - 1] : undefined,
    next: i >= 0 && i < flatNav.length - 1 ? flatNav[i + 1] : undefined,
  };
}
