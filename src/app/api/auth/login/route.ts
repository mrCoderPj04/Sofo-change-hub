import { NextRequest, NextResponse } from 'next/server';
import { emsLogin } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { employeeId, password } = await req.json();

    if (!employeeId || !password) {
      return NextResponse.json(
        { error: 'Employee ID and password are required' },
        { status: 400 }
      );
    }

    // 1. Authenticate with EMS Backend
    const emsData = await emsLogin(employeeId, password);

    // 2. Check if user already exists in CockroachDB
    const existingUserRes = await query(
      'SELECT * FROM users WHERE employee_id = $1',
      [employeeId]
    );

    let dbUser;
    if (existingUserRes.rows.length === 0) {
      // Auto-detect role: TL / Lead / Admin vs Customer
      const normalizedId = employeeId.toUpperCase();
      const normalizedUser = (emsData.user.username || '').toLowerCase();
      const isLead =
        normalizedId.startsWith('TL') ||
        normalizedId.startsWith('LEAD') ||
        normalizedId.startsWith('ADMIN') ||
        normalizedUser.includes('rajkamal') ||
        normalizedUser.includes('lead') ||
        emsData.user.role === 'ADMIN';

      const userRole = isLead ? 'team_leader' : 'customer';
      const orgName = isLead
        ? 'PJSOFONIC Core Ecosystem'
        : 'Apex Global Financials';

      const insertRes = await query(
        `INSERT INTO users (employee_id, username, ems_user_id, changehub_role, display_name, organization)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          employeeId,
          emsData.user.username,
          emsData.user.id,
          userRole,
          emsData.user.username,
          orgName,
        ]
      );
      dbUser = insertRes.rows[0];
    } else {
      dbUser = existingUserRes.rows[0];
      // Update ems_user_id if needed
      if (!dbUser.ems_user_id) {
        await query(
          'UPDATE users SET ems_user_id = $1 WHERE employee_id = $2',
          [emsData.user.id, employeeId]
        );
      }
    }

    return NextResponse.json({
      success: true,
      accessToken: emsData.accessToken,
      refreshToken: emsData.refreshToken,
      user: {
        id: dbUser.id,
        employeeId: dbUser.employee_id,
        username: dbUser.username,
        emsUserId: emsData.user.id,
        changehubRole: dbUser.changehub_role,
        displayName: dbUser.display_name || dbUser.username,
        organization: dbUser.organization,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
