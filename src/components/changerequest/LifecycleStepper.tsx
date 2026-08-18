import React from 'react';
import { LIFECYCLE_STAGES, LifecycleStage, ChangeRequest } from '@/types';
import { Check, Clock, AlertCircle, Circle } from 'lucide-react';

interface LifecycleStepperProps {
  changeRequest: ChangeRequest;
  activeTabStage: LifecycleStage;
  onSelectTabStage: (stage: LifecycleStage) => void;
}

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  changeRequest,
  activeTabStage,
  onSelectTabStage,
}) => {
  const currentStageIndex = LIFECYCLE_STAGES.findIndex((s) => s.id === changeRequest.currentStage);

  return (
    <div className="w-full bg-surface-secondary/70 border-y border-border px-4 py-3 overflow-x-auto">
      <div className="flex items-center min-w-[980px] justify-between relative">
        {/* Background connector line */}
        <div className="absolute left-4 right-4 top-4 h-0.5 bg-border -z-0"></div>

        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex || changeRequest.currentStage === 'delivered';
          const isCurrent = stage.id === changeRequest.currentStage && changeRequest.currentStage !== 'delivered';
          const isPending = idx > currentStageIndex && changeRequest.currentStage !== 'delivered';
          const isTabActive = activeTabStage === stage.id;

          return (
            <button
              key={stage.id}
              onClick={() => onSelectTabStage(stage.id)}
              className="flex flex-col items-center group relative z-10 focus:outline-none"
            >
              {/* Step Circle Indicator */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-code transition-all ${
                  isTabActive
                    ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface'
                    : ''
                } ${
                  isCompleted
                    ? 'bg-emerald-500 text-[#07090D] shadow-sm'
                    : isCurrent
                    ? 'bg-accent text-[#07090D] live-indicator shadow-md'
                    : 'bg-surface border border-border text-text-muted group-hover:border-border-hover'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span>{stage.number}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-1.5 text-center max-w-[80px]">
                <div
                  className={`text-[11px] font-medium leading-tight truncate ${
                    isTabActive
                      ? 'text-accent font-semibold'
                      : isCompleted
                      ? 'text-text-primary'
                      : isCurrent
                      ? 'text-cyan-300 font-semibold'
                      : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                >
                  {stage.shortLabel}
                </div>
                <div className="text-[9px] text-text-muted truncate mt-0.5">
                  {stage.actor.split(' ')[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
