import React, { useState } from 'react';
import { LIFECYCLE_STAGES, LifecycleStage } from '@/types';
import { Workflow, CheckCircle2, ArrowRight, ShieldCheck, Cpu, Code2, FileText, Video, Award, Rocket } from 'lucide-react';

export const WorkflowView: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<LifecycleStage>('tl_review');

  const getStageIcon = (num: number) => {
    switch (num) {
      case 1: return FileText;
      case 2: return ShieldCheck;
      case 3: return Cpu;
      case 4: return Code2;
      case 5: return FileText;
      case 6: return Workflow;
      case 7: return Video;
      case 8: return ShieldCheck;
      case 9: return FileText;
      case 10: return Award;
      case 11: return Rocket;
      default: return Workflow;
    }
  };

  const selectedStage = LIFECYCLE_STAGES.find((s) => s.id === activeStageId) || LIFECYCLE_STAGES[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-text-primary">
              PJSOFONIC 11-Stage Change Management Standard
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Formal governance lifecycle required for all enterprise ERP, FinTech, and SCM software modifications
          </p>
        </div>
        <span className="text-xs font-code text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
          SOC2 Type II Mandate v4.2
        </span>
      </div>

      {/* 11-Stage Interactive Pipeline Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {LIFECYCLE_STAGES.map((stage) => {
          const Icon = getStageIcon(stage.number);
          const isSelected = activeStageId === stage.id;

          return (
            <div
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-4 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-surface border-accent ring-1 ring-accent text-text-primary shadow-lg'
                  : 'glass-panel text-text-secondary hover:border-border-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-code text-xs font-bold text-accent">
                    Stage {stage.number.toString().padStart(2, '0')}
                  </span>
                  <div className="w-6 h-6 rounded bg-surface-secondary flex items-center justify-center text-text-muted">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="text-xs font-bold text-text-primary mb-1">
                  {stage.label}
                </h3>
                <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                  {stage.description}
                </p>
              </div>

              <div className="pt-2 mt-3 border-t border-border/50 flex items-center justify-between text-[10px] text-text-muted">
                <span>Accountable:</span>
                <span className="font-semibold text-text-primary">{stage.actor}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Inspector for Active Stage */}
      <div className="glass-panel p-5 rounded-lg border border-accent/40 bg-surface">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-code text-xs font-bold text-accent bg-accent-muted border border-accent-border px-2 py-0.5 rounded">
            Stage #{selectedStage.number.toString().padStart(2, '0')}
          </span>
          <h3 className="text-sm font-bold text-text-primary">
            Detailed Specification: {selectedStage.label}
          </h3>
        </div>

        <p className="text-xs text-text-secondary mb-4">
          {selectedStage.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-surface-secondary rounded border border-border">
            <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
              Primary Role Accountable
            </span>
            <span className="font-semibold text-text-primary">{selectedStage.actor}</span>
          </div>

          <div className="p-3 bg-surface-secondary rounded border border-border">
            <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
              Automated Gate Enforcement
            </span>
            <span className="text-emerald-400 font-semibold">Strict Digital Checkpoint</span>
          </div>

          <div className="p-3 bg-surface-secondary rounded border border-border">
            <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">
              Audit Record
            </span>
            <span className="font-code text-text-secondary">Immutable SHA-256 Stamp</span>
          </div>
        </div>
      </div>
    </div>
  );
};
