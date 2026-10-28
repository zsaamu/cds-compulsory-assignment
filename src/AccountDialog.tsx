import { useEffect, useState, type FormEvent } from 'react';
import { roleLabels, roles } from './accounts';
import type { Account, AccountForm, Role } from './types';

type AccountDialogProps = { account: Account | null; actor: Role; onClose: () => void; onSave: (form: AccountForm) => Promise<string | null> };

export function AccountDialog({ account, actor, onClose, onSave }: AccountDialogProps) {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const assignableRoles = roles.filter((role) => actor === 'admin' || (actor === 'superuser' && role === 'user'));

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(true);
    const result = await onSave({
      name: String(data.get('name')), username: String(data.get('username')),
      password: String(data.get('password') ?? ''), role: String(data.get('role')) as Role,
    });
    setError(result ?? '');
    setSaving(false);
  }

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <header className="dialog-head"><h2 id="dialog-title">{account ? 'Edit user' : 'Add user'}</h2><button className="icon-button" type="button" aria-label="Close" onClick={onClose}>×</button></header>
        {actor === 'superuser' && <p className="notice">Superusers can manage ordinary user accounts only.</p>}
        <form onSubmit={handleSubmit}>
          <div className="field"><label htmlFor="full-name">Full name</label><input id="full-name" name="name" defaultValue={account?.name} required maxLength={100} /></div>
          <div className="field"><label htmlFor="new-username">Username</label><input id="new-username" name="username" defaultValue={account?.username} required pattern="[a-zA-Z0-9._-]+" maxLength={40} autoComplete="off" /></div>
          {!account && <div className="field"><label htmlFor="new-password">Password</label><input id="new-password" name="password" type="password" minLength={8} required autoComplete="new-password" /></div>}
          <div className="field"><label htmlFor="new-role">Role</label><select id="new-role" name="role" defaultValue={account?.role ?? assignableRoles[0]}>
            {assignableRoles.map((role) => <option key={role} value={role}>{roleLabels[role]}{role === 'user' ? ' — view only' : role === 'superuser' ? ' — manage users' : ' — manage all roles'}</option>)}
          </select></div>
          {error && <p className="alert form-alert" role="alert">{error}</p>}
          <div className="dialog-actions"><button className="button" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit" disabled={saving}>{saving ? 'Saving…' : account ? 'Save changes' : 'Add user'}</button></div>
        </form>
      </section>
    </div>
  );
}
