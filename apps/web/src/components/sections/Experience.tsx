'use client';
import { motion } from 'framer-motion';
import { experience } from '@/content/experience';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function Experience() {
  return (
    <section id="experience" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="04 — experience"
          title="A timeline, not a CV."
          subtitle="Recent first. Each entry below links to a body of production code, not slides."
        />

        <ol className="relative space-y-10">
          {/* Spine */}
          <span className="pointer-events-none absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-white/10 to-transparent md:left-[7.5rem]" />

          {experience.map((e, i) => (
            <motion.li
              key={`${e.company}-${i}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative grid grid-cols-[2rem_1fr] items-start gap-4 md:grid-cols-[7rem_1fr_auto] md:gap-6"
            >
              {/* Period (md+) */}
              <div className="hidden font-mono text-xs text-ink-mute md:block">{e.period}</div>

              {/* Dot */}
              <span className="relative col-start-1 mt-2 flex h-3 w-3 md:col-start-2">
                <span className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-3 w-3 rounded-full bg-accent" />
                <span className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-5 w-5 animate-ping rounded-full bg-accent/40" />
              </span>

              {/* Card */}
              <div className="col-start-2 md:col-start-2 md:col-end-3">
                <p className="mb-1 font-mono text-xs text-ink-mute md:hidden">{e.period}</p>
                <h3 className="font-display text-xl tracking-tight">
                  <span className="text-ink">{e.role}</span>{' '}
                  <span className="text-ink-dim">· {e.company}</span>
                </h3>
                <p className="mt-1 text-xs text-ink-mute">{e.location}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-ink-dim marker:text-accent/60">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
