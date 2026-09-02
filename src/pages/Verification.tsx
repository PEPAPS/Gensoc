import { Claim } from '../components/Claim';
import { T } from '../components/glossary/Term';
import { DebugStepper } from '../components/interactive/DebugStepper';
import { FsmAnimator } from '../components/interactive/FsmAnimator';
import { HandshakeAnimator } from '../components/interactive/HandshakeAnimator';

export default function Verification() {
  return (
    <div className="page">
      <p className="eyebrow">How GenSoC works</p>
      <h1>Verification deep dive</h1>
      <p className="lede">
        The state-machine signal comparison method, worked through on the paper’s own example. This
        is the most original idea in the paper, and the one most worth borrowing.
      </p>

      <h2>The problem it solves</h2>
      <Claim kind="paper" source="Section IV-C">
        The paper’s stated motivation: while LLMs excel in handling code logic, they still have
        limitations in managing state machine signal triggers.
      </Claim>
      <p>
        That is a precise observation, and it matches what anyone who has tried it will recognise. Ask
        a model whether a piece of RTL implements a write channel and it will do reasonably well. Ask
        it to look at a waveform and say why a handshake stalled on cycle 847 and it will guess.
      </p>

      <Claim kind="inference">
        The reason is a difference in the shape of the task. Code is symbolic, local and small.
        A waveform is numeric, global and enormous — the relevant fact is a relationship between two
        signals across an interval, embedded in tens of thousands of irrelevant transitions. That is
        a needle-in-a-haystack perception task, and it is the wrong shape for a language model.
      </Claim>

      <h2>The method</h2>
      <p>The paper’s move is to change the shape of the data rather than the model:</p>
      <ol>
        <li>
          Extract key simulation data into a <strong>structured debug file</strong>: master–slave
          relationships, cycle count, state, and signal details.
        </li>
        <li>
          Compare that file against the <strong>protocol state machine and timing signals</strong>{' '}
          the SoC Integrator extracted from the protocol manual earlier.
        </li>
        <li>Pinpoint the mismatch, then correct the source code.</li>
      </ol>
      <p>
        The comparison is table against table. That is a task the model can do reliably — and it is
        also a task that could be done without a model at all, which is a point in the method’s
        favour rather than against it.
      </p>

      <h2>The paper’s worked example</h2>
      <p>
        Fig. 5 walks through one real fault. Step through it below — every fact in the walkthrough is
        the paper’s.
      </p>

      <DebugStepper />

      <Claim kind="paper" source="Section IV-C, Fig. 5">
        The paper calls this a typical issue: the erroneous association of state-triggered signals
        with incorrect states. In this instance the trigger signal for <code>s_axi_wready</code> was
        mistakenly placed in the <code>WR_DATA</code> state, and the validator repositions it to{' '}
        <code>WR_ADDR</code>.
      </Claim>

      <Claim kind="inference">
        It is worth appreciating why this specific bug is so well chosen as an example. Every module
        involved is individually correct. The master asserts valid properly; the bridge responds
        properly. The fault is a relationship — a signal asserted in the wrong state — and it is
        invisible unless you compare behaviour against the protocol’s state machine. That is exactly
        the class of bug the method is built to catch, and exactly the class that is most tedious to
        find by hand.
      </Claim>

      <h2>The background you need for that example</h2>
      <p>
        Two mechanics underlie it. If the walkthrough above went past too fast, these are the pieces.
      </p>

      <h3>The handshake</h3>
      <p>
        The stall in step 4 is a handshake that never completed. Toggle the signals and watch which
        cycles actually transfer:
      </p>
      <HandshakeAnimator />

      <h3>The state machine</h3>
      <p>
        And the reason a signal can be “assigned in the wrong state” at all is that the protocol is a{' '}
        <T k="FSM" />, where which signals may be asserted depends on where you are in the sequence:
      </p>
      <FsmAnimator />

      <h2>What this does and does not give you</h2>
      <div className="grid grid-2">
        <div className="card">
          <h4 style={{ marginTop: 0, color: 'var(--background-claim)' }}>What it does give you</h4>
          <ul style={{ marginBottom: 0 }}>
            <li>A machine-checkable reference for what the protocol requires</li>
            <li>A representation of the simulation a model can actually reason over</li>
            <li>Fault localisation to a specific signal in a specific state</li>
            <li>A revision that is a targeted edit rather than a rewrite</li>
          </ul>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0, color: 'var(--c4)' }}>What it does not give you</h4>
          <ul style={{ marginBottom: 0 }}>
            <li>Any guarantee of correctness — this is testing, not proof</li>
            <li>Coverage of behaviour the testbench never exercised</li>
            <li>Anything about clock-domain crossings, reset sequencing or power intent</li>
            <li>Confidence that the extracted protocol rules were themselves correct</li>
          </ul>
        </div>
      </div>

      <Claim kind="unspecified">
        The paper does not report how many iterations either case required, what happens when the
        loop fails to converge, what verification coverage the generated tests achieved, or the exact
        schema of the debug file. Fig. 5 shows representative fields, not a specification.
      </Claim>
    </div>
  );
}
