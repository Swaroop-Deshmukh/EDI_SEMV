import React from 'react';
import { CaseTimelineEvent } from '@/mock/cases';
import { FileText, ShieldAlert, ArrowUpRight, CheckCircle2, MessageSquare, PlusCircle } from 'lucide-react';

interface TimelineProps {
  events: CaseTimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getIcon = (type: CaseTimelineEvent['type']) => {
    switch (type) {
      case 'CREATION':
        return <PlusCircle className="w-4 h-4 text-blue-600" />;
      case 'EVIDENCE':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'ESCALATION':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'REVIEW':
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case 'NOTE':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case 'STATUS_CHANGE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBorderColor = (type: CaseTimelineEvent['type']) => {
    switch (type) {
      case 'CREATION':
        return 'border-blue-200 bg-blue-50';
      case 'EVIDENCE':
        return 'border-purple-200 bg-purple-50';
      case 'ESCALATION':
        return 'border-red-200 bg-red-50';
      case 'REVIEW':
        return 'border-amber-200 bg-amber-50';
      case 'NOTE':
        return 'border-indigo-200 bg-indigo-50';
      case 'STATUS_CHANGE':
        return 'border-emerald-200 bg-emerald-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border ${getBorderColor(
                    event.type
                  )} ring-4 ring-white shrink-0`}
                >
                  {getIcon(event.type)}
                </div>
                <div className="min-w-0 flex-1 pt-1.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                    <time className="text-2xs font-mono text-slate-400 whitespace-nowrap">
                      {event.timestamp}
                    </time>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{event.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-2xs text-slate-500">
                    <span className="font-medium text-slate-700">{event.actorName}</span>
                    <span>•</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {event.actorRole}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
