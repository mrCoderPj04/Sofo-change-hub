import React, { useState } from 'react';
import { Settings, ShieldCheck, Bell, Server, Database, Save, Check } from 'lucide-react';
import { CURRENT_USER } from '@/data/mockData';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [criticalSLAHours, setCriticalSLAHours] = useState(24);
  const [highSLAHours, setHighSLAHours] = useState(48);
  const [mediumSLAHours, setMediumSLAHours] = useState(120);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-text-primary">
              Ecosystem Governance & SLA Configuration
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            PJSOFONIC core parameters, Kubernetes cluster targets, and automated notification webhooks
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SLA Policy Section */}
        <div className="glass-panel p-5 rounded-lg border border-border space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SLA Response & Delivery Windows</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-text-muted text-[11px] font-semibold mb-1">
                Critical Priority Triage Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={criticalSLAHours}
                  onChange={(e) => setCriticalSLAHours(Number(e.target.value))}
                  className="w-24 bg-surface border border-border rounded px-3 py-1.5 text-text-primary font-code focus:outline-none focus:border-accent"
                />
                <span className="text-text-muted">Hours</span>
              </div>
            </div>

            <div>
              <label className="block text-text-muted text-[11px] font-semibold mb-1">
                High Priority Triage Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={highSLAHours}
                  onChange={(e) => setHighSLAHours(Number(e.target.value))}
                  className="w-24 bg-surface border border-border rounded px-3 py-1.5 text-text-primary font-code focus:outline-none focus:border-accent"
                />
                <span className="text-text-muted">Hours</span>
              </div>
            </div>

            <div>
              <label className="block text-text-muted text-[11px] font-semibold mb-1">
                Medium Priority Triage Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={mediumSLAHours}
                  onChange={(e) => setMediumSLAHours(Number(e.target.value))}
                  className="w-24 bg-surface border border-border rounded px-3 py-1.5 text-text-primary font-code focus:outline-none focus:border-accent"
                />
                <span className="text-text-muted">Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cluster Environments */}
        <div className="glass-panel p-5 rounded-lg border border-border space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Deployment Target Clusters</span>
          </h3>

          <div className="space-y-2">
            <div className="p-3 bg-surface rounded border border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">prod-fin-eu1 (Frankfurt)</div>
                <div className="text-[11px] text-text-muted">Kubernetes 1.30 • 12 Nodes active</div>
              </div>
              <span className="text-[10px] font-code bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded">
                Healthy
              </span>
            </div>

            <div className="p-3 bg-surface rounded border border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">staging-fin-02.pjsofonic.internal</div>
                <div className="text-[11px] text-text-muted">Tenant Sandbox Cluster for Customer Walkthroughs</div>
              </div>
              <span className="text-[10px] font-code bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded">
                Active Sandbox
              </span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" /> Settings Saved
            </span>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-[#07090D] font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Governance Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
