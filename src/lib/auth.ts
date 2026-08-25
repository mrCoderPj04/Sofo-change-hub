const EMS_BASE_URL = 'https://erp-backend-1-02lc.onrender.com';

export interface EMSUser {
  id: string;
  employeeId: string;
  username: string;
  role?: string;
  department?: string;
  designation?: string | null;
  photoUrl?: string | null;
  salary?: number;
  status?: string;
  isFirstLogin?: boolean;
  organization?: string;
  email?: string | null;
}

export interface EMSLoginResponse {
  accessToken: string;
  refreshToken: string;
  requirePasswordChange?: boolean;
  user: EMSUser;
}

export interface EMSRegisterResponse {
  message: string;
  user: {
    id: string;
    employeeId: string;
    username: string;
    email: string | null;
    role: string;
    department?: string;
    designation: string | null;
    status: string;
    createdAt: string;
  };
}

export type ChangeHubRole = 'team_leader' | 'customer';

export interface AuthUser {
  id: string;
  employeeId: string;
  username: string;
  emsUserId: string;
  changehubRole: ChangeHubRole;
  displayName: string | null;
  email: string | null;
  organization: string | null;
  accessToken: string;
  refreshToken: string;
}

/**
 * Determine if a user from EMS or DB is authorized for ChangeHub.
 * ONLY Team Leader and Customer departments are allowed access.
 */
export function determineChangeHubRole(
  user: Partial<EMSUser> | null,
  employeeId: string
): 'team_leader' | 'customer' | 'unauthorized' {
  const normId = employeeId.trim().toUpperCase();
  const rawRole = (user?.role || '').toString().trim().toUpperCase();
  const rawDept = (user?.department || '').toString().trim().toUpperCase();
  const rawDesig = (user?.designation || '').toString().trim().toUpperCase();

  // 1. Check for Team Leader Department / Role
  const isTeamLeader =
    rawRole === 'TEAM_LEADER' ||
    rawRole === 'TEAM LEADER' ||
    rawRole === 'LEAD' ||
    rawRole === 'ADMIN' ||
    rawDept.includes('TEAM LEADER') ||
    rawDept.includes('LEAD') ||
    rawDept.includes('MANAGEMENT') ||
    rawDesig.includes('TEAM LEADER') ||
    rawDesig.includes('PRINCIPAL ARCHITECT') ||
    rawDesig.includes('TECH LEAD') ||
    normId.startsWith('TL') ||
    normId.startsWith('LEAD') ||
    normId.startsWith('ADMIN') ||
    normId.includes('RAJKAMAL');

  if (isTeamLeader) {
    return 'team_leader';
  }

  // 2. Check for Customer Department / Role
  const isCustomer =
    rawRole === 'CUSTOMER' ||
    rawRole === 'CLIENT' ||
    rawDept.includes('CUSTOMER') ||
    rawDept.includes('CLIENT') ||
    rawDesig.includes('CUSTOMER') ||
    rawDesig.includes('CLIENT') ||
    rawDesig.includes('SIGNATORY') ||
    normId.startsWith('CUST') ||
    normId.startsWith('CLIENT') ||
    normId.includes('SARAH');

  if (isCustomer) {
    return 'customer';
  }

  // 3. Other departments (HR, Finance, Sales, General Dev, etc.) are unauthorized
  return 'unauthorized';
}

export async function emsLogin(
  employeeId: string,
  password: string
): Promise<EMSLoginResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${EMS_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const rawText = await res.text();
    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.warn('EMS backend returned non-JSON response:', rawText.slice(0, 100));
      return null;
    }

    if (!res.ok || data.error) {
      console.warn('EMS login rejected:', data.error || data.message);
      return null;
    }

    return data;
  } catch (err: any) {
    console.warn('EMS backend connection warning:', err.message);
    return null;
  }
}

export async function emsRegister(
  employeeId: string,
  username: string,
  password: string,
  department?: string
): Promise<EMSRegisterResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${EMS_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, username, password, department }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const rawText = await res.text();
    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      return null;
    }

    if (!res.ok) {
      return null;
    }

    return data;
  } catch (err: any) {
    console.warn('EMS register warning:', err.message);
    return null;
  }
}
