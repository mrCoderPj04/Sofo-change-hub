import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import { Play, CheckCircle2, Video, CheckSquare, Sparkles, Clock } from 'lucide-react';

interface Step7Props {
  cr: ChangeRequest;
}

export const Step7Walkthrough: React.FC<Step7Props> = ({ cr }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const items = cr.walkthroughItems || [];

  return (
    <div className="space-y-4">
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 07: Recorded Walkthrough & Verification Scenarios
            </h4>
          </div>
          <span className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded font-code">
            2 Verification Artifacts Recorded
          </span>
        </div>

        {/* Walkthrough Video Player Simulator */}
        <div className="bg-[#05070A] border border-border rounded-lg overflow-hidden mb-4">
          <div className="relative aspect-video max-h-[320px] w-full bg-slate-950 flex flex-col items-center justify-center border-b border-border/60">
            {/* Background simulated screen */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-secondary opacity-80 flex items-center justify-center p-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 mx-auto flex items-center justify-center">
                  <Play className="w-5 h-5 text-accent fill-accent ml-0.5" />
                </div>
                <div className="text-xs font-semibold text-text-primary">
                  Demo Walkthrough: SWIFT MT940 Ingestion & Real-Time Balance Posting
                </div>
                <div className="text-[11px] text-text-muted">
                  Duration: 3m 45s • Recorded by Marcus Vance (Senior Staff Engineer)
                </div>
              </div>
            </div>

            {/* Play overlay trigger */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative z-10 px-4 py-2 bg-surface/90 hover:bg-surface border border-accent/60 text-xs font-semibold text-accent rounded-md shadow-lg transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-accent" />
              <span>{isPlaying ? 'Pause Demo Playback' : 'Play Walkthrough Recording'}</span>
            </button>
          </div>

          {/* Player Progress bar */}
          <div className="p-3 bg-surface-secondary flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-code font-semibold">1080p 60fps</span>
              <span>•</span>
              <span>Staging Environment: <span className="font-code text-text-secondary">staging-fin-02.pjsofonic.internal</span></span>
            </div>
            <span className="font-code text-[11px]">3:45 / 3:45</span>
          </div>
        </div>

        {/* Key Demonstration Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface p-3.5 rounded border border-border">
            <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Demonstrated Capabilities
            </h5>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Automatic statement header validation in &lt;12ms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Zero duplicate entries detected during idempotency stress injection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Real-time multi-currency journal adjustments (EUR, USD, JPY)</span>
              </li>
            </ul>
          </div>

          <div className="bg-surface p-3.5 rounded border border-border">
            <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Client Verification Sign-off Criteria
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-1.5 bg-surface-secondary rounded border border-border/60">
                <span className="text-text-secondary">Latency SLA (&lt; 2000ms):</span>
                <span className="font-code text-emerald-400 font-semibold">420ms (Passed)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-surface-secondary rounded border border-border/60">
                <span className="text-text-secondary">Journal Integrity Check:</span>
                <span className="font-code text-emerald-400 font-semibold">100% Balanced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
