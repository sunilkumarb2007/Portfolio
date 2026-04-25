export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  stack: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Lattice Labs',
    role: 'Staff Engineer, Realtime Platform',
    period: '2023 — Present',
    location: 'Remote',
    bullets: [
      'Architected a CRDT sync server scaling to 50k concurrent rooms with sharded routing.',
      'Cut sync bandwidth 73% by designing a binary delta protocol on top of Yjs.',
      'Mentored 6 engineers; introduced load-shape testing into the release process.',
    ],
    stack: ['TypeScript', 'Rust', 'Redis', 'WebSockets', 'k8s'],
  },
  {
    company: 'Helion AI',
    role: 'Senior Full-Stack Engineer',
    period: '2021 — 2023',
    location: 'Remote',
    bullets: [
      'Built the edge inference gateway routing 1.2B requests/mo across 5 LLM providers.',
      'Implemented semantic caching, hitting 95% on FAQ traffic and saving $11k/mo.',
      'Owned the dashboard end-to-end: React, tRPC, Postgres, Tailwind design system.',
    ],
    stack: ['TypeScript', 'Cloudflare Workers', 'Postgres', 'tRPC'],
  },
  {
    company: 'Northwave',
    role: 'Senior Engineer, Observability',
    period: '2019 — 2021',
    location: 'Hybrid',
    bullets: [
      'Replaced ELK with a Neo4j-backed trace store; p95 RCA queries 11s → 280ms.',
      'Designed a query DSL that compiles to Cypher; adopted by 40+ internal teams.',
      'Built a span sampler that preserves traces causally adjacent to errors.',
    ],
    stack: ['Go', 'Neo4j', 'OpenTelemetry', 'gRPC'],
  },
  {
    company: 'Independent',
    role: 'Founder, R&D Studio',
    period: '2016 — 2019',
    location: 'Bengaluru',
    bullets: [
      'Shipped 9 product MVPs across fintech, climate tech, and developer tools.',
      'Three later acquired or operated as standalone businesses.',
    ],
    stack: ['Node.js', 'React', 'Postgres', 'WebGL'],
  },
];
