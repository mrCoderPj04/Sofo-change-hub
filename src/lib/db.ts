import { Pool, PoolClient } from 'pg';

const supabasePassword = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD || 'MrCoder@1304');
const defaultConnectionString = `postgresql://postgres.ffauweryjzpnskdaqcyp:${supabasePassword}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?options=-c%20search_path%3Dproject_changehub,public`;

const connectionString = process.env.DATABASE_URL || defaultConnectionString;

let pool: Pool | null = null;
let isSchemaInitialized = false;

// Resilient memory store for offline/fallback scenarios
const memoryStore = {
  users: [] as any[],
  change_requests: [] as any[],
  comments: [] as any[],
};

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.warn('[Supabase PG Pool Notice] Unexpected idle client error:', err.message);
    });
  }
  return pool;
}

export async function ensureSchema(client: PoolClient) {
  if (isSchemaInitialized) return;
  try {
    // 1. Ensure Schema
    await client.query(`CREATE SCHEMA IF NOT EXISTS project_changehub;`);
    await client.query(`SET search_path TO project_changehub, public;`);

    // 2. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_changehub.users (
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
    `);

    // 3. Change Requests Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_changehub.change_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_number VARCHAR(50) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category VARCHAR(100) DEFAULT 'Feature Enhancement',
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(30) DEFAULT 'pending_approval',
        current_stage VARCHAR(30) DEFAULT 'submitted',
        submitted_by UUID REFERENCES project_changehub.users(id),
        client_name VARCHAR(200),
        assigned_lead UUID REFERENCES project_changehub.users(id),
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
    `);

    // 4. Comments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_changehub.comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        change_request_id UUID REFERENCES project_changehub.change_requests(id) ON DELETE CASCADE,
        author_id UUID REFERENCES project_changehub.users(id),
        content TEXT NOT NULL,
        stage VARCHAR(30),
        is_internal BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    isSchemaInitialized = true;
  } catch (err: any) {
    console.warn('[DB Ensure Schema Notice]:', err.message);
  }
}

// Fallback in-memory query executor for offline/interrupted scenarios
function executeMemoryQuery(text: string, params: any[] = []): { rows: any[]; rowCount: number } {
  const sql = text.trim();

  // SELECT users by employee_id
  if (sql.includes('FROM users WHERE UPPER(employee_id) = UPPER($1)') || sql.includes('FROM users WHERE employee_id = $1')) {
    const empId = params[0]?.toUpperCase();
    const user = memoryStore.users.find(u => u.employee_id?.toUpperCase() === empId);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // INSERT into users
  if (sql.startsWith('INSERT INTO users')) {
    const [employee_id, username, ems_user_id, changehub_role, display_name, organization] = params;
    const existingIndex = memoryStore.users.findIndex(u => u.employee_id?.toUpperCase() === employee_id?.toUpperCase());
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

  // UPDATE users
  if (sql.startsWith('UPDATE users')) {
    const empId = params[params.length - 1];
    const user = memoryStore.users.find(u => u.employee_id?.toUpperCase() === empId?.toUpperCase() || u.id === empId);
    if (user) {
      if (params.length > 2) {
        user.changehub_role = params[0] || user.changehub_role;
        user.display_name = params[2] || user.display_name;
      }
      return { rows: [user], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // SELECT count(*) FROM change_requests
  if (sql.includes('SELECT count(*) FROM change_requests')) {
    return { rows: [{ count: memoryStore.change_requests.length.toString() }], rowCount: 1 };
  }

  // INSERT into change_requests
  if (sql.startsWith('INSERT INTO change_requests')) {
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
      assigned_lead: '6fd593c1-4673-448e-acb4-67ee1f2566ba',
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

  // SELECT change_requests
  if (sql.includes('FROM change_requests')) {
    if (params.length > 0 && (sql.includes('cr.id = $1') || sql.includes('cr.ticket_number = $1'))) {
      const match = memoryStore.change_requests.find(
        cr => cr.id === params[0] || cr.ticket_number === params[0]
      );
      return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
    }

    if (params.length > 0 && sql.includes('cr.submitted_by = $1')) {
      const filtered = memoryStore.change_requests.filter(cr => cr.submitted_by === params[0]);
      return { rows: filtered, rowCount: filtered.length };
    }

    return { rows: [...memoryStore.change_requests], rowCount: memoryStore.change_requests.length };
  }

  // UPDATE change_requests
  if (sql.startsWith('UPDATE change_requests')) {
    const targetId = params[params.length - 1];
    const cr = memoryStore.change_requests.find(
      c => c.id === targetId || c.ticket_number === targetId
    );
    if (cr) {
      cr.updated_at = new Date().toISOString();
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
      return { rows: [cr], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  return { rows: [], rowCount: 0 };
}

// Unified query function supporting Supabase PostgreSQL with resilient fallback
export async function query(text: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
  let client: PoolClient | null = null;
  try {
    const currentPool = getPool();
    client = await currentPool.connect();
    await ensureSchema(client);
    const result = await client.query(text, params);
    return {
      rows: result.rows,
      rowCount: result.rowCount ?? result.rows.length,
    };
  } catch (err: any) {
    console.warn('[Supabase DB Query Notice] Falling back to resilient store:', err.message);
    return executeMemoryQuery(text, params);
  } finally {
    if (client) {
      try {
        client.release();
      } catch {}
    }
  }
}
