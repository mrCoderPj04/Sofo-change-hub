const EMS_BASE_URL = 'https://erp-backend-1-02lc.onrender.com';

export interface EMSLoginResponse {
  accessToken: string;
  refreshToken: string;
  requirePasswordChange?: boolean;
  user: {
    id: string;
    employeeId: string;
    username: string;
    role: string;
    photoUrl: string | null;
    salary: number;
    designation: string | null;
    status: string;
    isFirstLogin: boolean;
  };
}

export interface EMSRegisterResponse {
  message: string;
  user: {
    id: string;
    employeeId: string;
    username: string;
    email: string | null;
    role: string;
    designation: string | null;
    status: string;
    createdAt: string;
  };
}

export async function emsLogin(
  employeeId: string,
  password: string
): Promise<EMSLoginResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

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
      console.warn('EMS login failed or disabled:', data.error || data.message);
      return null;
    }

    return data;
  } catch (err: any) {
    console.warn('EMS backend connection error:', err.message);
    return null;
  }
}

export async function emsRegister(
  employeeId: string,
  username: string,
  password: string
): Promise<EMSRegisterResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${EMS_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, username, password }),
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
    console.warn('EMS register error:', err.message);
    return null;
  }
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
