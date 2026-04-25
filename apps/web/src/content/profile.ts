/**
 * Static profile content. Edit this file to swap in your real bio without
 * touching components.
 */
export const profile = {
  name: 'Sunil Kumar B',
  shortName: 'Sunil',
  role: 'Senior Full-Stack Engineer',
  pitch:
    'I design and ship high-performance systems — from realtime infrastructure and edge AI to GPU-accelerated web experiences.',
  location: 'Bengaluru, IN — Remote, anywhere',
  email: 'hello@example.com',
  social: {
    github: 'https://github.com/sunilkumarb2007',
    linkedin: 'https://www.linkedin.com/in/your-handle',
    x: 'https://x.com/your-handle',
  },
  about: [
    'I build software that has to be fast, reliable, and feel inevitable. Twelve years across the stack — frontend, backend, and the infrastructure underneath.',
    'I care about three things: latency, correctness, and the craft of the interface. Most recently I have been working on realtime collaboration engines, edge AI gateways, and graph-native observability.',
    'When I am not shipping, I am probably writing WGSL compute shaders, reading distributed systems papers, or rebuilding my mechanical keyboard.',
  ],
  highlights: [
    { label: 'Years shipping', value: '12+' },
    { label: 'Production systems', value: '40+' },
    { label: 'Open source ★', value: '8.4k' },
    { label: 'p99 obsession', value: '∞' },
  ],
} as const;
