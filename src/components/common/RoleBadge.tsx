import React from 'react';
import { UserRole } from '../../types';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const configs = {
    student: {
      label: 'Étudiant',
      bg: 'dark:bg-blue-950/30 bg-blue-50',
      text: 'dark:text-blue-400 text-blue-700',
      border: 'dark:border-blue-500/30 border-blue-200',
      dot: 'bg-blue-500',
    },
    teacher: {
      label: 'Formateur',
      bg: 'dark:bg-emerald-950/30 bg-emerald-50',
      text: 'dark:text-emerald-400 text-emerald-700',
      border: 'dark:border-emerald-500/30 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    admin: {
      label: 'Admin',
      labelLong: 'Administrateur',
      bg: 'dark:bg-amber-950/30 bg-amber-50',
      text: 'dark:text-amber-400 text-amber-700',
      border: 'dark:border-amber-500/30 border-amber-200',
      dot: 'bg-amber-500',
    },
  };

  const current = configs[role] || configs.student;
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-[11px] px-2.5 py-1 tracking-wider',
    lg: 'text-xs px-3 py-1.5 tracking-wider font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase font-semibold transition-all ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
};
