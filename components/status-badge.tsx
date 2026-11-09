import type { ReactNode } from 'react';

export type BadgeStatus = 'success' | 'warning' | 'danger' | 'neutral';

type StatusBadgeProps = {
  status: BadgeStatus;
  children: ReactNode;
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return <span className={`status-badge status-badge-${status}`}>{children}</span>;
}
