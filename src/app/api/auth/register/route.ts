import { NextRequest, NextResponse } from 'next/server';
import { emsRegister, emsLogin } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { employeeId, username, password, department, displayName, organization } = await req.json();

    if (!employeeId || !username || !password) {
      return NextResponse.json(
        { error: 'Employee ID, username, and password are required' },
        { status: 400 }
      );
    }

    const role = department === 'team_leader' ? 'team_leader' : 'customer';
    const org = organization || (role === 'team_leader' ? 'PJSOFONIC Core Ecosystem' : 'Apex Global Financials');

    // 1. Try registering with EMS Backend
    await emsRegister(employeeId, username, password).catch(() => null);

    // 2. Perform Login / Get Token
    const loginData = await emsLogin(employeeId, password);

    const emsUserId = loginData?.user?.id || `ems-${Date.now()}`;
    const accessToken =
      loginData?.accessToken ||
      `sofo_tk_${Buffer.from(JSON.stringify({ emp: employeeId, role, ts: Date.now() })).toString('base64')}`;
    const refreshToken =
      loginData?.refreshToken ||
      `sofo_rf_${Buffer.from(JSON.stringify({ emp: employeeId, ts: Date.now() })).toString('base64')}`;

    // 3. Upsert user in CockroachDB
    const existing = await query('SELECT * FROM users WHERE employee_id = $1', [employeeId]);
    let dbUser;

    if (existing.rows.length === 0) {
      const insertRes = await query(
        `INSERT INTO users (employee_id, username, ems_user_id, changehub_role, display_name, organization)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [employeeId, username, emsUserId, role, displayName || username, org]
      );
      dbUser = insertRes.rows[0];
    } else {
      const updateRes = await query(
        `UPDATE users SET changehub_role = $1, ems_user_id = $2, display_name = $3, organization = $4 WHERE employee_id = $5 RETURNING *`,
        [role, emsUserId, displayName || username, org, employeeId]
      );
      dbUser = updateRes.rows[0];
    }

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: dbUser.id,
        employeeId: dbUser.employee_id,
        username: dbUser.username,
        emsUserId,
        changehubRole: dbUser.changehub_role,
        displayName: dbUser.display_name,
        organization: dbUser.organization,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
