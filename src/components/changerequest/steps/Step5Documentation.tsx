import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import { FileCode2, Copy, Check, Eye, Edit3, BookOpen } from 'lucide-react';

interface Step5Props {
  cr: ChangeRequest;
}

export const Step5Documentation: React.FC<Step5Props> = ({ cr }) => {
  const [docContent, setDocContent] = useState(
    cr.documentationMarkdown ||
      `### API Delta & Technical Specification for ${cr.ticketNumber}\n\n` +
      `#### Overview\nOperational runbook for ${cr.title}.\n\n` +
      `#### Ingestion Contract\n\`\`\`json\n{\n  "source": "SWIFT_GATEWAY",\n  "format": "MT940",\n  "idempotencyKey": "sha256-hash-94812",\n  "currency": "EUR"\n}\n\`\`\`\n\n` +
      `#### Verification Checklist\n- [x] ISO-4217 Currency table updated\n- [x] Kafka consumer backpressure tuned to 5,000 msg/sec\n- [x] Multi-entity audit retention policy set to 7 years`
  );
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'preview' | 'raw'>('preview');

  const handleCopy = () => {
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 05: Technical Documentation & API Delta Contract
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-surface border border-border rounded p-0.5 text-xs">
              <button
                onClick={() => setActiveView('preview')}
                className={`px-2 py-0.5 rounded ${
                  activeView === 'preview' ? 'bg-surface-secondary text-accent font-semibold' : 'text-text-muted'
                }`}
              >
                Rendered Preview
              </button>
              <button
                onClick={() => setActiveView('raw')}
                className={`px-2 py-0.5 rounded ${
                  activeView === 'raw' ? 'bg-surface-secondary text-accent font-semibold' : 'text-text-muted'
                }`}
              >
                Markdown Editor
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 bg-surface hover:bg-surface-hover border border-border rounded text-text-secondary hover:text-text-primary transition-colors text-xs flex items-center gap-1"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeView === 'preview' ? (
          <div className="bg-surface p-4 rounded-md border border-border text-xs text-text-secondary space-y-3 font-sans leading-relaxed">
            <div className="border-b border-border/60 pb-2">
              <h3 className="text-sm font-bold text-text-primary">
                Multi-Currency Real-Time Ledger Reconciliation (CR-2026-084)
              </h3>
              <p className="text-[11px] text-text-muted mt-0.5">
                Target Ecosystem: PJSOFONIC ERP Enterprise Suite • Go Microservice V4.18
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-text-primary mb-1 text-xs">1. Ingestion Pipeline & Architecture</h5>
              <p className="text-text-secondary text-[11px]">
                Validates inbound MT940 statement streams via the SWIFT Gateway broker. Ingested events are deduplicated in Redis 7 bloom-filters prior to PostgreSQL ledger insertion.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-text-primary mb-1 text-xs">2. API Schema Contract</h5>
              <div className="bg-[#05070A] p-2.5 rounded border border-border font-mono text-[11px] text-cyan-300">
                POST /api/v2/ledger/recon/intraday-sync<br />
                Content-Type: application/json<br /><br />
                &#123;<br />
                &nbsp;&nbsp;"batchReference": "SWIFT-20260817-0941",<br />
                &nbsp;&nbsp;"currency": "EUR",<br />
                &nbsp;&nbsp;"statementLines": 1420,<br />
                &nbsp;&nbsp;"idempotencyHash": "sha256-a94f810b2..."<br />
                &#125;
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-text-primary mb-1 text-xs">3. Verification & Compliance Controls</h5>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-text-secondary">
                <li>ECB Article 14 Liquidity Reporting compliance verified.</li>
                <li>Rollback toggle configured: <code className="text-accent font-mono">FF_SWIFT_INTRADAY_RECON_V2</code>.</li>
                <li>Zero heap memory leak over 48-hour continuous fuzz test run.</li>
              </ul>
            </div>
          </div>
        ) : (
          <textarea
            rows={12}
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            className="w-full bg-[#05070A] border border-border rounded-md p-3 font-mono text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
        )}
      </div>
    </div>
  );
};
