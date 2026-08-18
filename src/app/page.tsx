'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { LifecyclePipeline } from '@/components/dashboard/LifecyclePipeline';
import { CRTable } from '@/components/dashboard/CRTable';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { CRDetailWorkspace } from '@/components/changerequest/CRDetailWorkspace';
import { CRCreationModal } from '@/components/changerequest/CRCreationModal';
import { CommandPalette } from '@/components/common/CommandPalette';
import { NotificationDrawer } from '@/components/common/NotificationDrawer';
import { CustomerPortal } from '@/components/portals/CustomerPortal';
import { MobileAppView } from '@/components/portals/MobileAppView';
import { ProjectsView } from '@/components/projects/ProjectsView';
import { ApprovalsView } from '@/components/approvals/ApprovalsView';
import { WorkflowView } from '@/components/workflow/WorkflowView';
import { DocumentsView } from '@/components/documents/DocumentsView';
import { SettingsView } from '@/components/settings/SettingsView';
import { MOCK_PROJECTS } from '@/data/mockData';
import { ChangeRequest, LifecycleStage, DashboardMetrics } from '@/types';
import { RefreshCw } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [viewMode, setViewMode] = useState<'desktop' | 'customer' | 'mobile'>('desktop');
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState<LifecycleStage | null>(null);

  // Real-time Change requests state from CockroachDB
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [selectedCR, setSelectedCR] = useState<ChangeRequest | null>(null);
  const [isLoadingCRs, setIsLoadingCRs] = useState(false);

  // Modals and drawers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewCRModalOpen, setIsNewCRModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Check auth & fetch real-time DB data on mount
  useEffect(() => {
    const token = localStorage.getItem('sofo_auth_token');
    const userStr = localStorage.getItem('sofo_user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      if (user.changehubRole === 'customer') {
        setViewMode('customer');
      } else {
        setViewMode('desktop');
      }
    } catch (e) {
      router.push('/login');
      return;
    } finally {
      setIsAuthLoading(false);
    }

    // Init DB & fetch change requests
    initAndFetchData();
  }, [router]);

  const initAndFetchData = async () => {
    setIsLoadingCRs(true);
    try {
      // 1. Ensure DB schema exists
      await fetch('/api/db/init').catch((e) => console.log('Init DB notice:', e));

      // 2. Fetch real-time change requests
      const res = await fetch('/api/change-requests');
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setChangeRequests(data.data);
      }
    } catch (err) {
      console.error('Failed to load change requests from DB:', err);
    } finally {
      setIsLoadingCRs(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sofo_auth_token');
    localStorage.removeItem('sofo_user');
    router.push('/login');
  };

  // Filter change requests by project and stage
  const filteredChangeRequests = changeRequests.filter((cr) => {
    const matchesProject =
      selectedProjectId === 'all' || cr.projectId === selectedProjectId;
    const matchesStage =
      selectedStageFilter === null || cr.currentStage === selectedStageFilter;
    return matchesProject && matchesStage;
  });

  const pendingApprovalsCount = changeRequests.filter(
    (cr) =>
      cr.currentStage === 'submitted' ||
      cr.currentStage === 'tl_review' ||
      cr.currentStage === 'customer_approval'
  ).length;

  // Real-time calculated dashboard metrics
  const dynamicMetrics: DashboardMetrics = {
    totalActiveCRs: changeRequests.length,
    pendingApprovals: pendingApprovalsCount,
    slaBreachRisk: changeRequests.filter((cr) => cr.slaStatus === 'at_risk' || cr.slaHoursRemaining < 24).length,
    deliveredThisMonth: changeRequests.filter((cr) => cr.currentStage === 'delivered').length,
    averageCycleTimeDays: changeRequests.length > 0 ? 3.8 : 0,
    satisfactionRate: 99.4,
  };

  const handleCreateCR = (newCR: any) => {
    initAndFetchData();
  };

  const handleUpdateCR = (updatedCR: ChangeRequest) => {
    setChangeRequests(
      changeRequests.map((cr) => (cr.id === updatedCR.id ? updatedCR : cr))
    );
    if (selectedCR && selectedCR.id === updatedCR.id) {
      setSelectedCR(updatedCR);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center text-xs text-[#8D98A8]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#00A3FF] animate-spin" />
          <span>Verifying EMS Session...</span>
        </div>
      </div>
    );
  }

  // If in Customer Portal mode
  if (viewMode === 'customer') {
    return (
      <>
        <CustomerPortal
          changeRequests={changeRequests}
          onSelectCR={(cr) => {
            setSelectedCR(cr);
            setViewMode('desktop');
          }}
          onOpenNewCR={() => setIsNewCRModalOpen(true)}
          onSwitchToDesktop={() => setViewMode('desktop')}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <CRCreationModal
          isOpen={isNewCRModalOpen}
          onClose={() => setIsNewCRModalOpen(false)}
          onCreateCR={handleCreateCR}
          currentUser={currentUser}
        />
      </>
    );
  }

  // If in Mobile Application View mode
  if (viewMode === 'mobile') {
    return (
      <div className="bg-black/90 min-h-screen py-4 px-2">
        <MobileAppView
          changeRequests={changeRequests}
          onSelectCR={(cr) => {
            setSelectedCR(cr);
            setViewMode('desktop');
          }}
          onOpenNewCR={() => setIsNewCRModalOpen(true)}
          onSwitchToDesktop={() => setViewMode('desktop')}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <CRCreationModal
          isOpen={isNewCRModalOpen}
          onClose={() => setIsNewCRModalOpen(false)}
          onCreateCR={handleCreateCR}
          currentUser={currentUser}
        />
      </div>
    );
  }

  // 1440px Desktop SaaS Application Interface
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left Sidebar */}
      <DesktopSidebar
        currentSection={currentSection}
        onSelectSection={(section) => {
          setCurrentSection(section);
          setSelectedCR(null);
        }}
        pendingApprovalsCount={pendingApprovalsCount}
        activeRequestsCount={changeRequests.length}
        openNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={3}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <TopHeader
          currentSection={selectedCR ? 'workspace' : currentSection}
          selectedProject={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          projects={MOCK_PROJECTS}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNewCRModal={() => setIsNewCRModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadCount={3}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 overflow-y-auto">
          {selectedCR ? (
            /* Active 11-Step Lifecycle Workspace */
            <CRDetailWorkspace
              changeRequest={selectedCR}
              onBack={() => setSelectedCR(null)}
              onUpdateCR={handleUpdateCR}
            />
          ) : (
            <>
              {currentSection === 'dashboard' && (
                <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
                  {/* Row 1: Executive KPI Metrics Grid */}
                  <MetricsGrid
                    metrics={dynamicMetrics}
                    onFilterClick={(type) => {
                      if (type === 'approvals') setCurrentSection('approvals');
                    }}
                  />

                  {/* Row 2: 11-Stage Pipeline Distribution */}
                  <LifecyclePipeline
                    changeRequests={changeRequests}
                    selectedStageFilter={selectedStageFilter}
                    onSelectStage={(stage) => setSelectedStageFilter(stage)}
                  />

                  {/* Row 3: CR Data Table & Live Audit Stream */}
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                    <div className="xl:col-span-3">
                      <CRTable
                        changeRequests={filteredChangeRequests}
                        onSelectCR={(cr) => setSelectedCR(cr)}
                      />
                    </div>
                    <div className="xl:col-span-1">
                      <ActivityFeed />
                    </div>
                  </div>
                </div>
              )}

              {currentSection === 'projects' && (
                <ProjectsView
                  changeRequests={changeRequests}
                  onSelectProject={(projId) => {
                    setSelectedProjectId(projId);
                    setCurrentSection('dashboard');
                  }}
                  onSelectCR={(cr) => setSelectedCR(cr)}
                />
              )}

              {currentSection === 'requests' && (
                <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
                  <LifecyclePipeline
                    changeRequests={changeRequests}
                    selectedStageFilter={selectedStageFilter}
                    onSelectStage={(stage) => setSelectedStageFilter(stage)}
                  />
                  <CRTable
                    changeRequests={filteredChangeRequests}
                    onSelectCR={(cr) => setSelectedCR(cr)}
                  />
                </div>
              )}

              {currentSection === 'implementations' && (
                <DocumentsView
                  changeRequests={changeRequests}
                  onSelectCR={(cr) => setSelectedCR(cr)}
                />
              )}

              {currentSection === 'approvals' && (
                <ApprovalsView
                  changeRequests={changeRequests}
                  onSelectCR={(cr) => setSelectedCR(cr)}
                />
              )}

              {currentSection === 'documents' && (
                <DocumentsView
                  changeRequests={changeRequests}
                  onSelectCR={(cr) => setSelectedCR(cr)}
                />
              )}

              {currentSection === 'workflow' && <WorkflowView />}

              {currentSection === 'activity' && (
                <div className="p-6 max-w-4xl mx-auto">
                  <ActivityFeed />
                </div>
              )}

              {currentSection === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        changeRequests={changeRequests}
        onSelectCR={(cr) => {
          setSelectedCR(cr);
          setSelectedStageFilter(null);
        }}
        onNavigateSection={(section) => {
          setCurrentSection(section);
          setSelectedCR(null);
        }}
      />

      {/* New Change Request Creation Modal */}
      <CRCreationModal
        isOpen={isNewCRModalOpen}
        onClose={() => setIsNewCRModalOpen(false)}
        onCreateCR={handleCreateCR}
        currentUser={currentUser}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectNotification={(target) => {
          const matched = changeRequests.find((cr) => target.includes(cr.ticketNumber));
          if (matched) setSelectedCR(matched);
        }}
      />
    </div>
  );
}
