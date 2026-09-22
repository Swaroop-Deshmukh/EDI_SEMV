import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CaseProvider } from '@/context/CaseContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'AI Public Procurement Auditor | Official Audit System',
  description: 'AI-assisted public procurement fraud detection, risk scoring, and forensic audit platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-navy-900 selection:text-white">
        <AuthProvider>
          <CaseProvider>
            <AppShell>{children}</AppShell>
          </CaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
