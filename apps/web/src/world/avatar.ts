/**
 * Avatar configuration — renderer-independent (directive §24/§67). The Quaternius bodies expose named materials
 * (Skin, Hair, Shirt, Pants, Belt), so colours map 1:1 today and to a future rig later.
 */
export const BODIES = ['casual_female', 'casual_male', 'casual2_female', 'casual2_male'] as const;
export type Body = (typeof BODIES)[number];

export interface AvatarConfig {
  version: 1;
  body: Body;
  colors: { skin: string; hair: string; shirt: string; pants: string };
}

export const SKIN = ['#F2D0B6', '#E0B08C', '#C98E6B', '#A86C4C', '#7A4B33'];
export const HAIR = ['#1E1512', '#4A2F22', '#8A5A35', '#C9A26B', '#B8B3AD'];
export const SHIRT = ['#E8603C', '#0D5F5B', '#2E4FA3', '#F2C14E', '#F4F1EA', '#1B1A1F', '#8E5BA8'];
export const PANTS = ['#2E3A5C', '#1B1A1F', '#6B5B4B', '#D8CBB4', '#3F6A4E'];

export const DEFAULT_AVATAR: AvatarConfig = {
  version: 1,
  body: 'casual_female',
  colors: { skin: '#C98E6B', hair: '#1E1512', shirt: '#E8603C', pants: '#2E3A5C' },
};

const KEY = 'salaam.avatar.v1';

export function loadAvatar(): AvatarConfig {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_AVATAR;
    const v = JSON.parse(raw) as AvatarConfig;
    if (v.version === 1 && (BODIES as readonly string[]).includes(v.body)) return v;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_AVATAR;
}

export function saveAvatar(cfg: AvatarConfig) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cfg));
  } catch {
    /* ignore */
  }
}

export const bodyUrl = (b: Body) => `/world/characters/${b}.glb`;
