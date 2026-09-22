'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldAlert,
  Briefcase,
  PlusCircle,
  FileSpreadsheet,
  FileText,
  Gavel,
  Building2,
  Landmark,
  Share2,
  FileCheck,
  FileBarChart,
  History,
  ShieldCheck,
  Users,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { activeRole } = useAuth();

  const navGroups = [
    {
      label: 'OVERVIEW',
      items: [
        { label: 'Investigation Center', href: '/overview', icon: LayoutDashboard }
      ]
    },
    {
      label: 'INVESTIGATIONS',
      items: [
        { label: 'Investigation Queue', href: '/investigations/queue', icon: ShieldAlert, badge: '382' },
        { label: 'My Cases', href: '/investigations/cases', icon: Briefcase },
        { label: 'Create Investigation', href: '/investigations/create-case', icon: PlusCircle }
      ]
    },
    {
      label: 'PROCUREMENT',
      items: [
        { label: 'Transactions', href: '/procurement/transactions', icon: FileSpreadsheet },
        { label: 'Contracts', href: '/procurement/contracts', icon: FileText },
        { label: 'Bids & Tenders', href: '/procurement/bids', icon: Gavel }
      ]
    },
    {
      label: 'ENTITIES',
      items: [
        { label: 'Vendors Intelligence', href: '/entities/vendors', icon: Building2 },
        { label: 'Buyer Departments', href: '/entities/buyers', icon: Landmark }
      ]
    },
    {
      label: 'FORENSIC NETWORK',
      items: [
        { label: 'Relationship Explorer', href: '/network', icon: Share2 }
      ]
    },
    {
      label: 'EVIDENCE',
      items: [
        { label: 'Document & OCR Locker', href: '/evidence/documents', icon: FileCheck }
      ]
    },
    {
      label: 'REPORTS',
      items: [
        { label: 'Case Audit Reports', href: '/reports/case-reports', icon: FileBarChart },
        { label: 'Exported Dossiers', href: '/reports/exported', icon: FileText }
      ]
    },
    {
      label: 'SECURITY & AUDIT',
      items: [
        { label: 'Security Center', href: '/security/center', icon: ShieldCheck },
        { label: 'System Audit Log', href: '/security/audit-log', icon: History },
        ...(activeRole === 'Administrator'
          ? [{ label: 'Users & Roles', href: '/security/users', icon: Users }]
          : [])
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { label: 'Audit Settings', href: '/settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-navy-950 text-slate-300 flex flex-col shrink-0 border-r border-navy-900 select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center gap-3 border-b border-navy-800 bg-navy-950">
        <div className="w-8 h-8 rounded-md bg-audit-blue flex items-center justify-center font-bold text-white shadow-xs">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xs font-bold tracking-tight text-white uppercase truncate">
            PROCUREMENT AUDITOR
          </h1>
          <p className="text-2xs text-slate-400 truncate">AI Forensic System</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-0.5">
            <h2 className="px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider text-slate-300">
              {group.label}
            </h2>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/overview' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-navy-800 text-white font-semibold'
                      : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-2xs font-mono font-bold px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="p-3 bg-navy-900/60 border-t border-navy-800 text-2xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>Active Role:</span>
          <span className="text-slate-200 font-semibold">{activeRole}</span>
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-2xs text-slate-500">
          <span>V2.4-SECURE</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
      </div>
    </aside>
  );
};
