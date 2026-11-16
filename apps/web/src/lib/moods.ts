/** Companion moods — shared by server pages and the client avatar (must not live in a 'use client' module). */
export type Mood = 'calm' | 'energetic' | 'curious';
export const MOODS: Mood[] = ['calm', 'energetic', 'curious'];
