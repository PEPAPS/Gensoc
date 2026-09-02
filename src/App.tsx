import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/navigation/Layout';

import Home from './pages/Home';
import Tldr from './pages/Tldr';
import Problem from './pages/Problem';
import Basics from './pages/Basics';
import Protocols from './pages/Protocols';
import RtlFlow from './pages/RtlFlow';
import WhatIsGenSoC from './pages/WhatIsGenSoC';
import Architecture from './pages/Architecture';
import AgentManager from './pages/AgentManager';
import AgentIntegrator from './pages/AgentIntegrator';
import AgentValidator from './pages/AgentValidator';
import Pipeline from './pages/Pipeline';
import Verification from './pages/Verification';
import CaseA from './pages/CaseA';
import CaseB from './pages/CaseB';
import Setup from './pages/Setup';
import Results from './pages/Results';
import Interpretation from './pages/Interpretation';
import Limitations from './pages/Limitations';
import Reproduce from './pages/Reproduce';
import Figures from './pages/Figures';
import Glossary from './pages/Glossary';
import References from './pages/References';

/**
 * HashRouter, deliberately.
 *
 * GitHub Pages serves static files only — a deep link to /pipeline on a
 * BrowserRouter would 404 before React ever loads. Hash routing sidesteps that
 * entirely and needs no 404.html redirect shim.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tldr" element={<Tldr />} />
          <Route path="/problem" element={<Problem />} />
          <Route path="/basics" element={<Basics />} />
          <Route path="/protocols" element={<Protocols />} />
          <Route path="/rtl" element={<RtlFlow />} />
          <Route path="/gensoc" element={<WhatIsGenSoC />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/agents/ip-library-manager" element={<AgentManager />} />
          <Route path="/agents/soc-integrator" element={<AgentIntegrator />} />
          <Route path="/agents/soc-validator" element={<AgentValidator />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/cases/edge-ai" element={<CaseA />} />
          <Route path="/cases/mobile" element={<CaseB />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/results" element={<Results />} />
          <Route path="/interpretation" element={<Interpretation />} />
          <Route path="/limitations" element={<Limitations />} />
          <Route path="/reproduce" element={<Reproduce />} />
          <Route path="/figures" element={<Figures />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/references" element={<References />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
