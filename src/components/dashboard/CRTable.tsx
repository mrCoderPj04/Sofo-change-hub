import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  ExternalLink,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { ChangeRequest, CRPriority, LifecycleStage, SLAStatus } from '@/types';
import { StatusBadge } from '../common/StatusBadge';

interface CRTableProps {
  changeRequests: ChangeRequest[];
  onSelectCR: (cr: ChangeRequest) => void;
  onQuickApprove?: (crId: string) => void;
}

export const CRTable: React.FC<CRTableProps> = ({
  changeRequests,
  onSelectCR,
  onQuickApprove,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [slaFilter, setSlaFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'ticketNumber' | 'updatedAt' | 'sla'>('updatedAt');
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCRs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCRs.map((cr) => cr.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredCRs = changeRequests
    .filter((cr) => {
      const matchesSearch =
        cr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cr.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cr.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cr.projectName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || cr.priority === priorityFilter;
      const matchesSla = slaFilter === 'all' || cr.slaStatus === slaFilter;

      return matchesSearch && matchesPriority && matchesSla;
    })
    .sort((a, b) => {
      if (sortField === 'ticketNumber') {
        return sortAsc
          ? a.ticketNumber.localeCompare(b.ticketNumber)
          : b.ticketNumber.localeCompare(a.ticketNumber);
      }
      if (sortField === 'sla') {
        return sortAsc
          ? a.slaHoursRemaining - b.slaHoursRemaining
          : b.slaHoursRemaining - a.slaHoursRemaining;
      }
      return sortAsc
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="glass-panel rounded-lg border border-border overflow-hidden">
      {/* Table Controls Header */}
      <div className="p-3.5 border-b border-border bg-surface-secondary/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by ticket #, customer, title..."
              className="w-full bg-surface border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Right: Filters & Actions */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 rounded-md">
            <span className="text-text-muted text-[11px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-text-primary focus:outline-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* SLA filter */}
          <div className="flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 rounded-md">
            <span className="text-text-muted text-[11px]">SLA:</span>
            <select
              value={slaFilter}
              onChange={(e) => setSlaFilter(e.target.value)}
              className="bg-transparent text-text-primary focus:outline-none cursor-pointer"
            >
              <option value="all">All SLA</option>
              <option value="healthy">Healthy</option>
              <option value="at_risk">At Risk (&lt;24h)</option>
              <option value="breached">Breached</option>
            </select>
          </div>

          <div className="text-[11px] text-text-muted font-code pl-2">
            Showing {filteredCRs.length} of {changeRequests.length}
          </div>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/40 text-text-muted text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3 w-8">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredCRs.length && filteredCRs.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-border bg-surface text-accent focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => {
                setSortField('ticketNumber');
                setSortAsc(!sortAsc);
              }}>
                <div className="flex items-center gap-1">
                  <span>Ticket ID</span>
                  <ArrowUpDown className="w-3 h-3 text-text-muted" />
                </div>
              </th>
              <th className="py-2.5 px-3 min-w-[280px]">Change Request Summary</th>
              <th className="py-2.5 px-3">Project</th>
              <th className="py-2.5 px-3">Lifecycle Stage</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => {
                setSortField('sla');
                setSortAsc(!sortAsc);
              }}>
                <div className="flex items-center gap-1">
                  <span>SLA Countdown</span>
                  <ArrowUpDown className="w-3 h-3 text-text-muted" />
                </div>
              </th>
              <th className="py-2.5 px-3">Assigned Lead</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredCRs.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-text-muted text-xs">
                  No change requests matched your filter parameters.
                </td>
              </tr>
            ) : (
              filteredCRs.map((cr) => {
                const isSelected = selectedIds.includes(cr.id);
                return (
                  <tr
                    key={cr.id}
                    className={`hover:bg-surface-secondary/70 transition-colors group cursor-pointer ${
                      isSelected ? 'bg-surface-secondary/90' : ''
                    }`}
                    onClick={() => onSelectCR(cr)}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(cr.id)}
                        className="rounded border-border bg-surface text-accent focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Ticket # */}
                    <td className="py-3 px-3 font-code font-semibold text-accent whitespace-nowrap">
                      {cr.ticketNumber}
                    </td>

                    {/* Title & Customer */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-text-primary group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {cr.title}
                      </div>
                      <div className="text-[11px] text-text-muted flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-text-secondary">{cr.clientName}</span>
                        <span>•</span>
                        <span>{cr.category}</span>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[11px] text-text-secondary bg-surface-secondary px-2 py-0.5 rounded border border-border">
                        {cr.projectName.replace('PJSOFONIC ', '').slice(0, 18)}...
                      </span>
                    </td>

                    {/* Current Lifecycle Stage */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge type="stage" value={cr.currentStage} size="sm" />
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge type="priority" value={cr.priority} size="sm" />
                    </td>

                    {/* SLA remaining */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-code text-[11px]">
                        {cr.currentStage === 'delivered' ? (
                          <span className="text-emerald-400 font-medium">Delivered</span>
                        ) : cr.slaHoursRemaining < 24 ? (
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {cr.slaHoursRemaining}h remaining
                          </span>
                        ) : (
                          <span className="text-text-secondary">
                            {cr.slaHoursRemaining}h remaining
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5">
                        <StatusBadge type="sla" value={cr.slaStatus} size="sm" />
                      </div>
                    </td>

                    {/* Lead */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={cr.assignedLead.avatar}
                          alt={cr.assignedLead.name}
                          className="w-5 h-5 rounded-full object-cover border border-border"
                        />
                        <span className="text-[11px] text-text-secondary">
                          {cr.assignedLead.name.split(' ')[0]}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3 px-3 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectCR(cr)}
                          className="px-2 py-1 text-[11px] font-medium bg-surface hover:bg-surface-hover border border-border hover:border-border-hover text-text-primary rounded transition-colors flex items-center gap-1"
                          title="Open full 11-step workspace"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3 h-3 text-text-muted" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination & Batch Footer */}
      <div className="p-3 border-t border-border bg-surface-secondary/50 flex items-center justify-between text-xs text-text-muted">
        <div>
          {selectedIds.length > 0 ? (
            <span className="text-accent font-medium">
              {selectedIds.length} change request(s) selected
            </span>
          ) : (
            <span>Showing real-time records</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>Enterprise Cluster: <span className="font-code text-text-secondary">eu-central-1</span></span>
        </div>
      </div>
    </div>
  );
};
