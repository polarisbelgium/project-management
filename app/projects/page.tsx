import { projects, branches, departments, approvalQueue } from '@/lib/data';

export default function ProjectsPage() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1>Projects</h1>
        </div>
        <button className="primary-btn">New project</button>
      </header>

      <section className="card-grid three-up">
        {projects.map((project) => (
          <article key={project.id} className="info-card">
            <div className="info-card-header">
              <div>
                <p className="mini-label">{project.department}</p>
                <h3>{project.name}</h3>
              </div>
              <span className={`status-pill ${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {project.status}
              </span>
            </div>

            <dl className="property-list">
              <div>
                <dt>Branch</dt>
                <dd>{project.branch}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{project.owner}</dd>
              </div>
              <div>
                <dt>Stage</dt>
                <dd>{project.stage}</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>{project.dueDate}</dd>
              </div>
            </dl>

            <div className="metric-row">
              <span>{project.progress}%</span>
              <div className="progress-bar compact">
                <span style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <p className="risk-note">{project.risk}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
