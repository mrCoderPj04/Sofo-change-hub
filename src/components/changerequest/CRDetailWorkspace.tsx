import React, { useState } from 'react';
import { ChangeRequest, LifecycleStage } from '@/types';
import {
  ArrowLeft,
  Share2,
  Clock,
  User,
  Building2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { LifecycleStepper } from './LifecycleStepper';
import { Step1CustomerSubmit } from './steps/Step1CustomerSubmit';
import { Step2TLReview } from './steps/Step2TLReview';
import { Step3Planning } from './steps/Step3Planning';
import { Step4Development } from './steps/Step4Development';
import { Step5Documentation } from './steps/Step5Documentation';
import { Step6WorkflowChart } from './steps/Step6WorkflowChart';
import { Step7Walkthrough } from './steps/Step7Walkthrough';
import { Step8InternalQA } from './steps/Step8InternalQA';
import { Step9CustomerReview } from './steps/Step9CustomerReview';
import { Step10CustomerApproval } from './steps/Step10CustomerApproval';
import { Step11Delivery } from './steps/Step11Delivery';

interface CRDetailWorkspaceProps {
  changeRequest: ChangeRequest;
  currentUser?: {
    id?: string;
    displayName?: string;
    username?: string;
    employeeId?: string;
    organization?: string;
    email?: string;
  } | null;
  onBack: () => void;
  onUpdateCR?: (updatedCR: ChangeRequest) => void;
}

export const CRDetailWorkspace: React.FC<CRDetailWorkspaceProps> = ({
  changeRequest: initialCR,
  currentUser,
  onBack,
  onUpdateCR,
}) => {
  const [cr, setCR] = useState<ChangeRequest>(initialCR);
  const [activeTabStage, setActiveTabStage] = useState<LifecycleStage>(
    initialCR.currentStage || 'submitted'
  );

  // Handle Team Lead approval with DB persistence
  const handleApproveTL = async (
    riskScore: 'Low' | 'Medium' | 'High',
    notes: string,
    estHours: number
  ) => {
    const nextStage = cr.currentStage === 'submitted' || cr.currentStage === 'tl_review' ? 'planning' : cr.currentStage;
    const tlData = {
      approvedBy: {
        id: currentUser?.id || cr.assignedLead?.id || 'usr-lead',
        name: currentUser?.displayName || currentUser?.username || cr.assignedLead?.name || 'Assigned Team Lead',
        email: currentUser?.email || cr.assignedLead?.email || 'lead@pjsofonic.internal',
        role: 'Team Leader',
        avatar: '',
        organization: currentUser?.organization || 'PJSOFONIC Ecosystem Core',
        isLead: true,
      },
      approvedAt: new Date().toISOString(),
      decision: 'approved' as const,
      notes,
      riskScore,
    };

    const updated: ChangeRequest = {
      ...cr,
      currentStage: nextStage,
      tlApproval: tlData,
      implementationSpec: {
        ...cr.implementationSpec,
        estimatedHours: estHours,
      },
    };

    setCR(updated);
    if (onUpdateCR) onUpdateCR(updated);

    try {
      await fetch(`/api/change-requests/${cr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStage: nextStage,
          status: 'in_progress',
          tlApproval: tlData,
        }),
      });
    } catch (e) {
      console.error('Failed to persist TL approval to DB:', e);
    }
  };

  // Handle Customer Digital Sign-off with DB persistence
  const handleCustomerSignoff = async (
    signedBy: string,
    signeeRole: string,
    notes: string
  ) => {
    const updated: ChangeRequest = {
      ...cr,
      currentStage: 'delivered',
      customerSignoff: {
        signedBy,
        signeeRole,
        signedAt: new Date().toISOString(),
        notes,
        acceptedTerms: true,
        signatureHash: `sha256_${Math.random().toString(36).substring(2, 12)}`,
      },
    };

    setCR(updated);
    if (onUpdateCR) onUpdateCR(updated);

    try {
      await fetch(`/api/change-requests/${cr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStage: 'delivered',
          status: 'completed',
        }),
      });
    } catch (e) {
      console.error('Failed to persist Customer Sign-off to DB:', e);
    }
  };

  // Handle production delivery trigger
  const handleDeployProduction = async () => {
    const updated: ChangeRequest = {
      ...cr,
      currentStage: 'delivered',
      status: 'completed',
    };

    setCR(updated);
    if (onUpdateCR) onUpdateCR(updated);

    try {
      await fetch(`/api/change-requests/${cr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStage: 'delivered',
          status: 'completed',
        }),
      });
    } catch (e) {
      console.error('Failed to update stage to delivered:', e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-4 md:p-6 space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-surface-secondary text-text-secondary hover:text-text-primary rounded-md border border-border transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Register</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-code font-bold text-accent text-sm md:text-base">
              {cr.ticketNumber}
            </span>
            <span className="text-text-muted">•</span>
            <h1 className="text-sm md:text-base font-bold text-text-primary truncate max-w-md">
              {cr.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge type="stage" value={cr.currentStage} size="md" />
          <StatusBadge type="priority" value={cr.priority} size="md" />
        </div>
      </div>

      {/* 11-Stage Interactive Stepper */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
        <div className="text-[11px] font-semibold uppercase text-text-muted tracking-wider mb-3">
          11-Stage Change-Request Lifecycle Engine
        </div>
        <LifecycleStepper
          changeRequest={cr}
          activeTabStage={activeTabStage}
          onSelectTabStage={(stage) => setActiveTabStage(stage)}
        />
      </div>

      {/* Two-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        {/* Left Column: Interactive Stage Workspace (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {activeTabStage === 'submitted' && <Step1CustomerSubmit cr={cr} />}
          {activeTabStage === 'tl_review' && (
            <Step2TLReview cr={cr} currentUser={currentUser} onApproveTL={handleApproveTL} />
          )}
          {activeTabStage === 'planning' && <Step3Planning cr={cr} />}
          {activeTabStage === 'development' && <Step4Development cr={cr} />}
          {activeTabStage === 'documentation' && <Step5Documentation cr={cr} />}
          {activeTabStage === 'workflow_chart' && <Step6WorkflowChart cr={cr} />}
          {activeTabStage === 'walkthrough' && <Step7Walkthrough cr={cr} />}
          {activeTabStage === 'internal_review' && <Step8InternalQA cr={cr} />}
          {activeTabStage === 'customer_review' && (
            <Step9CustomerReview cr={cr} currentUser={currentUser} />
          )}
          {activeTabStage === 'customer_approval' && (
            <Step10CustomerApproval
              cr={cr}
              currentUser={currentUser}
              onCustomerSignoff={handleCustomerSignoff}
            />
          )}
          {activeTabStage === 'delivered' && (
            <Step11Delivery cr={cr} onDeployProduction={handleDeployProduction} />
          )}
        </div>

        {/* Right Column: Ticket Metadata Sidebar (1 col) */}
        <div className="space-y-3">
          {/* Stakeholders Card */}
          <div className="glass-panel p-3.5 rounded-lg border border-border text-xs">
            <h4 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-2.5 pb-1.5 border-b border-border/80">
              Governance &amp; Stakeholders
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-text-muted text-[10px] uppercase block mb-1">
                  Team Leader &amp; Reviewer
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-700 flex items-center justify-center text-white text-xs font-bold">
                    {(cr.assignedLead?.name || 'T').charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary text-xs">
                      {cr.assignedLead?.name || 'Assigned Lead'}
                    </div>
                    <div className="text-[10px] text-text-muted">{cr.assignedLead?.role || 'Team Leader'}</div>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-text-muted text-[10px] uppercase block mb-1">
                  Customer Signatory
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center text-white text-xs font-bold">
                    {(cr.clientContact?.name || cr.clientName || 'C').charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary text-xs">
                      {cr.clientContact?.name || cr.clientName || 'Client Contact'}
                    </div>
                    <div className="text-[10px] text-text-muted">{cr.clientName}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Effort & Release Card */}
          <div className="glass-panel p-3.5 rounded-lg border border-border text-xs">
            <h4 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-2.5 pb-1.5 border-b border-border/80">
              Engineering Specs
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-muted">Target Release:</span>
                <span className="font-code text-accent font-semibold">
                  {cr.implementationSpec?.targetReleaseVersion || 'v4.19.0'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-muted">Estimated Hours:</span>
                <span className="font-code text-text-primary">
                  {cr.implementationSpec?.estimatedHours || 0} hrs
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-muted">Actual Logged:</span>
                <span className="font-code text-emerald-400">
                  {cr.implementationSpec?.actualHours || 0} hrs
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">DB Migrations:</span>
                <span className="font-code text-text-secondary">
                  {cr.implementationSpec?.dbMigrationsRequired ? 'Yes' : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="glass-panel p-3.5 rounded-lg border border-border text-xs">
            <h4 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-2 pb-1.5 border-b border-border/80">
              Enterprise Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(cr.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-surface-secondary border border-border rounded text-[10px] font-code text-text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
