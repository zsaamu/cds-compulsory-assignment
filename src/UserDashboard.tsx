import { roleLabels, roles } from './accounts';
import type { Account, Role } from './types';
import { canManage } from './permissions';

type UserDashboardProps = {
  users: Account[];
  previewRole: Role;
  onPreview: (role: Role) => void;
  onLogout: () => void;
  onAdd: () => void;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
};

export function UserDashboard({ users, previewRole, onPreview, onLogout, onAdd, onEdit, onDelete }: UserDashboardProps) {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="title">
          <h1>Users</h1>
          <p>{users.length} {users.length === 1 ? 'account' : 'accounts'}</p>
        </div>
        <div className="controls">
          <label className="preview">
            <span>Preview as</span>
            <select value={previewRole} aria-label="Preview dashboard permissions"
              onChange={(event) => onPreview(event.target.value as Role)}>
              {roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
            </select>
          </label>
          {previewRole !== 'user' && <button className="button primary" type="button" onClick={onAdd}>Add user</button>}
          <button className="button" type="button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="table-card">
        <table>
          <thead><tr><th>Name</th><th>Username</th><th>Role</th><th className="actions">Actions</th></tr></thead>
          <tbody>
            {users.length === 0 ? <tr><td colSpan={4} className="empty">No accounts yet.</td></tr> : users.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td className="username">@{account.username}</td>
                <td><span className={'role role-' + account.role}>{roleLabels[account.role]}</span></td>
                <td className="actions">
                  {canManage(previewRole, account.role) ? <>
                    <button type="button" onClick={() => onEdit(account)}>Edit</button>
                    <button type="button" className="delete" onClick={() => onDelete(account)}>Delete</button>
                  </> : <span className="view-only">View only</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
