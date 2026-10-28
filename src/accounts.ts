import type { Role } from './types';

export const roles: Role[] = ['user', 'superuser', 'admin'];

export const roleLabels: Record<Role, string> = {
  user: 'User',
  superuser: 'Superuser',
  admin: 'Admin',
};


