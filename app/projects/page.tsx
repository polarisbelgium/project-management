import { projects } from '@/lib/data';
import { LinearProgress } from '@/components/linear-progress';
import { StatusBadge } from '@/components/status-badge';

export default function ProjectsPage() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div><p className="eyebrow">Portfolio</p><h1>Projects</h1></div>
        <button className="primary-btn">New project</button>
      </header>

      <section className="card-grid three-up">
        {projects.map((project) => {
          const status = project.status === 'On Track' ? 'success' : project.status === 'At Risk' ? 'warning' : 'danger';
          return (
            <article key={project.id} className="info-card">
              <div className="info-card-header">
                <div><p className="mini-label">{project.department}</p><h3>{project.name}</h3></div>
                <StatusBadge status={status}>{project.status}</StatusBadge>
              </div>
              <dl className="property-list">
                <div><dt>Branch</dt><dd>{project.branch}</dd></div>
                <div><dt>Owner</dt><dd>{project.owner}</dd></div>
                <div><dt>Stage</dt><dd>{project.stage}</dd></div>
                <div><dt>Due</dt><dd>{project.dueDate}</dd></div>
              </dl>
              <div className="project-progress"><span className="progress-label">Progress</span><LinearProgress value={project.progress} label={`${project.name} progress`} /></div>
              <p className="risk-note">{project.risk}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
