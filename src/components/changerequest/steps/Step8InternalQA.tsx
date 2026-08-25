import React from 'react';
import { ChangeRequest } from '@/types';
import { CheckCircle2, ShieldCheck, Bug, Terminal, FileCheck2, UserCheck, User } from 'lucide-react';

interface Step8Props {
  cr: ChangeRequest;
}

export const Step8InternalQA: React.FC<Step8Props> = ({ cr }) => {
  const qa = cr.qaApproval || {
    approvedBy: {
      id: 'usr-qa-lead',
      name: 'Elena Rostova',
      email: 'qa.lead@pjsofonic.internal',
      role: 'Lead QA Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      organization: 'PJSOFONIC Ecosystem Core',
    },
    approvedAt: new Date().toISOString(),
    testsPassed: 148,
    testsFailed: 0,
    coveragePercent: 94.6,
    securityPassed: true,
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 08: Internal Review &amp; QA Sign-off
            </h4>
          </div>
          <span className="text-[11px] font-code text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            QA Gate Status
          </span>
        </div>

        {/* QA Lead Signoff Card */}
        <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-surface border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <span>QA Verification Completed</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5">
                148/148 unit, integration, and contract tests verified with 0 regressions detected.
              </p>
            </div>
          </div>
        </div>

        {/* Test Matrix Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-[10px] text-text-muted uppercase font-semibold block">Tests Passed</span>
            <span className="text-base font-bold font-code text-emerald-400">148 / 148</span>
          </div>
          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-[10px] text-text-muted uppercase font-semibold block">Code Coverage</span>
            <span className="text-base font-bold font-code text-cyan-400">94.6%</span>
          </div>
          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-[10px] text-text-muted uppercase font-semibold block">Security Scan</span>
            <span className="text-base font-bold font-code text-emerald-400">0 High Vulns</span>
          </div>
          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-[10px] text-text-muted uppercase font-semibold block">Regressions</span>
            <span className="text-base font-bold font-code text-accent">None (0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
