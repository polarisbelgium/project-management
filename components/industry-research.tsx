'use client';

import { FormEvent, useMemo, useState } from 'react';

type Result = { title: string; url: string; snippet: string; score: number | null };
export function IndustryResearch() {
  const [kind, setKind] = useState('Clients or investors');
  const [sector, setSector] = useState('');
  const [region, setRegion] = useState('');
  const [keywords, setKeywords] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [retrievedAt, setRetrievedAt] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const query = useMemo(() => [kind !== 'Clients or investors' ? kind : '', sector, region, keywords].filter(Boolean).join(' '), [kind, sector, region, keywords]);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(''); setResults([]);
    try {
      const response = await fetch('/api/research', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Search failed.');
      setResults(data.results); setRetrievedAt(data.retrievedAt);
      if (data.results.length === 0) setNotice('No sourced results found. Try broader terms.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Search failed.'); }
    finally { setBusy(false); }
  }

  return <div className="page-shell"><header className="topbar"><div><p className="eyebrow">Business development</p><h1>Industry research</h1><p className="page-intro">Search public online sources for potential clients, investors, or partners. Review source evidence before adding a lead or contacting anyone.</p></div></header>
    <div className="research-notice"><strong>Research only.</strong> Search results are third-party public-source material, not verified leads or recommendations. Verify details and respect website/provider terms; this tool does not collect private contact information.</div>
    <section className="research-layout"><form className="panel research-form" onSubmit={search}><div className="panel-header"><h2>Define your search</h2></div>
      <label>Looking for<select value={kind} onChange={(event) => setKind(event.target.value)}><option>Clients or investors</option><option>Potential clients</option><option>Investors</option><option>Industry partners</option></select></label>
      <label>Industry<input value={sector} onChange={(event) => setSector(event.target.value)} placeholder="e.g. retail technology" /></label>
      <label>Region<input value={region} onChange={(event) => setRegion(event.target.value)} placeholder="e.g. Europe" /></label>
      <label>Keywords<input value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="e.g. multi-location operations" /></label>
      <button type="submit" className="primary-btn" disabled={busy}>{busy ? 'Searching…' : 'Search public sources'}</button><p className="form-hint">Search queries and results are handled through the configured server-side provider. API keys stay on the server.</p>
    </form><section className="panel research-results"><div className="panel-header research-header"><div><h2>Results</h2><span className="muted">{results.length} sourced results</span></div>{retrievedAt && <span className="muted">Retrieved {new Date(retrievedAt).toLocaleString()}</span>}</div>
      {notice && <p className="inline-notice" role="status">{notice}</p>}{results.length === 0 && !notice && <p className="empty-state">Choose filters and search to retrieve current public-source results.</p>}
      <div className="research-list">{results.map((result) => <article className="research-card" key={result.url}><div className="research-card-heading"><h3>{result.title}</h3>{result.score !== null && <span className="muted">Relevance {Math.round(result.score * 100)}%</span>}</div><p>{result.snippet}</p><a href={result.url} target="_blank" rel="noreferrer">View source ↗</a></article>)}</div>
    </section></section></div>;
}
