import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://mr_coder_04:FiqKgetgt506_v6KaXKW5A@sofo-changeges-32312.j77.aws-ap-south-1.cockroachlabs.cloud:26257/Sofo-change-hub?sslmode=verify-full';

let pool: Pool | null = null;
let isSchemaInitialized = false;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
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
  } catch (err) {
    console.error('Error in ensureSchema:', err);
  }
}

export async function query(text: string, params?: any[]) {
  const client = await getPool().connect();
  try {
    await ensureSchema(client);
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
