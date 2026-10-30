import type { Account, AccountForm, Role } from './types';

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

type ApiUser = { id: number | string; fullname?: string; fullName?: string; name?: string; username: string; role: string };
export type Session = { token: string; name: string; username: string; role: Role };

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) { super(message); }
}

async function request<T>(path: string, token?: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError('Could not reach the server. Check that the backend is running and try again.');
  }
  if (!response.ok) {
    let message = response.status === 401 ? 'Invalid username or password.'
      : response.status === 403 ? 'You are not allowed to perform this action.'
      : `Request failed (${response.status}).`;
    try {
      const body = await response.json() as { message?: string; title?: string };
      message = body.message ?? body.title ?? message;
    } catch { /* Keep the status-based message. */ }
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

export async function login(username: string, password: string): Promise<Session> {
  const result = await request<{ token: string; name: string; username: string; role: string }>('/api/Auth/login', undefined, {
    method: 'POST', body: JSON.stringify({ username, password }),
  });
  if (!result.token || !isRole(result.role)) throw new ApiError('The server returned an invalid login response.');
  return { token: result.token, name: result.name, username: result.username, role: result.role };
}

export async function getAccounts(token: string): Promise<Account[]> {
  const rows = await request<ApiUser[]>('/api/Auth/users', token);
  return rows.map((user) => ({ id: String(user.id), name: user.fullname ?? user.fullName ?? user.name ?? '', username: user.username, role: normalizeRole(user.role) }));
}

export async function createAccount(token: string, form: AccountForm): Promise<void> {
  await request('/api/Auth/users', token, { method: 'POST', body: JSON.stringify({ fullName: form.name.trim(), username: form.username.trim().toLowerCase(), password: form.password, role: form.role }) });
}

export async function updateAccount(token: string, id: string, form: AccountForm): Promise<void> {
  await request(`/api/Auth/users/${encodeURIComponent(id)}`, token, { method: 'PUT', body: JSON.stringify({ fullName: form.name.trim(), username: form.username.trim().toLowerCase(), role: form.role }) });
}

export async function deleteAccount(token: string, id: string): Promise<void> {
  await request(`/api/Auth/users/${encodeURIComponent(id)}`, token, { method: 'DELETE' });
}

function isRole(value: string): value is Role { return value === 'user' || value === 'superuser' || value === 'admin'; }
function normalizeRole(value: string): Role { const normalized = value.toLowerCase(); return isRole(normalized) ? normalized : 'user'; }
