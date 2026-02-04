'use client';

import { useRef, useMemo, Suspense, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/**
 * PC 3D – Titre "Le Sage Dev" avec animation frappe, pile dans l'écran. PC un peu baissé.
 */

function ScreenContent() {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current?.material) {
      meshRef.current.material.emissiveIntensity = 0.35 + Math.sin(t * 1.2) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0.02]}>
      {/* Fond écran avec glow pulsé */}
      <mesh ref={meshRef}>
        <planeGeometry args={[1.72, 0.98]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#1e3a5f"
          emissiveIntensity={0.4}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function PCSetup({ rotationY }) {
  const bezelColor = useMemo(() => new THREE.Color('#0f172a'), []);
  const towerColor = useMemo(() => new THREE.Color('#1f2937'), []);
  const standColor = useMemo(() => new THREE.Color('#4b5563'), []);

  return (
    <group
      rotation={[0, (rotationY * Math.PI) / 180, 0]}
      position={[0, -0.52, 0]}
    >
      {/* ========== MONITEUR ========== */}
      <group position={[0, 0.85, 0]}>
        <RoundedBox args={[1.92, 1.12, 0.08]} position={[0, 0, -0.06]} radius={0.02} smoothness={4}>
          <meshStandardMaterial color="#1f2937" roughness={0.6} metalness={0.3} />
        </RoundedBox>
        <RoundedBox args={[1.88, 1.08, 0.06]} position={[0, 0, 0]} radius={0.015} smoothness={4}>
          <meshStandardMaterial color={bezelColor} roughness={0.7} metalness={0.2} />
        </RoundedBox>
        <group position={[0, 0, 0.032]}>
          <ScreenContent />
        </group>
        <mesh position={[0, 0.48, 0.035]}>
          <sphereGeometry args={[0.02, 12, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>

      {/* ========== PIED ========== */}
      <group position={[0, 0.45, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.35, 16]} />
          <meshStandardMaterial color={standColor} roughness={0.5} metalness={0.4} />
        </mesh>
        <RoundedBox args={[0.35, 0.04, 0.22]} position={[0, -0.42, 0]} radius={0.02} smoothness={4}>
          <meshStandardMaterial color="#6b7280" roughness={0.5} metalness={0.35} />
        </RoundedBox>
      </group>

      {/* ========== TOUR ========== */}
      <group position={[1.15, 0.35, 0]}>
        <RoundedBox args={[0.22, 0.75, 0.45]} position={[0, 0, 0]} radius={0.02} smoothness={4}>
          <meshStandardMaterial color={towerColor} roughness={0.5} metalness={0.35} />
        </RoundedBox>
        <RoundedBox args={[0.18, 0.65, 0.02]} position={[0, 0, 0.23]} radius={0.01} smoothness={2}>
          <meshStandardMaterial color="#111827" roughness={0.7} metalness={0.1} />
        </RoundedBox>
        <mesh position={[0.06, 0.28, 0.24]}>
          <sphereGeometry args={[0.012, 10, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.06, 0.2, 0.24]}>
          <sphereGeometry args={[0.008, 8, 6]} />
          <meshStandardMaterial color="#374151" emissive="#374151" emissiveIntensity={0.1} />
        </mesh>
      </group>
    </group>
  );
}

function Scene3D({ rotationY }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, 2]} intensity={0.4} />
      <pointLight position={[0, 2, 3]} intensity={0.6} color="#3b82f6" />
      <Environment preset="apartment" />
      <group scale={[1.28, 1.28, 1.28]}>
        <PCSetup rotationY={rotationY} />
      </group>
    </>
  );
}

function ScrollRotatePC3DInner({ className = '' }) {
  const { scrollYProgress } = useScroll({ offset: ['start start', 'end start'] });
  const rotateYRaw = useTransform(
    scrollYProgress,
    [0, 0.12, 0.3, 0.5, 0.7, 0.88],
    [0, 45, 95, 145, 195, 240]
  );
  const rotateY = useSpring(rotateYRaw, { stiffness: 60, damping: 24, restDelta: 0.001 });
  /* Opacité : le PC se fond dans le bleu du fond au scroll pour ne pas gêner la lecture */
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.22, 0.4], [1, 0.75, 0.25, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.12], [1, 0.97]);

  const [rotation, setRotation] = useState(0);
  useMotionValueEvent(rotateY, 'change', (v) => setRotation(v));

  return (
    <motion.div
      className={`fixed inset-0 flex items-center justify-center pointer-events-none z-0 ${className}`}
      style={{ opacity, scale }}
      aria-hidden
    >
      <motion.div
        className="w-full h-full min-h-[100vh] pointer-events-none"
        style={{ perspective: '1600px' }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <Canvas
          camera={{ position: [0, 0, 4.1], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          style={{ pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <Scene3D rotationY={rotation} />
          </Suspense>
        </Canvas>
      </motion.div>
    </motion.div>
  );
}

export default function ScrollRotatePC3D({ className = '' }) {
  return <ScrollRotatePC3DInner className={className} />;
}
