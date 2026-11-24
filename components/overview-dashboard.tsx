import { projects } from '@/lib/data';

const stages = [
  { name: 'Analyze', className: 'stage-analyze', detail: 'Requirements & insights' },
  { name: 'Design', className: 'stage-design', detail: 'Solution planning' },
  { name: 'Develop', className: 'stage-develop', detail: 'Build & integrate' },
  { name: 'Implement', className: 'stage-implement', detail: 'Deploy & adopt' },
  { name: 'Monitor', className: 'stage-monitor', detail: 'Track outcomes' },
  { name: 'Evaluate', className: 'stage-evaluate', detail: 'Review & improve' },
];

export function OverviewDashboard() {
  return (
    <div className="page-shell lifecycle-page">
      <header className="topbar lifecycle-heading">
        <div>
          <p className="eyebrow">Project operations</p>
          <h1>Project Management Lifecycle</h1>
          <p className="page-intro">A clear path from initial analysis to continuous improvement.</p>
        </div>
      </header>

      <section className="lifecycle-board" aria-label="Project management lifecycle">
        <div className="lifecycle-wheel">
          <div className="center-node">
            <span>Project</span>
            <strong>Management</strong>
          </div>

          {stages.map((stage) => (
            <div className={`stage-node ${stage.className}`} key={stage.name}>
              <strong>{stage.name}</strong>
              <span>{stage.detail}</span>
            </div>
          ))}

          <span className="wheel-arrow arrow-analyze" aria-hidden="true">▶</span>
          <span className="wheel-arrow arrow-design" aria-hidden="true">▼</span>
          <span className="wheel-arrow arrow-develop" aria-hidden="true">▼</span>
          <span className="wheel-arrow arrow-implement" aria-hidden="true">◀</span>
          <span className="wheel-arrow arrow-monitor" aria-hidden="true">▶</span>
          <span className="wheel-arrow arrow-evaluate" aria-hidden="true">▶</span>
        </div>
      </section>

      <section className="lifecycle-summary" aria-label="Portfolio summary">
        {projects.map((project) => (
          <article className="lifecycle-project" key={project.id}>
            <div>
              <span className="mini-label">{project.department}</span>
              <h2>{project.name}</h2>
            </div>
            <span className="stage-pill">{project.stage}</span>
            <strong>{project.progress}%</strong>
          </article>
        ))}
      </section>
    </div>
  );
}
