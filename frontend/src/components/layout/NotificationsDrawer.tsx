'use client';

import React from 'react';
import { MOCK_NOTIFICATIONS } from '@/mock/notifications';
import { X, ShieldAlert, Briefcase, FileCheck, CheckCheck } from 'lucide-react';
import Link from 'next/link';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL_RISK':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'SENIOR_REVIEW_REQUEST':
      case 'CASE_ASSIGNMENT':
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      default:
        return <FileCheck className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-2xs" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Audit Action Notifications</h3>
              <p className="text-2xs text-slate-500">Live operational alerts and case escalations</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {MOCK_NOTIFICATIONS.map(notif => (
              <Link
                key={notif.id}
                href={notif.targetLink}
                onClick={onClose}
                className={`flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors ${
                  !notif.isRead ? 'bg-amber-50/40' : ''
                }`}
              >
                <div className="p-2 bg-white rounded-md border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-semibold text-slate-900 truncate">{notif.title}</h5>
                    <span className="text-2xs text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                  <p className="text-2xs text-slate-600 mt-1 leading-relaxed">{notif.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-2xs">
            <span className="text-slate-500">4 total alerts</span>
            <button className="text-navy-900 font-semibold hover:underline flex items-center gap-1">
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
