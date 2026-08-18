import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import { Workflow, Layers, CheckCircle2, ArrowRight, ShieldCheck, Database, Server, UserCheck } from 'lucide-react';

interface Step6Props {
  cr: ChangeRequest;
}

export const Step6WorkflowChart: React.FC<Step6Props> = ({ cr }) => {
  const [selectedNode, setSelectedNode] = useState<string>('recon_engine');

  const nodes = [
    {
      id: 'customer_inbound',
      title: 'Customer Submits MT940',
      type: 'Ingress',
      status: 'Passed',
      desc: 'SWIFT MT940 message uploaded via SFTP / API endpoint.',
    },
    {
      id: 'tl_gate',
      title: 'Team Lead Gate (Rajkamal)',
      type: 'Triage',
      status: 'Approved',
      desc: 'Feasibility, effort estimation, and risk classification.',
    },
    {
      id: 'kafka_stream',
      title: 'Kafka Topic: swift.inbound',
      type: 'Broker',
      status: 'Healthy',
      desc: 'Deduplicated message buffer with SHA-256 idempotency key.',
    },
    {
      id: 'recon_engine',
      title: 'Multi-Currency Recon Worker',
      type: 'Microservice',
      status: 'Active',
      desc: 'Go container parses Tag 61/86 and balances ledger entries.',
    },
    {
      id: 'postgres_ledger',
      title: 'Postgres 16 Partition Table',
      type: 'Database',
      status: 'Migrated',
      desc: 'Writes debit/credit journals with ISO-4217 currency lock.',
    },
    {
      id: 'qa_signoff',
      title: 'QA Automated Verification',
      type: 'Validation',
      status: '148/148 Green',
      desc: 'Elena Rostova QA sign-off & security fuzz test passing.',
    },
    {
      id: 'customer_signature',
      title: 'Customer Formal Sign-off',
      type: 'Sign-off',
      status: 'Pending Signature',
      desc: 'Sarah Chen (VP Financial Ops) digital certificate validation.',
    },
    {
      id: 'prod_cluster',
      title: 'Prod Cluster Release (v4.18)',
      type: 'Deployment',
      status: 'Staging Green',
      desc: 'Rolling Kubernetes deployment to prod-fin-eu1.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 06: System Architecture Workflow & State Transition Chart
            </h4>
          </div>
          <span className="text-[11px] text-text-muted font-code">
            CR-2026-084 Architecture Pipeline
          </span>
        </div>

        {/* Interactive SVG Flow Diagram */}
        <div className="bg-[#06080C] border border-border rounded-lg p-4 overflow-x-auto">
          <div className="min-w-[860px]">
            {/* Stage Row 1 */}
            <div className="grid grid-cols-4 gap-4 mb-6 relative">
              {nodes.slice(0, 4).map((node, i) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all relative ${
                    selectedNode === node.id
                      ? 'bg-surface border-accent ring-1 ring-accent text-text-primary shadow-md'
                      : 'bg-surface/70 border-border text-text-secondary hover:border-border-hover'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold font-code text-accent">
                      {node.type}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                      {node.status}
                    </span>
                  </div>
                  <div className="font-semibold text-text-primary text-xs truncate">
                    {node.title}
                  </div>
                  <div className="text-[10px] text-text-muted mt-1 truncate">
                    {node.desc}
                  </div>

                  {i < 3 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-border-hover">
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Connecting transition indicator */}
            <div className="flex justify-center my-2 text-text-muted">
              <span className="text-[10px] font-code bg-surface px-3 py-1 rounded border border-border">
                ↓ Streaming Message Ingestion to Persistent Ledger & Verification Pipeline ↓
              </span>
            </div>

            {/* Stage Row 2 */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {nodes.slice(4, 8).map((node, i) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all relative ${
                    selectedNode === node.id
                      ? 'bg-surface border-accent ring-1 ring-accent text-text-primary shadow-md'
                      : 'bg-surface/70 border-border text-text-secondary hover:border-border-hover'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold font-code text-purple-400">
                      {node.type}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded ${
                        node.status.includes('Pending')
                          ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>
                  <div className="font-semibold text-text-primary text-xs truncate">
                    {node.title}
                  </div>
                  <div className="text-[10px] text-text-muted mt-1 truncate">
                    {node.desc}
                  </div>

                  {i < 3 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-border-hover">
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Node Details Panel */}
        {selectedNode && (
          <div className="mt-3 p-3 bg-surface rounded-md border border-border text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <div>
                <span className="font-semibold text-text-primary">
                  {nodes.find((n) => n.id === selectedNode)?.title}
                </span>
                <span className="text-text-muted ml-2 text-[11px]">
                  {nodes.find((n) => n.id === selectedNode)?.desc}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-code text-emerald-400">
              Verified Pipeline Node
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
