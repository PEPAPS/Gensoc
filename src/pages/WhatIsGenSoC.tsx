import { Link } from 'react-router-dom';
import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';
import { noveltyClaims } from '../data/critique';

export default function WhatIsGenSoC() {
  return (
    <div className="page">
      <p className="eyebrow">How GenSoC works</p>
      <h1>What is GenSoC?</h1>
      <p className="lede">
        A methodology, not a product: a way of arranging LLM agents, structured hardware
        descriptions, protocol knowledge and EDA scripts so that a natural-language request can
        become a verified SoC design.
      </p>

      <Claim kind="paper" source="Abstract; Section III">
        The paper presents an LLM-based multi-agent assisted SoC design methodology, which utilises
        LLM agents to automatically and intelligently select, integrate and verify SoC design. Three
        agents are deployed — IP library manager, SoC integrator, SoC validator — each pre-configured
        with unique guidelines and toolsets for its design step.
      </Claim>

      <h2>Three phases, three agents</h2>
      <Figure caption="The paper's Fig. 2 divides the framework into these three panels. Each phase has one agent responsible for it.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 120" width="100%" style={{ minWidth: 480 }} role="img" aria-label="Three phases of GenSoC">
            <Defs />
            <Box x={10} y={30} w={175} h={58} label="A — IP refinement" sub="and selection" stroke="var(--c1)" />
            <Arrow d="M 189 59 L 207 59" />
            <Box x={211} y={30} w={175} h={58} label="B — SoC integration" sub="protocol-driven" stroke="var(--c2)" />
            <Arrow d="M 390 59 L 408 59" />
            <Box x={412} y={30} w={178} h={58} label="C — SoC verification" sub="simulate, compare, revise" stroke="var(--c3)" />

            <text x={97} y={20} textAnchor="middle" className="svg-label--sm">
              IP Library Manager
            </text>
            <text x={298} y={20} textAnchor="middle" className="svg-label--sm">
              SoC Integrator
            </text>
            <text x={501} y={20} textAnchor="middle" className="svg-label--sm">
              SoC Validator
            </text>

            <text x={300} y={110} textAnchor="middle" className="svg-label--sm">
              agents observe their predecessors’ actions — the collaboration is in the artifacts, not in conversation
            </text>
          </svg>
        </div>
      </Figure>

      <h2>What makes it a system rather than three prompts</h2>
      <p>
        Four mechanisms hold the framework together, and each is stated in the paper:
      </p>

      <div className="card">
        <h4 style={{ marginTop: 0 }}>1. Pre-defined guidelines and prompts</h4>
        <p style={{ marginBottom: 0 }}>
          Each agent is configured with behavioural guidelines intended to prevent deviation during
          reasoning. The paper gives one example in prose: the IP library manager must finish
          processing all IP information before moving on.
        </p>
      </div>

      <div className="card">
        <h4 style={{ marginTop: 0 }}>2. Hierarchical <T k="RAG" /></h4>
        <p style={{ marginBottom: 0 }}>
          Agents access the IP library by first identifying IP types, then retrieving details. A
          90+ IP library does not fit in a prompt, and does not need to — the type-level pass narrows
          the field before anything detailed is loaded.
        </p>
      </div>

      <div className="card">
        <h4 style={{ marginTop: 0 }}>3. Script-wrapped tools</h4>
        <p style={{ marginBottom: 0 }}>
          Compilation and simulation tools lack suitable APIs, so their commands are encapsulated in
          scripts. Agents adapt and execute those scripts, and store output files in specific
          locations for other agents to read. This is the bridge between a language model and real
          EDA software.
        </p>
      </div>

      <div className="card">
        <h4 style={{ marginTop: 0 }}>4. Shared artifacts</h4>
        <p style={{ marginBottom: 0 }}>
          During the workflow, agents observe the actions of their predecessors. The design plan, the
          integration documents and the extracted protocol rules are all produced by one agent for
          another to consume.
        </p>
      </div>

      <Figure title="Tool execution — how an LLM drives an EDA tool" caption="The agents do not call an API. They edit and run scripts, then read the files those scripts leave behind.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 150" width="100%" style={{ minWidth: 460 }} role="img" aria-label="Agent to tool execution loop">
            <Defs />
            <Box x={10} y={50} w={120} h={50} label="LLM agent" />
            <Arrow d="M 134 75 L 164 75" accent />
            <Box x={168} y={50} w={140} h={50} label="Command script" sub="adapted, then run" />
            <Arrow d="M 312 75 L 342 75" />
            <Box x={346} y={50} w={130} h={50} label="Compiler /" sub="simulator" />
            <Arrow d="M 480 75 L 510 75" />
            <Box x={514} y={50} w={76} h={50} label="Output" sub="files" />
            <Arrow d="M 552 104 L 552 126 L 70 126 L 70 104" dashed />
            <text x={300} y={142} textAnchor="middle" className="svg-label--sm">
              the agent reads the result and decides what to do next
            </text>
          </svg>
        </div>
      </Figure>

      <h2>What is actually new here</h2>
      <p>
        Individually, most of the ingredients exist elsewhere. The paper’s contribution is the
        arrangement, plus one genuinely novel verification technique.
      </p>

      {noveltyClaims.map((n) => (
        <div className="card" key={n.n}>
          <h4 style={{ marginTop: 0 }}>
            {n.n}. {n.claim}
          </h4>
          <p style={{ marginBottom: '0.5rem' }}>{n.plain}</p>
          <p className="small muted" style={{ marginBottom: 0 }}>
            {n.context}
          </p>
        </div>
      ))}

      <Claim kind="inference">
        If you had to name the single most transferable idea, it is number 6. Converting a simulation
        into a structured record and comparing it against a machine-readable protocol specification
        turns a perception problem into a table-diffing problem — and table-diffing is something
        language models do reliably. That technique is not specific to SoC generation.
      </Claim>

      <p>
        <Link to="/architecture">Next: how the three agents fit together →</Link>
      </p>
    </div>
  );
}
