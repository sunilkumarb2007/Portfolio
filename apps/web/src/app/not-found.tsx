import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">404</p>
      <h1 className="mt-2 font-display text-5xl tracking-tight">This page is not on the map.</h1>
      <p className="mt-3 max-w-md text-ink-dim">
        The route you tried doesn&apos;t exist. The portfolio lives at the home route.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 text-sm font-medium text-bg"
      >
        Take me home
      </Link>
    </main>
  );
}
