'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { HeroScene } from './HeroScene';

export function HeroCanvas() {
  const scrollProgress = useRef({ current: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);

    const onScroll = () => {
      const heroEl = document.getElementById('hero');
      const heroHeight = heroEl?.offsetHeight ?? window.innerHeight;
      const y = window.scrollY;
      scrollProgress.current.current = Math.max(0, Math.min(1, y / heroHeight));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', update);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.6, 8], fov: 45, near: 0.1, far: 50 }}
      frameloop="always"
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <HeroScene scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
