import { NextRequest, NextResponse } from 'next/server';
import { emsLogin } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { employeeId, password } = body;

    if (!employeeId || !password) {
      return NextResponse.json(
        { error: 'Employee ID and password are required' },
        { status: 400 }
      );
    }

    // 1. Try Authenticating with EMS Backend
    const emsData = await emsLogin(employeeId, password);

    // 2. Determine ChangeHub Role & Defaults
    const normalizedId = employeeId.trim().toUpperCase();
    const isLead =
      normalizedId.startsWith('TL') ||
      normalizedId.startsWith('LEAD') ||
      normalizedId.startsWith('ADMIN') ||
      normalizedId.includes('RAJKAMAL') ||
      emsData?.user?.role === 'ADMIN';

    const defaultRole = isLead ? 'team_leader' : 'customer';
    const defaultUsername = emsData?.user?.username || employeeId.trim().toLowerCase();
    const defaultDisplayName = isLead ? 'Rajkamal Singh' : 'Sarah Chen (Client)';
    const defaultOrg = isLead
      ? 'PJSOFONIC Core Ecosystem'
      : 'Apex Global Financials';

    // 3. Upsert / Query user in CockroachDB
    const existingUserRes = await query(
      'SELECT * FROM users WHERE UPPER(employee_id) = UPPER($1)',
      [employeeId.trim()]
    );

    let dbUser;
    if (existingUserRes.rows.length === 0) {
      const insertRes = await query(
        `INSERT INTO users (employee_id, username, ems_user_id, changehub_role, display_name, organization)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          employeeId.trim(),
          defaultUsername,
          emsData?.user?.id || `ems-${Date.now()}`,
          defaultRole,
          defaultDisplayName,
          defaultOrg,
        ]
      );
      dbUser = insertRes.rows[0];
    } else {
      dbUser = existingUserRes.rows[0];
      if (emsData?.user?.id && !dbUser.ems_user_id) {
        await query(
          'UPDATE users SET ems_user_id = $1 WHERE id = $2',
          [emsData.user.id, dbUser.id]
        );
      }
    }

    // Generate fallback JWT/session tokens if EMS didn't provide one
    const accessToken =
      emsData?.accessToken ||
      `sofo_tk_${Buffer.from(JSON.stringify({ id: dbUser.id, emp: dbUser.employee_id, role: dbUser.changehub_role, ts: Date.now() })).toString('base64')}`;

    const refreshToken =
      emsData?.refreshToken ||
      `sofo_rf_${Buffer.from(JSON.stringify({ id: dbUser.id, ts: Date.now() })).toString('base64')}`;

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: dbUser.id,
        employeeId: dbUser.employee_id,
        username: dbUser.username,
        emsUserId: dbUser.ems_user_id || 'ems-fallback',
        changehubRole: dbUser.changehub_role,
        displayName: dbUser.display_name || dbUser.username,
        organization: dbUser.organization,
      },
    });
  } catch (error: any) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
