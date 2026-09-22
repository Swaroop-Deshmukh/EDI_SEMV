import React from 'react';

interface RiskBadgeProps {
  score?: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  showScore = true,
  size = 'md',
}) => {
  const styles = {
    CRITICAL: 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-200',
    HIGH: 'bg-orange-50 text-orange-800 border-orange-300 ring-1 ring-orange-200',
    MEDIUM: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-200',
    LOW: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200',
  }[level] || 'bg-slate-100 text-slate-700 border-slate-300';

  const dotColor = {
    CRITICAL: 'bg-red-600',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-emerald-600',
  }[level] || 'bg-slate-500';

  const sizeStyles = {
    sm: 'text-2xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${styles} ${sizeStyles}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
      <span>{level}</span>
      {showScore && score !== undefined && (
        <span className="font-mono font-semibold ml-0.5">({score}/100)</span>
      )}
    </span>
  );
};
