'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField({ count, color, size, radius }: { count: number; color: string; size: number; radius: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * radius * 0.6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * radius;
    }
    return arr;
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    const p = state.pointer;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, p.y * 0.2, 0.04);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, p.x * 0.6, 0.04);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function SpeedRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.12;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 1.1 + state.pointer.y * 0.25, 0.05);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.4, 0.05);
  });
  return (
    <mesh ref={ref} position={[1.6, -0.2, -1]}>
      <torusGeometry args={[2.4, 0.012, 16, 120]} />
      <meshBasicMaterial color="#E10600" transparent opacity={0.5} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <fog attach="fog" args={['#0A0A0A', 6, 13]} />
      <ParticleField count={1400} color="#E10600" size={0.035} radius={16} />
      <ParticleField count={900} color="#9CA0A6" size={0.02} radius={18} />
      <SpeedRing />
    </Canvas>
  );
}
