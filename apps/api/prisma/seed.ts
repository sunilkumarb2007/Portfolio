import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  {
    slug: 'realtime-collab-engine',
    title: 'Realtime Collaboration Engine',
    tagline: 'CRDT-backed multiplayer editor scaling to 50k concurrent rooms',
    description:
      'Designed a CRDT (Yjs) sync server on top of WebSockets with a custom presence protocol. Built sharded Redis-backed room routing, optimistic batching, and a binary delta format that cut bandwidth by 73%.',
    tags: ['TypeScript', 'WebSockets', 'CRDT', 'Redis', 'Rust'],
    category: 'systems',
    year: 2025,
    featured: true,
    liveUrl: null,
    repoUrl: null,
    cover: null,
  },
  {
    slug: 'edge-inference-gateway',
    title: 'Edge Inference Gateway',
    tagline: 'Globally distributed LLM gateway with semantic caching',
    description:
      'A Cloudflare Workers + Durable Objects gateway routing model traffic across 5 providers with circuit breakers, semantic cache (95% hit rate on FAQ traffic), and per-tenant token budgets.',
    tags: ['Cloudflare', 'LLM', 'TypeScript', 'Vector Search'],
    category: 'ai',
    year: 2025,
    featured: true,
    liveUrl: null,
    repoUrl: null,
    cover: null,
  },
  {
    slug: 'graph-observability',
    title: 'Graph-native Observability',
    tagline: 'Trace search over a property graph instead of indexed logs',
    description:
      'Replaced ELK with a Neo4j-backed trace store and a query DSL compiled to Cypher. p95 root-cause query latency dropped from 11s to 280ms across 4B spans/day.',
    tags: ['Go', 'Neo4j', 'OpenTelemetry', 'DSL'],
    category: 'systems',
    year: 2024,
    featured: true,
    liveUrl: null,
    repoUrl: null,
    cover: null,
  },
  {
    slug: 'webgpu-particle-lab',
    title: 'WebGPU Particle Lab',
    tagline: '8M particle GPU simulation with compute shaders',
    description:
      'A research playground for spatial-hash particle simulations rendered via WebGPU compute pipelines. Hits 60 FPS on integrated GPUs at 2M particles.',
    tags: ['WebGPU', 'WGSL', 'Three.js', 'Rust'],
    category: '3d',
    year: 2024,
    featured: true,
    liveUrl: null,
    repoUrl: null,
    cover: null,
  },
  {
    slug: 'finops-rightsizing',
    title: 'Cloud FinOps Rightsizing',
    tagline: 'Cut a $4M/yr cloud bill by 38% with workload-aware autoscaling',
    description:
      'Built a workload classifier and a custom HPA controller that right-sizes EKS workloads using historical p95 + spot/on-demand mix optimization. Saved ~$1.5M annually.',
    tags: ['Kubernetes', 'Go', 'AWS', 'FinOps'],
    category: 'platform',
    year: 2024,
    featured: false,
    liveUrl: null,
    repoUrl: null,
    cover: null,
  },
  {
    slug: 'design-system-engine',
    title: 'Polymorphic Design System',
    tagline: 'Token-driven, fully typed components shared across 14 products',
    description:
      'A monorepo design system with style dictionary tokens, Radix primitives, automatic dark mode, and codegen for Figma <-> code parity. Reduced new feature CSS by 60%.',
    tags: ['React', 'Tailwind', 'Radix', 'Style Dictionary'],
    category: 'frontend',
    year: 2023,
    featured: false,
    liveUrl: null,
    repoUrl: null,
    cover: null,
  },
];

async function main() {
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`Seeded ${projects.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
