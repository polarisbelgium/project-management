import { approvalQueue } from '@/lib/data';

export default function ApprovalsPage() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Decision support</p>
          <h1>Approval queue</h1>
        </div>
        <button className="primary-btn">Review all</button>
      </header>

      <section className="queue-list">
        {approvalQueue.map((item) => (
          <article key={item.id} className="approval-panel">
            <div>
              <p className="mini-label">Pending action</p>
              <h3>{item.item}</h3>
            </div>

            <div className="approval-meta">
              <span>{item.owner}</span>
              <span>{item.date}</span>
            </div>

            <div className="approval-actions">
              <button className="ghost-btn">Reject</button>
              <button className="primary-btn small">Approve</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
