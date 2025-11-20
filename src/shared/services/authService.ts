import { buildJsonHeaders, getApiUrl, handleJsonResponse } from './apiClient';

const LOGIN_ENDPOINT = getApiUrl('/api/login');
const SIGNUP_ENDPOINT = getApiUrl('/api/users');
const LOGIN_ID_CHECK_ENDPOINT = getApiUrl('/api/login-id/check');
const ME_ENDPOINT = getApiUrl('/api/me');

export interface LoginPayload {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface LoginIdCheckResponse {
  loginId: string;
  available: boolean;
}

export interface MeResponse {
  id?: number;
  username?: string;
  email?: string;
  loginId?: string;
}
export interface SignUpPayload {
  username: string;
  email: string;
  loginId: string;
  password: string;
}

const safeString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
};

export const extractProfileFromToken = (
  token: string,
): { name?: string; username?: string; email?: string; loginId?: string } => {
  const payload = decodeJwtPayload(token);
  if (!payload) return {};

  return {
    name: safeString(payload.name) ?? safeString(payload.fullName),
    username: safeString(payload.username),
    email: safeString(payload.email),
    loginId: safeString(payload.loginId) ?? safeString(payload.sub),
  };
};

export const login = async ({ loginId, password }: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: buildJsonHeaders({ includeAuth: false }),
    body: JSON.stringify({ loginId, password }),
  });

  return handleJsonResponse(response);
};

export const signUp = async (payload: SignUpPayload): Promise<void> => {
  const response = await fetch(SIGNUP_ENDPOINT, {
    method: 'POST',
    headers: buildJsonHeaders({ includeAuth: false }),
    body: JSON.stringify(payload),
  });

  await handleJsonResponse(response);
};

export const fetchMe = async (
  accessToken: string,
  tokenType?: string,
): Promise<MeResponse> => {
  const response = await fetch(ME_ENDPOINT, {
    method: 'GET',
    headers: {
      ...buildJsonHeaders({ includeAuth: false }),
      Authorization: `${tokenType || 'Bearer'} ${accessToken}`,
    },
  });

  return handleJsonResponse(response);
};

export const checkLoginIdAvailability = async (loginId: string): Promise<LoginIdCheckResponse> => {
  const response = await fetch(`${LOGIN_ID_CHECK_ENDPOINT}?login_id=${encodeURIComponent(loginId)}`, {
    method: 'GET',
    headers: buildJsonHeaders({ includeAuth: false }),
  });

  return handleJsonResponse(response);
};
