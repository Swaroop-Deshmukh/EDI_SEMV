'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  const segments = pathname.split('/').filter(Boolean);

  const formatSegment = (segment: string) => {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-2xs text-slate-500 py-1 px-4 bg-white border-b border-slate-200">
      <Link
        href="/overview"
        className="flex items-center gap-1 hover:text-navy-900 transition-colors"
        aria-label="Overview Home"
      >
        <Home className="w-3 h-3 text-slate-400" />
        <span className="hidden sm:inline font-medium">Workspace</span>
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800 truncate max-w-[200px]" aria-current="page">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-navy-900 transition-colors truncate max-w-[140px]"
              >
                {formatSegment(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
