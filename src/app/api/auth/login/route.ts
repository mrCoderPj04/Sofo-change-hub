import { NextRequest, NextResponse } from 'next/server';
import { emsLogin, determineChangeHubRole } from '@/lib/auth';
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

    const trimmedId = employeeId.trim();

    // 1. Authenticate with EMS Backend (https://erp-backend-1-02lc.onrender.com)
    const emsData = await emsLogin(trimmedId, password);

    // 2. Classify Department & Role
    const resolvedRole = determineChangeHubRole(emsData?.user || null, trimmedId);

    // 3. Strict Department Authorization: ONLY Team Leader & Customer allowed
    if (resolvedRole === 'unauthorized') {
      const userDept = emsData?.user?.department || emsData?.user?.role || 'Other';
      return NextResponse.json(
        {
          error: `Access Denied: Only users from Team Leader or Customer departments can access SOFO ChangeHub. (Detected Department/Role: ${userDept})`,
          code: 'UNAUTHORIZED_DEPARTMENT',
        },
        { status: 403 }
      );
    }

    // 4. Default metadata depending on role
    const isLead = resolvedRole === 'team_leader';
    const defaultUsername = emsData?.user?.username || trimmedId.toLowerCase();
    const defaultDisplayName =
      emsData?.user?.username ||
      (isLead ? 'Rajkamal Singh (Team Leader)' : 'Sarah Chen (Customer)');
    const defaultOrg = isLead
      ? 'PJSOFONIC Core Ecosystem'
      : (emsData?.user?.organization || 'Apex Global Financials');
    const defaultEmail = emsData?.user?.email || (isLead ? 'rajkamal@pjsofonic.com' : 'sarah.chen@apexfinancials.com');

    // 5. Query / Upsert in Supabase PostgreSQL (project_changehub.users)
    const existingUserRes = await query(
      'SELECT * FROM users WHERE UPPER(employee_id) = UPPER($1)',
      [trimmedId]
    );

    let dbUser;
    if (existingUserRes.rows.length === 0) {
      const insertRes = await query(
        `INSERT INTO users (employee_id, username, ems_user_id, changehub_role, display_name, email, organization)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          trimmedId,
          defaultUsername,
          emsData?.user?.id || `ems-${Date.now()}`,
          resolvedRole,
          defaultDisplayName,
          defaultEmail,
          defaultOrg,
        ]
      );
      dbUser = insertRes.rows[0];
    } else {
      dbUser = existingUserRes.rows[0];
      // Update role if changed or if ems_user_id needs sync
      await query(
        `UPDATE users SET 
          changehub_role = $1, 
          display_name = COALESCE($2, display_name),
          organization = COALESCE($3, organization),
          ems_user_id = COALESCE($4, ems_user_id)
         WHERE id = $5`,
        [
          resolvedRole,
          defaultDisplayName,
          defaultOrg,
          emsData?.user?.id || null,
          dbUser.id,
        ]
      );
      dbUser.changehub_role = resolvedRole;
    }

    // 6. Generate authenticated tokens
    const accessToken =
      emsData?.accessToken ||
      `sofo_tk_${Buffer.from(
        JSON.stringify({
          id: dbUser.id,
          emp: dbUser.employee_id,
          role: resolvedRole,
          ts: Date.now(),
        })
      ).toString('base64')}`;

    const refreshToken =
      emsData?.refreshToken ||
      `sofo_rf_${Buffer.from(
        JSON.stringify({ id: dbUser.id, ts: Date.now() })
      ).toString('base64')}`;

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: dbUser.id,
        employeeId: dbUser.employee_id,
        username: dbUser.username,
        emsUserId: dbUser.ems_user_id || 'ems-session',
        changehubRole: resolvedRole,
        displayName: dbUser.display_name || defaultDisplayName,
        email: dbUser.email || defaultEmail,
        organization: dbUser.organization || defaultOrg,
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
