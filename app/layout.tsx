import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Management MVP',
  description: 'Company project, branch, and department management dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
