'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from './Breadcrumbs';
import { AuditBanner } from '../common/AuditBanner';
import { useAuth } from '@/context/AuthContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // If login page or not authenticated, render bare content
  if (pathname === '/login' || !isAuthenticated) {
    return <main className="min-h-screen bg-slate-100">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AuditBanner />
        <Header />
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
