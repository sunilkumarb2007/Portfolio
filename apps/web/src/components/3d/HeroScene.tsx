'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  Environment,
  Sparkles,
  MeshDistortMaterial,
  Icosahedron,
  Torus,
  TorusKnot,
  Edges,
} from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  scrollProgress: React.MutableRefObject<{ current: number }>;
  reducedMotion: boolean;
}

/**
 * The main 3D hero scene. A holographic core surrounded by floating
 * geometric shapes and a particle field. Camera drifts upward and inward
 * as the user scrolls past the hero section.
 */
export function HeroScene({ scrollProgress, reducedMotion }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const { camera, mouse } = useThree();

  useFrame((_state, delta) => {
    const t = scrollProgress.current.current;
    // Camera drift on scroll: pull back + rise
    const targetZ = 8 + t * 4;
    const targetY = 0.6 + t * 1.4;
    const targetX = mouse.x * 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);

    if (reducedMotion) return;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.x = mouse.y * 0.08;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.2;
      coreRef.current.rotation.y += delta * 0.15;
      const s = 1 + Math.sin(performance.now() * 0.001) * 0.04;
      coreRef.current.scale.setScalar(s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.1;
    }
  });

  const orbiters = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 3.6 + (i % 2) * 0.6;
        return {
          position: [Math.cos(angle) * r, (i % 3 - 1) * 0.6, Math.sin(angle) * r] as [
            number,
            number,
            number,
          ],
          color: ['#7c5cff', '#22d3ee', '#ff5cab', '#a3ff5c', '#ffa55c', '#5cffd6'][i % 6]!,
          shape: i % 3,
        };
      }),
    [],
  );

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#c8c2ff" />
      <directionalLight position={[-6, -2, -5]} intensity={0.5} color="#22d3ee" />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#7c5cff" distance={10} />

      <Environment preset="city" />

      <group ref={groupRef}>
        {/* Holographic core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.4, 1]} />
          <MeshDistortMaterial
            color="#7c5cff"
            emissive="#5b3cff"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.15}
            distort={0.35}
            speed={1.4}
          />
          <Edges color="#c8c2ff" threshold={20} />
        </mesh>

        {/* Concentric rings */}
        <group ref={ringRef}>
          <Torus args={[2.4, 0.012, 16, 200]}>
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={1.1}
              metalness={0.9}
              roughness={0.1}
            />
          </Torus>
          <Torus args={[2.9, 0.008, 16, 200]} rotation={[Math.PI / 2.4, 0, 0]}>
            <meshStandardMaterial
              color="#7c5cff"
              emissive="#7c5cff"
              emissiveIntensity={0.9}
              metalness={0.9}
              roughness={0.1}
            />
          </Torus>
          <Torus args={[3.4, 0.006, 16, 200]} rotation={[Math.PI / 1.7, Math.PI / 3, 0]}>
            <meshStandardMaterial
              color="#ff5cab"
              emissive="#ff5cab"
              emissiveIntensity={0.7}
              metalness={0.9}
              roughness={0.1}
            />
          </Torus>
        </group>

        {/* Floating orbiters */}
        {orbiters.map((o, i) => (
          <Float
            key={i}
            speed={1.2 + (i % 3) * 0.4}
            rotationIntensity={0.6}
            floatIntensity={0.8}
            position={o.position}
          >
            {o.shape === 0 ? (
              <Icosahedron args={[0.32, 0]}>
                <meshStandardMaterial
                  color={o.color}
                  emissive={o.color}
                  emissiveIntensity={0.4}
                  metalness={0.8}
                  roughness={0.2}
                />
                <Edges color={o.color} />
              </Icosahedron>
            ) : o.shape === 1 ? (
              <TorusKnot args={[0.24, 0.07, 80, 16]}>
                <meshStandardMaterial
                  color={o.color}
                  emissive={o.color}
                  emissiveIntensity={0.5}
                  metalness={0.7}
                  roughness={0.25}
                />
              </TorusKnot>
            ) : (
              <mesh>
                <octahedronGeometry args={[0.34, 0]} />
                <meshStandardMaterial
                  color={o.color}
                  emissive={o.color}
                  emissiveIntensity={0.5}
                  metalness={0.6}
                  roughness={0.3}
                />
                <Edges color={o.color} />
              </mesh>
            )}
          </Float>
        ))}

        {/* Particle field */}
        <Sparkles
          count={120}
          scale={[14, 8, 14]}
          size={2.6}
          speed={reducedMotion ? 0 : 0.4}
          color="#c8c2ff"
        />
        <Sparkles
          count={60}
          scale={[10, 6, 10]}
          size={1.4}
          speed={reducedMotion ? 0 : 0.25}
          color="#22d3ee"
        />
      </group>

      <fog attach="fog" args={['#06070b', 9, 22]} />
    </>
  );
}
