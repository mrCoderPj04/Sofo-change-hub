import React from 'react';
import { CRPriority, CRStatus, LifecycleStage, SLAStatus } from '@/types';

interface StatusBadgeProps {
  type: 'status' | 'priority' | 'stage' | 'sla';
  value: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  if (type === 'priority') {
    const priority = value as CRPriority;
    switch (priority) {
      case 'critical':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded border border-red-500/30 bg-red-500/10 text-red-400 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Critical
          </span>
        );
      case 'high':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            High
          </span>
        );
      case 'medium':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Medium
          </span>
        );
      case 'low':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded border border-slate-700 bg-slate-800 text-text-secondary ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted"></span>
            Low
          </span>
        );
    }
  }

  if (type === 'status') {
    const status = value as CRStatus;
    switch (status) {
      case 'in_progress':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 live-indicator"></span>
            In Progress
          </span>
        );
      case 'pending_approval':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded border border-purpleAccent-border bg-purpleAccent-muted text-purple-300 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            Pending Approval
          </span>
        );
      case 'completed':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Completed
          </span>
        );
      case 'blocked':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded border border-red-500/30 bg-red-500/10 text-red-300 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Blocked
          </span>
        );
      case 'rejected':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 text-text-muted ${sizeClasses}`}>
            Rejected
          </span>
        );
    }
  }

  if (type === 'sla') {
    const sla = value as SLAStatus;
    switch (sla) {
      case 'healthy':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            SLA Met
          </span>
        );
      case 'at_risk':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 live-indicator"></span>
            SLA Risk
          </span>
        );
      case 'breached':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-red-950/50 border border-red-800/50 text-red-400 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Breached
          </span>
        );
    }
  }

  if (type === 'stage') {
    const stageLabels: Record<string, string> = {
      submitted: '1. Submitted',
      tl_review: '2. TL Review',
      planning: '3. Planning',
      development: '4. Dev & Build',
      documentation: '5. Docs & Changelog',
      workflow_chart: '6. Workflow Chart',
      walkthrough: '7. Walkthrough',
      internal_review: '8. Internal QA',
      customer_review: '9. Customer Review',
      customer_approval: '10. Customer Sign-off',
      delivered: '11. Delivered',
    };

    return (
      <span className={`inline-flex items-center rounded border border-border bg-surface-secondary text-text-secondary ${sizeClasses}`}>
        {stageLabels[value] || value}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded border border-border bg-surface text-text-secondary ${sizeClasses}`}>
      {value}
    </span>
  );
};
