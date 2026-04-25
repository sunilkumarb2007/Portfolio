'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { fallbackProjects } from '@/content/projects';
import { api } from '@/lib/api';
import { track } from '@/lib/analytics';
import type { Project } from '@/types/domain';

const ProjectsGallery3D = dynamic(
  () => import('@/components/3d/ProjectsGallery3D').then((m) => m.ProjectsGallery3D),
  { ssr: false, loading: () => <div className="h-[480px] md:h-[560px]" /> },
);

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ items: Project[] }>('/api/projects')
      .then((res) => {
        if (!cancelled && res.items.length > 0) setProjects(res.items);
      })
      .catch(() => {
        // fall back to static content
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = projects.filter((p) => p.featured);
  const visibleIn3D = featured.length > 0 ? featured : projects.slice(0, 4);

  const active = projects.find((p) => p.slug === activeSlug) ?? null;

  return (
    <section id="projects" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="02 — selected work"
          title="Projects, as objects."
          subtitle="A curved 3D gallery of recent work. Hover to expand. Click to open the full case."
        />

        <ProjectsGallery3D
          projects={visibleIn3D}
          onOpen={(slug) => {
            track({ type: 'project_open', metadata: { slug } });
            setActiveSlug(slug);
          }}
        />

        {/* Grid fallback / extended list */}
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              onClick={() => {
                track({ type: 'project_open', metadata: { slug: p.slug } });
                setActiveSlug(p.slug);
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-bg-elev/60 p-5 text-left transition-colors hover:border-white/20 hover:bg-bg-elev"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink-mute">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {p.category} · {p.year}
              </div>
              <h3 className="mt-3 font-display text-xl tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-dim">{p.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="absolute right-4 top-4 text-ink-mute transition-colors group-hover:text-ink">↗</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/80 px-4 backdrop-blur-md"
            onClick={() => setActiveSlug(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-8"
            >
              <button
                aria-label="Close"
                onClick={() => setActiveSlug(null)}
                className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-ink-dim transition-colors hover:bg-white/10 hover:text-ink"
              >
                ✕
              </button>
              <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
                {active.category} · {active.year}
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
                {active.title}
              </h2>
              <p className="mt-2 text-ink-dim">{active.tagline}</p>
              <p className="mt-6 text-ink-dim leading-relaxed">{active.description}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {active.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex gap-3 text-sm">
                {active.liveUrl && (
                  <a
                    href={active.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-gradient-to-r from-accent to-accent-cyan px-4 py-2 font-medium text-bg"
                  >
                    Live ↗
                  </a>
                )}
                {active.repoUrl && (
                  <a
                    href={active.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/15 px-4 py-2 text-ink-dim hover:text-ink"
                  >
                    Source ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
