import { departments } from '@/lib/data';

export default function DepartmentsPage() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Teams</p>
          <h1>Departments</h1>
        </div>
        <button className="primary-btn">Add department</button>
      </header>

      <section className="card-grid two-up">
        {departments.map((dept) => (
          <article key={dept.name} className="info-card">
            <div className="info-card-header">
              <div>
                <p className="mini-label">Department</p>
                <h3>{dept.name}</h3>
              </div>
              <span className="budget-badge">{dept.budget}</span>
            </div>

            <dl className="property-list compact-list">
              <div>
                <dt>Lead</dt>
                <dd>{dept.lead}</dd>
              </div>
              <div>
                <dt>Function</dt>
                <dd>Working across planning, execution, and review</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
