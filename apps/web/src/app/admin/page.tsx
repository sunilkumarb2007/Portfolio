'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import type { AnalyticsSummary, ContactMessage } from '@/types/domain';

function useAdminToken() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const t = localStorage.getItem('pf-admin-token');
    const exp = Number(localStorage.getItem('pf-admin-expires') ?? 0);
    if (!t || exp < Date.now()) {
      router.replace('/admin/login');
      return;
    }
    setToken(t);
  }, [router]);
  return token;
}

export default function AdminPage() {
  const router = useRouter();
  const token = useAdminToken();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api<{ items: ContactMessage[] }>('/api/admin/messages', { token }),
      api<AnalyticsSummary>('/api/admin/analytics/summary', { token }),
    ])
      .then(([m, s]) => {
        setMessages(m.items);
        setSummary(s);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem('pf-admin-token');
          router.replace('/admin/login');
        } else {
          setError('Failed to load data.');
        }
      });
  }, [token, router]);

  async function markRead(id: string) {
    if (!token) return;
    try {
      const updated = await api<ContactMessage>(`/api/admin/messages/${id}/read`, {
        method: 'POST',
        token,
      });
      setMessages((cur) => cur.map((m) => (m.id === id ? updated : m)));
      setActive((cur) => (cur && cur.id === id ? updated : cur));
    } catch {
      /* ignore */
    }
  }

  function logout() {
    localStorage.removeItem('pf-admin-token');
    localStorage.removeItem('pf-admin-expires');
    router.replace('/admin/login');
  }

  if (!token) return null;

  const unread = messages.filter((m) => !m.read).length;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <Link href="/" className="text-xs text-ink-mute hover:text-ink">
              ← back to site
            </Link>
            <h1 className="mt-1 font-display text-3xl tracking-tight">Admin</h1>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-ink-dim hover:text-ink"
          >
            Sign out
          </button>
        </header>

        {error && (
          <p className="mb-6 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        <section className="mb-12 grid gap-4 md:grid-cols-3">
          <Stat label="Messages" value={messages.length.toString()} sub={`${unread} unread`} />
          <Stat
            label="Analytics events (30d)"
            value={summary ? summary.total.toLocaleString() : '—'}
            sub={summary ? `${summary.byType.length} event types` : ' '}
          />
          <Stat
            label="Top event type"
            value={summary?.byType[0]?.type ?? '—'}
            sub={
              summary?.byType[0]
                ? `${summary.byType[0].count.toLocaleString()} events`
                : ' '
            }
          />
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-display text-xl tracking-tight">Messages</h2>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-ink-mute">
                <tr>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-ink-dim">
                      No messages yet.
                    </td>
                  </tr>
                )}
                {messages.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setActive(m)}
                    className="cursor-pointer border-t border-white/5 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <div className="text-ink">{m.name}</div>
                      <div className="text-xs text-ink-mute">{m.email}</div>
                    </td>
                    <td className="px-4 py-3 text-ink-dim">
                      {m.subject ?? <span className="text-ink-mute">(no subject)</span>}
                    </td>
                    <td className="px-4 py-3 text-ink-mute">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {m.read ? (
                        <span className="text-ink-mute">Read</span>
                      ) : (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                          New
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl tracking-tight">Analytics</h2>
          {summary ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
                  events by type
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {summary.byType
                    .sort((a, b) => b.count - a.count)
                    .map((b) => (
                      <li key={b.type} className="flex items-center gap-3">
                        <span className="w-32 truncate text-ink">{b.type}</span>
                        <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/5">
                          <span
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent-cyan"
                            style={{
                              width: `${
                                (b.count / Math.max(...summary.byType.map((x) => x.count))) * 100
                              }%`,
                            }}
                          />
                        </span>
                        <span className="w-16 text-right text-xs text-ink-mute">{b.count}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
                  events by day (30d)
                </p>
                <DayBars data={summary.byDay} />
              </div>
            </div>
          ) : (
            <p className="text-ink-dim">Loading…</p>
          )}
        </section>

        {active && (
          <div
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-2xl space-y-4 rounded-2xl p-6"
            >
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl">
                    {active.subject ?? '(no subject)'}
                  </h3>
                  <p className="text-sm text-ink-dim">
                    From {active.name} &lt;{active.email}&gt;
                  </p>
                  <p className="text-xs text-ink-mute">
                    {new Date(active.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="rounded-full bg-white/5 p-2 text-ink-dim hover:text-ink"
                >
                  ✕
                </button>
              </header>
              <p className="whitespace-pre-wrap rounded-xl border border-white/10 bg-bg/50 p-4 text-sm leading-relaxed text-ink">
                {active.message}
              </p>
              <div className="flex items-center justify-between">
                <a
                  href={`mailto:${active.email}?subject=${encodeURIComponent('Re: ' + (active.subject ?? ''))}`}
                  className="rounded-full bg-gradient-to-r from-accent to-accent-cyan px-4 py-1.5 text-sm font-medium text-bg"
                >
                  Reply ↗
                </a>
                {!active.read && (
                  <button
                    onClick={() => markRead(active.id)}
                    className="text-sm text-ink-dim hover:text-ink"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">{label}</p>
      <p className="mt-1 font-display text-3xl tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-ink-mute">{sub}</p>
    </div>
  );
}

function DayBars({ data }: { data: Array<{ day: string; count: number }> }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="mt-3 flex h-32 items-end gap-1">
      {data.map((d) => (
        <div
          key={d.day}
          title={`${new Date(d.day).toLocaleDateString()}: ${d.count}`}
          className="flex-1 rounded-t bg-gradient-to-t from-accent/30 to-accent-cyan"
          style={{ height: `${(d.count / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
