'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { track } from '@/lib/analytics';
import { profile } from '@/content/profile';
import { cn } from '@/lib/cn';

const Schema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Valid email required').max(254),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'At least 10 characters').max(5000),
});

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      subject: String(fd.get('subject') ?? '') || undefined,
      message: String(fd.get('message') ?? ''),
      website: String(fd.get('website') ?? ''),
    };
    const parsed = Schema.safeParse(payload);
    if (!parsed.success) {
      const errs: Partial<Record<string, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0];
        if (typeof k === 'string') errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus({ kind: 'submitting' });
    try {
      await api<{ ok: boolean }>('/api/contact', {
        method: 'POST',
        body: payload,
      });
      track({ type: 'contact_submit' });
      setStatus({ kind: 'success' });
      e.currentTarget.reset();
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 429
          ? 'Slow down — too many submissions. Try again in a minute.'
          : 'Something went wrong. Try again or email me directly.';
      setStatus({ kind: 'error', message: msg });
    }
  }

  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="05 — contact"
          title={'Let\u2019s build something together.'}
          subtitle="Roles, freelance work, or just nerding out about distributed systems — I read everything."
        />

        <div className="grid gap-10 md:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="glass space-y-4 rounded-2xl p-6"
            noValidate
          >
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <Field label="Name" name="name" autoComplete="name" error={errors.name} />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              error={errors.email}
            />
            <Field label="Subject (optional)" name="subject" error={errors.subject} />
            <Field
              label="Message"
              name="message"
              as="textarea"
              rows={6}
              error={errors.message}
            />

            <div className="flex items-center justify-between gap-4 pt-2">
              <p className="text-xs text-ink-mute">
                Rate-limited & validated server-side. No tracking pixels.
              </p>
              <Button type="submit" disabled={status.kind === 'submitting'}>
                {status.kind === 'submitting' ? 'Sending…' : 'Send message →'}
              </Button>
            </div>

            {status.kind === 'success' && (
              <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-sm text-emerald-300">
                Got it. I'll reply within 48 hours.
              </p>
            )}
            {status.kind === 'error' && (
              <p className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-sm text-rose-300">
                {status.message}
              </p>
            )}
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="space-y-4"
          >
            <div className="glass rounded-2xl p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
                direct
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-2 block font-display text-2xl tracking-tight text-ink hover:text-accent-cyan"
              >
                {profile.email}
              </a>
              <p className="mt-1 text-sm text-ink-dim">Best for internships, freelance, or collaborations.</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
                elsewhere
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href={profile.social.github} className="text-ink hover:text-accent-cyan" target="_blank" rel="noreferrer">
                    GitHub ↗
                  </a>
                </li>
                <li>
                  <a href={profile.social.linkedin} className="text-ink hover:text-accent-cyan" target="_blank" rel="noreferrer">
                    LinkedIn ↗
                  </a>
                </li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6 text-sm text-ink-dim">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-mute">
                response time
              </p>
              <p className="mt-2 text-ink">~24 hours, typically faster.</p>
              <p className="mt-1">Currently UTC+5:30. Async-friendly.</p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = 'text',
  rows,
  as = 'input',
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  rows?: number;
  as?: 'input' | 'textarea';
  error?: string;
  autoComplete?: string;
}) {
  const baseClass = cn(
    'w-full rounded-xl border bg-bg/50 px-3 py-2.5 text-sm text-ink placeholder:text-ink-mute outline-none transition-colors',
    error
      ? 'border-rose-400/40 focus:border-rose-400'
      : 'border-white/10 focus:border-white/30',
  );
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-mono uppercase tracking-widest text-ink-mute">
        {label}
      </span>
      {as === 'textarea' ? (
        <textarea name={name} rows={rows ?? 4} className={baseClass} />
      ) : (
        <input name={name} type={type} autoComplete={autoComplete} className={baseClass} />
      )}
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  );
}
