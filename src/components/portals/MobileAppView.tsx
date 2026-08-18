import React, { useState } from 'react';
import { ChangeRequest } from '@/types';
import {
  LayoutDashboard,
  GitPullRequest,
  CheckCircle2,
  Bell,
  User,
  Search,
  Plus,
  ArrowLeft,
  ChevronRight,
  Clock,
  ShieldAlert,
  Sparkles,
  Layers,
  FileSignature,
  Building2,
  LogOut,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface MobileAppViewProps {
  changeRequests: ChangeRequest[];
  onSelectCR: (cr: ChangeRequest) => void;
  onOpenNewCR: () => void;
  onSwitchToDesktop: () => void;
  currentUser?: {
    displayName?: string;
    username?: string;
    employeeId?: string;
    changehubRole?: string;
    organization?: string;
  } | null;
  onLogout?: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  changeRequests,
  onSelectCR,
  onOpenNewCR,
  onSwitchToDesktop,
  currentUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'requests' | 'approvals' | 'alerts' | 'profile'>('home');
  const [searchTerm, setSearchTerm] = useState('');

  const userName = currentUser?.displayName || currentUser?.username || 'Team Leader';
  const isTL = currentUser?.changehubRole === 'team_leader';

  const pendingApprovals = changeRequests.filter(
    (cr) => cr.currentStage === 'submitted' || cr.currentStage === 'tl_review' || cr.currentStage === 'customer_approval'
  );

  const filteredRequests = changeRequests.filter(
    (cr) =>
      cr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cr.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cr.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between max-w-md mx-auto border-x border-border shadow-2xl relative">
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="SOFO ChangeHub Logo"
            className="w-7 h-7 rounded object-contain bg-surface-secondary border border-border/60 p-0.5"
          />
          <div>
            <div className="text-xs font-bold tracking-tight text-text-primary">
              SOFO ChangeHub
            </div>
            <div className="text-[9px] text-text-muted">
              {isTL ? 'Team Leader' : 'Customer'} • Real-Time DB
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToDesktop}
            className="px-2 py-1 text-[10px] bg-surface-secondary border border-border text-text-secondary hover:text-text-primary rounded"
          >
            Desktop
          </button>
          {!isTL && (
            <button
              onClick={onOpenNewCR}
              className="w-7 h-7 rounded-full bg-accent text-[#07090D] flex items-center justify-center font-bold text-xs"
              title="New Change Request"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </header>

      {/* Main Tab Content Area */}
      <main className="flex-1 p-3.5 space-y-4 pb-20 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets, clients, tags..."
            className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
        </div>

        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-3 animate-in fade-in-50">
            {/* Quick Greeting */}
            <div className="p-3 bg-surface-secondary/70 rounded-lg border border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center text-white font-bold text-xs border border-border">
                  {userName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-text-primary">{userName}</div>
                  <div className="text-[10px] text-text-muted">
                    {isTL ? 'Team Leader' : 'Customer Client'} • {currentUser?.organization || 'PJSOFONIC'}
                  </div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            {/* Mobile Metric Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => setActiveTab('requests')}
                className="p-3 bg-surface rounded-lg border border-border text-left cursor-pointer"
              >
                <span className="text-[10px] text-text-muted uppercase font-semibold">Active CRs</span>
                <div className="text-xl font-bold font-code text-accent mt-0.5">
                  {changeRequests.length}
                </div>
                <div className="text-[9px] text-text-muted">Real-time CockroachDB</div>
              </div>

              <div
                onClick={() => setActiveTab('approvals')}
                className="p-3 bg-surface rounded-lg border border-purpleAccent-border text-left cursor-pointer"
              >
                <span className="text-[10px] text-purple-300 uppercase font-semibold">Approvals</span>
                <div className="text-xl font-bold font-code text-purple-400 mt-0.5">
                  {pendingApprovals.length}
                </div>
                <div className="text-[9px] text-purple-200/70">Action required</div>
              </div>
            </div>

            {/* Quick Triage Feed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
                  Live Lifecycle Feed
                </h4>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-[10px] text-accent font-medium"
                >
                  View All →
                </button>
              </div>

              {changeRequests.length === 0 ? (
                <div className="p-4 bg-surface rounded-lg border border-border text-center text-xs text-text-muted">
                  No change requests stored yet. Tap + above to create one.
                </div>
              ) : (
                changeRequests.slice(0, 3).map((cr) => (
                  <div
                    key={cr.id}
                    onClick={() => onSelectCR(cr)}
                    className="p-3 bg-surface rounded-lg border border-border hover:border-border-hover transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-code text-xs font-bold text-accent">
                        {cr.ticketNumber}
                      </span>
                      <StatusBadge type="priority" value={cr.priority} size="sm" />
                    </div>
                    <div className="text-xs font-semibold text-text-primary line-clamp-1 mb-1">
                      {cr.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span>{cr.clientName}</span>
                      <StatusBadge type="stage" value={cr.currentStage} size="sm" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-2 animate-in fade-in-50">
            <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
              All In-Flight Requests ({filteredRequests.length})
            </h4>

            {filteredRequests.map((cr) => (
              <div
                key={cr.id}
                onClick={() => onSelectCR(cr)}
                className="p-3 bg-surface rounded-lg border border-border hover:border-border-hover transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-code text-xs font-bold text-accent">
                    {cr.ticketNumber}
                  </span>
                  <StatusBadge type="stage" value={cr.currentStage} size="sm" />
                </div>
                <div className="text-xs font-semibold text-text-primary line-clamp-1 mb-1">
                  {cr.title}
                </div>
                <p className="text-[11px] text-text-secondary line-clamp-2 mb-2">
                  {cr.description}
                </p>
                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-border/50 text-text-muted">
                  <span>{cr.clientName}</span>
                  <span className="font-code text-amber-400 font-semibold">{cr.slaHoursRemaining}h SLA</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="space-y-3 animate-in fade-in-50">
            <h4 className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
              Sign-off & Triage Queue ({pendingApprovals.length})
            </h4>

            {pendingApprovals.map((cr) => (
              <div
                key={cr.id}
                onClick={() => onSelectCR(cr)}
                className="p-3.5 bg-surface rounded-lg border border-purpleAccent-border transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-code text-xs font-bold text-accent">
                    {cr.ticketNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purpleAccent-muted text-purple-300 border border-purpleAccent-border">
                    {cr.currentStage === 'submitted' || cr.currentStage === 'tl_review'
                      ? 'Stage 2: TL Review'
                      : 'Stage 10: Customer Sign-off'}
                  </span>
                </div>
                <div className="text-xs font-bold text-text-primary mb-1">
                  {cr.title}
                </div>
                <div className="text-[11px] text-text-muted mb-3">
                  Client: {cr.clientName} • Target: {new Date(cr.targetDeliveryDate).toLocaleDateString()}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCR(cr);
                  }}
                  className="w-full py-1.5 bg-purpleAccent hover:bg-purple-600 text-white rounded text-xs font-bold shadow-sm transition-all"
                >
                  Open Approval Workspace →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-2 animate-in fade-in-50">
            <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
              Live Push Notifications
            </h4>
            <div className="p-3 bg-surface rounded-lg border border-border text-xs space-y-1">
              <div className="font-bold text-text-primary">CockroachDB Connected</div>
              <p className="text-[11px] text-text-secondary">Real-time change request data sync active.</p>
              <span className="text-[9px] text-text-muted block">Just now</span>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-3 animate-in fade-in-50">
            <div className="p-4 bg-surface rounded-lg border border-border text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg border-2 border-accent mx-auto mb-2">
                {userName.charAt(0)}
              </div>
              <h3 className="text-sm font-bold text-text-primary">{userName}</h3>
              <p className="text-xs text-text-muted">{isTL ? 'Team Leader' : 'Customer Client'}</p>
              <p className="text-[11px] text-accent font-code mt-0.5">{currentUser?.employeeId || 'TL001'}</p>
            </div>

            <div className="bg-surface rounded-lg border border-border divide-y divide-border/60 text-xs">
              <div className="p-3 flex justify-between">
                <span className="text-text-muted">Organization</span>
                <span className="text-text-primary font-medium">{currentUser?.organization || 'PJSOFONIC'}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-text-muted">Database Sync</span>
                <span className="text-emerald-400 font-code font-bold">CockroachDB Live</span>
              </div>
              {onLogout && (
                <div className="p-3">
                  <button
                    onClick={onLogout}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Mobile Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface border-t border-border p-2 flex items-center justify-around z-40">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            activeTab === 'home' ? 'text-accent' : 'text-text-muted'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            activeTab === 'requests' ? 'text-accent' : 'text-text-muted'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Requests</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors relative ${
            activeTab === 'approvals' ? 'text-purple-400' : 'text-text-muted'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approvals</span>
          {pendingApprovals.length > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 bg-purple-500 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            activeTab === 'alerts' ? 'text-accent' : 'text-text-muted'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            activeTab === 'profile' ? 'text-accent' : 'text-text-muted'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
