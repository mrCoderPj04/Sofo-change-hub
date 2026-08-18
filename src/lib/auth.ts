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

export async function emsLogin(employeeId: string, password: string): Promise<EMSLoginResponse> {
  const res = await fetch(`${EMS_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

export async function emsRegister(employeeId: string, username: string, password: string): Promise<EMSRegisterResponse> {
  const res = await fetch(`${EMS_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
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
