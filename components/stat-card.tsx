import type { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
  tone: 'blue' | 'purple' | 'green' | 'red';
  trend?: { label: string; direction: 'up' | 'down' | 'steady' };
};

export function StatCard({ title, value, icon, description, tone, trend }: StatCardProps) {
  return (
    <article className={`stat-card stat-card-${tone}`}>
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-icon" aria-hidden="true">{icon}</span>
      </div>
      <strong className="stat-card-value">{value}</strong>
      <div className="stat-card-bottom">
        <small>{description}</small>
        {trend && <span className={`stat-trend trend-${trend.direction}`}>{trend.label}</span>}
      </div>
    </article>
  );
}
