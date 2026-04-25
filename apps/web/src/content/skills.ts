export interface SkillNode {
  name: string;
  group: 'frontend' | 'backend' | 'systems' | 'ai' | 'infra' | 'craft';
  level: number; // 0..1
}

export const skills: SkillNode[] = [
  // frontend
  { name: 'TypeScript', group: 'frontend', level: 0.98 },
  { name: 'React', group: 'frontend', level: 0.96 },
  { name: 'Next.js', group: 'frontend', level: 0.94 },
  { name: 'Three.js / R3F', group: 'frontend', level: 0.88 },
  { name: 'WebGPU / WGSL', group: 'frontend', level: 0.7 },
  { name: 'Tailwind', group: 'frontend', level: 0.95 },

  // backend
  { name: 'Node.js', group: 'backend', level: 0.95 },
  { name: 'Go', group: 'backend', level: 0.85 },
  { name: 'Rust', group: 'backend', level: 0.78 },
  { name: 'Postgres', group: 'backend', level: 0.92 },
  { name: 'Redis', group: 'backend', level: 0.9 },
  { name: 'GraphQL / tRPC', group: 'backend', level: 0.88 },

  // systems
  { name: 'Distributed systems', group: 'systems', level: 0.86 },
  { name: 'CRDTs', group: 'systems', level: 0.84 },
  { name: 'Observability', group: 'systems', level: 0.9 },
  { name: 'Performance', group: 'systems', level: 0.92 },

  // ai
  { name: 'LLM infra', group: 'ai', level: 0.88 },
  { name: 'Vector search', group: 'ai', level: 0.82 },
  { name: 'Eval pipelines', group: 'ai', level: 0.78 },

  // infra
  { name: 'Kubernetes', group: 'infra', level: 0.86 },
  { name: 'AWS', group: 'infra', level: 0.88 },
  { name: 'Cloudflare', group: 'infra', level: 0.84 },
  { name: 'Terraform', group: 'infra', level: 0.78 },

  // craft
  { name: 'Design systems', group: 'craft', level: 0.9 },
  { name: 'API design', group: 'craft', level: 0.92 },
  { name: 'Mentoring', group: 'craft', level: 0.86 },
];

export const groupColors: Record<SkillNode['group'], string> = {
  frontend: '#7c5cff',
  backend: '#22d3ee',
  systems: '#a3ff5c',
  ai: '#ff5cab',
  infra: '#ffa55c',
  craft: '#5cffd6',
};
