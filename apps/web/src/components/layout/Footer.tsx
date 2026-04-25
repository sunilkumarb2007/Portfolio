import Link from 'next/link';
import { profile } from '@/content/profile';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-white/5 bg-bg/60 px-6 py-12 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg">{profile.name}</p>
          <p className="text-sm text-ink-dim">{profile.role} · {profile.location}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-dim">
          <a href={profile.social.github} target="_blank" rel="noreferrer" className="hover:text-ink">
            GitHub
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-ink">
            {profile.email}
          </a>
          <Link href="/admin" className="hover:text-ink">
            Admin
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between text-xs text-ink-mute">
        <span>© {year} {profile.name}. Built with Next.js, R3F, Postgres.</span>
        <span className="font-mono">v1.0.0</span>
      </div>
    </footer>
  );
}
