import type { Account, Role } from './types';

export const roles: Role[] = ['user', 'superuser', 'admin'];

export const roleLabels: Record<Role, string> = {
  user: 'User',
  superuser: 'Superuser',
  admin: 'Admin',
};

export const usersStorageKey = 'cds.demo.users.v1';

export const initialUsers: Account[] = [
  { id: 'a1', name: 'Alex Morgan', username: 'alex.morgan', role: 'admin' },
  { id: 'a2', name: 'Jordan Lee', username: 'jordan.lee', role: 'superuser' },
  { id: 'u1', name: 'Maya Chen', username: 'maya.chen', role: 'user' },
  { id: 'u2', name: 'Noah Williams', username: 'noah.williams', role: 'user' },
  { id: 'u3', name: 'Sofia Garcia', username: 'sofia.garcia', role: 'user' },
];

export function readUsers(): Account[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(usersStorageKey) ?? 'null');
    return Array.isArray(saved) ? saved as Account[] : initialUsers;
  } catch {
    return initialUsers;
  }
}
