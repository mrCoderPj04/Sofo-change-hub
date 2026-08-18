import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import { CheckCircle2, ShieldCheck, Clock, FileSignature, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { CURRENT_USER } from '@/data/mockData';

interface ApprovalsViewProps {
  changeRequests: ChangeRequest[];
  onSelectCR: (cr: ChangeRequest) => void;
  onQuickApproveTL?: (crId: string) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  changeRequests,
  onSelectCR,
  onQuickApproveTL,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'tl' | 'customer'>('all');

  const tlReviewRequests = changeRequests.filter((cr) => cr.currentStage === 'tl_review');
  const customerApprovalRequests = changeRequests.filter(
    (cr) => cr.currentStage === 'customer_approval'
  );

  const displayedRequests =
    activeFilter === 'tl'
      ? tlReviewRequests
      : activeFilter === 'customer'
      ? customerApprovalRequests
      : [...tlReviewRequests, ...customerApprovalRequests];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-text-primary">
              Approvals & Governance Sign-off Queue
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Decisive gating checkpoints for Team Lead feasibility triage and Customer digital sign-off
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-surface border border-border rounded-md p-0.5 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded transition-colors ${
              activeFilter === 'all'
                ? 'bg-surface-secondary text-accent font-semibold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            All Pending ({tlReviewRequests.length + customerApprovalRequests.length})
          </button>
          <button
            onClick={() => setActiveFilter('tl')}
            className={`px-3 py-1 rounded transition-colors ${
              activeFilter === 'tl'
                ? 'bg-surface-secondary text-purple-300 font-semibold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Team Lead Triage ({tlReviewRequests.length})
          </button>
          <button
            onClick={() => setActiveFilter('customer')}
            className={`px-3 py-1 rounded transition-colors ${
              activeFilter === 'customer'
                ? 'bg-surface-secondary text-cyan-300 font-semibold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Customer Sign-off ({customerApprovalRequests.length})
          </button>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {displayedRequests.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-lg border border-border">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-text-primary">Approvals Queue is Clear</h3>
            <p className="text-xs text-text-muted mt-1">
              All active change requests have satisfied their respective governance checkpoints.
            </p>
          </div>
        ) : (
          displayedRequests.map((cr) => {
            const isTLStep = cr.currentStage === 'tl_review';
            return (
              <div
                key={cr.id}
                onClick={() => onSelectCR(cr)}
                className="glass-panel p-4 rounded-lg border border-border hover:border-purpleAccent-border/80 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="font-code font-bold text-accent text-xs">
                      {cr.ticketNumber}
                    </span>
                    <span className="text-text-muted">•</span>
                    <span className="text-xs font-semibold text-text-primary group-hover:text-cyan-300 transition-colors">
                      {cr.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        isTLStep
                          ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                          : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'
                      }`}
                    >
                      {isTLStep ? 'Stage 2: Team Lead Review' : 'Stage 10: Customer Sign-off'}
                    </span>
                    <StatusBadge type="priority" value={cr.priority} size="sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-3">
                  <div className="bg-surface p-2.5 rounded border border-border/70">
                    <span className="text-text-muted text-[10px] block">Requesting Client</span>
                    <span className="font-medium text-text-primary">{cr.clientName}</span>
                  </div>
                  <div className="bg-surface p-2.5 rounded border border-border/70">
                    <span className="text-text-muted text-[10px] block">SLA Commitment</span>
                    <span className="font-code text-amber-400 font-semibold">
                      {cr.slaHoursRemaining} Hours Remaining
                    </span>
                  </div>
                  <div className="bg-surface p-2.5 rounded border border-border/70">
                    <span className="text-text-muted text-[10px] block">Assigned Lead</span>
                    <span className="font-medium text-text-primary">{cr.assignedLead.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  <p className="text-[11px] text-text-secondary truncate max-w-lg">
                    {cr.businessJustification || cr.description}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCR(cr);
                    }}
                    className="px-3 py-1 bg-purpleAccent hover:bg-purple-600 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all shrink-0 ml-2"
                  >
                    <span>Open Approval Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
