import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Ensure schema exists
    await query(`CREATE SCHEMA IF NOT EXISTS project_changehub;`);
    await query(`SET search_path TO project_changehub, public;`);

    // 2. Create users table
    await query(`
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
      )
    `);

    // 3. Create change_requests table
    await query(`
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
      )
    `);

    // 4. Create comments table
    await query(`
      CREATE TABLE IF NOT EXISTS project_changehub.comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        change_request_id UUID REFERENCES project_changehub.change_requests(id) ON DELETE CASCADE,
        author_id UUID REFERENCES project_changehub.users(id),
        content TEXT NOT NULL,
        stage VARCHAR(30),
        is_internal BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    const users = await query(`SELECT id, employee_id, username, changehub_role, display_name, organization FROM project_changehub.users;`);
    const crCount = await query(`SELECT count(*) FROM project_changehub.change_requests;`);

    return NextResponse.json({ 
      success: true, 
      database: 'Supabase PostgreSQL',
      schema: 'project_changehub',
      message: 'Database schema initialized successfully (Clean real-time state)',
      tables: ['project_changehub.users', 'project_changehub.change_requests', 'project_changehub.comments'],
      usersCount: users.rows.length,
      changeRequestsCount: parseInt(crCount.rows[0]?.count || '0', 10),
    });
  } catch (error: any) {
    console.error('DB init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: error.message },
      { status: 500 }
    );
  }
}
