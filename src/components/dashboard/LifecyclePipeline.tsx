import React from 'react';
import { LIFECYCLE_STAGES, LifecycleStage, ChangeRequest } from '@/types';
import { ChevronRight, Layers, ArrowRight } from 'lucide-react';

interface LifecyclePipelineProps {
  changeRequests: ChangeRequest[];
  selectedStageFilter: string | null;
  onSelectStage: (stage: LifecycleStage | null) => void;
}

export const LifecyclePipeline: React.FC<LifecyclePipelineProps> = ({
  changeRequests,
  selectedStageFilter,
  onSelectStage,
}) => {
  // Calculate counts per stage
  const countsByStage = LIFECYCLE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = changeRequests.filter((cr) => cr.currentStage === stage.id).length;
    return acc;
  }, {} as Record<LifecycleStage, number>);

  return (
    <div className="glass-panel p-4 rounded-lg border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            11-Stage Change Request Lifecycle Pipeline
          </h2>
          <span className="text-[11px] text-text-muted">
            (PJSOFONIC Release Governance Standard)
          </span>
        </div>
        {selectedStageFilter && (
          <button
            onClick={() => onSelectStage(null)}
            className="text-[11px] text-accent hover:underline flex items-center gap-1 font-medium"
          >
            Clear stage filter ✕
          </button>
        )}
      </div>

      {/* 11-step pipeline cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2">
        {LIFECYCLE_STAGES.map((stage) => {
          const count = countsByStage[stage.id] || 0;
          const isSelected = selectedStageFilter === stage.id;
          const hasActive = count > 0;

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(isSelected ? null : stage.id)}
              className={`p-2 rounded-md border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-accent-muted border-accent text-text-primary shadow-sm ring-1 ring-accent'
                  : hasActive
                  ? 'bg-surface-secondary border-border/90 hover:border-border-hover text-text-primary'
                  : 'bg-surface border-border/50 text-text-muted hover:border-border/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-code text-[10px] font-semibold text-text-muted">
                  #{stage.number.toString().padStart(2, '0')}
                </span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-code rounded font-semibold ${
                    count > 0
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-text-muted bg-surface'
                  }`}
                >
                  {count}
                </span>
              </div>
              <div>
                <div className="text-[11px] font-semibold truncate leading-tight mb-0.5">
                  {stage.shortLabel}
                </div>
                <div className="text-[9px] text-text-muted truncate">
                  {stage.actor}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
