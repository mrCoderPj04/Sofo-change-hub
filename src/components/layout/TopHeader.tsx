import React from 'react';
import {
  Search,
  Bell,
  Plus,
  Monitor,
  Smartphone,
  Users,
  ChevronDown,
  Layers,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { Project } from '@/types';

interface TopHeaderProps {
  currentSection: string;
  selectedProject: string;
  onSelectProject: (projectId: string) => void;
  projects: Project[];
  onOpenCommandPalette: () => void;
  onOpenNewCRModal: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  viewMode: 'desktop' | 'customer' | 'mobile';
  onChangeViewMode: (mode: 'desktop' | 'customer' | 'mobile') => void;
  currentUser?: {
    displayName?: string;
    username?: string;
    employeeId?: string;
    changehubRole?: string;
    organization?: string;
  } | null;
  onLogout?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentSection,
  selectedProject,
  onSelectProject,
  projects,
  onOpenCommandPalette,
  onOpenNewCRModal,
  onOpenNotifications,
  unreadCount = 3,
  viewMode,
  onChangeViewMode,
  currentUser,
  onLogout,
}) => {
  const getSectionTitle = () => {
    switch (currentSection) {
      case 'dashboard':
        return 'Executive Overview & Lifecycle Monitor';
      case 'projects':
        return 'Enterprise Projects Portfolio';
      case 'requests':
        return 'Change Request Pipeline';
      case 'implementations':
        return 'Implementation Specifications & Architecture';
      case 'approvals':
        return 'Approvals & Governance Queue';
      case 'documents':
        return 'Technical Runbooks & Changelogs';
      case 'workflow':
        return 'PJSOFONIC 11-Stage Lifecycle Architecture Map';
      case 'activity':
        return 'Enterprise Audit Trail & Telemetry';
      case 'settings':
        return 'Workspace & SLA Governance Settings';
      default:
        return 'SOFO ChangeHub';
    }
  };

  const userName = currentUser?.displayName || currentUser?.username || 'Team Leader';
  const roleName = currentUser?.changehubRole === 'team_leader' ? 'Team Leader' : 'Customer Client';

  return (
    <header className="h-14 bg-surface border-b border-border px-4 flex items-center justify-between gap-3 shrink-0 z-20">
      {/* Left: Section Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted font-medium">SOFO</span>
          <span className="text-text-muted">/</span>
          <h1 className="text-sm font-semibold text-text-primary tracking-tight">
            {getSectionTitle()}
          </h1>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="hidden lg:flex items-center bg-surface-secondary border border-border rounded-md p-0.5 ml-4">
          <button
            onClick={() => onChangeViewMode('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              viewMode === 'desktop'
                ? 'bg-surface text-cyan-300 border border-border shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            title="Switch to 1440px Desktop SaaS"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop SaaS</span>
          </button>

          <button
            onClick={() => onChangeViewMode('customer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              viewMode === 'customer'
                ? 'bg-surface text-purple-300 border border-border shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            title="Switch to Customer Portal View"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </button>

          <button
            onClick={() => onChangeViewMode('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              viewMode === 'mobile'
                ? 'bg-surface text-emerald-300 border border-border shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            title="Switch to Mobile App View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App</span>
          </button>
        </div>
      </div>

      {/* Middle/Right: Search, Project Selector, New CR, Notifications, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Project Selector Filter */}
        <div className="relative hidden md:block">
          <select
            value={selectedProject}
            onChange={(e) => onSelectProject(e.target.value)}
            className="appearance-none bg-surface-secondary hover:bg-surface-hover text-xs font-medium text-text-primary border border-border rounded-md px-3 py-1.5 pr-7 focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">All Projects (4)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.key} - {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2 top-2.5 pointer-events-none" />
        </div>

        {/* Global Command/Search trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 bg-surface-secondary hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-md text-xs transition-colors"
          title="Press Cmd+K to search"
        >
          <Search className="w-3.5 h-3.5 text-text-muted" />
          <span className="hidden sm:inline">Search CRs or actions...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.2 bg-surface border border-border text-[10px] text-text-muted rounded font-code">
            ⌘K
          </kbd>
        </button>

        {/* New Change Request CTA Button - Only visible for Customer, NOT in TL Portal */}
        {currentUser?.changehubRole === 'customer' && (
          <button
            onClick={onOpenNewCRModal}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-[#07090D] font-semibold text-xs px-3 py-1.5 rounded-md shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Change Request</span>
          </button>
        )}

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-md border border-border/60 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full ring-2 ring-surface"></span>
          )}
        </button>

        {/* User profile capsule */}
        <div className="flex items-center gap-2 pl-1 border-l border-border/80">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center text-white font-bold text-xs border border-border">
            {userName.charAt(0)}
          </div>
          <div className="hidden xl:block text-left text-xs leading-tight">
            <span className="font-medium text-text-primary block">{userName}</span>
            <span className="text-[10px] text-text-muted block">{roleName}</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1 text-text-muted hover:text-red-400 hover:bg-surface-secondary rounded transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
