import { Claim } from '../components/Claim';
import { backgroundSources, paperReferences } from '../data/references';
import { paperMeta } from '../data/paperResults';

export default function References() {
  return (
    <div className="page">
      <p className="eyebrow">Reference</p>
      <h1>References</h1>

      <h2>The paper under review</h2>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>{paperMeta.title}</h3>
        <p style={{ marginBottom: '0.5rem' }}>{paperMeta.authors.join(', ')}</p>
        <p className="small muted" style={{ marginBottom: '0.5rem' }}>
          {paperMeta.affiliations.join(' · ')}
        </p>
        <p className="small" style={{ marginBottom: '0.5rem' }}>
          {paperMeta.venue}
          <br />
          DOI:{' '}
          <a href={`https://doi.org/${paperMeta.doi}`} target="_blank" rel="noreferrer">
            {paperMeta.doi}
          </a>
        </p>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Index terms: {paperMeta.indexTerms.join(', ')}. {paperMeta.funding}
        </p>
      </div>

      <Claim kind="background">
        Section and figure citations throughout this site refer to that paper’s own numbering:
        Section III (SoC generation with multi-agent), Section IV-A (IP library construction and IP
        selection), Section IV-B (SoC integration), Section IV-C (SoC verification), Section V
        (Evaluations), Fig. 5 (state-machine signal comparison), Table III (SoC specifications). No
        page numbers are cited, because the source used for this review does not carry stable
        pagination.
      </Claim>

      <h2>Cited by the paper</h2>
      <p className="small muted">
        A selection from the paper’s own bibliography, keeping its numbering. These are the works
        GenSoC builds on or compares against.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="num">#</th>
              <th>Reference</th>
              <th>Relevance</th>
            </tr>
          </thead>
          <tbody>
            {paperReferences.map((r) => (
              <tr key={r.n}>
                <td className="num">[{r.n}]</td>
                <td className="small">{r.text}</td>
                <td className="small muted">{r.usedFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Background sources used by this review</h2>
      <Claim kind="background">
        These are <strong>not</strong> the paper’s claims. They are external material this review
        consulted to explain concepts the paper assumes its audience already knows — protocol
        specifications, project documentation, tool homepages. They are listed separately, and
        deliberately so, because mixing them into the paper’s citations would blur exactly the line
        this site exists to keep sharp.
      </Claim>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>What it provides</th>
              <th>Where</th>
            </tr>
          </thead>
          <tbody>
            {backgroundSources.map((s) => (
              <tr key={s.topic}>
                <td>
                  <strong>{s.topic}</strong>
                </td>
                <td className="small">{s.what}</td>
                <td className="small muted">{s.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>About this review</h2>
      <p>
        This site is an independent educational review. It is not affiliated with the authors, Peking
        University, or IEEE, and it reproduces none of the paper’s figures or text beyond short
        quotations for the purpose of commentary.
      </p>
      <p className="small muted">
        Every quantitative claim on this site is traceable to a table or figure in the paper and is
        stored in a single data file rather than typed into pages. Where the paper does not state
        something, the site says so instead of estimating.
      </p>
    </div>
  );
}
