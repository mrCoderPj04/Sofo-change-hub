import React from 'react';
import { Activity, ArrowRight, MessageSquare, CheckCircle, ShieldCheck, GitCommit, Send } from 'lucide-react';
import { MOCK_ACTIVITY_LOG } from '@/data/mockData';

export const ActivityFeed: React.FC = () => {
  return (
    <div className="glass-panel p-4 rounded-lg border border-border flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Audit Activity & Sign-off Telemetry
          </h3>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded font-code">
          Live Stream
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {MOCK_ACTIVITY_LOG.map((item) => (
          <div key={item.id} className="flex gap-3 text-xs">
            <img
              src={item.user.avatar}
              alt={item.user.name}
              className="w-7 h-7 rounded-full object-cover border border-border shrink-0 mt-0.5"
            />
            <div className="flex-1 space-y-0.5">
              <div className="text-text-primary leading-tight">
                <span className="font-semibold text-text-primary">{item.user.name}</span>{' '}
                <span className="text-text-secondary">{item.action}</span>
              </div>
              <div className="text-[11px] font-code text-accent hover:underline cursor-pointer">
                {item.target}
              </div>
              <div className="text-[10px] text-text-muted">{item.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
        <span>Immutable PJSOFONIC Audit Log</span>
        <span className="font-code text-text-secondary">Chain Hash #94a1f</span>
      </div>
    </div>
  );
};
