/**
 * SALAAM World scene schema (renderer-independent). The renderer (WorldCanvas) only interprets this data,
 * so new rooms/objects are configuration, not code. Units: KayKit grid units (1 ≈ 0.75 m).
 */
export type FeatureKey = 'music' | 'exhibition_culture' | 'workshop_talk' | 'cinema' | 'community_free' | 'near';
export type Vec3 = [number, number, number];

export interface SceneObject {
  id: string;
  /** GLB under /public/world */
  asset: string;
  position: Vec3;
  rotationY?: number;
  scale?: number;
  /** If set, the object is an interactive shortcut into that part of the product. */
  feature?: FeatureKey;
  /** Where the companion stands when it walks to this object. */
  approach?: [number, number];
  /** Height of the floating label above the object's origin. */
  labelY?: number;
  castShadow?: boolean;
}

export interface WorldScene {
  id: string;
  version: number;
  room: { half: number; wallHeight: number; window: { x0: number; x1: number; y0: number; y1: number } };
  character: { home: [number, number]; homeYaw: number; scale: number };
  objects: SceneObject[];
}

const F = (n: string) => `/world/furniture/${n}.glb`;

export const STUDIO_BAKU: WorldScene = {
  id: 'studio-baku',
  version: 1,
  room: { half: 3.5, wallHeight: 3.7, window: { x0: 0.1, x1: 3.3, y0: 1.15, y1: 3.05 } },
  character: { home: [0.2, 0.6], homeYaw: Math.PI / 4, scale: 0.8 },
  objects: [
    { id: 'rug', asset: F('rug_rectangle_stripes_A'), position: [1.2, 0, 0.9], rotationY: 0 },
    { id: 'armchair', asset: F('armchair_pillows'), position: [-2.45, 0, -2.35], rotationY: Math.PI / 4 },
    { id: 'standframe', asset: F('pictureframe_standing_A'), position: [-1.3, 0, -3.1], rotationY: 0.1 },
    { id: 'frame', asset: F('pictureframe_large_A'), position: [-1.95, 2.35, -3.38], feature: 'exhibition_culture', approach: [-0.1, -0.2], labelY: 0.9 },
    { id: 'desk', asset: F('desk'), position: [1.75, 0, -2.7] },
    { id: 'monitor', asset: F('monitor'), position: [2.1, 1.0, -3.05] },
    { id: 'keyboard', asset: F('keyboard'), position: [2.1, 1.0, -2.55] },
    { id: 'pencils', asset: F('cup_pencils'), position: [3.0, 1.0, -2.9] },
    { id: 'headphones', asset: F('lamp_desk_headphones'), position: [0.75, 1.0, -2.95], rotationY: 0.2, feature: 'music', approach: [0.9, -1.25], labelY: 1.6 },
    { id: 'chair', asset: F('chair_desk_A'), position: [1.95, 0, -1.6], rotationY: Math.PI },
    { id: 'plant', asset: F('cactus_medium_A'), position: [3.05, 0, -1.25] },
    { id: 'shelf', asset: F('shelf_B_large_decorated'), position: [-3.38, 1.95, 1.05], rotationY: Math.PI / 2, feature: 'workshop_talk', approach: [-2.3, 1.1], labelY: 1.1 },
    { id: 'cabinet', asset: F('cabinet_medium_decorated'), position: [-2.95, 0, 2.45], rotationY: Math.PI / 2 },
    { id: 'frame2', asset: F('pictureframe_medium'), position: [-3.38, 2.55, 2.45], rotationY: Math.PI / 2 },
    { id: 'couch', asset: F('couch_pillows'), position: [1.35, 0, 2.55], rotationY: Math.PI, feature: 'cinema', approach: [0.4, 1.5], labelY: 1.7 },
    { id: 'table', asset: F('table_low'), position: [1.35, 0, 0.75], feature: 'community_free', approach: [-0.1, 0.6], labelY: 1.15 },
    { id: 'mugA', asset: F('mug_A'), position: [1.0, 0.5, 0.65], rotationY: 0.6 },
    { id: 'mugB', asset: F('mug_B'), position: [1.7, 0.5, 0.95], rotationY: -0.8 },
    { id: 'books', asset: F('book_set'), position: [1.35, 0.75, 0.55], rotationY: 0.2 },
    { id: 'lamp', asset: F('lamp_standing'), position: [-3.0, 0, -0.75] },
    { id: 'cactus2', asset: F('cactus_small_B'), position: [-2.95, 1.83, 2.6] },
  ],
};

/** The window is an interactive object too (opens the city / near me). */
export const WINDOW_FEATURE: { feature: FeatureKey; approach: [number, number] } = { feature: 'near', approach: [1.6, -0.9] };
