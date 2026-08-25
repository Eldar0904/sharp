import type { ActiveWorkout, Workout } from '@/types';

const HISTORY = 'form.workouts.v1'; const ACTIVE = 'form.active.v1';
const browser = () => typeof window !== 'undefined';
function read<T>(key: string, fallback: T): T { if (!browser()) return fallback; try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { localStorage.removeItem(key); return fallback; } }
function write<T>(key: string, value: T) { if (!browser()) return; try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be unavailable. */ } }
export const getWorkouts = () => read<Workout[]>(HISTORY, []).filter((item) => item && Array.isArray(item.exercises));
export const saveWorkout = (workout: Workout) => { const all = getWorkouts().filter((item) => item.id !== workout.id); write(HISTORY,[workout,...all]); };
export const getWorkout = (id: string) => getWorkouts().find((item) => item.id === id);
export const updateWorkout = saveWorkout;
export const deleteWorkout = (id: string) => write(HISTORY,getWorkouts().filter((item) => item.id !== id));
export const getActiveWorkout = () => { const value = read<ActiveWorkout | null>(ACTIVE,null); return value?.workout?.status === 'in-progress' && Array.isArray(value.completedSets) ? value : null; };
export const saveActiveWorkout = (active: ActiveWorkout) => write(ACTIVE,active);
export const clearActiveWorkout = () => { if (browser()) localStorage.removeItem(ACTIVE); };
