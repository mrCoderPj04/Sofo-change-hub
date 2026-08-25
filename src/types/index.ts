export type LifecycleStage =
  | 'submitted'
  | 'tl_review'
  | 'planning'
  | 'development'
  | 'documentation'
  | 'workflow_chart'
  | 'walkthrough'
  | 'internal_review'
  | 'customer_review'
  | 'customer_approval'
  | 'delivered';

export interface StageMeta {
  id: LifecycleStage;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
  actor: 'Customer' | 'Team Lead' | 'Tech Lead / Architect' | 'Engineering' | 'Technical Writer' | 'QA Team' | 'Release Ops';
}

export const LIFECYCLE_STAGES: StageMeta[] = [
  {
    id: 'submitted',
    number: 1,
    label: 'Customer Submission',
    shortLabel: 'Submitted',
    description: 'Customer initiates and submits formal change request specification',
    actor: 'Customer',
  },
  {
    id: 'tl_review',
    number: 2,
    label: 'Team Lead Review & Approval',
    shortLabel: 'TL Review',
    description: 'Team lead triages scope, feasibility, risk assessment, and assigns resources',
    actor: 'Team Lead',
  },
  {
    id: 'planning',
    number: 3,
    label: 'Implementation Planning',
    shortLabel: 'Planning',
    description: 'Technical architecture, schema migrations, and rollback strategy formulated',
    actor: 'Tech Lead / Architect',
  },
  {
    id: 'development',
    number: 4,
    label: 'Development & Build',
    shortLabel: 'Development',
    description: 'Feature implementation, unit tests, code reviews, and linked git commits',
    actor: 'Engineering',
  },
  {
    id: 'documentation',
    number: 5,
    label: 'Documentation & Changelog',
    shortLabel: 'Documentation',
    description: 'API specs, user manuals, and technical delta documentation updated',
    actor: 'Technical Writer',
  },
  {
    id: 'workflow_chart',
    number: 6,
    label: 'Workflow Chart & Architecture Map',
    shortLabel: 'Workflow Chart',
    description: 'Visual system state transition diagram and process flow verification',
    actor: 'Tech Lead / Architect',
  },
  {
    id: 'walkthrough',
    number: 7,
    label: 'Interactive Walkthrough & Demo',
    shortLabel: 'Walkthrough',
    description: 'Recorded functional walkthrough and verification scenario playback',
    actor: 'Engineering',
  },
  {
    id: 'internal_review',
    number: 8,
    label: 'Internal Review & QA Sign-off',
    shortLabel: 'Internal QA',
    description: 'Automated test suite, security scan, and cross-team QA sign-off',
    actor: 'QA Team',
  },
  {
    id: 'customer_review',
    number: 9,
    label: 'Customer Review & Staging Feedback',
    shortLabel: 'Customer Review',
    description: 'Customer reviews staging environment and validates business requirements',
    actor: 'Customer',
  },
  {
    id: 'customer_approval',
    number: 10,
    label: 'Customer Formal Sign-off',
    shortLabel: 'Customer Sign-off',
    description: 'Executive client sign-off with digital confirmation and SLA acceptance',
    actor: 'Customer',
  },
  {
    id: 'delivered',
    number: 11,
    label: 'Production Delivery & Release',
    shortLabel: 'Delivered',
    description: 'Deployment to production cluster, telemetry verification, and ticket closure',
    actor: 'Release Ops',
  },
];

export type CRPriority = 'critical' | 'high' | 'medium' | 'low';
export type CRStatus = 'in_progress' | 'pending_approval' | 'completed' | 'blocked' | 'rejected';
export type SLAStatus = 'healthy' | 'at_risk' | 'breached';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  organization: string;
  isLead?: boolean;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  category: 'ERP Core' | 'FinTech / PayGate' | 'Supply Chain' | 'CRM & Analytics' | 'HRMS Suite';
  description: string;
  activeCRs: number;
  health: 'healthy' | 'warning' | 'critical';
  client: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  stage: LifecycleStage;
  isInternal?: boolean;
}

export interface GitCommit {
  hash: string;
  branch: string;
  message: string;
  author: string;
  timestamp: string;
  additions: number;
  deletions: number;
  filesChanged: number;
}

export interface ImplementationSpec {
  architectureNotes: string;
  affectedMicroservices: string[];
  dbMigrationsRequired: boolean;
  dbMigrationDetails?: string;
  rollbackStrategy: string;
  estimatedHours: number;
  actualHours: number;
  targetReleaseVersion: string;
  assignedEngineers: User[];
  codeCommits: GitCommit[];
}

export interface WalkthroughItem {
  id: string;
  title: string;
  duration: string;
  type: 'video_demo' | 'flow_screen' | 'api_trace';
  status: 'passed' | 'review_needed';
  description: string;
  thumbnailUrl?: string;
  keyHighlights: string[];
}

export interface ChangeRequest {
  id: string;
  ticketNumber: string; // e.g. "CR-2026-084"
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  category: 'Feature Enhancement' | 'Schema Modification' | 'Integration / API' | 'Compliance & Regulatory' | 'Performance / Hotfix';
  priority: CRPriority;
  status: CRStatus;
  currentStage: LifecycleStage;
  stageProgress: Record<LifecycleStage, 'completed' | 'current' | 'pending' | 'blocked'>;
  
  // Stakeholders
  clientName: string;
  clientContact: User;
  assignedLead: User; // Rajkamal Singh
  assignedEngineer?: User;
  
  // Dates & SLA
  submittedAt: string;
  updatedAt: string;
  targetDeliveryDate: string;
  slaHoursRemaining: number;
  slaStatus: SLAStatus;
  
  // Modules & Specs
  businessJustification: string;
  scopeSummary: string;
  implementationSpec: ImplementationSpec;
  
  // Documentation & Deliverables
  documentationMarkdown: string;
  workflowDiagramUrl?: string;
  walkthroughItems: WalkthroughItem[];
  
  // Approvals Log
  tlApproval?: {
    approvedBy: User;
    approvedAt: string;
    decision: 'approved' | 'rejected' | 'revision_requested';
    notes: string;
    riskScore: 'Low' | 'Medium' | 'High';
  };
  qaApproval?: {
    approvedBy: User;
    approvedAt: string;
    testsPassed: number;
    testsFailed: number;
    coveragePercent: number;
    securityPassed: boolean;
  };
  customerSignoff?: {
    signedBy: string;
    signeeRole: string;
    signedAt: string;
    signatureHash: string;
    notes: string;
    acceptedTerms: boolean;
  };
  
  deliveryMeta?: {
    deployedAt: string;
    releaseVersion: string;
    clusterEnvironment: string;
    changelogNotes: string;
  };

  comments: Comment[];
  tags: string[];
}

export interface DashboardMetrics {
  totalActiveCRs: number;
  pendingApprovals: number;
  slaBreachRisk: number;
  deliveredThisMonth: number;
  averageCycleTimeDays: number;
  satisfactionRate: number;
}
