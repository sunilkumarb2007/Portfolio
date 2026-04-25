'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { skills, groupColors, type SkillNode } from '@/content/skills';

const SkillsOrbit = dynamic(
  () => import('@/components/3d/SkillsOrbit').then((m) => m.SkillsOrbit),
  { ssr: false, loading: () => <div className="h-[520px] md:h-[600px]" /> },
);

export function Skills() {
  const grouped = skills.reduce<Record<string, SkillNode[]>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="03 — skills"
          title="The full stack, weighted by use."
          subtitle="Hover the orbiting nodes for proficiency. The list below is the same data, reflowed."
        />

        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SkillsOrbit />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5 space-y-6"
          >
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-mute">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: groupColors[group as SkillNode['group']] }}
                  />
                  {group}
                </h3>
                <ul className="space-y-2">
                  {items
                    .sort((a, b) => b.level - a.level)
                    .map((s) => (
                      <li key={s.name} className="flex items-center gap-3 text-sm">
                        <span className="w-32 shrink-0 truncate text-ink">{s.name}</span>
                        <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/5">
                          <span
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                              width: `${s.level * 100}%`,
                              background: `linear-gradient(90deg, ${groupColors[s.group]}, ${groupColors[s.group]}99)`,
                            }}
                          />
                        </span>
                        <span className="w-10 text-right text-xs text-ink-mute">
                          {Math.round(s.level * 100)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
