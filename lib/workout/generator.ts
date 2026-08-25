import { exerciseById } from '@/data/exercises';
import type { Workout, WorkoutPreferences } from '@/types';

const plans: Record<string, string[]> = {
  'full-body': ['bodyweight-squat','push-up','reverse-lunge','pike-push-up','glute-bridge','plank'],
  upper: ['push-up','scapular-pull-up','pike-push-up','negative-pull-up','diamond-push-up','plank'],
  lower: ['bodyweight-squat','reverse-lunge','glute-bridge','calf-raise','bulgarian-split-squat'],
  core: ['dead-bug','plank','bird-dog','side-plank','mountain-climber'],
  mobility: ['cat-cow','worlds-greatest-stretch','hip-flexor-stretch','hamstring-stretch','thoracic-rotation'],
};
export function generateWorkout(preferences: WorkoutPreferences, name = 'Custom session', type: Workout['type'] = 'custom'): Workout {
  const count = preferences.durationMinutes <= 10 ? 4 : preferences.durationMinutes <= 20 ? 5 : 6;
  const ids = plans[preferences.focus].filter((id) => { const ex = exerciseById(id); return ex && (ex.equipment.includes('none') || ex.equipment.some((item) => preferences.equipment.includes(item))); }).slice(0,count);
  return { id: crypto.randomUUID(), name, type, status: 'planned', exercises: ids.map((id) => { const ex = exerciseById(id)!; return { exerciseId: id, sets: preferences.durationMinutes <= 10 ? 2 : ex.defaultSets, targetReps: ex.defaultReps, targetDurationSeconds: ex.defaultDurationSeconds, restSeconds: ex.restSeconds }; }) };
}

export const presets = {
  quick: { name: 'Quick Reset', type: 'quick' as const, preferences: { durationMinutes: 10, focus: 'full-body' as const, equipment: ['none'], difficulty: 'beginner' as const } },
  'full-body': { name: 'Full Body', type: 'full-body' as const, preferences: { durationMinutes: 25, focus: 'full-body' as const, equipment: ['none'], difficulty: 'beginner' as const } },
  strength: { name: 'Strength Builder', type: 'strength' as const, preferences: { durationMinutes: 35, focus: 'upper' as const, equipment: ['none','pull-up bar'], difficulty: 'intermediate' as const } },
  mobility: { name: 'Mobility Flow', type: 'mobility' as const, preferences: { durationMinutes: 15, focus: 'mobility' as const, equipment: ['none'], difficulty: 'beginner' as const } },
};
