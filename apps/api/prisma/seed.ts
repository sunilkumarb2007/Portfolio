import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  {
    slug: 'ai-medical-assistant',
    title: 'AI Medical Assistant Chatbot',
    tagline: 'Full-stack AI chatbot answering medical queries with a Flask backend',
    description:
      'A full-stack chatbot that fields medical questions and returns grounded answers. Built a modular React (Vite + Tailwind) frontend talking to a Flask service over a structured-JSON REST contract. Hardened the surface with timeouts, retries, and React Error Boundaries; ships to Vercel with environment-based configuration so dev / preview / prod stay isolated.',
    tags: ['React', 'Vite', 'Tailwind', 'Python', 'Flask', 'REST', 'Vercel'],
    category: 'ai',
    year: 2025,
    featured: true,
    liveUrl: null,
    repoUrl: 'https://github.com/Sunilkumarb2007',
    cover: null,
  },
  {
    slug: 'bookstore-go-service',
    title: 'Bookstore Management System',
    tagline: 'CRUD service in Go with GORM, Gorilla Mux, and MySQL',
    description:
      'A bookstore management API written in Go: Gorilla Mux for routing, GORM as the ORM layer, MySQL for persistence. Implements the full CRUD lifecycle (create, list, fetch, update, delete) with structured request validation and predictable error envelopes.',
    tags: ['Go', 'Gorilla Mux', 'GORM', 'MySQL', 'REST'],
    category: 'systems',
    year: 2025,
    featured: true,
    liveUrl: null,
    repoUrl: 'https://github.com/Sunilkumarb2007',
    cover: null,
  },
  {
    slug: 'aws-codepipeline-deploy',
    title: 'AWS CodePipeline Deployment',
    tagline: 'Two-stage CI/CD on AWS — S3 source → EC2 deploy via CodeDeploy',
    description:
      'Built an end-to-end deployment pipeline on AWS. Source stage watches a versioned sample app in an S3 bucket. Deploy stage hands off to CodeDeploy, which rolls the artifact onto EC2 instances. Practical exercise in real cloud delivery: artifact buckets, IAM roles, deployment groups, and rollback paths.',
    tags: ['AWS', 'CodePipeline', 'CodeDeploy', 'EC2', 'S3', 'CI/CD'],
    category: 'platform',
    year: 2025,
    featured: true,
    liveUrl: null,
    repoUrl: 'https://github.com/Sunilkumarb2007',
    cover: null,
  },
  {
    slug: 'github-api-shell',
    title: 'GitHub API Integration',
    tagline: 'Shell automation around the GitHub API for repo introspection',
    description:
      'A small shell-scripting project that integrates with the GitHub REST API to enumerate users with access to a given repository. Showcases JSON parsing in shell, paginated API consumption, and clean exit codes.',
    tags: ['Shell', 'Bash', 'Git', 'GitHub API'],
    category: 'platform',
    year: 2025,
    featured: true,
    liveUrl: null,
    repoUrl: 'https://github.com/Sunilkumarb2007',
    cover: null,
  },
  {
    slug: 'portfolio-3d',
    title: 'Portfolio (this site)',
    tagline: 'Next.js + R3F + Express + Postgres, with an AI dock',
    description:
      'This site itself: a 3D portfolio on Next.js 14 (App Router, TS strict), Tailwind, Framer Motion, and React Three Fiber. The backend is an Express/Prisma/Postgres service running on Vercel as a serverless function with a contact form, analytics, an admin inbox, and an LLM-powered assistant grounded on the on-site data.',
    tags: ['Next.js', 'TypeScript', 'R3F', 'Express', 'Prisma', 'Postgres'],
    category: '3d',
    year: 2026,
    featured: false,
    liveUrl: null,
    repoUrl: 'https://github.com/Sunilkumarb2007/Portfolio',
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
