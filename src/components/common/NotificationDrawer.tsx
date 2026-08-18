import React from 'react';
import { Bell, Check, Clock, AlertTriangle, FileText, CheckCircle2, X } from 'lucide-react';
import { MOCK_ACTIVITY_LOG } from '@/data/mockData';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotification?: (target: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
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
            3 New
          </span>
        </div>
        <button onClick={onClose} className="p-1 text-text-muted hover:text-text-primary rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60 p-2">
        {MOCK_ACTIVITY_LOG.map((item) => (
          <div
            key={item.id}
            className="p-3 hover:bg-surface-secondary/70 rounded transition-colors text-xs flex gap-3 cursor-pointer group"
            onClick={() => {
              if (onSelectNotification) onSelectNotification(item.target);
              onClose();
            }}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === 'approval' && (
                <div className="w-6 h-6 rounded-full bg-purpleAccent-muted border border-purpleAccent-border flex items-center justify-center text-purple-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
              {item.type === 'review' && (
                <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileText className="w-3.5 h-3.5" />
                </div>
              )}
              {item.type === 'commit' && (
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
              {item.type === 'qa' && (
                <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              )}
              {item.type === 'submission' && (
                <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-text-primary leading-tight">
                <span className="font-medium text-text-primary">{item.user.name}</span>{' '}
                <span className="text-text-secondary">{item.action}</span>
              </p>
              <p className="text-accent font-code text-[11px] truncate group-hover:underline">
                {item.target}
              </p>
              <p className="text-[10px] text-text-muted">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-surface-secondary flex items-center justify-between text-xs">
        <button className="text-text-muted hover:text-text-primary transition-colors">
          Mark all as read
        </button>
        <span className="text-text-muted text-[11px]">SLA Live Feed</span>
      </div>
    </div>
  );
};
