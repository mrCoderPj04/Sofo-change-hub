import React, { useState } from 'react';
import { ChangeRequest, User } from '@/types';
import { ShieldCheck, UserCheck, CheckCircle2, XCircle, AlertCircle, Clock, Save } from 'lucide-react';
import { CURRENT_USER, MOCK_USERS } from '@/data/mockData';

interface Step2Props {
  cr: ChangeRequest;
  onApproveTL?: (riskScore: 'Low' | 'Medium' | 'High', notes: string, estHours: number) => void;
}

export const Step2TLReview: React.FC<Step2Props> = ({ cr, onApproveTL }) => {
  const [riskScore, setRiskScore] = useState<'Low' | 'Medium' | 'High'>(
    cr.tlApproval?.riskScore || 'Medium'
  );
  const [notes, setNotes] = useState(
    cr.tlApproval?.notes ||
      'Scope verified against PJSOFONIC ERP architecture. Kafka idempotency strategy approved. Proceeding with implementation planning.'
  );
  const [estHours, setEstHours] = useState(cr.implementationSpec.estimatedHours || 40);
  const [isSubmitted, setIsSubmitted] = useState(!!cr.tlApproval);

  const handleApprove = () => {
    setIsSubmitted(true);
    if (onApproveTL) {
      onApproveTL(riskScore, notes, estHours);
    }
  };

  return (
    <div className="space-y-4">
      {/* TL Review Header */}
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 02: Team Lead Technical Triage & Feasibility Review
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-muted">Reviewing Lead:</span>
            <span className="text-xs font-semibold text-accent">{CURRENT_USER.name}</span>
          </div>
        </div>

        {/* Existing Approval Banner if already approved */}
        {cr.tlApproval && (
          <div className="mb-4 p-3 bg-purpleAccent-muted border border-purpleAccent-border rounded-md text-xs text-purple-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-purple-300">
                Approved by {cr.tlApproval.approvedBy.name} on{' '}
                {new Date(cr.tlApproval.approvedAt).toLocaleDateString()}
              </div>
              <p className="text-purple-200/80 mt-1">{cr.tlApproval.notes}</p>
            </div>
          </div>
        )}

        {/* Evaluation Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Risk Assessment */}
          <div className="bg-surface p-3 rounded border border-border">
            <label className="block text-text-muted text-[11px] font-semibold uppercase tracking-wider mb-2">
              System Risk Classification
            </label>
            <div className="flex gap-2">
              {(['Low', 'Medium', 'High'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskScore(r)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded border transition-all ${
                    riskScore === r
                      ? r === 'High'
                        ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                        : r === 'Medium'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-surface-secondary border-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-text-muted mt-2">
              {riskScore === 'High' && 'Requires architecture board signoff and mandatory rollback tests.'}
              {riskScore === 'Medium' && 'Standard microservice isolation with feature toggle control.'}
              {riskScore === 'Low' && 'Non-breaking UI or schema additive changes.'}
            </p>
          </div>

          {/* Effort Estimation */}
          <div className="bg-surface p-3 rounded border border-border">
            <label className="block text-text-muted text-[11px] font-semibold uppercase tracking-wider mb-2">
              Estimated Engineering Effort
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={estHours}
                onChange={(e) => setEstHours(Number(e.target.value))}
                className="w-24 bg-surface-secondary border border-border rounded px-2.5 py-1 text-xs text-text-primary font-code focus:outline-none focus:border-accent"
              />
              <span className="text-text-muted text-xs">Hours ({Math.ceil(estHours / 8)} Days)</span>
            </div>
            <p className="text-[10px] text-text-muted mt-2">
              Includes unit tests, Swagger documentation, and QA validation.
            </p>
          </div>

          {/* Assigned Engineer */}
          <div className="bg-surface p-3 rounded border border-border">
            <label className="block text-text-muted text-[11px] font-semibold uppercase tracking-wider mb-2">
              Assigned Principal Engineer
            </label>
            <div className="flex items-center gap-2">
              <img
                src={MOCK_USERS.marcus.avatar}
                alt={MOCK_USERS.marcus.name}
                className="w-6 h-6 rounded-full object-cover border border-border"
              />
              <div>
                <div className="font-semibold text-text-primary text-xs">{MOCK_USERS.marcus.name}</div>
                <div className="text-[10px] text-text-muted">{MOCK_USERS.marcus.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Review Notes Input */}
        <div className="mt-4">
          <label className="block text-text-muted text-[11px] font-semibold uppercase tracking-wider mb-1.5">
            Team Lead Triage Notes & Directives
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-surface border border-border rounded-md p-2.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            placeholder="Add specific architectural guardrails, SLA considerations, or client stipulations..."
          />
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>Audit log will record digital timestamp upon sign-off</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded transition-colors"
            >
              Reject Request
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 rounded transition-colors"
            >
              Request Revisions
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-1.5 text-xs font-semibold bg-purpleAccent hover:bg-purple-600 text-white rounded shadow-sm flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSubmitted ? 'Update Approval Record' : 'Approve for Implementation Planning'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
