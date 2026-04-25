'use client';
import { motion } from 'framer-motion';
import { profile } from '@/content/profile';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function About() {
  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="01 — about" title="Engineer, by craft." />
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 space-y-6">
            {profile.about.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="text-lg leading-relaxed text-ink-dim"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <div className="glass overflow-hidden rounded-2xl">
              <div className="border-b border-white/5 bg-white/5 px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink-mute">
                principles
              </div>
              <ul className="divide-y divide-white/5 text-sm">
                {[
                  ['Latency is the product.', 'p95 + p99, not averages.'],
                  ['Observability first.', 'You can\u2019t fix what you can\u2019t see.'],
                  ['Ship to production.', 'Anything else is a hobby project.'],
                  ['Boring, then clever.', 'Use Postgres. Cache later.'],
                  ['Type the boundaries.', 'Fewer mocks, more tests.'],
                ].map(([title, body]) => (
                  <li key={title} className="px-5 py-3">
                    <p className="text-ink">{title}</p>
                    <p className="text-ink-dim">{body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
