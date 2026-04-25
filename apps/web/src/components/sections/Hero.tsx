'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { profile } from '@/content/profile';
import { Button } from '@/components/ui/Button';

const HeroCanvas = dynamic(
  () => import('@/components/3d/HeroCanvas').then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-3 w-3 animate-pulse rounded-full bg-accent" />
      </div>
    ),
  },
);

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      {/* 3D background */}
      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      {/* Gradient + grid overlays */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-start justify-center px-6 pt-32 md:pt-24">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-ink-dim backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
          </span>
          Open to internships & collaborations · {profile.location}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="block text-ink">{profile.name}</span>
          <span className="block gradient-text">{profile.role}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-2xl text-lg text-ink-dim md:text-xl"
        >
          {profile.pitch}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            See selected work →
          </Button>
          <Button
            variant="outline"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get in touch
          </Button>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="ml-1 hidden items-center gap-2 rounded-full px-3 py-1.5 text-sm text-ink-dim transition-colors hover:text-ink sm:inline-flex"
          >
            <span className="font-mono">github.com/Sunilkumarb2007</span> ↗
          </a>
        </motion.div>

        {/* highlights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur md:grid-cols-4"
        >
          {profile.highlights.map((h) => (
            <div key={h.label} className="bg-bg/40 p-5">
              <p className="font-display text-2xl tracking-tight text-ink md:text-3xl">
                {h.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-ink-mute">
                {h.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-ink-mute"
        >
          <div className="flex flex-col items-center gap-2">
            <span>scroll</span>
            <span className="block h-8 w-px bg-gradient-to-b from-ink-mute to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
