import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import { Rocket, CheckCircle2, Server, Download, ShieldCheck, ExternalLink, Activity } from 'lucide-react';

interface Step11Props {
  cr: ChangeRequest;
  onDeployProduction?: () => void;
}

export const Step11Delivery: React.FC<Step11Props> = ({ cr, onDeployProduction }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(cr.currentStage === 'delivered');

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
      if (onDeployProduction) onDeployProduction();
    }, 1800);
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 11: Production Cluster Delivery & Release Deployment
            </h4>
          </div>
          <span className="text-[11px] font-code text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            {isDeployed ? 'Live in Production' : 'Staged for Release'}
          </span>
        </div>

        {/* Release Status & Target Cluster */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-text-muted text-[10px] uppercase font-semibold block mb-1">
              Production Version
            </span>
            <div className="text-sm font-bold font-code text-accent">
              {cr.implementationSpec.targetReleaseVersion || 'v4.18.0'}
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">Semantic Release Tag</div>
          </div>

          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-text-muted text-[10px] uppercase font-semibold block mb-1">
              Target Kubernetes Cluster
            </span>
            <div className="text-sm font-bold font-code text-text-primary">
              prod-fin-eu1 (Frankfurt)
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 12 Pods Running
            </div>
          </div>

          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-text-muted text-[10px] uppercase font-semibold block mb-1">
              Health & Telemetry
            </span>
            <div className="text-sm font-bold font-code text-emerald-400">
              0.00% Error Rate
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">Prometheus P99: 18ms</div>
          </div>
        </div>

        {/* Action / Trigger Deployment */}
        <div className="bg-surface p-4 rounded-lg border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-semibold text-text-primary text-xs mb-1">
                {isDeployed
                  ? 'Production Rollout Successful & Telemetry Verified'
                  : 'Automated Blue/Green Cluster Rollout'}
              </h5>
              <p className="text-[11px] text-text-secondary">
                {isDeployed
                  ? 'Customer has been automatically notified. Release notes published to knowledge base.'
                  : 'Requires valid customer digital signature (Stage 10). Executes automated zero-downtime rolling update.'}
              </p>
            </div>

            {!isDeployed ? (
              <button
                type="button"
                onClick={handleDeploy}
                disabled={isDeploying}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#07090D] font-bold text-xs rounded-md shadow-md flex items-center gap-2 transition-all shrink-0"
              >
                <Rocket className="w-4 h-4" />
                <span>{isDeploying ? 'Deploying to Cluster...' : 'Execute Production Release'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>Delivered & Closed</span>
              </div>
            )}
          </div>
        </div>

        {/* Release Notes Summary */}
        <div className="mt-4 bg-surface p-3.5 rounded border border-border text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-text-primary uppercase tracking-wider text-[11px]">
              Generated Release Note & Changelog
            </span>
            <button className="text-[11px] text-accent hover:underline flex items-center gap-1">
              <Download className="w-3 h-3" /> Export Markdown
            </button>
          </div>
          <div className="font-mono text-[11px] text-text-secondary bg-[#05070A] p-3 rounded border border-border/80 space-y-1">
            <div># PJSOFONIC ERP {cr.implementationSpec.targetReleaseVersion}</div>
            <div className="text-emerald-300">+ Added: {cr.title} ({cr.ticketNumber})</div>
            <div>+ Client: {cr.clientName}</div>
            <div>+ Validated By: QA Team (148 suites passed) & Customer Signatory</div>
            <div>+ SHA-256 Commit: c8f419a / b1e092d</div>
          </div>
        </div>
      </div>
    </div>
  );
};
