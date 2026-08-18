<p align="center">
  <img src="public/logo.png" alt="SOFO ChangeHub Logo" width="160" />
</p>

<h1 align="center">SOFO ChangeHub</h1>

<p align="center">
  <strong>Production Enterprise SaaS Change-Request Lifecycle Platform</strong><br>
  Built for the <em>PJSOFONIC Software Ecosystem</em> with Real-Time Database Persistence & EMS Authentication.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=flat&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/CockroachDB-PostgreSQL-5967D8?style=flat&logo=cockroachlabs" alt="CockroachDB" />
  <img src="https://img.shields.io/badge/EMS_Auth-Live-00A3FF?style=flat" alt="EMS Auth" />
  <img src="https://img.shields.io/badge/Render-Deploy_Ready-46E3B7?style=flat&logo=render" alt="Render" />
  <img src="https://img.shields.io/badge/UptimeRobot-Health_Monitored-10B981?style=flat" alt="UptimeRobot" />
</p>

---

## 📖 Product Overview

**SOFO ChangeHub** manages the end-to-end customer change-request lifecycle for enterprise software products across the PJSOFONIC ecosystem (ERP, FinTech/PayGate, Supply Chain, and CRM).

The platform connects **Customers** (who submit, track, and provide digital sign-offs) with **Team Leaders & Architects** (who triage feasibility, assess risk, estimate engineering hours, and oversee execution).

---

## 🏛️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │             SOFO ChangeHub                   │
                               │      Next.js 14 (App Router / SSR)           │
                               └──────┬───────────────────────┬───────────────┘
                                      │                       │
                     EMS JWT Auth     │                       │ Real-time CRUD
            ┌─────────────────────────▼────────┐     ┌────────▼───────────────────────┐
            │       PJEMS Backend API          │     │    CockroachDB Serverless      │
            │ erp-backend-1-02lc.onrender.com │     │       PostgreSQL Engine        │
            │  • /api/auth/login               │     │  • users                       │
            │  • /api/auth/register            │     │  • change_requests             │
            │  • JWT Access & Refresh Tokens   │     │  • comments                    │
            └──────────────────────────────────┘     └────────────────────────────────┘
```

---

## 🌐 Complete Website Structure

```
SOFO ChangeHub Web Architecture
├── 🔐 Authentication & Session
│   ├── /login                     → Unified Simple Sign-In (EMS Employee ID + Password)
│   └── Auto-Role Routing          → Automatically loads Team Leader or Customer Portal
│
├── 🖥️ 1. Team Leader & Engineer Desktop Portal (1440px SaaS)
│   ├── Left Sidebar               → Branding, Ecosystem Nav, Status, User Profile & Logout
│   ├── Top Header                 → Section Breadcrumbs, Project Filter, Cmd+K Search, Notifications
│   ├── 📊 Dashboard               → Real-time KPI Metrics Grid, 11-Stage Pipeline, Live CR Data Table
│   ├── 📁 Projects                → Ecosystem projects (ERP, PayGate, Supply Chain, CRM)
│   ├── ⚡ Change Requests         → Complete filterable & sortable change-request register
│   ├── 🛡️ Approvals               → Dedicated TL Sign-off Queue (Scope, Risk, Estimation)
│   ├── 📐 Implementations         → Microservices impact, DB migrations & rollback strategy
│   ├── 📄 Documents               → Living runbooks, API delta contracts & Swagger specs
│   ├── 🔀 Workflow Chart          → Interactive SVG architecture state transition diagram
│   └── ⚙️ Settings                → SLA governance policies, deployment clusters, webhooks
│
├── 👥 2. Dedicated Customer Portal
│   ├── Customer Header            → Client organization badge, Submit Request CTA, User Info
│   ├── Client Dashboard           → Active in-flight requests submitted by client organization
│   ├── ➕ Submit Change Request    → Modal to initiate formal change request into CockroachDB
│   ├── 🎥 Demo Walkthrough        → Review staging video playback and requirement checklist
│   └── ✍️ Digital Sign-off        → Formal acceptance certificate with SHA-256 hash & signature
│
├── 📱 3. Responsive Mobile Application View
│   ├── Top Mobile Bar             → SOFO ChangeHub logo, active role pill, Desktop switch
│   ├── 5-Tab Bottom Navigation    → Home, Requests, Approvals, Alerts, Profile
│   └── Touch Triage Cards         → Single-tap review, swipeable stage pills, SLA warnings
│
└── 🔍 4. The 11-Stage Interactive Lifecycle Engine
    ├── Stage 01: Customer Submission
    ├── Stage 02: Team Lead Review & Risk Triage (TL Approval)
    ├── Stage 03: Implementation Planning & Technical Specs
    ├── Stage 04: Engineering Development & Git Commit Diff View
    ├── Stage 05: Technical Documentation & API Delta Contract
    ├── Stage 06: System Architecture Workflow Chart
    ├── Stage 07: Recorded Walkthrough & Verification Scenarios
    ├── Stage 08: Internal QA Review (148/148 Tests Passed)
    ├── Stage 09: Customer Sandbox Staging Review & Comments
    ├── Stage 10: Customer Formal Executive Digital Sign-off
    └── Stage 11: Production Cluster Delivery (v4.18.0 Tag)
```

---

## 🛣️ API Endpoints Reference

### 1. Monitoring & UptimeRobot (200 OK)
- **`GET /api/health`** (or **`GET /health`**) → `{ "status": "ok", "service": "SOFO ChangeHub", "timestamp": "..." }`
- **`GET /api/ping`** (or **`GET /ping`**) → Plain text `pong` (Status 200 OK)

### 2. Authentication (EMS Proxy & DB Sync)
- **`POST /api/auth/login`** → Authenticates via EMS API, auto-detects role, syncs with CockroachDB.
- **`POST /api/auth/register`** → Registers on EMS backend and records user in CockroachDB.

### 3. Change Requests (Real-Time CockroachDB)
- **`GET /api/change-requests`** → Returns all live change requests.
- **`POST /api/change-requests`** → Creates a new change request in CockroachDB (Customer only).
- **`GET /api/change-requests/[id]`** → Returns single change request details.
- **`PUT /api/change-requests/[id]`** → Updates stage, TL approval, customer signature, or status.
- **`GET /api/db/init`** → Ensures CockroachDB schema exists.

---

## 🗄️ Database Schema (CockroachDB PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  ems_user_id VARCHAR(100),
  changehub_role VARCHAR(20) NOT NULL DEFAULT 'customer',
  display_name VARCHAR(200),
  email VARCHAR(200),
  organization VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Change Requests Table
CREATE TABLE change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'Feature Enhancement',
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(30) DEFAULT 'pending_approval',
  current_stage VARCHAR(30) DEFAULT 'submitted',
  submitted_by UUID REFERENCES users(id),
  client_name VARCHAR(200),
  assigned_lead UUID REFERENCES users(id),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  target_delivery_date TIMESTAMPTZ,
  sla_hours_remaining INT DEFAULT 336,
  sla_status VARCHAR(20) DEFAULT 'healthy',
  tl_approval JSONB,
  scope_summary TEXT,
  business_justification TEXT,
  tags TEXT[] DEFAULT '{}'
);

-- Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  change_request_id UUID REFERENCES change_requests(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  stage VARCHAR(30),
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🚀 Deployment Guide (Render.com)

The project includes a ready-to-use [`render.yaml`](render.yaml) Blueprint:

1. Push this repository to **GitHub / GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Web Service** (or **Blueprint**).
4. Connect the repository.
5. Configure Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
6. Add Environment Variable:
   - `DATABASE_URL`: `postgresql://mr_coder_04:FiqKgetgt506_v6KaXKW5A@sofo-changeges-32312.j77.aws-ap-south-1.cockroachlabs.cloud:26257/Sofo-change-hub?sslmode=verify-full`
7. Click **Create Web Service**.

### 🤖 UptimeRobot Setup
- **Monitor Type**: `HTTP(s)`
- **URL**: `https://<your-render-app-name>.onrender.com/api/health` (or `/ping`)
- **Monitoring Interval**: 5 minutes
- **Keyword / Expectation**: HTTP 200 OK

---

## 💻 Local Development

```bash
# 1. Clone repository & install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
npm start
```

### 🔑 Test Credentials

| Role | Employee ID | Password | Portal View |
|---|---|---|---|
| **Team Leader** | `TL001` | `Admin@123` | Desktop SaaS / Approvals Queue |
| **Customer** | `CUST001` | `Admin@123` | Customer Portal / Create Request |

---

<p align="center">
  <sub>Developed for the <strong>PJSOFONIC Ecosystem</strong> • SOFO ChangeHub v1.0.0</sub>
</p>
