import { useEffect, useState } from 'react';
import { AccountDialog } from './AccountDialog';
import { LoginPage } from './LoginPage';
import { UserDashboard } from './UserDashboard';
import { readUsers, usersStorageKey } from './accounts';
import type { Account, AccountForm, Role } from './types';
import { canManage } from './permissions';

export default function App() {
  const [users, setUsers] = useState<Account[]>(readUsers);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [previewRole, setPreviewRole] = useState<Role>('admin');
  const [dialogAccount, setDialogAccount] = useState<Account | null | undefined>();
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(usersStorageKey, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function enterPrototype() {
    setIsLoggedIn(true);
    setPreviewRole('admin');
  }

  function logout() {
    setIsLoggedIn(false);
    setPreviewRole('admin');
    setDialogAccount(undefined);
  }

  function saveAccount(form: AccountForm): string | null {
    if (!isLoggedIn) return 'Please log in again.';

    const username = form.username.trim().toLowerCase();
    const taken = users.some((user) => user.username.toLowerCase() === username && user.id !== dialogAccount?.id);
    if (taken) return 'That username is already in use.';

    if (dialogAccount) {
      if (!canManage(previewRole, dialogAccount.role)) return 'You cannot edit this account.';
      if (previewRole !== 'admin' && form.role !== 'user') return 'You cannot assign this role.';
      setUsers((current) => current.map((user) => user.id === dialogAccount.id
        ? { ...user, name: form.name.trim(), username, role: form.role } : user));
      setToast('Account updated');
    } else {
      const canCreate = previewRole === 'admin' || (previewRole === 'superuser' && form.role === 'user');
      if (!canCreate) return 'You cannot create this account.';
      setUsers((current) => [...current, { id: crypto.randomUUID(), name: form.name.trim(), username, role: form.role }]);
      setToast('Account added');
    }

    setDialogAccount(undefined);
    return null;
  }

  function deleteAccount(account: Account) {
    if (!isLoggedIn || !canManage(previewRole, account.role)) return;
    if (!window.confirm("Delete " + account.name + "'s account?")) return;
    setUsers((current) => current.filter((user) => user.id !== account.id));
    setToast('Account deleted');
  }

  return (
    <>
      {isLoggedIn ? (
        <UserDashboard users={users} previewRole={previewRole} onPreview={setPreviewRole}
          onLogout={logout} onAdd={() => setDialogAccount(null)} onEdit={setDialogAccount} onDelete={deleteAccount} />
      ) : <LoginPage onEnter={enterPrototype} />}

      {isLoggedIn && dialogAccount !== undefined && (
        <AccountDialog key={dialogAccount?.id ?? 'new'} account={dialogAccount} actor={previewRole}
          onClose={() => setDialogAccount(undefined)} onSave={saveAccount} />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
