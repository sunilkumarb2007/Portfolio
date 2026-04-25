export interface SkillNode {
  name: string;
  group: 'frontend' | 'backend' | 'systems' | 'ai' | 'infra' | 'craft';
  level: number; // 0..1 — self-rated, calibrated against shipped projects
}

export const skills: SkillNode[] = [
  // frontend
  { name: 'JavaScript', group: 'frontend', level: 0.85 },
  { name: 'React', group: 'frontend', level: 0.8 },
  { name: 'Vite', group: 'frontend', level: 0.75 },
  { name: 'HTML5 / CSS3', group: 'frontend', level: 0.9 },
  { name: 'Tailwind CSS', group: 'frontend', level: 0.78 },
  { name: 'Next.js', group: 'frontend', level: 0.7 },

  // backend
  { name: 'Node.js', group: 'backend', level: 0.78 },
  { name: 'Express.js', group: 'backend', level: 0.78 },
  { name: 'Python', group: 'backend', level: 0.75 },
  { name: 'Flask', group: 'backend', level: 0.72 },
  { name: 'Go', group: 'backend', level: 0.7 },
  { name: 'Java', group: 'backend', level: 0.78 },
  { name: 'SQL / MySQL', group: 'backend', level: 0.75 },
  { name: 'REST API design', group: 'backend', level: 0.78 },

  // systems / cs fundamentals
  { name: 'Data structures', group: 'systems', level: 0.78 },
  { name: 'Algorithms', group: 'systems', level: 0.75 },
  { name: 'OOP', group: 'systems', level: 0.8 },
  { name: 'System design (basics)', group: 'systems', level: 0.55 },
  { name: 'Async programming', group: 'systems', level: 0.7 },

  // ai
  { name: 'LLM API integration', group: 'ai', level: 0.65 },
  { name: 'Prompt engineering', group: 'ai', level: 0.6 },

  // infra
  { name: 'AWS (EC2 · S3 · CodePipeline)', group: 'infra', level: 0.7 },
  { name: 'Oracle Cloud (OCI)', group: 'infra', level: 0.6 },
  { name: 'Git / GitHub', group: 'infra', level: 0.88 },
  { name: 'GitHub Actions', group: 'infra', level: 0.7 },
  { name: 'Vercel', group: 'infra', level: 0.78 },
  { name: 'Docker (basics)', group: 'infra', level: 0.55 },

  // craft
  { name: 'Problem solving', group: 'craft', level: 0.85 },
  { name: 'Communication', group: 'craft', level: 0.8 },
  { name: 'Time management', group: 'craft', level: 0.78 },
  { name: 'Team collaboration', group: 'craft', level: 0.82 },
];

export const groupColors: Record<SkillNode['group'], string> = {
  frontend: '#7c5cff',
  backend: '#22d3ee',
  systems: '#a3ff5c',
  ai: '#ff5cab',
  infra: '#ffa55c',
  craft: '#5cffd6',
};
