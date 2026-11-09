import { branches } from '@/lib/data';
import { StatusBadge } from '@/components/status-badge';

export default function BranchesPage() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div><p className="eyebrow">Locations</p><h1>Branches</h1></div>
        <button className="primary-btn">Add branch</button>
      </header>
      <section className="card-grid three-up">
        {branches.map((branch) => {
          const status = branch.health === 'Healthy' ? 'success' : branch.health === 'At Risk' ? 'warning' : 'danger';
          return (
            <article key={branch.name} className="info-card">
              <div className="info-card-header">
                <div><p className="mini-label">City</p><h3>{branch.city}</h3></div>
                <StatusBadge status={status}>{branch.health}</StatusBadge>
              </div>
              <div className="branch-summary"><strong>{branch.name}</strong><p>Operations managed centrally with local project tracking and regional compliance oversight.</p></div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
