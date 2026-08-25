import React from 'react';
import { Bell, Check, Clock, AlertTriangle, FileText, CheckCircle2, X } from 'lucide-react';
import { ChangeRequest } from '@/types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  changeRequests?: ChangeRequest[];
  onSelectNotification?: (target: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  changeRequests = [],
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-surface border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">Ecosystem Notifications</h3>
          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-accent-muted text-accent border border-accent-border rounded">
            {changeRequests.length} Live
          </span>
        </div>
        <button onClick={onClose} className="p-1 text-text-muted hover:text-text-primary rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60 p-2">
        {changeRequests.length === 0 ? (
          <div className="py-12 text-center text-text-muted text-xs">
            <Bell className="w-6 h-6 text-text-muted mx-auto mb-2 opacity-50" />
            <p className="font-medium text-text-secondary">No notifications right now</p>
            <p className="text-[11px] text-text-muted mt-0.5">
              Live alerts will appear as change requests are created and approved.
            </p>
          </div>
        ) : (
          changeRequests.map((cr) => (
            <div
              key={cr.id}
              className="p-3 hover:bg-surface-secondary/70 rounded transition-colors text-xs flex gap-3 cursor-pointer group"
              onClick={() => {
                if (onSelectNotification) onSelectNotification(cr.ticketNumber);
                onClose();
              }}
            >
              <div className="shrink-0 mt-0.5">
                {cr.currentStage === 'delivered' ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : cr.currentStage === 'tl_review' ? (
                  <div className="w-6 h-6 rounded-full bg-purpleAccent-muted border border-purpleAccent-border flex items-center justify-center text-purple-400">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-text-primary leading-tight">
                  <span className="font-medium text-text-primary">{cr.clientName}</span>{' '}
                  <span className="text-text-secondary">
                    {cr.currentStage === 'submitted' || cr.currentStage === 'tl_review'
                      ? 'queued change request'
                      : `moved request to ${cr.currentStage}`}
                  </span>
                </p>
                <p className="text-accent font-code text-[11px] truncate group-hover:underline">
                  {cr.ticketNumber}: {cr.title}
                </p>
                <p className="text-[10px] text-text-muted">
                  {new Date(cr.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-surface-secondary flex items-center justify-between text-xs">
        <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
          Close
        </button>
        <span className="text-text-muted text-[11px]">Real-Time Notifications</span>
      </div>
    </div>
  );
};
