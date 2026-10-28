import type { Role } from './types';

export function canManage(actor: Role, target: Role): boolean {
  return actor === 'admin' || (actor === 'superuser' && target === 'user');
}
