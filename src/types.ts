export type Role = 'user' | 'superuser' | 'admin';

export type Account = {
  id: string;
  name: string;
  username: string;
  role: Role;
};

export type AccountForm = {
  name: string;
  username: string;
  role: Role;
};
