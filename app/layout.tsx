import { AppShell } from '@/components/app-shell';
import '@/app/globals.css';

export const metadata = {
  title: 'ProjectHub',
  description: 'Company project, department, and branch management dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
