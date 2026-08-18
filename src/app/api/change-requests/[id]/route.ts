import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await query(
      `SELECT cr.*, u.display_name as submitter_name, u.organization as submitter_org 
       FROM change_requests cr
       LEFT JOIN users u ON cr.submitted_by = u.id
       WHERE cr.id = $1 OR cr.ticket_number = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Change request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Get CR error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const {
      currentStage,
      status,
      tlApproval,
      priority,
      scopeSummary,
      businessJustification,
    } = body;

    const updateFields: string[] = ['updated_at = now()'];
    const values: any[] = [];
    let paramIndex = 1;

    if (currentStage !== undefined) {
      updateFields.push(`current_stage = $${paramIndex++}`);
      values.push(currentStage);
    }

    if (status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    if (tlApproval !== undefined) {
      updateFields.push(`tl_approval = $${paramIndex++}`);
      values.push(JSON.stringify(tlApproval));
    }

    if (priority !== undefined) {
      updateFields.push(`priority = $${paramIndex++}`);
      values.push(priority);
    }

    if (scopeSummary !== undefined) {
      updateFields.push(`scope_summary = $${paramIndex++}`);
      values.push(scopeSummary);
    }

    values.push(id);
    const sql = `
      UPDATE change_requests 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} OR ticket_number = $${paramIndex}
      RETURNING *
    `;

    const updateRes = await query(sql, values);

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Change request not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Change request updated in real-time database',
      data: updateRes.rows[0],
    });
  } catch (error: any) {
    console.error('Update CR error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 });
  }
}
