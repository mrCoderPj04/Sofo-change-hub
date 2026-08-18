import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import { ShieldCheck, CheckCircle2, FileSignature, Lock, Sparkles, Award } from 'lucide-react';
import { MOCK_USERS } from '@/data/mockData';

interface Step10Props {
  cr: ChangeRequest;
  onCustomerSignoff?: (signeeName: string, role: string, notes: string) => void;
}

export const Step10CustomerApproval: React.FC<Step10Props> = ({
  cr,
  onCustomerSignoff,
}) => {
  const [signeeName, setSigneeName] = useState(
    cr.customerSignoff?.signedBy || 'Sarah Chen'
  );
  const [signeeRole, setSigneeRole] = useState(
    cr.customerSignoff?.signeeRole || 'VP of Financial Ops (Apex Global Financials)'
  );
  const [notes, setNotes] = useState(
    cr.customerSignoff?.notes ||
      'All multi-currency ledger acceptance tests completed on staging tenant. Verified compliance with ECB Article 14. We authorize immediate deployment to production.'
  );
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isSigned, setIsSigned] = useState(!!cr.customerSignoff?.signedAt);

  const handleSign = () => {
    setIsSigned(true);
    if (onCustomerSignoff) {
      onCustomerSignoff(signeeName, signeeRole, notes);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 10: Formal Customer Acceptance & Executive Digital Sign-off
            </h4>
          </div>
          <span className="text-[11px] font-code text-purple-300 bg-purpleAccent-muted border border-purpleAccent-border px-2 py-0.5 rounded">
            {isSigned ? 'Executive Signed' : 'Awaiting Final Sign-off'}
          </span>
        </div>

        {/* Certificate Card */}
        <div className="bg-surface border border-purpleAccent-border/60 rounded-lg p-4 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-text-primary">
                  PJSOFONIC Change Acceptance Certificate
                </h3>
              </div>
              <p className="text-[11px] text-text-muted">
                Enterprise Ticket ID: <span className="font-code text-accent">{cr.ticketNumber}</span> • Target: {cr.projectName}
              </p>
            </div>

            <div className="text-left md:text-right text-xs">
              <span className="text-text-muted text-[10px] uppercase block">Authorized Client</span>
              <span className="font-semibold text-text-primary">{cr.clientName}</span>
            </div>
          </div>

          {/* Form fields if not signed */}
          {!isSigned ? (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    value={signeeName}
                    onChange={(e) => setSigneeName(e.target.value)}
                    className="w-full bg-surface-secondary border border-border rounded px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-purpleAccent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
                    Official Executive Role
                  </label>
                  <input
                    type="text"
                    value={signeeRole}
                    onChange={(e) => setSigneeRole(e.target.value)}
                    className="w-full bg-surface-secondary border border-border rounded px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-purpleAccent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
                  Acceptance Notes & Production Authorization
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded p-2.5 text-xs text-text-primary focus:outline-none focus:border-purpleAccent"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="rounded border-border bg-surface text-purpleAccent focus:ring-0 cursor-pointer"
                />
                <label htmlFor="terms" className="text-text-secondary text-[11px] cursor-pointer">
                  I confirm that all functional requirements in {cr.ticketNumber} have been reviewed on staging and authorize deployment to production.
                </label>
              </div>

              <div className="pt-3 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={handleSign}
                  disabled={!acceptedTerms}
                  className={`px-4 py-2 text-xs font-bold rounded shadow-md flex items-center gap-2 transition-all ${
                    acceptedTerms
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white cursor-pointer'
                      : 'bg-surface-secondary text-text-muted border border-border cursor-not-allowed'
                  }`}
                >
                  <FileSignature className="w-4 h-4" />
                  <span>Digitally Sign & Authorize Production Release</span>
                </button>
              </div>
            </div>
          ) : (
            /* Signed Certificate Presentation */
            <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-lg text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-text-primary text-sm">
                    Digitally Authorized by {signeeName}
                  </span>
                </div>
                <span className="text-[10px] font-code text-text-muted">
                  Signature Timestamp: 2026-08-17 14:10:00 UTC
                </span>
              </div>

              <p className="text-text-secondary leading-relaxed bg-surface p-3 rounded border border-border">
                "{notes}"
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-text-muted gap-2 pt-2 border-t border-purple-900/40">
                <span className="font-code flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-400" />
                  SHA-256 Cert: <span className="text-purple-300">sha256-a4f910e48c1b9...</span>
                </span>
                <span className="text-emerald-400 font-semibold">
                  ✓ Ready for Stage 11 Delivery
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
