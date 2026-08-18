import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');

    let sql = `
      SELECT 
        cr.*,
        u_sub.display_name as submitter_name,
        u_sub.email as submitter_email,
        u_sub.organization as submitter_org,
        u_lead.display_name as lead_name,
        u_lead.email as lead_email
      FROM change_requests cr
      LEFT JOIN users u_sub ON cr.submitted_by = u_sub.id
      LEFT JOIN users u_lead ON cr.assigned_lead = u_lead.id
    `;

    const params: any[] = [];
    if (role === 'customer' && userId) {
      sql += ` WHERE cr.submitted_by = $1`;
      params.push(userId);
    }

    sql += ` ORDER BY cr.updated_at DESC`;

    const result = await query(sql, params);

    // Map database rows to ChangeRequest frontend interface
    const changeRequests = result.rows.map((row) => ({
      id: row.id,
      ticketNumber: row.ticket_number,
      title: row.title,
      description: row.description || '',
      projectId: 'proj-erp-core',
      projectName: row.category ? `PJSOFONIC ERP (${row.category})` : 'PJSOFONIC ERP Enterprise Suite',
      category: row.category || 'Feature Enhancement',
      priority: row.priority || 'medium',
      status: row.status || 'pending_approval',
      currentStage: row.current_stage || 'submitted',
      stageProgress: {
        submitted: 'completed',
        tl_review: row.current_stage === 'submitted' ? 'current' : 'completed',
        planning: row.current_stage === 'planning' ? 'current' : row.current_stage === 'submitted' || row.current_stage === 'tl_review' ? 'pending' : 'completed',
        development: row.current_stage === 'development' ? 'current' : ['submitted', 'tl_review', 'planning'].includes(row.current_stage) ? 'pending' : 'completed',
        documentation: row.current_stage === 'documentation' ? 'current' : ['submitted', 'tl_review', 'planning', 'development'].includes(row.current_stage) ? 'pending' : 'completed',
        workflow_chart: row.current_stage === 'workflow_chart' ? 'current' : ['submitted', 'tl_review', 'planning', 'development', 'documentation'].includes(row.current_stage) ? 'pending' : 'completed',
        walkthrough: row.current_stage === 'walkthrough' ? 'current' : ['submitted', 'tl_review', 'planning', 'development', 'documentation', 'workflow_chart'].includes(row.current_stage) ? 'pending' : 'completed',
        internal_review: row.current_stage === 'internal_review' ? 'current' : ['submitted', 'tl_review', 'planning', 'development', 'documentation', 'workflow_chart', 'walkthrough'].includes(row.current_stage) ? 'pending' : 'completed',
        customer_review: row.current_stage === 'customer_review' ? 'current' : ['submitted', 'tl_review', 'planning', 'development', 'documentation', 'workflow_chart', 'walkthrough', 'internal_review'].includes(row.current_stage) ? 'pending' : 'completed',
        customer_approval: row.current_stage === 'customer_approval' ? 'current' : ['delivered'].includes(row.current_stage) ? 'completed' : 'pending',
        delivered: row.current_stage === 'delivered' ? 'completed' : 'pending',
      },
      clientName: row.client_name || row.submitter_org || 'Apex Global Financials',
      clientContact: {
        id: row.submitted_by || 'usr-cust',
        name: row.submitter_name || 'Client Contact',
        email: row.submitter_email || 'client@enterprise.com',
        role: 'Customer Signatory',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        organization: row.client_name || 'Apex Global Financials',
      },
      assignedLead: {
        id: row.assigned_lead || 'usr-lead',
        name: row.lead_name || 'Rajkamal Singh',
        email: row.lead_email || 'rajkamal.singh@pjsofonic.internal',
        role: 'Team Leader & Principal Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'PJSOFONIC Ecosystem Core',
        isLead: true,
      },
      submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
      targetDeliveryDate: row.target_delivery_date ? new Date(row.target_delivery_date).toISOString() : new Date(Date.now() + 14 * 86400000).toISOString(),
      slaHoursRemaining: row.sla_hours_remaining || 336,
      slaStatus: row.sla_status || 'healthy',
      businessJustification: row.business_justification || '',
      scopeSummary: row.scope_summary || row.description || '',
      implementationSpec: {
        architectureNotes: 'Technical specification governed by PJSOFONIC ERP standards.',
        affectedMicroservices: ['svc-ledger-core', 'svc-ingress-gateway'],
        dbMigrationsRequired: false,
        rollbackStrategy: 'Zero-downtime feature toggle mechanism.',
        estimatedHours: 40,
        actualHours: 0,
        targetReleaseVersion: 'v4.19.0',
        assignedEngineers: [],
        codeCommits: [],
      },
      documentationMarkdown: `### ${row.ticket_number}: ${row.title}\n\n${row.description || ''}`,
      walkthroughItems: [],
      tlApproval: row.tl_approval || undefined,
      comments: [],
      tags: row.tags || [row.category || 'Feature', row.priority?.toUpperCase() || 'MEDIUM'],
    }));

    return NextResponse.json({ success: true, data: changeRequests });
  } catch (error: any) {
    console.error('Fetch CRs error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch change requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      category = 'Feature Enhancement',
      priority = 'medium',
      submittedBy,
      clientName,
      businessJustification,
      targetDays = 14,
      tags = [],
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Auto-generate ticket number
    const countRes = await query('SELECT count(*) FROM change_requests');
    const nextNum = parseInt(countRes.rows[0].count, 10) + 101;
    const ticketNumber = `CR-2026-${nextNum}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (targetDays || 14));

    const insertRes = await query(
      `INSERT INTO change_requests (
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
        tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        ticketNumber,
        title,
        description || '',
        category,
        priority,
        'pending_approval',
        'submitted', // Initial Stage 1
        submittedBy || null,
        clientName || 'Apex Global Financials',
        deliveryDate,
        targetDays * 24,
        'healthy',
        businessJustification || '',
        description || '',
        tags.length > 0 ? tags : [category.split(' ')[0], priority.toUpperCase()],
      ]
    );

    const row = insertRes.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Change request created successfully in real-time database',
      data: {
        id: row.id,
        ticketNumber: row.ticket_number,
        title: row.title,
        description: row.description,
        currentStage: row.current_stage,
        priority: row.priority,
        status: row.status,
      },
    });
  } catch (error: any) {
    console.error('Create CR error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create change request' }, { status: 500 });
  }
}
