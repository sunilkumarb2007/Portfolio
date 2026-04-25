'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '@/types/domain';

interface Card3DProps {
  project: Project;
  index: number;
  total: number;
  active: string | null;
  setActive: (slug: string | null) => void;
  onOpen: (slug: string) => void;
}

function projectColor(category: string): string {
  switch (category) {
    case 'systems':
      return '#22d3ee';
    case 'ai':
      return '#ff5cab';
    case '3d':
      return '#a3ff5c';
    case 'platform':
      return '#ffa55c';
    case 'frontend':
      return '#7c5cff';
    default:
      return '#5cffd6';
  }
}

function Card3D({ project, index, total, active, setActive, onOpen }: Card3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const isActive = active === project.slug;
  const dimmed = active !== null && !isActive;
  const color = projectColor(project.category);

  // Curved layout: arc cards along an arc.
  const arc = Math.PI * 0.85;
  const t = total === 1 ? 0.5 : index / (total - 1);
  const angle = -arc / 2 + t * arc;
  const radius = 5;
  const baseX = Math.sin(angle) * radius;
  const baseZ = -Math.cos(angle) * radius + radius;
  const baseY = (index % 2 === 0 ? 0.05 : -0.05);
  const baseRot = -angle * 0.6;

  useFrame((_s, delta) => {
    if (!groupRef.current) return;
    const targetY = baseY + (isActive ? 0.4 : 0);
    const targetScale = isActive ? 1.08 : dimmed ? 0.92 : 1;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * delta * 6;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 6,
    );
    const tilt = isActive ? 0 : baseRot;
    groupRef.current.rotation.y += (tilt - groupRef.current.rotation.y) * delta * 5;
  });

  const handleEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setActive(project.slug);
    document.body.style.cursor = 'pointer';
  };
  const handleLeave = () => {
    setActive(null);
    document.body.style.cursor = '';
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onOpen(project.slug);
  };

  return (
    <group
      ref={groupRef}
      position={[baseX, baseY, baseZ]}
      rotation={[0, baseRot, 0]}
      onPointerOver={handleEnter}
      onPointerOut={handleLeave}
      onClick={handleClick}
    >
      {/* Card body */}
      <RoundedBox args={[2.4, 1.5, 0.06]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color="#11141d"
          emissive={color}
          emissiveIntensity={isActive ? 0.18 : 0.05}
          metalness={0.4}
          roughness={0.4}
          transparent
          opacity={dimmed ? 0.45 : 1}
        />
      </RoundedBox>

      {/* Glow border */}
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[2.55, 1.65]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.4 : 0.15} />
      </mesh>

      {/* Top label: category + year */}
      <Text
        position={[-1.1, 0.6, 0.05]}
        fontSize={0.08}
        anchorX="left"
        anchorY="middle"
        color={color}
      >
        {project.category.toUpperCase()} · {project.year}
      </Text>

      {/* Title */}
      <Text
        position={[-1.1, 0.3, 0.05]}
        fontSize={0.16}
        maxWidth={2.1}
        anchorX="left"
        anchorY="middle"
        color="#e6e8ee"
        lineHeight={1.05}
      >
        {project.title}
      </Text>

      {/* Tagline */}
      <Text
        position={[-1.1, -0.05, 0.05]}
        fontSize={0.08}
        maxWidth={2.1}
        anchorX="left"
        anchorY="top"
        color="#a3a8b6"
        lineHeight={1.3}
      >
        {project.tagline}
      </Text>

      {/* Tags */}
      <Text
        position={[-1.1, -0.55, 0.05]}
        fontSize={0.07}
        maxWidth={2.1}
        anchorX="left"
        anchorY="middle"
        color="#6b7280"
      >
        {project.tags.slice(0, 4).join(' · ')}
      </Text>

      {isActive && (
        <Html
          position={[0, -0.95, 0.1]}
          center
          zIndexRange={[20, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="pointer-events-none rounded-full border border-white/15 bg-bg-elev/85 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-dim backdrop-blur">
            click to open
          </div>
        </Html>
      )}
    </group>
  );
}

interface Props {
  projects: Project[];
  onOpen: (slug: string) => void;
}

export function ProjectsGallery3D({ projects, onOpen }: Props) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative h-[480px] w-full md:h-[560px]">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 5.2], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 4, 5]} intensity={0.8} color="#c8c2ff" />
        <directionalLight position={[-5, -2, -3]} intensity={0.3} color="#22d3ee" />
        <pointLight position={[0, 2, 4]} intensity={0.6} color="#7c5cff" />

        {projects.map((p, i) => (
          <Card3D
            key={p.id}
            project={p}
            index={i}
            total={projects.length}
            active={active}
            setActive={setActive}
            onOpen={onOpen}
          />
        ))}
        <fog attach="fog" args={['#06070b', 6, 14]} />
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-bg-elev/70 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-mute backdrop-blur">
        hover to expand · click to open
      </div>
    </div>
  );
}
