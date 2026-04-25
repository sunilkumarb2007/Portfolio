'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/content/profile';
import { cn } from '@/lib/cn';

const links = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all',
        scrolled ? 'pt-3' : 'pt-6',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2 transition-all',
          scrolled
            ? 'glass shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]'
            : 'border border-transparent',
        )}
      >
        <Link href="/" className="flex items-center gap-2 px-2">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-accent-cyan to-accent-magenta opacity-90" />
            <span className="relative font-display font-bold text-bg">
              {profile.shortName.charAt(0)}
            </span>
          </span>
          <span className="hidden font-display text-sm tracking-tight sm:inline">
            {profile.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm text-ink-dim transition-colors hover:bg-white/5 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full px-3 py-1.5 text-xs text-ink-dim transition-colors hover:bg-white/5 hover:text-ink sm:inline-flex"
          >
            GitHub ↗
          </a>
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-accent to-accent-cyan px-4 py-1.5 text-xs font-medium text-bg shadow-[0_4px_20px_-6px_rgba(124,92,255,0.6)] transition-transform hover:scale-105"
          >
            Get in touch
          </a>
        </div>
      </div>
    </motion.header>
  );
}
