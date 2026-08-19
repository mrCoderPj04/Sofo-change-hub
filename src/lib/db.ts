import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://mr_coder_04:FiqKgetgt506_v6KaXKW5A@sofo-changeges-32312.j77.aws-ap-south-1.cockroachlabs.cloud:26257/Sofo-change-hub?sslmode=verify-full';

let pool: Pool | null = null;
let isSchemaInitialized = false;

// Global fallback in-memory store for when CockroachDB monthly limit is reached
const memoryStore = {
  users: [
    {
      id: 'usr-tl-001',
      employee_id: 'TL001',
      username: 'rajkamal',
      ems_user_id: 'ems-tl-001',
      changehub_role: 'team_leader',
      display_name: 'Rajkamal Singh',
      email: 'rajkamal@pjsofonic.com',
      organization: 'PJSOFONIC Core Ecosystem',
      created_at: new Date().toISOString(),
    },
    {
      id: 'usr-cust-001',
      employee_id: 'CUST001',
      username: 'customer1',
      ems_user_id: 'ems-cust-001',
      changehub_role: 'customer',
      display_name: 'Sarah Chen (Client)',
      email: 'sarah.chen@apexfinancials.com',
      organization: 'Apex Global Financials',
      created_at: new Date().toISOString(),
    },
  ] as any[],
  change_requests: [] as any[],
  comments: [] as any[],
};

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 15000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export async function ensureSchema(client: any) {
  if (isSchemaInitialized) return;
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
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

      CREATE TABLE IF NOT EXISTS change_requests (
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

      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        change_request_id UUID REFERENCES change_requests(id) ON DELETE CASCADE,
        author_id UUID REFERENCES users(id),
        content TEXT NOT NULL,
        stage VARCHAR(30),
        is_internal BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    isSchemaInitialized = true;
  } catch (err: any) {
    console.warn('Schema init warning (will use fallback if needed):', err.message);
  }
}

// Fallback query emulator for when remote DB limit is exceeded
function fallbackQuery(text: string, params: any[] = []): { rows: any[]; rowCount: number } {
  const normalizedSql = text.trim();

  // 1. SELECT users by employee_id
  if (normalizedSql.includes('FROM users WHERE UPPER(employee_id) = UPPER($1)') || normalizedSql.includes('FROM users WHERE employee_id = $1')) {
    const empId = params[0]?.toUpperCase();
    const user = memoryStore.users.find(u => u.employee_id.toUpperCase() === empId);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 2. INSERT into users
  if (normalizedSql.startsWith('INSERT INTO users')) {
    const [employee_id, username, ems_user_id, changehub_role, display_name, organization] = params;
    const existingIndex = memoryStore.users.findIndex(u => u.employee_id.toUpperCase() === employee_id?.toUpperCase());
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      employee_id,
      username,
      ems_user_id,
      changehub_role: changehub_role || 'customer',
      display_name: display_name || username,
      organization: organization || 'Apex Global Financials',
      created_at: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      memoryStore.users[existingIndex] = { ...memoryStore.users[existingIndex], ...newUser };
      return { rows: [memoryStore.users[existingIndex]], rowCount: 1 };
    }
    memoryStore.users.push(newUser);
    return { rows: [newUser], rowCount: 1 };
  }

  // 3. UPDATE users
  if (normalizedSql.startsWith('UPDATE users')) {
    const empId = params[params.length - 1];
    const user = memoryStore.users.find(u => u.employee_id.toUpperCase() === empId?.toUpperCase());
    if (user) {
      user.changehub_role = params[0] || user.changehub_role;
      return { rows: [user], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 4. SELECT count(*) FROM change_requests
  if (normalizedSql.includes('SELECT count(*) FROM change_requests')) {
    return { rows: [{ count: memoryStore.change_requests.length.toString() }], rowCount: 1 };
  }

  // 5. INSERT into change_requests
  if (normalizedSql.startsWith('INSERT INTO change_requests')) {
    const [
      ticket_number,
      title,
      description,
      category,
      priority,
      status,
      current_stage,
      submitted_by,
      client_name,
      target_delivery_date,
      sla_hours_remaining,
      sla_status,
      business_justification,
      scope_summary,
      tags,
    ] = params;

    const newCR = {
      id: `cr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ticket_number,
      title,
      description,
      category,
      priority,
      status,
      current_stage,
      submitted_by,
      client_name,
      assigned_lead: 'usr-tl-001',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      target_delivery_date: target_delivery_date ? new Date(target_delivery_date).toISOString() : new Date().toISOString(),
      sla_hours_remaining: sla_hours_remaining || 336,
      sla_status: sla_status || 'healthy',
      business_justification,
      scope_summary,
      tags: tags || [],
    };
    memoryStore.change_requests.unshift(newCR);
    return { rows: [newCR], rowCount: 1 };
  }

  // 6. SELECT change_requests
  if (normalizedSql.includes('FROM change_requests')) {
    if (params.length > 0 && (normalizedSql.includes('cr.id = $1') || normalizedSql.includes('cr.ticket_number = $1'))) {
      const match = memoryStore.change_requests.find(
        cr => cr.id === params[0] || cr.ticket_number === params[0]
      );
      return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
    }

    if (params.length > 0 && normalizedSql.includes('cr.submitted_by = $1')) {
      const filtered = memoryStore.change_requests.filter(cr => cr.submitted_by === params[0]);
      return { rows: filtered, rowCount: filtered.length };
    }

    return { rows: [...memoryStore.change_requests], rowCount: memoryStore.change_requests.length };
  }

  // 7. UPDATE change_requests
  if (normalizedSql.startsWith('UPDATE change_requests')) {
    const targetId = params[params.length - 1];
    const cr = memoryStore.change_requests.find(
      c => c.id === targetId || c.ticket_number === targetId
    );
    if (cr) {
      cr.updated_at = new Date().toISOString();
      if (params.length >= 2) {
        // Apply stage / status / tlApproval updates
        for (const p of params) {
          if (typeof p === 'string' && ['submitted', 'tl_review', 'planning', 'development', 'documentation', 'workflow_chart', 'walkthrough', 'internal_review', 'customer_review', 'customer_approval', 'delivered'].includes(p)) {
            cr.current_stage = p;
          }
          if (typeof p === 'string' && ['in_progress', 'completed', 'pending_approval', 'rejected'].includes(p)) {
            cr.status = p;
          }
          if (typeof p === 'string' && p.startsWith('{') && p.includes('decision')) {
            try {
              cr.tl_approval = JSON.parse(p);
            } catch {}
          }
        }
      }
      return { rows: [cr], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 8. DELETE
  if (normalizedSql.startsWith('DELETE FROM change_requests')) {
    memoryStore.change_requests = [];
    return { rows: [], rowCount: 0 };
  }
  if (normalizedSql.startsWith('DELETE FROM comments')) {
    memoryStore.comments = [];
    return { rows: [], rowCount: 0 };
  }

  return { rows: [], rowCount: 0 };
}

export async function query(text: string, params?: any[]) {
  try {
    const client = await getPool().connect();
    try {
      await ensureSchema(client);
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  } catch (dbErr: any) {
    // If CockroachDB monthly Request Unit limit is exceeded or connection dropped, seamlessly use fallback
    console.warn(
      `[Database Fallback Active] Remote DB error (${dbErr.message.slice(0, 70)}...). Serving query via resilient fallback store.`
    );
    return fallbackQuery(text, params);
  }
}
