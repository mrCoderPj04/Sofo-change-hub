import React from 'react';
import { ChangeRequest } from '@/types';
import { Cpu, Database, Undo2, Layers, Server, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Step3Props {
  cr: ChangeRequest;
}

export const Step3Planning: React.FC<Step3Props> = ({ cr }) => {
  const spec = cr.implementationSpec;

  return (
    <div className="space-y-4">
      {/* Implementation Spec Overview */}
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 03: Technical Implementation Plan & Architecture Spec
            </h4>
          </div>
          <span className="text-[11px] font-code text-accent bg-accent-muted border border-accent-border px-2 py-0.5 rounded">
            Target Release: {spec.targetReleaseVersion}
          </span>
        </div>

        {/* Architecture Notes */}
        <div className="mb-4">
          <label className="block text-text-muted text-[11px] font-semibold uppercase tracking-wider mb-1.5">
            Architecture Blueprint & Runtime Container Topology
          </label>
          <div className="bg-surface p-3 rounded border border-border/80 text-xs text-text-secondary leading-relaxed font-mono">
            {spec.architectureNotes}
          </div>
        </div>

        {/* Affected Microservices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-surface p-3 rounded border border-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-primary mb-2">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Affected PJSOFONIC Microservices ({spec.affectedMicroservices.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {spec.affectedMicroservices.map((svc) => (
                <span
                  key={svc}
                  className="px-2 py-1 bg-surface-secondary border border-border rounded text-[11px] font-code text-cyan-300"
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-surface p-3 rounded border border-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-primary mb-2">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Database Migrations & Schema Delta</span>
            </div>
            {spec.dbMigrationsRequired ? (
              <div>
                <span className="inline-block px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-code mb-1">
                  MIGRATION REQUIRED
                </span>
                <p className="text-[11px] font-code text-text-secondary">
                  {spec.dbMigrationDetails}
                </p>
              </div>
            ) : (
              <p className="text-xs text-text-muted">No schema migrations or DDL updates required.</p>
            )}
          </div>
        </div>

        {/* Rollback Strategy */}
        <div className="bg-surface p-3 rounded border border-border">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1.5">
            <Undo2 className="w-3.5 h-3.5" />
            <span>Zero-Downtime Rollback Strategy (SLA Mandate)</span>
          </div>
          <p className="text-xs text-text-secondary font-mono">
            {spec.rollbackStrategy}
          </p>
        </div>
      </div>
    </div>
  );
};
