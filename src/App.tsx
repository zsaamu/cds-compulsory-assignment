import { useEffect, useState, type FormEvent } from 'react';

type Role = 'user' | 'superuser' | 'admin';
type Account = { id: string; name: string; username: string; role: Role };
type Session = { id: string; role: Role };
type AccountForm = { name: string; username: string; role: Role };

const roles: Role[] = ['user', 'superuser', 'admin'];
const roleLabels: Record<Role, string> = { user: 'User', superuser: 'Superuser', admin: 'Admin' };
const usersKey = 'cds.demo.users.v1';
const initialUsers: Account[] = [
  { id: 'a1', name: 'Alex Morgan', username: 'alex.morgan', role: 'admin' },
  { id: 'a2', name: 'Jordan Lee', username: 'jordan.lee', role: 'superuser' },
  { id: 'u1', name: 'Maya Chen', username: 'maya.chen', role: 'user' },
  { id: 'u2', name: 'Noah Williams', username: 'noah.williams', role: 'user' },
  { id: 'u3', name: 'Sofia Garcia', username: 'sofia.garcia', role: 'user' },
];

function readUsers(): Account[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(usersKey) ?? 'null');
    return Array.isArray(value) ? value as Account[] : initialUsers;
  } catch { return initialUsers; }
}

function canManage(actor: Role, target: Role) {
  return actor === 'admin' || (actor === 'superuser' && target === 'user');
}

export default function App() {
  const [users, setUsers] = useState<Account[]>(readUsers);
  const [session, setSession] = useState<Session | null>(null);
  const [previewRole, setPreviewRole] = useState<Role>('admin');
  const [dialog, setDialog] = useState<Account | null | undefined>(undefined);
  const [toast, setToast] = useState('');

  useEffect(() => { localStorage.setItem(usersKey, JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function enterPrototype(_username: string, _password: string) {
    setSession({ id: 'prototype', role: 'admin' });
    setPreviewRole('admin');
  }

  function logout() {
    setSession(null);
    setPreviewRole('admin');
  }

  function saveAccount(form: AccountForm): string | null {
    if (!session) return 'Please log in again.';
    const username = form.username.trim().toLowerCase();
    if (users.some((user) => user.username.toLowerCase() === username && user.id !== dialog?.id)) return 'That username is already in use.';
    if (dialog) {
      if (!canManage(session.role, dialog.role)) return 'You cannot edit this account.';
      if (session.role !== 'admin' && form.role !== 'user') return 'You cannot assign this role.';
      setUsers((current) => current.map((user) => user.id === dialog.id ? { ...user, name: form.name.trim(), username, role: form.role } : user));
      setToast('Account updated');
    } else {
      if (session.role === 'user' || (session.role === 'superuser' && form.role !== 'user')) return 'You cannot create this account.';
      setUsers((current) => [...current, { id: crypto.randomUUID(), name: form.name.trim(), username, role: form.role }]);
      setToast('Account added');
    }
    setDialog(undefined);
    return null;
  }

  function deleteAccount(account: Account) {
    if (!session || !canManage(session.role, account.role)) return;
    if (window.confirm(`Delete ${account.name}'s account?`)) {
      setUsers((current) => current.filter((user) => user.id !== account.id));
      setToast('Account deleted');
    }
  }

  return <>
    {session ? <Dashboard users={users} previewRole={previewRole} onPreview={setPreviewRole} onLogout={logout}
      onAdd={() => setDialog(null)} onEdit={setDialog} onDelete={deleteAccount} />
      : <Login onEnter={enterPrototype} />}
    {session && dialog !== undefined && <AccountDialog key={dialog?.id ?? 'new'} account={dialog} actor={session.role} onClose={() => setDialog(undefined)} onSave={saveAccount} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </>;
}

function Login({ onEnter }: { onEnter: (username: string, password: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onEnter(String(data.get('username')), String(data.get('password')));
  }
  return <main className="login-wrap"><section className="login-card" aria-labelledby="login-title">
    <h1 id="login-title">Login</h1><p className="subtitle">Enter your credentials to continue.</p>
    <form onSubmit={submit}>
      <div className="field"><label htmlFor="login-username">Username</label><input id="login-username" name="username" autoComplete="username" required /></div>
      <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" name="password" type="password" autoComplete="current-password" required /></div>
      <button className="button primary login-button" type="submit">Login</button>
    </form>
    <p className="demo-note">Authentication is not connected in this prototype. Enter any username and password to continue.</p>
  </section></main>;
}

function Dashboard({ users, previewRole, onPreview, onLogout, onAdd, onEdit, onDelete }: {
  users: Account[]; previewRole: Role; onPreview: (role: Role) => void; onLogout: () => void;
  onAdd: () => void; onEdit: (account: Account) => void; onDelete: (account: Account) => void;
}) {
  const canAdd = previewRole !== 'user';
  return <main className="shell"><header className="topbar">
    <div className="title"><h1>Users</h1><p>{users.length} {users.length === 1 ? 'account' : 'accounts'}</p></div>
    <div className="controls"><label className="preview"><span>Preview as</span><select value={previewRole} aria-label="Preview dashboard permissions" onChange={(event) => onPreview(event.target.value as Role)}>
      {roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
    </select></label>
      {canAdd && <button className="button primary" type="button" onClick={onAdd}>Add user</button>}
      <button className="button" type="button" onClick={onLogout}>Logout</button>
    </div>
  </header>
  <div className="table-card"><table><thead><tr><th scope="col">Name</th><th scope="col">Username</th><th scope="col">Role</th><th scope="col" className="actions">Actions</th></tr></thead>
    <tbody>{users.length === 0 ? <tr><td colSpan={4} className="empty">No accounts yet.</td></tr> : users.map((account) => <tr key={account.id}>
      <td>{account.name}</td><td className="username">@{account.username}</td><td><span className={`role role-${account.role}`}>{roleLabels[account.role]}</span></td>
      <td className="actions">{canManage(previewRole, account.role)
        ? <><button type="button" onClick={() => onEdit(account)}>Edit</button><button type="button" className="delete" onClick={() => onDelete(account)}>Delete</button></>
        : <span className="view-only">View only</span>}</td>
    </tr>)}</tbody>
  </table></div></main>;
}

function AccountDialog({ account, actor, onClose, onSave }: {
  account: Account | null; actor: Role; onClose: () => void; onSave: (form: AccountForm) => string | null;
}) {
  const [error, setError] = useState('');
  const assignableRoles = roles.filter((role) => actor === 'admin' || (actor === 'superuser' && role === 'user'));
  useEffect(() => {
    function keydown(event: KeyboardEvent) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [onClose]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(onSave({ name: String(data.get('name')), username: String(data.get('username')), role: String(data.get('role')) as Role }) ?? '');
  }
  return <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <header className="dialog-head"><h2 id="dialog-title">{account ? 'Edit user' : 'Add user'}</h2><button className="icon-button" type="button" aria-label="Close" onClick={onClose}>×</button></header>
      {actor === 'superuser' && <p className="notice">Superusers can manage ordinary user accounts only.</p>}
      <form onSubmit={submit}>
        <div className="field"><label htmlFor="full-name">Full name</label><input id="full-name" name="name" defaultValue={account?.name} required maxLength={100} /></div>
        <div className="field"><label htmlFor="new-username">Username</label><input id="new-username" name="username" defaultValue={account?.username} required pattern="[a-zA-Z0-9._-]+" maxLength={40} autoComplete="off" /></div>
        {!account && <div className="field"><label htmlFor="new-password">Password</label><input id="new-password" name="password" type="password" minLength={8} required autoComplete="new-password" /></div>}
        <div className="field"><label htmlFor="new-role">Role</label><select id="new-role" name="role" defaultValue={account?.role ?? assignableRoles[0]}>
          {assignableRoles.map((role) => <option key={role} value={role}>{roleLabels[role]}{role === 'user' ? ' — view only' : role === 'superuser' ? ' — manage users' : ' — manage all roles'}</option>)}
        </select></div>
        {error && <p className="alert form-alert" role="alert">{error}</p>}
        <div className="dialog-actions"><button className="button" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit">{account ? 'Save changes' : 'Add user'}</button></div>
      </form>
    </section>
  </div>;
}
