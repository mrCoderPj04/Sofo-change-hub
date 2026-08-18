import React from 'react';
import { Project, ChangeRequest } from '@/types';
import { FolderGit2, ArrowRight, ShieldCheck, Activity, Layers, CheckCircle2 } from 'lucide-react';
import { MOCK_PROJECTS } from '@/data/mockData';

interface ProjectsViewProps {
  changeRequests: ChangeRequest[];
  onSelectProject: (projectId: string) => void;
  onSelectCR: (cr: ChangeRequest) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  changeRequests,
  onSelectProject,
  onSelectCR,
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            PJSOFONIC Ecosystem Projects & Microservice Suites
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Active enterprise systems under change management SLA governance
          </p>
        </div>
        <div className="text-xs text-text-muted font-code">
          4 Core Enterprise Systems Registered
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PROJECTS.map((project) => {
          const projectCRs = changeRequests.filter((cr) => cr.projectId === project.id);
          return (
            <div
              key={project.id}
              className="glass-panel p-5 rounded-lg border border-border hover:border-border-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-code font-bold text-accent text-xs bg-accent-muted border border-accent-border px-2 py-0.5 rounded">
                      {project.key}
                    </span>
                    <span className="text-[11px] text-text-muted uppercase font-semibold">
                      {project.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-code font-semibold ${
                      project.health === 'healthy'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                    }`}
                  >
                    {project.health.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-text-primary mb-1.5">{project.name}</h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* In-Flight Tickets within Project */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] text-text-muted uppercase font-semibold block">
                    In-Flight Change Requests ({projectCRs.length})
                  </span>
                  {projectCRs.slice(0, 2).map((cr) => (
                    <div
                      key={cr.id}
                      onClick={() => onSelectCR(cr)}
                      className="p-2 bg-surface rounded border border-border/70 hover:border-accent text-xs flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate mr-2">
                        <span className="font-code text-accent font-semibold">{cr.ticketNumber}</span>
                        <span className="text-text-primary truncate">{cr.title}</span>
                      </div>
                      <span className="text-[10px] text-text-muted shrink-0 font-code">
                        {cr.currentStage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Project Metadata */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
                <span>Client: <strong className="text-text-secondary">{project.client}</strong></span>
                <button
                  onClick={() => onSelectProject(project.id)}
                  className="text-accent hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Filter Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
