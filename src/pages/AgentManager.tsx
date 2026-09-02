import { useState } from 'react';
import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';
import { IpSelectorDemo } from '../components/interactive/IpSelectorDemo';
import { agents, ipDescriptionLevels } from '../data/agents';
import { ipCategories, ipEntries, type IpCategoryId } from '../data/ipLibrary';

const agent = agents[0];

function IpLibraryBrowser() {
  const [filter, setFilter] = useState<IpCategoryId | 'ALL'>('ALL');
  const shown = filter === 'ALL' ? ipEntries : ipEntries.filter((e) => e.category === filter);
  const totalShown = filter === 'ALL' ? ipCategories.reduce((s, c) => s + c.count, 0) : ipCategories.find((c) => c.id === filter)!.count;

  return (
    <>
      <div className="controls">
        <button type="button" className={`btn ${filter === 'ALL' ? 'btn--on' : ''}`} onClick={() => setFilter('ALL')}>
          All categories
        </button>
        {ipCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`btn ${filter === c.id ? 'btn--on' : ''}`}
            onClick={() => setFilter(c.id)}
          >
            {c.label} <span className="muted">({c.count})</span>
          </button>
        ))}
      </div>

      {filter !== 'ALL' &&
        (() => {
          const c = ipCategories.find((x) => x.id === filter)!;
          return (
            <p className="small muted">
              <T k={c.glossaryTerm}>
                <strong>{c.label}</strong>
              </T>{' '}
              — {c.whatItIs}
            </p>
          );
        })()}

      <p className="small muted">
        Showing the {shown.length} representative entries Table I names, out of {totalShown} the
        paper counts in {filter === 'ALL' ? 'all categories' : 'this category'}. The paper does not
        list the rest, so neither does this site.
      </p>

      <div className="grid grid-2">
        {shown.map((e) => (
          <div className="card" key={e.name} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h4 style={{ margin: 0 }}>{e.name}</h4>
              <span className="chip">{e.category === 'IO' ? 'I/O' : e.category}</span>
              {e.usedIn?.map((c) => (
                <span key={c} className={`chip chip--${c === 'A' ? 'a' : 'b'}`}>
                  Case {c}
                </span>
              ))}
            </div>
            <p className="small muted" style={{ marginBottom: e.paperNote ? '0.5rem' : 0 }}>
              {e.background}
            </p>
            {e.paperNote && (
              <p className="small" style={{ marginBottom: 0, color: 'var(--paper)' }}>
                <b>In the paper:</b> <span className="muted">{e.paperNote}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default function AgentManager() {
  return (
    <div className="page agent-manager">
      <span className="agent-badge">Agent 1</span>
      <h1 style={{ marginTop: '0.5rem' }}>IP Library Manager</h1>
      <p className="lede">{agent.oneLine}</p>

      <Claim kind="paper" source={agent.paperSection}>
        The IP library manager first refines — that is, reorganises OSH IPs to a unified style — the
        existing open-source code and documentation, using online resources and its own expertise.
        The refined materials are stored into the constructed IP library. When generating an SoC,
        users state their requirements in natural language and the manager explores the library for
        SoC design solutions.
      </Claim>

      <h2>Two jobs, not one</h2>
      <Figure caption="Library construction happens once, offline. Selection happens per request. The same agent does both, but they are different activities.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 220" width="100%" style={{ minWidth: 480 }} role="img" aria-label="Library construction and IP selection">
            <Defs />
            <text x={20} y={16} className="svg-label--sm">
              Job 1 — build the library (once)
            </text>
            <Box x={10} y={24} w={124} h={44} label="OSH on GitHub" sub="90+ IPs" />
            <Arrow d="M 138 46 L 162 46" />
            <Box x={166} y={24} w={130} h={44} label="Refine" sub="unify style, annotate" />
            <Arrow d="M 300 46 L 324 46" />
            <Box x={328} y={24} w={130} h={44} label="Describe" sub="3 levels" />
            <Arrow d="M 462 46 L 486 46" />
            <Box x={490} y={24} w={100} h={44} label="Classify" sub="5 categories" />

            <Arrow d="M 300 72 L 300 96" accent />
            <Box x={190} y={100} w={220} h={40} label="Structured IP library" />

            <text x={20} y={168} className="svg-label--sm">
              Job 2 — select for a request (per SoC)
            </text>
            <Box x={10} y={176} w={150} h={40} label="User requirement" sub="natural language" />
            <Arrow d="M 164 196 L 194 196" />
            <Box x={198} y={176} w={190} h={40} label="Reasoning table" sub="hard then soft constraints" />
            <Arrow d="M 392 196 L 422 196" accent />
            <Box x={426} y={176} w={164} h={40} label="Design plan" />
            <Arrow d="M 300 144 L 300 172" dashed />
          </svg>
        </div>
      </Figure>

      <h2>The three-level description method</h2>
      <p>
        Each IP is abstracted into a tree, where each node is a module’s design code and its
        documentation, and each edge is the hierarchy between modules. Descriptions exist at three
        levels of abstraction — and which level an agent reads depends on what it is trying to decide.
      </p>

      <Figure caption="The levels are not redundancy. Selection needs level 1; integration needs level 2; modification needs level 3.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 200" width="100%" style={{ minWidth: 460 }} role="img" aria-label="Three-level IP description hierarchy">
            <Defs />
            <Box x={200} y={10} w={200} h={40} label="1 — IP level" sub="what this block is" stroke="var(--c1)" />
            <Arrow d="M 300 52 L 300 72" />
            <Box x={140} y={76} w={320} h={40} label="2 — Module level" sub="how its submodules connect" stroke="var(--c2)" />
            <Arrow d="M 300 118 L 300 138" />
            <Box x={80} y={142} w={440} h={40} label="3 — Code level" sub="the RTL itself, reorganised and annotated" stroke="var(--c3)" />
            <text x={20} y={34} className="svg-label--sm">
              read by
            </text>
            <text x={20} y={48} className="svg-label--sm">
              the manager
            </text>
            <text x={470} y={100} className="svg-label--sm">
              read by the
            </text>
            <text x={470} y={114} className="svg-label--sm">
              integrator
            </text>
            <text x={20} y={196} className="svg-label--sm">
              read when something has to be changed or debugged
            </text>
          </svg>
        </div>
      </Figure>

      {ipDescriptionLevels.map((l) => (
        <div className="card" key={l.level}>
          <h4 style={{ marginTop: 0 }}>
            Level {l.level} — {l.name}
          </h4>
          <p className="small muted">{l.scope}</p>
          <ul className="small">
            {l.contents.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="small" style={{ marginBottom: 0 }}>
            <strong>Why it matters:</strong> {l.whyItMatters}
          </p>
        </div>
      ))}

      <Claim kind="inference">
        The underlying observation is a practical one about working with models: an LLM should not
        have to read an entire repository to answer “is this CPU low-power enough?”. Structuring the
        description by abstraction level means each question can be answered at the cheapest level
        that can answer it — which is what makes a 90+ IP library workable at all.
      </Claim>

      <h2>The library — Table I</h2>
      <p>
        More than 90 open-source IPs were retrieved and reorganised across five categories. Table I
        names a representative subset.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th className="num">Count</th>
              <th>Representative IPs named in Table I</th>
            </tr>
          </thead>
          <tbody>
            {ipCategories.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.label}</strong>
                </td>
                <td className="num">{c.count}</td>
                <td className="small">
                  {ipEntries
                    .filter((e) => e.category === c.id)
                    .map((e) => e.name)
                    .join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <IpLibraryBrowser />

      <h2>How selection actually works</h2>
      <p>
        When a request arrives, the manager runs a reasoning process in tabular format. Candidates
        are judged against <T k="hard constraint">hard constraints</T> that eliminate, and{' '}
        <T k="soft constraint">soft constraints</T> that rank.
      </p>

      <IpSelectorDemo />

      <h2>What the paper does not specify</h2>
      <Claim kind="unspecified">
        <ul style={{ marginBottom: 0 }}>
          {agent.notSpecified.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Claim>

      <Claim kind="inference">
        The library construction step is the one that most invites scepticism. “Refine 90+
        open-source repositories into a unified style, with accurate interface tables and PPA data”
        is an enormous amount of work, and the quality of everything downstream depends on it being
        right. The paper attributes it to the agent using online resources and its own expertise. How
        much human supervision that involved, and how the resulting descriptions were checked for
        accuracy, is not stated.
      </Claim>
    </div>
  );
}
