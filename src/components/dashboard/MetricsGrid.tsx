import React from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardMetrics } from '@/types';

interface MetricsGridProps {
  metrics: DashboardMetrics;
  onFilterClick?: (filterType: string) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, onFilterClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* Metric 1: In-Flight CRs */}
      <div
        onClick={() => onFilterClick?.('active')}
        className="glass-panel p-3.5 rounded-lg border border-border hover:border-border-hover transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Active Pipeline</span>
          <GitPullRequest className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-code text-text-primary">
            {metrics.totalActiveCRs}
          </span>
          <span className="text-[11px] text-emerald-400 flex items-center font-medium">
            +3 new
          </span>
        </div>
        <div className="text-[10px] text-text-muted mt-1 truncate">
          Across 4 enterprise clusters
        </div>
      </div>

      {/* Metric 2: Approvals Pending */}
      <div
        onClick={() => onFilterClick?.('approvals')}
        className="glass-panel p-3.5 rounded-lg border border-border hover:border-purpleAccent-border transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Pending Action</span>
          <CheckCircle2 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-code text-purple-300">
            {metrics.pendingApprovals}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Sign-off
          </span>
        </div>
        <div className="text-[10px] text-text-muted mt-1 truncate">
          2 Team Lead • 2 Customer
        </div>
      </div>

      {/* Metric 3: SLA Risk */}
      <div
        onClick={() => onFilterClick?.('sla_risk')}
        className="glass-panel p-3.5 rounded-lg border border-border hover:border-amber-500/50 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">SLA Threshold</span>
          <ShieldAlert className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-code text-amber-400">
            {metrics.slaBreachRisk}
          </span>
          <span className="text-[10px] text-amber-400/90 font-medium">
            &lt; 24h left
          </span>
        </div>
        <div className="text-[10px] text-text-muted mt-1 truncate">
          CR-2026-092 needs triage
        </div>
      </div>

      {/* Metric 4: Average Cycle Time */}
      <div className="glass-panel p-3.5 rounded-lg border border-border">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Avg Cycle Time</span>
          <Clock className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-code text-text-primary">
            {metrics.averageCycleTimeDays}
          </span>
          <span className="text-[11px] text-text-muted font-normal">days</span>
        </div>
        <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
          <ArrowUpRight className="w-3 h-3" /> 18% faster than Q2
        </div>
      </div>

      {/* Metric 5: Delivered Releases */}
      <div className="glass-panel p-3.5 rounded-lg border border-border">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Delivered / Mo</span>
          <Zap className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-code text-emerald-400">
            {metrics.deliveredThisMonth}
          </span>
          <span className="text-[11px] text-text-muted">releases</span>
        </div>
        <div className="text-[10px] text-text-muted mt-1 truncate">
          100% verified on staging
        </div>
      </div>

      {/* Metric 6: Customer Acceptance */}
      <div className="glass-panel p-3.5 rounded-lg border border-border">
        <div className="flex items-center justify-between text-text-muted mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Acceptance Rate</span>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-code text-text-primary">
            {metrics.satisfactionRate}%
          </span>
        </div>
        <div className="text-[10px] text-emerald-400 mt-1 truncate">
          0 production rollbacks
        </div>
      </div>
    </div>
  );
};
