import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/branches', label: 'Branches' },
  { href: '/departments', label: 'Departments' },
  { href: '/approvals', label: 'Approvals' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">PM</div>
          <div>
            <p className="brand-eyebrow">Operations</p>
            <h2>ProjectHub</h2>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-item">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-card">
          <span className="card-label">AI Agent</span>
          <strong>Project planner</strong>
          <p>Drafting resource plans, risk summaries, and action recommendations.</p>
        </div>
      </aside>

      <main className="main-panel">{children}</main>
    </div>
  );
}
