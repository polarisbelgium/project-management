'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Prospect = {
  id: string;
  name: string;
  organization: string;
  email: string;
  kind: 'Client' | 'Investor';
  status: 'New' | 'Contacted' | 'Qualified';
  notes: string;
};

const storageKey = 'projecthub-prospects-v1';
const initialProspects: Prospect[] = [
  { id: 'p-1', name: 'Amara Okafor', organization: 'Northstar Retail Group', email: 'amara@example.com', kind: 'Client', status: 'Contacted', notes: 'Interested in a multi-branch operations rollout.' },
  { id: 'p-2', name: 'Daniel Meyer', organization: 'Meridian Ventures', email: 'daniel@example.com', kind: 'Investor', status: 'Qualified', notes: 'Requested an introductory company overview.' },
];

export function ProspectsManager() {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setProspects(JSON.parse(saved) as Prospect[]);
    } catch {
      // Keep the sample records if browser storage is unavailable or invalid.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(prospects));
  }, [prospects, ready]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return prospects;
    return prospects.filter((person) =>
      [person.name, person.organization, person.email, person.kind, person.status]
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [prospects, query]);

  function addProspect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('name') ?? '').trim();
    const organization = String(values.get('organization') ?? '').trim();
    const email = String(values.get('email') ?? '').trim();
    if (!name || !organization || !email) return;

    setProspects((current) => [{
      id: `p-${Date.now()}`,
      name,
      organization,
      email,
      kind: String(values.get('kind')) as Prospect['kind'],
      status: 'New',
      notes: String(values.get('notes') ?? '').trim(),
    }, ...current]);
    form.reset();
  }

  function updateStatus(id: string, status: Prospect['status']) {
    setProspects((current) => current.map((person) => person.id === id ? { ...person, status } : person));
  }

  function removeProspect(id: string) {
    setProspects((current) => current.filter((person) => person.id !== id));
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Relationships</p>
          <h1>Prospects</h1>
          <p className="page-intro">Keep prospective clients and investors, contact details, and follow-up status in one place.</p>
        </div>
      </header>

      <section className="prospects-layout">
        <form className="panel prospect-form" onSubmit={addProspect}>
          <div className="panel-header"><h2>Add a prospect</h2></div>
          <label>Name<input name="name" required placeholder="Contact name" /></label>
          <label>Organization<input name="organization" required placeholder="Company or fund" /></label>
          <label>Email<input name="email" type="email" required placeholder="name@company.com" /></label>
          <label>Relationship type
            <select name="kind" defaultValue="Client"><option>Client</option><option>Investor</option></select>
          </label>
          <label>Notes<textarea name="notes" rows={3} placeholder="Context, interests, or next steps" /></label>
          <button className="primary-btn" type="submit">Save prospect</button>
          <p className="form-hint">Demo data is saved in this browser only. Connect a secure database before using real contact information.</p>
        </form>

        <section className="panel">
          <div className="panel-header prospects-header">
            <div><h2>Prospect list</h2><span className="muted">{prospects.length} contacts</span></div>
            <input aria-label="Search prospects" className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search contacts" />
          </div>
          <div className="prospect-list">
            {filtered.length === 0 && <p className="empty-state">No matching prospects. Add one using the form.</p>}
            {filtered.map((person) => (
              <article className="prospect-card" key={person.id}>
                <div className="prospect-card-main">
                  <div className="avatar-circle">{person.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div>
                  <div className="prospect-details">
                    <div className="prospect-title"><h3>{person.name}</h3><span className="type-badge">{person.kind}</span></div>
                    <p>{person.organization}</p>
                    <a href={`mailto:${person.email}`}>{person.email}</a>
                    {person.notes && <small>{person.notes}</small>}
                  </div>
                </div>
                <div className="prospect-controls">
                  <label className="sr-only" htmlFor={`status-${person.id}`}>Status for {person.name}</label>
                  <select id={`status-${person.id}`} value={person.status} onChange={(event) => updateStatus(person.id, event.target.value as Prospect['status'])}>
                    <option>New</option><option>Contacted</option><option>Qualified</option>
                  </select>
                  <button className="text-button" type="button" onClick={() => removeProspect(person.id)} aria-label={`Remove ${person.name}`}>Remove</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
