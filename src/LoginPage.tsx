import { useState, type FormEvent } from 'react';

type LoginPageProps = { onLogin: (username: string, password: string) => Promise<string | null> };

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setError((await onLogin(String(data.get('username')).trim(), String(data.get('password')))) ?? '');
    setSubmitting(false);
  }

  return (
    <main className="login-wrap">
      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">Login</h1>
        <p className="subtitle">Enter your credentials to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="field"><label htmlFor="login-username">Username</label><input id="login-username" name="username" autoComplete="username" required /></div>
          <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" name="password" type="password" autoComplete="current-password" required /></div>
          {error && <p className="alert form-alert" role="alert">{error}</p>}
          <button className="button primary login-button" type="submit" disabled={submitting}>{submitting ? 'Logging in…' : 'Login'}</button>
        </form>     </section>
    </main>
  );
}




