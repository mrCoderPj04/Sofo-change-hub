import React from 'react';
import { Activity, ShieldCheck, CheckCircle2, Clock, FileText } from 'lucide-react';
import { ChangeRequest } from '@/types';

interface ActivityFeedProps {
  changeRequests?: ChangeRequest[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ changeRequests = [] }) => {
  return (
    <div className="glass-panel p-4 rounded-lg border border-border flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Real-Time Audit Activity
          </h3>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded font-code">
          Live Stream
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {changeRequests.length === 0 ? (
          <div className="py-8 text-center text-text-muted text-xs">
            <Clock className="w-6 h-6 text-text-muted mx-auto mb-2 opacity-50" />
            <p className="font-medium text-text-secondary">No live audit activity yet</p>
            <p className="text-[11px] text-text-muted mt-0.5">
              Activity entries will stream here in real-time as change requests are submitted and reviewed.
            </p>
          </div>
        ) : (
          changeRequests.map((cr) => (
            <div key={cr.id} className="flex gap-3 text-xs pb-2 border-b border-border/40 last:border-0">
              <div className="w-7 h-7 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-accent shrink-0 mt-0.5">
                {cr.currentStage === 'delivered' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : cr.currentStage === 'tl_review' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="text-text-primary leading-tight">
                  <span className="font-semibold text-text-primary">{cr.clientName}</span>{' '}
                  <span className="text-text-secondary">
                    {cr.currentStage === 'submitted' || cr.currentStage === 'tl_review'
                      ? 'submitted change request'
                      : `updated request to stage ${cr.currentStage}`}
                  </span>
                </div>
                <div className="text-[11px] font-code text-accent hover:underline cursor-pointer truncate">
                  {cr.ticketNumber}: {cr.title}
                </div>
                <div className="text-[10px] text-text-muted">
                  {new Date(cr.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
        <span>PJSOFONIC Audit Log</span>
        <span className="font-code text-emerald-400">Live PostgreSQL Stream</span>
      </div>
    </div>
  );
};
