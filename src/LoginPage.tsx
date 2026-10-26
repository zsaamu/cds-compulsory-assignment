import type { FormEvent } from 'react';

type LoginPageProps = { onEnter: () => void };

export function LoginPage({ onEnter }: LoginPageProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onEnter();
  }

  return (
    <main className="login-wrap">
      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">Login</h1>
        <p className="subtitle">Enter your credentials to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login-username">Username</label>
            <input id="login-username" name="username" autoComplete="username" required />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <button className="button primary login-button" type="submit">Login</button>
        </form>
        <p className="demo-note">Authentication is not connected in this prototype. Enter any username and password to continue.</p>
      </section>
    </main>
  );
}
