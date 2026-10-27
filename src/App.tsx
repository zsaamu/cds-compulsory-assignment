import { useEffect, useState } from 'react';
import { AccountDialog } from './AccountDialog';
import { ApiError, createAccount, deleteAccount as deleteAccountRequest, getAccounts, login, updateAccount, type Session } from './api';
import { LoginPage } from './LoginPage';
import { UserDashboard } from './UserDashboard';
import type { Account, AccountForm } from './types';

export default function App() {
  const [users, setUsers] = useState<Account[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [dialogAccount, setDialogAccount] = useState<Account | null | undefined>();
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleLogin(username: string, password: string): Promise<string | null> {
    try {
      const signedIn = await login(username, password);
      setSession(signedIn);
      setLoading(true);
      setLoadError('');
      try { setUsers(await getAccounts(signedIn.token)); }
      catch (error) {
        if (error instanceof ApiError && error.status === 401) { setSession(null); return 'Your session was rejected. Please log in again.'; }
        setLoadError(error instanceof Error ? error.message : 'Could not load accounts.');
      } finally { setLoading(false); }
      return null;
    } catch (error) { return error instanceof Error ? error.message : 'Login failed. Please try again.'; }
  }


  async function refreshAccounts() {
    if (!session) return;
    setLoadError('');
    setUsers(await getAccounts(session.token));
  }

  function logout() {
    setSession(null);
    setUsers([]);
    setLoadError('');
    setDialogAccount(undefined);
  }

  async function saveAccount(form: AccountForm): Promise<string | null> {
    if (!session) return 'Please log in again.';
    try {
      if (dialogAccount) {
        await updateAccount(session.token, dialogAccount.id, form);
        setToast('Account updated');
      } else {
        await createAccount(session.token, form);
        setToast('Account added');
      }
      await refreshAccounts();
      setDialogAccount(undefined);
      return null;
    } catch (error) { return error instanceof Error ? error.message : 'Could not save the account.'; }
  }

  async function removeAccount(account: Account) {
    if (!session) return;
    if (!window.confirm(`Delete ${account.name}'s account?`)) return;
    try {
      await deleteAccountRequest(session.token, account.id);
      await refreshAccounts();
      setToast('Account deleted');
    } catch (error) { setLoadError(error instanceof Error ? error.message : 'Could not delete the account.'); }
  }

  const visible = session !== null;

  return <>
    {visible ? <>\r\n      <UserDashboard users={users} role={session!.role} name={session!.name} loading={loading} loadError={loadError}
        onLogout={logout} onAdd={() => setDialogAccount(null)} onEdit={setDialogAccount} onDelete={removeAccount} />
    </> : <LoginPage onLogin={handleLogin} />}
    {session && dialogAccount !== undefined && <AccountDialog key={dialogAccount?.id ?? 'new'} account={dialogAccount} actor={session.role}
      onClose={() => setDialogAccount(undefined)} onSave={saveAccount} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </>;
}



