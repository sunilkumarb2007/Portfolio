'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

export function PageTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track({ type: 'pageview', path: pathname });
  }, [pathname]);
  return null;
}
