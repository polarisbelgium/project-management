'use client';

import { FormEvent, useMemo, useState } from 'react';

type TargetKind = 'Client' | 'Investor' | 'All';
type ResearchTarget = {
  id: string;
  name: string;
  kind: Exclude<TargetKind, 'All'>;
  sector: string;
  region: string;
  summary: string;
  fit: string;
};

// Clearly illustrative records keep the prototype useful without implying a live web search.
const examples: ResearchTarget[] = [
  { id: 'r1', name: 'Example multi-location retailer', kind: 'Client', sector: 'Retail', region: 'Europe', summary: 'Illustrative company profile for testing industry and region filters.', fit: 'Potential fit: branch operations and portfolio visibility' },
  { id: 'r2', name: 'Sample logistics operator', kind: 'Client', sector: 'Logistics', region: 'Africa', summary: 'Illustrative company profile; not a verified business or live research result.', fit: 'Potential fit: cross-location project coordination' },
  { id: 'r3', name: 'Demo growth investment fund', kind: 'Investor', sector: 'Technology', region: 'North America', summary: 'Illustrative investor profile for testing the discovery workflow.', fit: 'Potential fit: B2B software and operational technology' },
  { id: 'r4', name: 'Example regional venture firm', kind: 'Investor', sector: 'Retail', region: 'Europe', summary: 'Illustrative investor profile; not a verified business or live research result.', fit: 'Potential fit: retail technology and expansion' },
  { id: 'r5', name: 'Sample healthcare network', kind: 'Client', sector: 'Healthcare', region: 'Middle East', summary: 'Illustrative company profile for testing industry-based discovery.', fit: 'Potential fit: multi-site operations planning' },
];

const sectors = ['Any sector', 'Retail', 'Logistics', 'Technology', 'Healthcare'];
const regions = ['Any region', 'Europe', 'Africa', 'North America', 'Middle East'];

export function IndustryResearch() {
  const [submitted, setSubmitted] = useState(false);
  const [kind, setKind] = useState<TargetKind>('All');
  const [sector, setSector] = useState('Any sector');
  const [region, setRegion] = useState('Any region');
  const [keywords, setKeywords] = useState('');
  const [notice, setNotice] = useState('');

  const results = useMemo(() => {
    const term = keywords.trim().toLowerCase();
    return examples.filter((target) => {
      const matchesKind = kind === 'All' || target.kind === kind;
      const matchesSector = sector === 'Any sector' || target.sector === sector;
      const matchesRegion = region === 'Any region' || target.region === region;
      const matchesTerm = !term || `${target.name} ${target.sector} ${target.region} ${target.summary} ${target.fit}`.toLowerCase().includes(term);
      return matchesKind && matchesSector && matchesRegion && matchesTerm;
    });
  }, [kind, sector, region, keywords]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setNotice('Showing illustrative demo records only. Connect an approved data/search provider to retrieve and cite live results.');
  }

  function addToProspects(target: ResearchTarget) {
    setNotice(`Demo only: ${target.name} was not saved. Live CRM integration is not configured.`);
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Business development</p>
          <h1>Industry research</h1>
          <p className="page-intro">Find potential clients and investors by industry, region, and fit—then review evidence before adding a contact or starting outreach.</p>
        </div>
      </header>

      <div className="research-notice" role="status"><strong>Live search is not connected.</strong> Results below are clearly labeled examples, not verified leads. A production version should use authorized search or business-data providers and show a source URL and retrieval date for every result.</div>

      <section className="research-layout">
        <form className="panel research-form" onSubmit={search}>
          <div className="panel-header"><h2>Define your search</h2></div>
          <label>Looking for
            <select value={kind} onChange={(event) => setKind(event.target.value as TargetKind)}>
              <option>All</option><option>Client</option><option>Investor</option>
            </select>
          </label>
          <label>Industry
            <select value={sector} onChange={(event) => setSector(event.target.value)}>{sectors.map((item) => <option key={item}>{item}</option>)}</select>
          </label>
          <label>Region
            <select value={region} onChange={(event) => setRegion(event.target.value)}>{regions.map((item) => <option key={item}>{item}</option>)}</select>
          </label>
          <label>Keywords
            <input value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="e.g. multi-branch, growth-stage" />
          </label>
          <button type="submit" className="primary-btn">Search examples</button>
          <p className="form-hint">In a live version, AI can summarize public company information and explain why each result may fit. It should not invent contact details or send outreach automatically.</p>
        </form>

        <section className="panel research-results">
          <div className="panel-header research-header">
            <div><h2>{submitted ? 'Search results' : 'Discovery examples'}</h2><span className="muted">{results.length} illustrative records</span></div>
            <span className="demo-chip">DEMO DATA</span>
          </div>
          {notice && <p className="inline-notice" role="status">{notice}</p>}
          <div className="research-list">
            {results.length === 0 && <p className="empty-state">No example records match these filters. Try another industry, region, or keyword.</p>}
            {results.map((target) => (
              <article className="research-card" key={target.id}>
                <div className="research-card-heading">
                  <div><span className="type-badge">{target.kind}</span><h3>{target.name}</h3></div>
                  <span className="muted">Illustrative only</span>
                </div>
                <div className="research-tags"><span>{target.sector}</span><span>{target.region}</span></div>
                <p>{target.summary}</p>
                <div className="fit-note"><strong>Possible fit</strong><span>{target.fit}</span></div>
                <div className="source-placeholder"><strong>Source</strong><span>No live source attached in demo</span></div>
                <button type="button" className="ghost-btn" onClick={() => addToProspects(target)}>Add to prospects (demo)</button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
