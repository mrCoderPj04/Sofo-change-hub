import React, { useState, useEffect } from 'react';
import { Search, FileCode, CheckCircle, ArrowRight, X, Clock, Layers } from 'lucide-react';
import { ChangeRequest } from '@/types';
import { StatusBadge } from './StatusBadge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  changeRequests: ChangeRequest[];
  onSelectCR: (cr: ChangeRequest) => void;
  onNavigateSection: (section: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  changeRequests,
  onSelectCR,
  onNavigateSection,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCRs = changeRequests.filter(
    (cr) =>
      cr.title.toLowerCase().includes(query.toLowerCase()) ||
      cr.ticketNumber.toLowerCase().includes(query.toLowerCase()) ||
      cr.clientName.toLowerCase().includes(query.toLowerCase()) ||
      cr.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const quickNav = [
    { label: 'Go to Approvals Queue', section: 'approvals', icon: CheckCircle },
    { label: 'View All Change Requests', section: 'requests', icon: FileCode },
    { label: 'Inspect Projects Portfolio', section: 'projects', icon: Layers },
    { label: 'View Interactive Workflow Chart', section: 'workflow', icon: ArrowRight },
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-surface-secondary">
          <Search className="w-4 h-4 text-text-muted mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets, clients, microservices, or jump to section (e.g. CR-084)..."
            className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-border/50">
          {/* Quick Navigation Items */}
          {quickNav.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-text-muted uppercase">
                Quick Navigation
              </div>
              {quickNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.section}
                    onClick={() => {
                      onNavigateSection(item.section);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-accent" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-code">Jump</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Change Requests Section */}
          <div className="py-2">
            <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-text-muted uppercase flex justify-between">
              <span>Change Requests</span>
              <span className="font-normal text-text-muted">{filteredCRs.length} found</span>
            </div>
            {filteredCRs.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-text-muted">
                No matching change requests found for "{query}".
              </div>
            ) : (
              filteredCRs.map((cr) => (
                <button
                  key={cr.id}
                  onClick={() => {
                    onSelectCR(cr);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-surface-secondary rounded text-left transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden mr-2">
                    <span className="font-code text-xs font-semibold text-accent shrink-0">
                      {cr.ticketNumber}
                    </span>
                    <div className="truncate">
                      <div className="text-xs text-text-primary font-medium truncate group-hover:text-cyan-300">
                        {cr.title}
                      </div>
                      <div className="text-[11px] text-text-muted truncate">
                        {cr.clientName} • {cr.projectName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge type="stage" value={cr.currentStage} size="sm" />
                    <StatusBadge type="priority" value={cr.priority} size="sm" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-border bg-surface-secondary/80 flex items-center justify-between text-[11px] text-text-muted">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1.5 py-0.5 bg-border rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-border rounded text-[10px]">↓</kbd></span>
            <span>Select: <kbd className="px-1.5 py-0.5 bg-border rounded text-[10px]">↵</kbd></span>
          </div>
          <span>Close: <kbd className="px-1.5 py-0.5 bg-border rounded text-[10px]">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
};
