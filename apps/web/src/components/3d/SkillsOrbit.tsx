'use client';
import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Line, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { skills, groupColors, type SkillNode } from '@/content/skills';

interface NodePosition extends SkillNode {
  position: [number, number, number];
  ringIndex: number;
  ringSize: number;
}

function buildLayout(nodes: SkillNode[]): NodePosition[] {
  // Group nodes onto concentric rings, one ring per group.
  const groups = Array.from(new Set(nodes.map((n) => n.group)));
  const ringRadii: Record<string, number> = {};
  groups.forEach((g, i) => {
    ringRadii[g] = 1.6 + i * 0.6;
  });
  const byGroup = groups.map((g) => nodes.filter((n) => n.group === g));

  const positioned: NodePosition[] = [];
  byGroup.forEach((groupNodes, gi) => {
    const r = ringRadii[groupNodes[0]!.group]!;
    groupNodes.forEach((n, i) => {
      const a = (i / groupNodes.length) * Math.PI * 2 + gi * 0.4;
      // Slight tilt per ring for a planetary feel
      const tilt = (gi % 2 === 0 ? 1 : -1) * 0.18;
      positioned.push({
        ...n,
        position: [Math.cos(a) * r, Math.sin(a) * r * tilt, Math.sin(a) * r],
        ringIndex: gi,
        ringSize: groupNodes.length,
      });
    });
  });
  return positioned;
}

function Ring({ radius, color }: { radius: number; color: string }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);
  return <Line points={points} color={color} lineWidth={0.6} transparent opacity={0.25} />;
}

function SkillSphere({
  node,
  hovered,
  onHover,
}: {
  node: NodePosition;
  hovered: string | null;
  onHover: (name: string | null) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const isHovered = hovered === node.name;
  const color = groupColors[node.group];
  const radius = 0.12 + node.level * 0.18;

  useFrame((_state, delta) => {
    if (!ref.current) return;
    const targetScale = isHovered ? 1.6 : 1;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.3} position={node.position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node.name);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = '';
        }}
      >
        <icosahedronGeometry args={[radius, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 1.1 : 0.6}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      {isHovered && (
        <Html center distanceFactor={8} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-white/15 bg-bg-elev/90 px-3 py-1.5 text-xs font-medium text-ink shadow-2xl backdrop-blur">
            <span style={{ color }}>●</span> {node.name}
            <span className="ml-2 text-ink-mute">
              {Math.round(node.level * 100)}%
            </span>
          </div>
        </Html>
      )}
    </Float>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_s, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
      ref.current.rotation.x += delta * 0.2;
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial
        color="#7c5cff"
        emissive="#5b3cff"
        emissiveIntensity={0.7}
        metalness={0.6}
        roughness={0.2}
        wireframe
      />
    </mesh>
  );
}

function Scene({
  hovered,
  setHovered,
}: {
  hovered: string | null;
  setHovered: (n: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const layout = useMemo(() => buildLayout(skills), []);
  const ringRadii = useMemo(() => {
    const groups = Array.from(new Set(skills.map((s) => s.group)));
    return groups.map((g, i) => ({ group: g, radius: 1.6 + i * 0.6 }));
  }, []);

  useFrame((_state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.06;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#7c5cff" distance={8} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      <Sparkles count={50} scale={[10, 10, 10]} size={1.4} color="#c8c2ff" speed={0.2} />

      <group ref={groupRef}>
        <Core />
        {ringRadii.map((r) => (
          <Ring key={r.group} radius={r.radius} color={groupColors[r.group]} />
        ))}
        {layout.map((node) => (
          <SkillSphere key={node.name} node={node} hovered={hovered} onHover={setHovered} />
        ))}
      </group>
    </>
  );
}

export function SkillsOrbit() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="relative h-[520px] w-full md:h-[600px]">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.6, 6.4], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene hovered={hovered} setHovered={setHovered} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        {Object.entries(groupColors).map(([g, c]) => (
          <span
            key={g}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-bg-elev/70 px-2.5 py-1 capitalize text-ink-dim backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
            {g}
          </span>
        ))}
      </div>
    </div>
  );
}
