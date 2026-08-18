import React from 'react';
import { ChangeRequest } from '@/types';
import { FileText, Download, ExternalLink, BookOpen, ShieldCheck, Code2 } from 'lucide-react';

interface DocumentsViewProps {
  changeRequests: ChangeRequest[];
  onSelectCR: (cr: ChangeRequest) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  changeRequests,
  onSelectCR,
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-text-primary">
              Enterprise Technical Documentation & Specifications
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Living runbooks, architecture specs, schema migrations, and API delta contracts
          </p>
        </div>
      </div>

      {/* Docs List */}
      <div className="space-y-3">
        {changeRequests.map((cr) => (
          <div
            key={cr.id}
            onClick={() => onSelectCR(cr)}
            className="glass-panel p-4 rounded-lg border border-border hover:border-border-hover transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <span className="font-code text-xs font-bold text-accent">
                  {cr.ticketNumber}
                </span>
                <span className="text-text-muted">•</span>
                <span className="text-xs font-semibold text-text-primary group-hover:text-cyan-300">
                  {cr.title}
                </span>
              </div>
              <span className="text-[11px] font-code text-text-muted">
                v{cr.implementationSpec.targetReleaseVersion}
              </span>
            </div>

            <p className="text-xs text-text-secondary line-clamp-2 mb-3">
              {cr.implementationSpec.architectureNotes}
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40 text-text-muted">
              <div className="flex items-center gap-3 text-[11px]">
                <span>Microservices: <strong className="text-text-secondary">{cr.implementationSpec.affectedMicroservices.join(', ')}</strong></span>
                <span>•</span>
                <span>DB Migrations: <strong className="text-text-secondary">{cr.implementationSpec.dbMigrationsRequired ? 'Yes' : 'No'}</strong></span>
              </div>
              <span className="text-accent hover:underline flex items-center gap-1 font-medium">
                View Markdown Spec →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
