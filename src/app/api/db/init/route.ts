import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Create users table
    await query(`
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
      )
    `);

    // Create change_requests table
    await query(`
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
      )
    `);

    // Create comments table
    await query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        change_request_id UUID REFERENCES change_requests(id) ON DELETE CASCADE,
        author_id UUID REFERENCES users(id),
        content TEXT NOT NULL,
        stage VARCHAR(30),
        is_internal BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Database schema initialized successfully',
      tables: ['users', 'change_requests', 'comments']
    });
  } catch (error: any) {
    console.error('DB init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: error.message },
      { status: 500 }
    );
  }
}
