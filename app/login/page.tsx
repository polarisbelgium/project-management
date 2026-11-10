'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email: String(form.get('email')), password: String(form.get('password')) });
      if (error) throw error;
      window.location.assign('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in. Check your configuration and credentials.');
      setBusy(false);
    }
  }

  async function signUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({ email: String(form.get('email')), password: String(form.get('password')), options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (error) throw error;
      setMessage('Check your email for the account confirmation link.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create account.');
    } finally { setBusy(false); }
  }

  return (
    <main className="login-page">
      <section className="panel login-card">
        <p className="eyebrow">ProjectHub</p><h1>Sign in</h1>
        <p className="page-intro">Use your company account to access project operations.</p>
        <form className="login-form" onSubmit={signIn}>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
          <button className="primary-btn" disabled={busy}>Sign in</button>
        </form>
        <form className="login-form signup-form" onSubmit={signUp}>
          <h2>Create account</h2>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
          <button className="ghost-btn" disabled={busy}>Create account</button>
        </form>
        {message && <p className="inline-notice" role="status">{message}</p>}
      </section>
    </main>
  );
}
