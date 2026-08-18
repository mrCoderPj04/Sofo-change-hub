import React, { useState } from 'react';
import { ChangeRequest, CRPriority } from '@/types';
import { X, Plus, Sparkles, Building2, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { MOCK_PROJECTS } from '@/data/mockData';

interface CRCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCR: (newCR: any) => void;
  currentUser?: {
    id?: string;
    displayName?: string;
    username?: string;
    employeeId?: string;
    changehubRole?: string;
    organization?: string;
  } | null;
}

export const CRCreationModal: React.FC<CRCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateCR,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(MOCK_PROJECTS[0].id);
  const [clientName, setClientName] = useState(currentUser?.organization || 'Apex Global Financials');
  const [category, setCategory] = useState<ChangeRequest['category']>('Feature Enhancement');
  const [priority, setPriority] = useState<CRPriority>('high');
  const [description, setDescription] = useState('');
  const [businessJustification, setBusinessJustification] = useState('');
  const [targetDays, setTargetDays] = useState(14);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title,
        description,
        category,
        priority,
        submittedBy: currentUser?.id || null,
        clientName: clientName || currentUser?.organization || 'Apex Global Financials',
        businessJustification,
        targetDays,
        tags: [category.split(' ')[0], priority.toUpperCase()],
      };

      const res = await fetch('/api/change-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create change request in database');
      }

      onCreateCR(data.data);
      onClose();
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to save change request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden my-8 animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-text-primary">
              Initiate Customer Change Request (CR)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-text-muted hover:text-text-primary rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 mx-4 mt-4 bg-red-950/40 border border-red-800/50 rounded text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
              Change Request Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Automated Multi-Currency Ledger Intraday Reconciliation"
              className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Project & Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
                Target Enterprise System
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent cursor-pointer"
              >
                {MOCK_PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.key})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
                Requesting Client Organization
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
                Change Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="Feature Enhancement">Feature Enhancement</option>
                <option value="Schema Modification">Schema Modification</option>
                <option value="Integration / API">Integration / API</option>
                <option value="Compliance & Regulatory">Compliance & Regulatory</option>
                <option value="Performance / Hotfix">Performance / Hotfix</option>
              </select>
            </div>

            <div>
              <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CRPriority)}
                className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="critical">Critical (24h Triage)</option>
                <option value="high">High (48h Triage)</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
                Delivery Window
              </label>
              <select
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value={7}>7 Days (Fast Track)</option>
                <option value={14}>14 Days (Standard Sprint)</option>
                <option value={30}>30 Days (Major Milestone)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
              Functional Scope & Requirement Specification *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe user stories, schema fields, expected API payloads, and acceptance criteria..."
              className="w-full bg-surface-secondary border border-border rounded-md p-2.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Business Justification */}
          <div>
            <label className="block text-text-muted text-[11px] font-semibold uppercase mb-1">
              Business Justification / Regulatory Mandate
            </label>
            <textarea
              rows={2}
              value={businessJustification}
              onChange={(e) => setBusinessJustification(e.target.value)}
              placeholder="Explain revenue impact, customer SLA, or compliance drivers..."
              className="w-full bg-surface-secondary border border-border rounded-md p-2.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Footer CTAs */}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-text-muted">
              Will enter Stage 01 (Submitted) and notify Team Lead in real-time
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-text-secondary hover:text-text-primary transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-[#07090D] font-bold text-xs rounded-md shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isSubmitting ? 'Saving to Database...' : 'Submit Change Request'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
