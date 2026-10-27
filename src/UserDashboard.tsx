import { roleLabels } from './accounts';
import type { Account, Role } from './types';
import { canManage } from './permissions';

type UserDashboardProps = {
  users: Account[];
  role: Role;
  name: string;
  loading: boolean;
  loadError: string;
  onLogout: () => void;
  onAdd: () => void;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
};

export function UserDashboard({ users, role, name, loading, loadError, onLogout, onAdd, onEdit, onDelete }: UserDashboardProps) {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="title"><h1>Users</h1><p>{users.length} {users.length === 1 ? 'account' : 'accounts'} · Signed in as {name} ({roleLabels[role]})</p></div>
        <div className="controls">
          {role !== 'user' && <button className="button primary" type="button" onClick={onAdd}>Add user</button>}
          <button className="button" type="button" onClick={onLogout}>Logout</button>
        </div>
      </header>
      {loadError && <p className="alert" role="alert">{loadError}</p>}
      <div className="table-card">
        <table>
          <thead><tr><th>Name</th><th>Username</th><th>Role</th><th className="actions">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="empty">Loading accounts…</td></tr>
              : users.length === 0 ? <tr><td colSpan={4} className="empty">No accounts yet.</td></tr>
              : users.map((account) => <tr key={account.id}>
                <td>{account.name}</td><td className="username">@{account.username}</td>
                <td><span className={'role role-' + account.role}>{roleLabels[account.role]}</span></td>
                <td className="actions">{canManage(role, account.role) ? <>
                  <button type="button" onClick={() => onEdit(account)}>Edit</button>
                  <button type="button" className="delete" onClick={() => onDelete(account)}>Delete</button>
                </> : <span className="view-only">View only</span>}</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </main>
  );
}



