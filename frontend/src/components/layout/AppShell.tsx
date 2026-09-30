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

  // Route is purely public if it's the landing home page '/' or login page '/login'
  const isPublicRoute = pathname === '/' || pathname === '/login';

  // If public route or unauthenticated, render pure standalone page without sidebar shell
  if (isPublicRoute || !isAuthenticated) {
    return <main className="min-h-screen bg-slate-50 w-full">{children}</main>;
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
