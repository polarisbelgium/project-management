'use client';

import { useState } from 'react';

type EmailDraft = { id: string; subject: string; recipient: string; body: string; state: 'Needs approval' | 'Approved (not sent)' | 'Rejected'; };

const inbox = [
  { id: 'in-1', from: 'Amara Okafor <amara@example.com>', subject: 'Branch operations platform', time: 'Today, 9:42 AM', preview: 'Could you share more about how your platform supports teams in multiple locations?', reply: 'Hi Amara,\n\nThanks for reaching out. Our platform is designed to help teams coordinate projects and operations across multiple branches. I would be happy to learn more about your needs and arrange a short introductory conversation.\n\nWould you be available for a call next week?\n\nBest regards' },
  { id: 'in-2', from: 'Daniel Meyer <daniel@example.com>', subject: 'Company overview request', time: 'Yesterday', preview: 'Please send a short overview of the company and the product roadmap.', reply: 'Hi Daniel,\n\nThank you for your interest. I can share a company overview and discuss the product roadmap. Before I send materials, could you let me know which areas would be most useful to cover?\n\nBest regards' },
];

export function EmailWorkspace() {
  const [selectedId, setSelectedId] = useState(inbox[0].id);
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [notice, setNotice] = useState('');
  const selected = inbox.find((message) => message.id === selectedId) ?? inbox[0];

  function draftReply() {
    const alreadyExists = drafts.some((draft) => draft.id === selected.id && draft.state !== 'Rejected');
    if (alreadyExists) {
      setNotice('A reply draft for this message is already in the approval queue.');
      return;
    }
    setDrafts((current) => [{
      id: selected.id,
      subject: `Re: ${selected.subject}`,
      recipient: selected.from.match(/<([^>]+)>/)?.[1] ?? selected.from,
      body: selected.reply,
      state: 'Needs approval',
    }, ...current]);
    setNotice('Reply drafted and submitted for your approval. Nothing has been sent.');
  }

  function setDraftState(id: string, state: EmailDraft['state']) {
    setDrafts((current) => current.map((draft) => draft.id === id ? { ...draft, state } : draft));
    setNotice(state === 'Approved (not sent)'
      ? 'Approved in this demo. It has not been sent; connect an email provider to enable delivery.'
      : 'Draft rejected. It will not be sent.');
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI-assisted communication</p>
          <h1>Email workspace</h1>
          <p className="page-intro">Review incoming messages and approve or reject agent-drafted replies before anything is sent.</p>
        </div>
        <span className="approval-required">Approval required · sending disabled</span>
      </header>

      <div className="email-notice" role="status">Demo mode: sample messages and local drafts only. This app is not connected to an email account and cannot send or receive real email.</div>

      <section className="email-layout">
        <aside className="panel inbox-panel">
          <div className="panel-header"><h2>Inbox sample</h2></div>
          {inbox.map((message) => (
            <button type="button" key={message.id} className={`inbox-item ${selected.id === message.id ? 'selected' : ''}`} onClick={() => { setSelectedId(message.id); setNotice(''); }}>
              <strong>{message.from.split(' <')[0]}</strong><span>{message.time}</span>
              <b>{message.subject}</b><small>{message.preview}</small>
            </button>
          ))}
        </aside>

        <section className="panel message-panel">
          <div className="panel-header"><div><p className="mini-label">Incoming message</p><h2>{selected.subject}</h2></div><span className="status-pill at-risk">Needs review</span></div>
          <p className="message-from">From: {selected.from}</p>
          <p className="message-preview">{selected.preview}</p>
          <button type="button" className="primary-btn" onClick={draftReply}>Draft AI reply for approval</button>
          <p className="form-hint">The reply is a sample draft. Review and edit the content before approving. Approval does not send an email in this demo.</p>

          {notice && <p className="inline-notice" role="status">{notice}</p>}

          <div className="draft-queue">
            <div className="panel-header"><h2>Reply approval queue</h2><span className="muted">{drafts.filter((draft) => draft.state === 'Needs approval').length} pending</span></div>
            {drafts.length === 0 && <p className="empty-state">No drafts yet. Select a message and ask the agent to prepare a reply.</p>}
            {drafts.map((draft) => (
              <article className="draft-card" key={draft.id}>
                <div className="draft-heading"><div><span className="mini-label">To: {draft.recipient}</span><h3>{draft.subject}</h3></div><span className={`status-pill ${draft.state === 'Needs approval' ? 'at-risk' : draft.state.startsWith('Approved') ? 'healthy' : 'delayed'}`}>{draft.state}</span></div>
                <textarea aria-label={`Draft reply to ${draft.recipient}`} value={draft.body} onChange={(event) => setDrafts((current) => current.map((item) => item.id === draft.id ? { ...item, body: event.target.value } : item))} rows={7} />
                {draft.state === 'Needs approval' && <div className="approval-actions"><button className="ghost-btn" type="button" onClick={() => setDraftState(draft.id, 'Rejected')}>Reject</button><button className="primary-btn small" type="button" onClick={() => setDraftState(draft.id, 'Approved (not sent)')}>Approve draft</button></div>}
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
