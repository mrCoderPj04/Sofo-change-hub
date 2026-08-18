import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import { GitBranch, GitCommit, CheckCircle2, Play, Terminal, Code2, Plus, Minus } from 'lucide-react';

interface Step4Props {
  cr: ChangeRequest;
}

export const Step4Development: React.FC<Step4Props> = ({ cr }) => {
  const commits = cr.implementationSpec.codeCommits || [];
  const [selectedCommit, setSelectedCommit] = useState(commits[0]?.hash || 'c8f419a');

  return (
    <div className="space-y-4">
      {/* Dev Branch & CI/CD Status Header */}
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 04: Engineering Implementation & CI/CD Pipeline
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-muted">Active Branch:</span>
            <span className="px-2 py-0.5 bg-surface border border-border rounded text-[11px] font-code text-cyan-300">
              feature/cr-084-swift-parser
            </span>
          </div>
        </div>

        {/* CI/CD Build Card */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 text-xs">
          <div className="bg-surface p-2.5 rounded border border-border flex items-center justify-between">
            <div>
              <span className="text-text-muted text-[10px] block">Build Pipeline</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> #8412 Passed
              </span>
            </div>
            <span className="font-code text-[10px] text-text-muted">4m 12s</span>
          </div>

          <div className="bg-surface p-2.5 rounded border border-border flex items-center justify-between">
            <div>
              <span className="text-text-muted text-[10px] block">Unit Test Suite</span>
              <span className="text-emerald-400 font-semibold">148/148 Green</span>
            </div>
            <span className="font-code text-[10px] text-text-muted">100% pass</span>
          </div>

          <div className="bg-surface p-2.5 rounded border border-border flex items-center justify-between">
            <div>
              <span className="text-text-muted text-[10px] block">Code Coverage</span>
              <span className="text-cyan-300 font-semibold font-code">94.6%</span>
            </div>
            <span className="text-[10px] text-emerald-400">+2.1%</span>
          </div>

          <div className="bg-surface p-2.5 rounded border border-border flex items-center justify-between">
            <div>
              <span className="text-text-muted text-[10px] block">Security SAST</span>
              <span className="text-emerald-400 font-semibold">0 High/Crit</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-code">Clean</span>
          </div>
        </div>

        {/* Linked Commits List */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-accent" />
            <span>Linked Git Commits ({commits.length})</span>
          </div>
          <div className="space-y-1.5">
            {commits.map((commit) => (
              <div
                key={commit.hash}
                onClick={() => setSelectedCommit(commit.hash)}
                className={`p-2.5 rounded border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  selectedCommit === commit.hash
                    ? 'bg-surface border-accent text-text-primary ring-1 ring-accent'
                    : 'bg-surface/60 border-border/70 text-text-secondary hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden mr-2">
                  <span className="font-code text-accent font-semibold shrink-0">
                    {commit.hash}
                  </span>
                  <span className="truncate font-mono">{commit.message}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[11px] font-code">
                  <span className="text-emerald-400">+{commit.additions}</span>
                  <span className="text-red-400">-{commit.deletions}</span>
                  <span className="text-text-muted hidden md:inline">{commit.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Code Diff Simulation */}
        <div>
          <div className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Code Diff Inspection: <span className="font-mono text-accent">pkg/ledger/swift/mt940_parser.go</span></span>
          </div>
          <div className="bg-[#05070A] border border-border rounded-md font-mono text-[11px] overflow-hidden">
            <div className="p-2 border-b border-border/70 bg-surface-secondary text-text-muted flex justify-between text-[10px]">
              <span>@@ -142,6 +142,18 @@ func (p *MT940Parser) ProcessStream(ctx context.Context, r io.Reader) error @@</span>
              <span>Go 1.22 • 0 allocs/op</span>
            </div>
            <div className="p-3 overflow-x-auto space-y-0.5 text-text-secondary">
              <div className="text-text-muted">  // Validate MT940 statement header checksum against redis idempotency bloom filter</div>
              <div className="text-text-muted">  msgHash := sha256.Sum256(rawBytes)</div>
              <div className="bg-emerald-950/30 text-emerald-300 px-1 py-0.5 border-l-2 border-emerald-500">
                + if p.bloomFilter.Exists(ctx, msgHash) &#123;
              </div>
              <div className="bg-emerald-950/30 text-emerald-300 px-1 py-0.5 border-l-2 border-emerald-500">
                +     return ErrDuplicateStatementMessage
              </div>
              <div className="bg-emerald-950/30 text-emerald-300 px-1 py-0.5 border-l-2 border-emerald-500">
                + &#125;
              </div>
              <div className="bg-emerald-950/30 text-emerald-300 px-1 py-0.5 border-l-2 border-emerald-500">
                + // Parse :61: Statement Line into normalized MultiCurrencyJournalEntry
              </div>
              <div className="bg-emerald-950/30 text-emerald-300 px-1 py-0.5 border-l-2 border-emerald-500">
                + entry, err := p.parseStatementLineTag61(statementLine)
              </div>
              <div className="bg-emerald-950/30 text-emerald-300 px-1 py-0.5 border-l-2 border-emerald-500">
                + if err != nil &#123; return fmt.Errorf("tag61 malformed: %w", err) &#125;
              </div>
              <div className="text-text-muted">  return p.ledgerBroker.EmitReconBatch(ctx, entry)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
