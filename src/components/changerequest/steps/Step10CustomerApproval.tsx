import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import { ShieldCheck, CheckCircle2, FileSignature, Lock, Sparkles, Award } from 'lucide-react';

interface Step10Props {
  cr: ChangeRequest;
  currentUser?: {
    displayName?: string;
    username?: string;
    employeeId?: string;
    organization?: string;
  } | null;
  onCustomerSignoff?: (signeeName: string, role: string, notes: string) => void;
}

export const Step10CustomerApproval: React.FC<Step10Props> = ({
  cr,
  currentUser,
  onCustomerSignoff,
}) => {
  const defaultSignee =
    cr.customerSignoff?.signedBy ||
    currentUser?.displayName ||
    currentUser?.username ||
    'Customer Signatory';

  const defaultRole =
    cr.customerSignoff?.signeeRole ||
    (currentUser?.organization ? `Authorized Signatory (${currentUser.organization})` : 'Authorized Customer Signatory');

  const [signeeName, setSigneeName] = useState(defaultSignee);
  const [signeeRole, setSigneeRole] = useState(defaultRole);
  const [notes, setNotes] = useState(
    cr.customerSignoff?.notes ||
      'All acceptance criteria and test scenarios completed on staging tenant. We authorize immediate deployment to production.'
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
              Stage 10: Formal Customer Acceptance &amp; Executive Digital Sign-off
            </h4>
          </div>
          <span className="text-[11px] font-code text-purple-300 bg-purpleAccent-muted border border-purpleAccent-border px-2 py-0.5 rounded">
            Executive Milestone
          </span>
        </div>

        {/* Completed Sign-off Certificate */}
        {cr.customerSignoff && (
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-950/40 via-surface to-purple-950/20 border border-purple-800/60 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Digitally Signed Acceptance Certificate</span>
              </div>
              <span className="text-[10px] font-code text-text-muted">
                SHA-256: #8f32c91a...
              </span>
            </div>
            <div className="mt-3 text-xs text-text-secondary grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-text-muted text-[10px] block">Authorized Signatory</span>
                <span className="font-semibold text-text-primary">{cr.customerSignoff.signedBy}</span>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">Corporate Designation</span>
                <span className="font-semibold text-text-primary">{cr.customerSignoff.signeeRole}</span>
              </div>
            </div>
            <p className="text-[11px] text-purple-200/80 mt-2 bg-surface/60 p-2 rounded border border-border/60">
              &ldquo;{cr.customerSignoff.notes}&rdquo;
            </p>
          </div>
        )}

        {/* Digital Sign-off Input Form */}
        {!cr.customerSignoff && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-text-muted text-[11px] font-semibold mb-1">
                  Full Name (Signatory)
                </label>
                <input
                  type="text"
                  value={signeeName}
                  onChange={(e) => setSigneeName(e.target.value)}
                  placeholder="Enter full legal name..."
                  className="w-full bg-surface border border-border rounded px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-text-muted text-[11px] font-semibold mb-1">
                  Corporate Role / Department
                </label>
                <input
                  type="text"
                  value={signeeRole}
                  onChange={(e) => setSigneeRole(e.target.value)}
                  placeholder="e.g. VP of Ops, Director..."
                  className="w-full bg-surface border border-border rounded px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-muted text-[11px] font-semibold mb-1">
                Executive Acceptance Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Confirmation of acceptance..."
                className="w-full bg-surface border border-border rounded p-2 text-xs text-text-primary focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-text-secondary text-[11px]">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="rounded border-border bg-surface text-accent focus:ring-0"
                />
                <span>I confirm that the delivered change request satisfies all acceptance criteria.</span>
              </label>

              <button
                type="button"
                onClick={handleSign}
                disabled={!acceptedTerms || !signeeName.trim()}
                className="px-4 py-2 bg-purpleAccent hover:bg-purple-600 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>Execute Digital Sign-off</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
