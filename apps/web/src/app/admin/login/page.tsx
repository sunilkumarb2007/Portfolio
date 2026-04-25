'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await api<{ token: string; expiresIn: number }>('/api/admin/login', {
        method: 'POST',
        body: { email, password },
      });
      localStorage.setItem('pf-admin-token', res.token);
      localStorage.setItem('pf-admin-expires', String(Date.now() + res.expiresIn * 1000));
      router.replace('/admin');
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 401
          ? 'Invalid email or password.'
          : err instanceof ApiError && err.status === 503
            ? 'Admin password is not configured server-side.'
            : 'Login failed. Try again.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="glass w-full max-w-sm space-y-4 rounded-2xl p-6"
      >
        <Link href="/" className="text-xs text-ink-mute hover:text-ink">
          ← back to site
        </Link>
        <h1 className="font-display text-2xl tracking-tight">Admin login</h1>
        <p className="-mt-2 text-sm text-ink-dim">
          Sign in to view contact messages and analytics.
        </p>
        <label className="block">
          <span className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-ink-mute">
            email
          </span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-bg/50 px-3 py-2.5 text-sm outline-none focus:border-white/30"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-ink-mute">
            password
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-bg/50 px-3 py-2.5 text-sm outline-none focus:border-white/30"
          />
        </label>
        {error && (
          <p className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-sm text-rose-300">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </main>
  );
}
