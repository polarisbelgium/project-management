import { projects, branches, departments, recommendations, approvalQueue } from '@/lib/data';
import { LinearProgress } from '@/components/linear-progress';
import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';

export function OverviewDashboard() {
  const totalProgress = Math.round(
    projects.reduce((sum, project) => sum + project.progress, 0) / projects.length,
  );

  const onTrack = projects.filter((project) => project.status === 'On Track').length;
  const atRisk = projects.filter((project) => project.status === 'At Risk').length;
  const delayed = projects.filter((project) => project.status === 'Delayed').length;

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Company operations</p>
          <h1>Project Control Center</h1>
        </div>
        <button className="primary-btn">Create new project</button>
      </header>

      <section className="stats-grid" aria-label="Portfolio summary">
        <StatCard title="Projects" value={projects.length} icon="▦" description="Across all branches" tone="blue" />
        <StatCard title="Average progress" value={`${totalProgress}%`} icon="◷" description="Portfolio completion" tone="purple" />
        <StatCard title="On track" value={onTrack} icon="✓" description="Healthy initiatives" tone="green" />
        <StatCard title="Needs review" value={atRisk + delayed} icon="!" description={`${atRisk} at risk · ${delayed} delayed`} tone="red" />
      </section>

      <section className="content-grid">
        <div className="panel span-2">
          <div className="panel-header">
            <h2>Portfolio lifecycle</h2>
            <span className="badge">Analyze → Design → Develop → Implement → Monitor → Evaluate</span>
          </div>

          <div className="project-table">
            <div className="table-head row">
              <span>Project</span><span>Branch</span><span>Stage</span><span>Owner</span><span>Progress</span>
            </div>
            {projects.map((project) => (
              <div key={project.id} className="table-row row">
                <div className="project-name-wrap"><strong>{project.name}</strong><small>{project.department}</small></div>
                <span>{project.branch}</span>
                <span className="stage-pill">{project.stage}</span>
                <span>{project.owner}</span>
                <LinearProgress value={project.progress} label={`${project.name} progress`} />
              </div>
            ))}
          </div>
        </div>

        <aside className="panel">
          <div className="panel-header"><h2>AI recommendations</h2></div>
          <div className="stack-list">
            {recommendations.map((item) => (
              <div key={item.title} className="recommendation-card">
                <div className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</div>
                <h3>{item.title}</h3><p>{item.detail}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="bottom-grid" aria-label="Company operations overview">
        <div className="panel">
          <div className="panel-header"><h2>Branch health</h2></div>
          <div className="branch-list">
            {branches.map((branch) => {
              const status = branch.health === 'Healthy' ? 'success' : branch.health === 'At Risk' ? 'warning' : 'danger';
              return <div key={branch.name} className="branch-item"><div><strong>{branch.name}</strong><small>{branch.city}</small></div><StatusBadge status={status}>{branch.health}</StatusBadge></div>;
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Departments</h2></div>
          <div className="dept-list">
            {departments.map((dept) => <div key={dept.name} className="dept-item"><div><strong>{dept.name}</strong><small>{dept.lead}</small></div><span>{dept.budget}</span></div>)}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Approval queue</h2></div>
          <div className="approval-list">
            {approvalQueue.map((item) => <div key={item.id} className="approval-item"><strong>{item.item}</strong><small>{item.owner}</small><span>{item.date}</span></div>)}
          </div>
        </div>
      </section>
    </div>
  );
}
