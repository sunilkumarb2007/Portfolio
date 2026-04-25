'use client';
import { PUBLIC_ENV } from './env';

const SESSION_KEY = 'pf-session';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

interface Event {
  type: string;
  path?: string;
  metadata?: Record<string, unknown>;
}

export function track(event: Event): void {
  if (typeof window === 'undefined') return;
  const payload = {
    ...event,
    sessionId: getSessionId(),
    referrer: document.referrer || undefined,
    path: event.path ?? window.location.pathname,
  };
  // Fire-and-forget; never block UI
  const url = `${PUBLIC_ENV.apiUrl}/api/analytics/event`;
  if ('sendBeacon' in navigator) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
    return;
  }
  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
