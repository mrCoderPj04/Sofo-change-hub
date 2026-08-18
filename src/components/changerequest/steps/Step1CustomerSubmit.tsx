import React from 'react';
import { ChangeRequest } from '@/types';
import { FileText, Building2, User, Clock, AlertTriangle, Paperclip } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface StepProps {
  cr: ChangeRequest;
}

export const Step1CustomerSubmit: React.FC<StepProps> = ({ cr }) => {
  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Customer Change Submission Details
            </h4>
          </div>
          <span className="text-[11px] font-code text-text-muted">
            Submitted: {new Date(cr.submittedAt).toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-text-muted text-[11px] block mb-1">Requesting Client</span>
            <div className="font-medium text-text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {cr.clientName}
            </div>
            <div className="text-text-secondary text-[11px] mt-0.5">
              Contact: {cr.clientContact.name} ({cr.clientContact.role})
            </div>
          </div>

          <div>
            <span className="text-text-muted text-[11px] block mb-1">Target ERP Project</span>
            <div className="font-medium text-text-primary">{cr.projectName}</div>
            <div className="text-text-muted text-[11px] mt-0.5">
              Category: <span className="text-text-secondary">{cr.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Justification */}
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          Business Justification & Impact
        </h4>
        <p className="text-xs text-text-secondary leading-relaxed bg-surface p-3 rounded border border-border/60">
          {cr.businessJustification}
        </p>
      </div>

      {/* Scope Summary */}
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">
          Scope Summary & Functional Requirements
        </h4>
        <p className="text-xs text-text-secondary leading-relaxed bg-surface p-3 rounded border border-border/60">
          {cr.scopeSummary}
        </p>
      </div>

      {/* SLA & Attachments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            SLA & Delivery Commitment
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-muted">Target Delivery Date:</span>
              <span className="font-code text-text-primary">
                {new Date(cr.targetDeliveryDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-muted">Remaining SLA Window:</span>
              <span className="font-code text-amber-400 font-semibold">
                {cr.slaHoursRemaining} Hours
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">SLA Health:</span>
              <StatusBadge type="sla" value={cr.slaStatus} size="sm" />
            </div>
          </div>
        </div>

        <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-cyan-400" />
            Attached Specs & Schemas
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="p-2 bg-surface rounded border border-border/60 flex items-center justify-between">
              <span className="text-text-secondary font-code text-[11px]">swift_mt940_sample_2026.dat</span>
              <span className="text-[10px] text-text-muted">42 KB</span>
            </div>
            <div className="p-2 bg-surface rounded border border-border/60 flex items-center justify-between">
              <span className="text-text-secondary font-code text-[11px]">ecb_compliance_mandate_v2.pdf</span>
              <span className="text-[10px] text-text-muted">1.4 MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
