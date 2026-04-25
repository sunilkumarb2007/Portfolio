'use client';
import { motion } from 'framer-motion';
import { profile } from '@/content/profile';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function About() {
  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="01 — about" title="Student. Builder. Curious about everything." />
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
                  ['Ship something every week.', 'A small thing finished beats a big thing imagined.'],
                  ['Read the actual error.', 'Stack traces are not decoration.'],
                  ['Boring tools, sharp questions.', 'Postgres + REST + JSON gets very far.'],
                  ['Learn in public.', 'Open-source the homework.'],
                  ['Be honest about what you know.', 'And about what you do not.'],
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
