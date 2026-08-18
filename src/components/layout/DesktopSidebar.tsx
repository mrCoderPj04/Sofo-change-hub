import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  GitPullRequest,
  Cpu,
  CheckCircle2,
  FileText,
  Activity,
  Bell,
  Settings,
  Workflow,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  LogOut,
} from 'lucide-react';

interface DesktopSidebarProps {
  currentSection: string;
  onSelectSection: (section: string) => void;
  pendingApprovalsCount: number;
  activeRequestsCount: number;
  openNotifications: () => void;
  unreadNotificationsCount?: number;
  currentUser?: {
    displayName?: string;
    username?: string;
    employeeId?: string;
    changehubRole?: string;
    organization?: string;
  } | null;
  onLogout?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentSection,
  onSelectSection,
  pendingApprovalsCount,
  activeRequestsCount,
  openNotifications,
  unreadNotificationsCount = 3,
  currentUser,
  onLogout,
}) => {
  const isTeamLeader = currentUser?.changehubRole === 'team_leader';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderGit2,
      badge: '4',
    },
    {
      id: 'requests',
      label: 'Change Requests',
      icon: GitPullRequest,
      badge: activeRequestsCount.toString(),
    },
    {
      id: 'implementations',
      label: 'Implementations',
      icon: Cpu,
      badge: null,
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount.toString() : null,
      badgeColor: 'bg-purple-600/30 text-purple-300 border-purple-500/40',
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      badge: null,
    },
    {
      id: 'workflow',
      label: 'Workflow Chart',
      icon: Workflow,
      badge: 'v4.2',
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: Activity,
      badge: null,
    },
  ];

  const userName = currentUser?.displayName || currentUser?.username || 'Rajkamal Singh';
  const userRole = isTeamLeader ? 'Team Leader' : 'Customer Signatory';
  const orgName = currentUser?.organization || (isTeamLeader ? 'PJSOFONIC Core' : 'Apex Financials');

  return (
    <aside className="w-64 h-screen bg-surface border-r border-border flex flex-col justify-between select-none shrink-0 z-30">
      {/* Brand & Ecosystem Header */}
      <div>
        <div className="p-4 border-b border-border/80 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="SOFO ChangeHub Logo"
            className="w-8 h-8 rounded-md object-contain bg-surface-secondary border border-border/60 p-0.5"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-text-primary">
                SOFO ChangeHub
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                PJSOFONIC Ecosystem
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Lifecycle Platform
          </div>
          <nav className="space-y-0.5 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-surface-secondary text-accent border border-border/80 shadow-sm font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-code rounded border ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? 'bg-accent-muted text-accent border-accent-border'
                          : 'bg-surface-secondary text-text-muted border-border'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="px-3 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Preferences & Alerts
          </div>
          <div className="space-y-0.5">
            <button
              onClick={openNotifications}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors border border-transparent"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-text-muted" />
                <span>Notifications</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-accent-muted text-accent border border-accent-border rounded font-code">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectSection('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                currentSection === 'settings'
                  ? 'bg-surface-secondary text-accent border border-border/80'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-text-muted" />
                <span>Settings</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-border bg-surface-secondary/40">
        <div className="p-2 rounded-lg bg-surface border border-border flex items-center justify-between group hover:border-border-hover transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center text-white font-bold text-xs border border-border">
                {userName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-surface rounded-full"></span>
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-semibold text-text-primary truncate">
                {userName}
              </div>
              <div className="text-[10px] text-text-muted truncate flex items-center gap-1">
                <span>{userRole}</span>
                <span className="text-accent">• {currentUser?.employeeId || 'TL001'}</span>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1 text-text-muted hover:text-red-400 hover:bg-surface-secondary rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between px-2 text-[10px] text-text-muted font-code">
          <span>{orgName.slice(0, 16)}</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> Live DB
          </span>
        </div>
      </div>
    </aside>
  );
};
