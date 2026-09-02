import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { Arrow, Box, Defs, Figure } from '../components/diagrams/svg';
import { FsmAnimator } from '../components/interactive/FsmAnimator';
import { HandshakeAnimator } from '../components/interactive/HandshakeAnimator';

const ADDRESS_MAP = [
  { range: '0x0000_0000 – 0x0000_FFFF', block: 'ROM', note: 'Boot code. The CPU starts fetching here at reset.' },
  { range: '0x1000_0000 – 0x1000_0FFF', block: 'UART', note: 'Serial port control and data registers.' },
  { range: '0x1000_1000 – 0x1000_1FFF', block: 'GPIO', note: 'Pin direction and value registers.' },
  { range: '0x2000_0000 – 0x2000_FFFF', block: 'NPU control', note: 'Accelerator configuration and status.' },
  { range: '0x8000_0000 – 0xBFFF_FFFF', block: 'DDR', note: 'External memory. The large region.' },
];

export default function Protocols() {
  return (
    <div className="page">
      <p className="eyebrow">Background</p>
      <h1>Buses, protocols and addresses</h1>
      <p className="lede">
        This page covers the vocabulary the integration and verification chapters depend on:{' '}
        <T k="AMBA" />, <T k="AXI" />, <T k="APB" />, the <T k="VALID/READY" /> handshake, state
        machines, address maps and registers.
      </p>

      <h2>AMBA — the family of standards</h2>
      <Claim kind="background">
        <T k="AMBA">AMBA (Advanced Microcontroller Bus Architecture)</T> is Arm’s family of on-chip
        communication standards. Its value is coordination: if two blocks from two unrelated projects
        both implement AXI correctly, they can be connected without either team having talked to the
        other. It is the reason an IP-reuse ecosystem is possible at all.
      </Claim>

      <div className="grid grid-3">
        <div className="card">
          <h4 style={{ marginTop: 0 }}>
            <T k="AXI" />
          </h4>
          <p className="small">
            The high-performance one. Separate address, data and response channels, bursts, multiple
            outstanding transactions. More logic, more bandwidth.
          </p>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Used for CPU-to-accelerator and memory paths.
          </p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>
            <T k="AXI-Lite" />
          </h4>
          <p className="small">
            AXI with the hard parts removed: no bursts, one transaction at a time. Same signal names,
            far less logic.
          </p>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Used for control and status registers.
          </p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>
            <T k="APB" />
          </h4>
          <p className="small">
            The simplest one. Few signals, no concurrency, easy to get right.
          </p>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Used for UARTs, timers, GPIO — anything low-bandwidth.
          </p>
        </div>
      </div>

      <Claim kind="paper" source="Section IV-B">
        The paper states the rule its integrator uses directly: APB is suitable for low-bandwidth
        peripherals, while AXI is preferred for high-bandwidth scenarios such as CPU–accelerator
        interactions.
      </Claim>

      <Figure caption="Bandwidth decides the protocol. Mixing them in one design is normal — which is exactly why bridges between them are needed.">
        <div className="figure-scroll">
          <svg viewBox="0 0 600 170" width="100%" style={{ minWidth: 460 }} role="img" aria-label="AXI for high bandwidth, APB for peripherals">
            <Defs />
            <Box x={20} y={20} w={120} h={48} label="CPU" />
            <Box x={440} y={20} w={140} h={48} label="NPU / GPU" />
            <Arrow d="M 144 44 L 436 44" accent />
            <text x={290} y={34} textAnchor="middle" className="svg-label--head svg-label" style={{ fill: 'var(--accent)' }}>
              AXI
            </text>
            <text x={290} y={62} textAnchor="middle" className="svg-label--sm">
              wide, bursty, high bandwidth
            </text>

            <Box x={20} y={100} w={120} h={48} label="CPU" />
            <Box x={440} y={100} w={140} h={48} label="UART / GPIO" />
            <Arrow d="M 144 124 L 436 124" />
            <text x={290} y={114} textAnchor="middle" className="svg-label--head svg-label">
              APB
            </text>
            <text x={290} y={142} textAnchor="middle" className="svg-label--sm">
              narrow, simple, low bandwidth
            </text>
          </svg>
        </div>
      </Figure>

      <h2>Master and slave</h2>
      <Claim kind="background">
        Every bus transaction has an initiator and a responder. The <T k="master" /> issues the
        address and says whether it wants to read or write; the <T k="slave" /> accepts and responds.
        A CPU is normally a master. A memory or peripheral is normally a slave. An accelerator is
        often both — a slave for its control registers, a master when it fetches its own data.
      </Claim>

      <h2>The VALID/READY handshake</h2>
      <p>
        This is the mechanism the paper’s debugging example turns on, so it is worth understanding
        properly. Two wires per channel. The sender raises VALID when it has something. The receiver
        raises READY when it can take something. The transfer happens on the clock edge where both
        are high.
      </p>

      <HandshakeAnimator />

      <Claim kind="background">
        The rule that prevents deadlock: a sender must not wait for READY before asserting VALID. A
        receiver may wait for VALID before asserting READY. Get that backwards on one side and the
        two blocks wait for each other forever — while each, examined alone, looks perfectly correct.
      </Claim>

      <h2>State machines</h2>
      <p>
        A protocol is not just a set of wires; it is a sequence. AXI’s write path moves through
        distinct states, and which signals may be asserted depends on which state you are in.
      </p>

      <FsmAnimator />

      <Claim kind="paper" source="Section IV-B">
        The paper’s integrator extracts read and write state-machine transition tables from the AMBA
        manual — current state, trigger signals, next state — along with signal dependencies such as
        “ARVALID must precede RVALID”, and the looser relationship that ARREADY is related to ARVALID
        but not strictly required to follow it.
      </Claim>

      <Claim kind="inference">
        That last distinction is the interesting one. Some ordering rules are mandatory and some are
        merely typical. A checker that treats every observed ordering as a rule would report false
        failures constantly, so encoding which dependencies are strict is what makes the comparison
        method usable. The paper gives two examples of this distinction but does not publish the full
        rule set.
      </Claim>

      <h2>Address maps</h2>
      <p>
        Hardware is programmed by writing to addresses. Each block gets a range; the interconnect
        routes an access to whichever block owns that range.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Address range</th>
              <th>Block</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {ADDRESS_MAP.map((r) => (
              <tr key={r.block}>
                <td>
                  <code>{r.range}</code>
                </td>
                <td>{r.block}</td>
                <td className="small muted">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">
        An illustrative map, not the paper’s. The paper states that its generated address mapping
        table adopts a hierarchical structure detailing each IP’s address information, and Fig. 4
        shows main regions containing sub-regions — but it does not publish the actual addresses.
      </p>

      <h2>Registers</h2>
      <p>
        Within a block’s range sit its <T k="register">registers</T> — small storage locations with
        defined meanings.
      </p>
      <pre>{`UART_BASE + 0x00   DATA     write a byte here to transmit it
UART_BASE + 0x04   STATUS   read: is the transmitter busy?
UART_BASE + 0x08   CONTROL  write: baud rate, enable, interrupts`}</pre>
      <p>
        From software this is just pointer writes. <T k="memory-mapped I/O" /> is what makes it work:
        the address decodes to a peripheral instead of to memory, so an ordinary store instruction
        drives hardware.
      </p>

      <Claim kind="paper" source="Section IV-B">
        The SoC Integrator generates a register functional documentation listing register functions
        and their corresponding addresses. That document exists so the validator — and any software
        written later — knows what to poke and where.
      </Claim>
    </div>
  );
}
