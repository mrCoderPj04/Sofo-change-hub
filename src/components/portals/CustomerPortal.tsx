import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import {
  Building2,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileSignature,
  Video,
  ChevronRight,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface CustomerPortalProps {
  changeRequests: ChangeRequest[];
  onSelectCR: (cr: ChangeRequest) => void;
  onOpenNewCR: () => void;
  onSwitchToDesktop: () => void;
  currentUser?: {
    displayName?: string;
    username?: string;
    employeeId?: string;
    organization?: string;
  } | null;
  onLogout?: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  changeRequests,
  onSelectCR,
  onOpenNewCR,
  onSwitchToDesktop,
  currentUser,
  onLogout,
}) => {
  const [selectedClient, setSelectedClient] = useState(currentUser?.organization || 'Apex Global Financials');
  
  // Show either client specific or all active requests
  const clientCRs = changeRequests;

  const userName = currentUser?.displayName || currentUser?.username || 'Customer Signatory';

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Customer Header */}
      <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="SOFO ChangeHub Logo"
            className="w-8 h-8 rounded-md object-contain bg-surface-secondary border border-border/60 p-0.5"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-text-primary">
                SOFO ChangeHub
              </span>
              <span className="px-2 py-0.2 bg-purpleAccent-muted text-purple-300 border border-purpleAccent-border rounded text-[10px] font-semibold">
                Client Portal
              </span>
            </div>
            <div className="text-[11px] text-text-muted">
              Connected as: <span className="text-text-secondary font-medium">{currentUser?.organization || selectedClient}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={onOpenNewCR}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-[#07090D] font-bold px-3 py-1.5 rounded-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Change Request</span>
          </button>

          <button
            onClick={onSwitchToDesktop}
            className="px-3 py-1.5 text-text-secondary hover:text-text-primary border border-border hover:bg-surface-secondary rounded transition-colors"
          >
            Switch to Team Lead View
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 text-text-muted hover:text-red-400 hover:bg-surface-secondary rounded border border-border transition-colors flex items-center gap-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="glass-panel p-5 rounded-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-bold text-text-primary">
              Welcome, {userName}
            </h2>
            <p className="text-xs text-text-secondary">
              Track lifecycle milestones in real-time, review demo walkthroughs, and provide executive digital sign-off for your enterprise ERP change requests.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-text-muted uppercase block">Active In-Flight</span>
              <span className="text-xl font-bold font-code text-accent">{clientCRs.length} Requests</span>
            </div>
          </div>
        </div>

        {/* Client Request Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Your Real-Time Change Requests ({clientCRs.length})</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-code flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Supabase Live Sync
            </span>
          </div>

          {clientCRs.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-lg border border-border">
              <Building2 className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-60" />
              <h4 className="text-sm font-bold text-text-primary">No Change Requests Yet</h4>
              <p className="text-xs text-text-muted mt-1 mb-4">
                You have not initiated any change requests yet. Click below to submit your first request for Team Lead approval.
              </p>
              <button
                onClick={onOpenNewCR}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-[#07090D] font-bold text-xs rounded-md shadow transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit First Change Request</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {clientCRs.map((cr) => (
                <div
                  key={cr.id}
                  onClick={() => onSelectCR(cr)}
                  className="glass-panel p-4 rounded-lg border border-border hover:border-purpleAccent-border/80 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className="font-code font-bold text-accent text-xs">
                        {cr.ticketNumber}
                      </span>
                      <span className="text-text-muted">•</span>
                      <span className="text-xs font-semibold text-text-primary group-hover:text-cyan-300 transition-colors">
                        {cr.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge type="stage" value={cr.currentStage} size="sm" />
                      <StatusBadge type="priority" value={cr.priority} size="sm" />
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 mb-3">
                    {cr.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-border/40">
                    <div className="flex items-center gap-4 text-[11px] text-text-muted">
                      <span>
                        Target Date: <strong className="text-text-secondary font-code">{new Date(cr.targetDeliveryDate).toLocaleDateString()}</strong>
                      </span>
                      <span>
                        Assigned Lead: <strong className="text-text-secondary">{cr.assignedLead?.name || 'Rajkamal Singh'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {cr.currentStage === 'customer_approval' && (
                        <span className="px-2 py-0.5 bg-purpleAccent-muted text-purple-300 border border-purpleAccent-border rounded text-[11px] font-bold flex items-center gap-1">
                          <FileSignature className="w-3.5 h-3.5" /> Awaiting Your Sign-off
                        </span>
                      )}
                      <button className="px-3 py-1 bg-surface hover:bg-surface-secondary border border-border text-text-primary text-xs rounded font-medium flex items-center gap-1">
                        <span>Inspect Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
