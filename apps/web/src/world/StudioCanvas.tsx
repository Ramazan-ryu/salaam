'use client';

import { OrbitControls, PerspectiveCamera, useAnimations, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { BODIES, bodyUrl, type AvatarConfig } from './avatar';

const MAT_KEYS: Record<string, keyof AvatarConfig['colors']> = { Skin: 'skin', Hair: 'hair', Shirt: 'shirt', Pants: 'pants' };

/** Studio preview: the same renderer-independent AvatarConfig, shown full-size on a plinth. */
function Model({ cfg, cheer, reducedMotion }: { cfg: AvatarConfig; cheer: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const { scene: src, animations } = useGLTF(bodyUrl(cfg.body));
  const model = useMemo(() => {
    const c = cloneSkinned(src) as THREE.Group;
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.material = Array.isArray(m.material) ? m.material.map((x) => x.clone()) : (m.material as THREE.Material).clone();
      }
    });
    return c;
  }, [src]);
  useEffect(() => {
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      for (const mat of (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshStandardMaterial[]) {
        const k = MAT_KEYS[mat.name];
        if (k) mat.color.set(cfg.colors[k]);
        mat.roughness = 0.7;
      }
    });
  }, [model, cfg]);
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (reducedMotion) {
      actions.Idle?.reset().play();
      actions.Idle && (actions.Idle.timeScale = 0);
      return;
    }
    actions.Idle?.reset().fadeIn(0.2).play();
    return () => void actions.Idle?.fadeOut(0.2);
  }, [actions, reducedMotion, cfg.body]);
  useEffect(() => {
    if (!cheer || reducedMotion) return;
    const v = actions.Victory;
    if (!v) return;
    v.reset().setLoop(THREE.LoopOnce, 1);
    v.clampWhenFinished = false;
    actions.Idle?.fadeOut(0.2);
    v.fadeIn(0.2).play();
    const id = setTimeout(() => {
      v.fadeOut(0.3);
      actions.Idle?.reset().fadeIn(0.3).play();
    }, 1800);
    return () => clearTimeout(id);
  }, [cheer, actions, reducedMotion]);
  return (
    <group ref={group} position={[0, 0.12, 0]} scale={1.05}>
      <primitive object={model} />
    </group>
  );
}

export default function StudioCanvas({ cfg, cheer, reducedMotion }: { cfg: AvatarConfig; cheer: number; reducedMotion: boolean }) {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }} aria-label="Avatar preview">
      <PerspectiveCamera makeDefault position={[0, 2.6, 11]} fov={28} />
      <OrbitControls target={[0, 1.75, 0]} enablePan={false} enableZoom={false} minPolarAngle={1.1} maxPolarAngle={1.55} enableDamping autoRotate={!reducedMotion} autoRotateSpeed={0.6} />
      <hemisphereLight args={['#FFF4E6', '#5B4034', 0.9]} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} color="#FFE7CC" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, -3]} intensity={1.1} color="#9FD3CC" />
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.25, 1.35, 0.12, 64]} />
        <meshStandardMaterial color="#E9DFD2" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.12, 64]} />
        <meshBasicMaterial color="#E8603C" />
      </mesh>
      <Suspense fallback={null}>
        <Model cfg={cfg} cheer={cheer} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}

for (const b of BODIES) useGLTF.preload(bodyUrl(b));
