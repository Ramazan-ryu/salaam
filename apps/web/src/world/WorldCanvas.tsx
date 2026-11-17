'use client';

import { Html, OrbitControls, OrthographicCamera, useAnimations, useGLTF } from '@react-three/drei';
import { Bloom, EffectComposer, N8AO, SMAA, Vignette } from '@react-three/postprocessing';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { bodyUrl, type AvatarConfig } from './avatar';
import { STUDIO_BAKU, WINDOW_FEATURE, type FeatureKey, type SceneObject, type WorldScene } from './scene';
import { planksTexture, windowViewTexture, type TimeOfDay } from './textures';

let rectInit = false;
function initRectLights() {
  if (!rectInit) {
    RectAreaLightUniformsLib.init();
    rectInit = true;
  }
}

export interface WorldLabels {
  objects: Record<FeatureKey, string>;
  hello: string;
}

export interface WorldCanvasProps {
  tod: TimeOfDay;
  avatar: AvatarConfig;
  labels: WorldLabels;
  /** Object the companion should go to (null = stay home). */
  selected: FeatureKey | null;
  onSelect: (f: FeatureKey) => void;
  /** Called when the companion has reached the selected object. */
  onArrive: (f: FeatureKey) => void;
  reducedMotion: boolean;
  scene?: WorldScene;
}

const LIGHT: Record<TimeOfDay, { hemiSky: string; hemiGround: string; hemi: number; sun: string; sunI: number; sunPos: [number, number, number]; lamps: number; wall: string }> = {
  morning: { hemiSky: '#FFE9D6', hemiGround: '#B59A85', hemi: 1.05, sun: '#FFD2A6', sunI: 2.6, sunPos: [-5, 7, -10], lamps: 0, wall: '#EFDCC8' },
  day: { hemiSky: '#FFFFFF', hemiGround: '#C9B9A6', hemi: 1.15, sun: '#FFF4E0', sunI: 2.9, sunPos: [-3, 11, -9], lamps: 0, wall: '#F1E2D2' },
  evening: { hemiSky: '#F2B48C', hemiGround: '#5A4A66', hemi: 0.7, sun: '#FF9A5A', sunI: 2.3, sunPos: [-7, 4.5, -11], lamps: 0.9, wall: '#EBCDB4' },
  night: { hemiSky: '#6B7EB0', hemiGround: '#2A2438', hemi: 0.45, sun: '#9DB4FF', sunI: 0.55, sunPos: [-4, 9, -10], lamps: 1.6, wall: '#D9C2B0' },
};

/* ---------------------------------------------------------------- room architecture */

function Room({ scene, tod, onWindow, windowLabel, selected }: { scene: WorldScene; tod: TimeOfDay; onWindow: () => void; windowLabel: string; selected: boolean }) {
  const { half, wallHeight: H, window: win } = scene.room;
  const planks = useMemo(() => {
    const t = planksTexture();
    t.repeat.set(1.4, 1.4);
    return t;
  }, []);
  const view = useMemo(() => windowViewTexture(tod), [tod]);
  const L = LIGHT[tod];
  const wallMat = <meshStandardMaterial color={L.wall} roughness={0.95} />;
  const trim = '#B98E6A';
  const T = 0.28; // wall thickness
  const [hover, setHover] = useState(false);
  const wx = (win.x0 + win.x1) / 2;
  const wy = (win.y0 + win.y1) / 2;
  const ww = win.x1 - win.x0;
  const wh = win.y1 - win.y0;

  return (
    <group>
      {/* floor slab (diorama base) */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[half * 2 + T, 0.4, half * 2 + T]} />
        <meshStandardMaterial color="#8A5E3F" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[half * 2, half * 2]} />
        <meshStandardMaterial map={planks} roughness={0.75} />
      </mesh>

      {/* back wall (z = -half) with a window opening */}
      <group position={[0, 0, -half - T / 2]}>
        <mesh position={[(-half + win.x0) / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[win.x0 + half, H, T]} />
          {wallMat}
        </mesh>
        <mesh position={[(win.x1 + half) / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[half - win.x1, H, T]} />
          {wallMat}
        </mesh>
        <mesh position={[wx, win.y0 / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[ww, win.y0, T]} />
          {wallMat}
        </mesh>
        <mesh position={[wx, (win.y1 + H) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[ww, H - win.y1, T]} />
          {wallMat}
        </mesh>
        {/* window frame + mullions */}
        {(
          [
            [wx, win.y0, ww + 0.12, 0.1],
            [wx, win.y1, ww + 0.12, 0.1],
          ] as Array<[number, number, number, number]>
        ).map(([x, y, w, h], i) => (
          <mesh key={`h${i}`} position={[x, y, 0.1]} castShadow>
            <boxGeometry args={[w, h, 0.16]} />
            <meshStandardMaterial color="#F5EFE6" roughness={0.6} />
          </mesh>
        ))}
        {[win.x0, wx, win.x1].map((x, i) => (
          <mesh key={`v${i}`} position={[x, wy, 0.1]} castShadow>
            <boxGeometry args={[i === 1 ? 0.07 : 0.1, wh, 0.16]} />
            <meshStandardMaterial color="#F5EFE6" roughness={0.6} />
          </mesh>
        ))}
        {/* sill */}
        <mesh position={[wx, win.y0 - 0.04, 0.22]} castShadow receiveShadow>
          <boxGeometry args={[ww + 0.3, 0.08, 0.32]} />
          <meshStandardMaterial color="#F5EFE6" roughness={0.6} />
        </mesh>
        {/* the city view (unlit painted backdrop just behind the opening) */}
        <mesh
          position={[wx, wy, -0.05]}
          onClick={(e) => {
            e.stopPropagation();
            onWindow();
          }}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <planeGeometry args={[ww, wh]} />
          <meshBasicMaterial map={view} toneMapped={false} color={hover || selected ? '#FFFFFF' : '#F2F2F2'} />
        </mesh>
        {/* curtains */}
        {[win.x0 - 0.18, win.x1 + 0.18].map((x, i) => (
          <mesh key={`c${i}`} position={[x, (win.y1 + 0.35) / 2 + 0.2, 0.22]} castShadow>
            <boxGeometry args={[0.32, win.y1 + 0.15, 0.08]} />
            <meshStandardMaterial color="#D8A47F" roughness={1} />
          </mesh>
        ))}
        <mesh position={[wx, win.y1 + 0.3, 0.26]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, ww + 0.9, 8]} />
          <meshStandardMaterial color="#5B4034" />
        </mesh>
        <Html position={[wx, win.y1 + 0.55, 0.3]} center zIndexRange={[20, 0]}>
          <button className={`w-label${selected ? ' is-on' : ''}${hover ? ' is-hover' : ''}`} onClick={onWindow} type="button">
            {windowLabel}
          </button>
        </Html>
      </group>

      {/* left wall (x = -half) */}
      <mesh position={[-half - T / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, half * 2 + T * 2]} />
        {wallMat}
      </mesh>
      {/* wall caps + baseboards */}
      <mesh position={[0, H + 0.04, -half - T / 2]}>
        <boxGeometry args={[half * 2 + T * 2, 0.08, T + 0.02]} />
        <meshStandardMaterial color={trim} />
      </mesh>
      <mesh position={[-half - T / 2, H + 0.04, 0]}>
        <boxGeometry args={[T + 0.02, 0.08, half * 2 + T * 2]} />
        <meshStandardMaterial color={trim} />
      </mesh>
      <mesh position={[0, 0.08, -half + 0.02]} receiveShadow>
        <boxGeometry args={[half * 2, 0.16, 0.04]} />
        <meshStandardMaterial color="#F5EFE6" />
      </mesh>
      <mesh position={[-half + 0.02, 0.08, 0]} receiveShadow>
        <boxGeometry args={[0.04, 0.16, half * 2]} />
        <meshStandardMaterial color="#F5EFE6" />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------- furniture & interactive objects */

function Furniture({ obj, label, active, onSelect }: { obj: SceneObject; label?: string; active: boolean; onSelect?: () => void }) {
  const { scene } = useGLTF(obj.asset);
  const interactive = Boolean(obj.feature && onSelect);
  const model = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = obj.castShadow !== false;
        m.receiveShadow = true;
        if (interactive) m.material = (m.material as THREE.MeshStandardMaterial).clone();
      }
    });
    return c;
  }, [scene, interactive, obj.castShadow]);
  const [hover, setHover] = useState(false);
  const lit = hover || active;

  useEffect(() => {
    if (!interactive) return;
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color(lit ? '#FFB86B' : '#000000');
        mat.emissiveIntensity = lit ? 0.32 : 0;
      }
    });
  }, [lit, model, interactive]);

  return (
    <group position={obj.position} rotation={[0, obj.rotationY ?? 0, 0]} scale={obj.scale ?? 1}>
      <primitive
        object={model}
        onClick={
          interactive
            ? (e: { stopPropagation: () => void }) => {
                e.stopPropagation();
                onSelect!();
              }
            : undefined
        }
        onPointerOver={interactive ? () => setHover(true) : undefined}
        onPointerOut={interactive ? () => setHover(false) : undefined}
      />
      {interactive && label && (
        <Html position={[0, obj.labelY ?? 1.2, 0]} center zIndexRange={[20, 0]}>
          <button
            className={`w-label${active ? ' is-on' : ''}${hover ? ' is-hover' : ''}`}
            type="button"
            onClick={onSelect}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
          >
            {label}
          </button>
        </Html>
      )}
    </group>
  );
}

/* ---------------------------------------------------------------- the companion */

const MAT_KEYS: Record<string, keyof AvatarConfig['colors']> = { Skin: 'skin', Hair: 'hair', Shirt: 'shirt', Pants: 'pants' };

function Companion({
  cfg,
  scene,
  target,
  onArrive,
  celebrate,
  reducedMotion,
  hello,
  onTap,
}: {
  cfg: AvatarConfig;
  scene: WorldScene;
  target: { feature: FeatureKey; at: [number, number]; look: [number, number] } | null;
  onArrive: (f: FeatureKey) => void;
  celebrate: number;
  reducedMotion: boolean;
  hello: string;
  onTap: () => void;
}) {
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
      const mats = (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshStandardMaterial[];
      for (const mat of mats) {
        const k = MAT_KEYS[mat.name];
        if (k) mat.color.set(cfg.colors[k]);
        mat.roughness = 0.75;
      }
    });
  }, [model, cfg]);

  const { actions, mixer } = useAnimations(animations, group);
  const current = useRef<string>('');
  const play = (name: string, once = false) => {
    const next = actions[name];
    if (!next || current.current === name) return;
    const prev = current.current ? actions[current.current] : null;
    next.reset();
    next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity);
    next.clampWhenFinished = once;
    next.fadeIn(0.25).play();
    prev?.fadeOut(0.25);
    current.current = name;
  };

  const [home] = useState(() => new THREE.Vector3(scene.character.home[0], 0, scene.character.home[1]));
  const arrivedFor = useRef<FeatureKey | null>(null);
  const busy = useRef(false); // one-shot animation running
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    group.current.position.copy(home);
    group.current.rotation.y = scene.character.homeYaw;
    play('Idle');
    const done = (e: { action: THREE.AnimationAction }) => {
      busy.current = false;
      if (e.action.getClip().name !== 'Idle') play('Idle');
    };
    mixer.addEventListener('finished', done);
    return () => mixer.removeEventListener('finished', done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  useEffect(() => {
    if (!celebrate) return;
    busy.current = true;
    current.current = '';
    play('Victory', true);
    setBubble(true);
    const t = setTimeout(() => setBubble(false), 3200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebrate]);

  useEffect(() => {
    arrivedFor.current = null;
    if (reducedMotion && target) {
      group.current.position.set(target.at[0], 0, target.at[1]);
      arrivedFor.current = target.feature;
      onArrive(target.feature);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.feature]);

  useFrame((_, dt) => {
    const g = group.current;
    const dest = target ? new THREE.Vector3(target.at[0], 0, target.at[1]) : home;
    const d = dest.clone().sub(g.position);
    d.y = 0;
    const dist = d.length();
    let wantYaw = scene.character.homeYaw;
    if (dist > 0.06 && !reducedMotion) {
      const step = Math.min(dist, 1.9 * dt);
      g.position.add(d.normalize().multiplyScalar(step));
      wantYaw = Math.atan2(d.x, d.z);
      if (!busy.current) play('Walk');
    } else {
      if (target) {
        wantYaw = Math.atan2(target.look[0] - g.position.x, target.look[1] - g.position.z);
        if (arrivedFor.current !== target.feature) {
          arrivedFor.current = target.feature;
          busy.current = true;
          current.current = '';
          play('PickUp', true);
          onArrive(target.feature);
        }
      }
      if (!busy.current) play('Idle');
    }
    // shortest-path yaw easing
    let dy = wantYaw - g.rotation.y;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    g.rotation.y += dy * Math.min(1, dt * 7);
  });

  return (
    <group
      ref={group}
      scale={scene.character.scale}
      onClick={(e) => {
        e.stopPropagation();
        onTap();
      }}
    >
      <primitive object={model} />
      {bubble && (
        <Html position={[0, 3.6, 0]} center zIndexRange={[30, 0]}>
          <div className="w-bubble" role="status">
            {hello}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ---------------------------------------------------------------- camera, lights, scene */

function IsoCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const { size } = useThree();
  // Portrait phones: fill the width and lift the room above the bottom sheet; landscape: fit the whole room.
  const portrait = size.height > size.width * 1.2;
  const zoom = portrait ? size.width / 9.2 : Math.min(size.width / 12, size.height / 10.2);
  const lift = portrait ? -1.0 : 0;
  return (
    <>
      <OrthographicCamera makeDefault position={[11, 10.5 + lift, 11]} zoom={zoom} near={0.1} far={200} />
      <OrbitControls
        target={[0, 1.2 + lift, 0]}
        enableZoom={false}
        enablePan={false}
        enableRotate={!reducedMotion}
        minAzimuthAngle={Math.PI / 4 - 0.38}
        maxAzimuthAngle={Math.PI / 4 + 0.38}
        minPolarAngle={0.85}
        maxPolarAngle={1.05}
        rotateSpeed={0.5}
        enableDamping
      />
    </>
  );
}

function Lights({ tod, scene }: { tod: TimeOfDay; scene: WorldScene }) {
  const L = LIGHT[tod];
  const sun = useRef<THREE.DirectionalLight>(null!);
  useEffect(() => {
    sun.current.target.position.set(0, 0, 0);
    sun.current.target.updateMatrixWorld();
  }, []);
  const lamp = scene.objects.find((o) => o.id === 'lamp');
  const desk = scene.objects.find((o) => o.id === 'headphones');
  return (
    <>
      <hemisphereLight args={[L.hemiSky, L.hemiGround, L.hemi]} />
      <directionalLight
        ref={sun}
        position={L.sunPos}
        intensity={L.sunI}
        color={L.sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {L.lamps > 0 && lamp && (
        <pointLight position={[lamp.position[0], 2.25, lamp.position[2]]} color="#FFB56B" intensity={L.lamps * 7} distance={7} decay={1.6} castShadow={false} />
      )}
      {L.lamps > 0 && desk && <pointLight position={[desk.position[0], 2.0, desk.position[2] + 0.4]} color="#FFC37A" intensity={L.lamps * 3.5} distance={4.5} decay={1.8} />}
      {/* light spilling in from the city window */}
      <rectAreaLight
        position={[(scene.room.window.x0 + scene.room.window.x1) / 2, (scene.room.window.y0 + scene.room.window.y1) / 2, -scene.room.half + 0.05]}
        width={scene.room.window.x1 - scene.room.window.x0}
        height={scene.room.window.y1 - scene.room.window.y0}
        color={tod === 'night' ? '#7C93D6' : tod === 'evening' ? '#FFB27A' : '#FFF2DC'}
        intensity={tod === 'night' ? 1.2 : 2.4}
        rotation={[0, Math.PI, 0]}
      />
    </>
  );
}

/** Warm string lights along the top of both walls — the cosy accent the references rely on (bloom makes them glow). */
function FairyLights({ scene, tod }: { scene: WorldScene; tod: TimeOfDay }) {
  const { half, wallHeight: H } = scene.room;
  const on = tod === 'evening' || tod === 'night';
  const pts = useMemo(() => {
    const out: Array<[number, number, number]> = [];
    const n = 15;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      out.push([-half + 0.12 + t * (half * 2 - 0.3), H - 0.32 - Math.sin(t * Math.PI * 3) ** 2 * 0.22, -half + 0.12]);
      out.push([-half + 0.12, H - 0.32 - Math.sin(t * Math.PI * 3) ** 2 * 0.22, -half + 0.3 + t * (half * 2 - 0.5)]);
    }
    return out;
  }, [half, H]);
  const colors = ['#FFC46B', '#FFB0A0', '#FFE3A0'];
  return (
    <group>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial
            color={colors[i % 3]}
            emissive={colors[i % 3]}
            emissiveIntensity={on ? (tod === 'night' ? 6 : 3.5) : 0.25}
            toneMapped={!on}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Soft "clay" finish: ambient occlusion in corners and under furniture, glow on lights, gentle vignette. */
function Finish({ tod }: { tod: TimeOfDay }) {
  const bloom = tod === 'night' ? 0.95 : tod === 'evening' ? 0.7 : 0.18;
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO aoRadius={0.9} distanceFalloff={0.6} intensity={tod === 'night' ? 2.2 : 3.2} color={tod === 'night' ? '#120c22' : '#3a2416'} halfRes quality="medium" />
      <Bloom mipmapBlur luminanceThreshold={0.92} luminanceSmoothing={0.2} intensity={bloom} radius={0.7} />
      <SMAA />
      <Vignette offset={0.32} darkness={tod === 'day' ? 0.32 : 0.5} />
    </EffectComposer>
  );
}

function WorldContents(p: WorldCanvasProps & { scene: WorldScene; celebrate: number; onTapCompanion: () => void }) {
  const { scene } = p;
  const target = useMemo(() => {
    if (!p.selected) return null;
    if (p.selected === 'near') {
      const w = scene.room.window;
      return { feature: 'near' as FeatureKey, at: WINDOW_FEATURE.approach, look: [(w.x0 + w.x1) / 2, -scene.room.half] as [number, number] };
    }
    const obj = scene.objects.find((o) => o.feature === p.selected);
    if (!obj?.approach) return null;
    return { feature: p.selected, at: obj.approach, look: [obj.position[0], obj.position[2]] as [number, number] };
  }, [p.selected, scene]);

  return (
    <>
      <IsoCamera reducedMotion={p.reducedMotion} />
      <Lights tod={p.tod} scene={scene} />
      <FairyLights scene={scene} tod={p.tod} />
      <Room scene={scene} tod={p.tod} onWindow={() => p.onSelect('near')} windowLabel={p.labels.objects.near} selected={p.selected === 'near'} />
      {scene.objects.map((o) => (
        <Furniture
          key={o.id}
          obj={o}
          label={o.feature ? p.labels.objects[o.feature] : undefined}
          active={!!o.feature && p.selected === o.feature}
          onSelect={o.feature ? () => p.onSelect(o.feature!) : undefined}
        />
      ))}
      <Companion
        cfg={p.avatar}
        scene={scene}
        target={target}
        onArrive={p.onArrive}
        celebrate={p.celebrate}
        reducedMotion={p.reducedMotion}
        hello={p.labels.hello}
        onTap={p.onTapCompanion}
      />
      <Finish tod={p.tod} />
    </>
  );
}

export default function WorldCanvas(props: WorldCanvasProps) {
  initRectLights();
  const scene = props.scene ?? STUDIO_BAKU;
  const [celebrate, setCelebrate] = useState(0);
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = props.tod === 'night' ? 1.05 : 1.0;
      }}
      aria-label="SALAAM World"
    >
      <Suspense fallback={null}>
        <WorldContents {...props} scene={scene} celebrate={celebrate} onTapCompanion={() => setCelebrate((c) => c + 1)} />
      </Suspense>
    </Canvas>
  );
}

for (const o of STUDIO_BAKU.objects) useGLTF.preload(o.asset);
