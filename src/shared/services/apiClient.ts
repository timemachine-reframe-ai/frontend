import { CURRENT_USER_KEY } from './storageService';

const API_BASE =
  (import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:8000';

type BuildHeadersOptions = {
  includeAuth?: boolean;
};

const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const getApiUrl = (path: string) => `${API_BASE}${path}`;

export const buildJsonHeaders = (options: BuildHeadersOptions = {}) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (options.includeAuth !== false) {
    const storedUserJson = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUserJson) {
      try {
        const { accessToken, tokenType } = JSON.parse(storedUserJson);
        if (accessToken) {
          headers.Authorization = `${tokenType || 'Bearer'} ${accessToken}`;
        }
      } catch {
        // ignore malformed data and continue without auth header
      }
    }
  }

  return headers;
};

export const requireAuthJsonHeaders = () => {
  const headers = buildJsonHeaders();
  if (!headers.Authorization) {
    throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
  }
  return headers;
};

export const handleJsonResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.reload();
    throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
  }

  if (!response.ok) {
    const data = await safeJson(response);
    const detail =
      (data && (data.detail || data.message)) || '요청 처리 중 오류가 발생했습니다.';
    throw new Error(detail);
  }
  return response.json();
};
