import React from 'react';
import { ChangeRequest } from '@/types';
import { CheckCircle2, ShieldCheck, Bug, Terminal, FileCheck2, UserCheck } from 'lucide-react';
import { MOCK_USERS } from '@/data/mockData';

interface Step8Props {
  cr: ChangeRequest;
}

export const Step8InternalQA: React.FC<Step8Props> = ({ cr }) => {
  const qa = cr.qaApproval || {
    approvedBy: MOCK_USERS.elena,
    approvedAt: '2026-08-15T09:15:00Z',
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
              Stage 08: Internal Review & QA Sign-off
            </h4>
          </div>
          <span className="text-[11px] font-code text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            QA Gate Passed
          </span>
        </div>

        {/* QA Lead Signoff Card */}
        <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <img
              src={qa.approvedBy.avatar}
              alt={qa.approvedBy.name}
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
            />
            <div>
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <span>QA Certified by {qa.approvedBy.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-0.5">
                Lead QA & Release Engineer • Ecosystem Core
              </div>
              <p className="text-xs text-text-secondary mt-1.5 font-sans">
                "All 148 test suites passed with 0 regressions. Verified multi-currency ledger adjustments against synthetic DB transaction dumps. Ready for Customer Review & Final Sign-off."
              </p>
            </div>
          </div>
          <span className="text-[10px] font-code text-text-muted">
            {new Date(qa.approvedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Test Execution Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-text-muted text-[10px] uppercase font-semibold block mb-1">
              Passed Tests
            </span>
            <div className="text-lg font-bold font-code text-emerald-400">
              {qa.testsPassed} / {qa.testsPassed}
            </div>
            <div className="text-[10px] text-text-muted">0 failed • 0 skipped</div>
          </div>

          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-text-muted text-[10px] uppercase font-semibold block mb-1">
              Line Coverage
            </span>
            <div className="text-lg font-bold font-code text-cyan-300">
              {qa.coveragePercent}%
            </div>
            <div className="text-[10px] text-text-muted">Target threshold: &gt; 85%</div>
          </div>

          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-text-muted text-[10px] uppercase font-semibold block mb-1">
              Security Audit
            </span>
            <div className="text-lg font-bold font-code text-emerald-400">
              SOC2 Clean
            </div>
            <div className="text-[10px] text-text-muted">OWASP Top 10 Scanned</div>
          </div>

          <div className="bg-surface p-3 rounded border border-border">
            <span className="text-text-muted text-[10px] uppercase font-semibold block mb-1">
              Performance Fuzz
            </span>
            <div className="text-lg font-bold font-code text-text-primary">
              12,400 rps
            </div>
            <div className="text-[10px] text-text-muted">Max memory delta: +4MB</div>
          </div>
        </div>
      </div>
    </div>
  );
};
