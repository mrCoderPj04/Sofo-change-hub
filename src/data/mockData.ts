import { ChangeRequest, DashboardMetrics, Project, User } from '@/types';

export const CURRENT_USER: User = {
  id: 'usr-default',
  name: 'Authorized User',
  email: 'user@pjsofonic.com',
  role: 'Team Leader',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  organization: 'PJSOFONIC Ecosystem Core',
  isLead: true,
};

export const MOCK_USERS: Record<string, User> = {
  rajkamal: CURRENT_USER,
  sarah: {
    id: 'usr-client',
    name: 'Customer Signatory',
    email: 'client@apexfinancials.com',
    role: 'Client Contact',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    organization: 'Apex Global Financials',
  },
  marcus: {
    id: 'usr-engineer',
    name: 'Assigned Lead Engineer',
    email: 'engineer@pjsofonic.internal',
    role: 'Staff Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    organization: 'PJSOFONIC Ecosystem Core',
  },
  elena: {
    id: 'usr-qa',
    name: 'QA & Release Engineer',
    email: 'qa@pjsofonic.internal',
    role: 'QA Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organization: 'PJSOFONIC Ecosystem Core',
  },
  devon: {
    id: 'usr-client-2',
    name: 'Logistics Signatory',
    email: 'logistics@novalogistics.com',
    role: 'Client Director',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    organization: 'Nova Logistics Global',
  },
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-erp-core',
    key: 'SOFO-ERP',
    name: 'PJSOFONIC ERP Enterprise Suite',
    category: 'ERP Core',
    description: 'Core ledger, supply chain tracking, multi-entity tax engines, and automated journal reconciliation.',
    activeCRs: 0,
    health: 'healthy',
    client: 'Apex Global Financials & Partners',
  },
  {
    id: 'proj-paygate-v3',
    key: 'SOFO-PAY',
    name: 'PJSOFONIC PayGate & Settlements',
    category: 'FinTech / PayGate',
    description: 'High-throughput payment gateway, ISO-20022 wire messaging, and automated dispute resolution webhooks.',
    activeCRs: 0,
    health: 'healthy',
    client: 'Vertex FinTech Corp',
  },
  {
    id: 'proj-supply-opt',
    key: 'SOFO-SCM',
    name: 'SOFO Supply Chain Intelligence',
    category: 'Supply Chain',
    description: 'Predictive warehouse inventory routing, customs compliance manifests, and barcode telemetry.',
    activeCRs: 0,
    health: 'healthy',
    client: 'Nova Logistics Global',
  },
  {
    id: 'proj-crm-sync',
    key: 'SOFO-CRM',
    name: 'PJSOFONIC Customer 360 & Analytics',
    category: 'CRM & Analytics',
    description: 'Unified client account timeline, omni-channel support routing, and revenue attribution models.',
    activeCRs: 0,
    health: 'healthy',
    client: 'Apex Global Financials',
  },
];

// ZERO initial test change requests
export const MOCK_CHANGE_REQUESTS: ChangeRequest[] = [];

export const MOCK_DASHBOARD_METRICS: DashboardMetrics = {
  totalActiveCRs: 0,
  pendingApprovals: 0,
  slaBreachRisk: 0,
  deliveredThisMonth: 0,
  averageCycleTimeDays: 0,
  satisfactionRate: 100,
};

// ZERO initial activity logs
export const MOCK_ACTIVITY_LOG: any[] = [];
