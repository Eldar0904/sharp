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

export type MobilityRoutine = { id: string; name: string; focus: 'lower body' | 'back' | 'upper body' | 'full body' | 'neck' | 'hips' | 'knees'; minutes: 5 | 10 | 15; description: string; exerciseIds: string[] };

export const mobilityRoutines: MobilityRoutine[] = [
  { id:'lower-5', name:'Lower Body Reset', focus:'lower body', minutes:5, description:'Quick hips, hamstrings, and ankles.', exerciseIds:['leg-swing','ninety-ninety-hip-switch','hamstring-stretch','ankle-rock'] },
  { id:'lower-10', name:'Lower Body Mobility', focus:'lower body', minutes:10, description:'Open the hips and restore easy squat depth.', exerciseIds:['leg-swing','hip-flexor-stretch','ninety-ninety-hip-switch','frog-stretch','hamstring-stretch','ankle-rock'] },
  { id:'lower-15', name:'Lower Body Deep Flow', focus:'lower body', minutes:15, description:'A slower, complete hips-to-ankles session.', exerciseIds:['leg-swing','worlds-greatest-stretch','hip-flexor-stretch','ninety-ninety-hip-switch','frog-stretch','hamstring-stretch','ankle-rock'] },
  { id:'back-5', name:'Back Release', focus:'back', minutes:5, description:'Gentle spinal movement after sitting.', exerciseIds:['cat-cow','childs-pose','thoracic-rotation','cobra-stretch'] },
  { id:'back-10', name:'Back Mobility', focus:'back', minutes:10, description:'Move the spine through comfortable ranges.', exerciseIds:['cat-cow','bird-dog','childs-pose','thoracic-rotation','seated-spinal-twist','cobra-stretch'] },
  { id:'upper-10', name:'Upper Body Opener', focus:'upper body', minutes:10, description:'Shoulders, chest, and upper-back freedom.', exerciseIds:['shoulder-roll','arm-circle','doorway-chest-stretch','thoracic-rotation','childs-pose'] },
  { id:'upper-15', name:'Upper Body Flow', focus:'upper body', minutes:15, description:'A complete shoulder and thoracic session.', exerciseIds:['neck-rotation','shoulder-roll','arm-circle','doorway-chest-stretch','cat-cow','thoracic-rotation','childs-pose'] },
  { id:'full-15', name:'Full Body Flow', focus:'full body', minutes:15, description:'One balanced mobility routine for everything.', exerciseIds:['cat-cow','worlds-greatest-stretch','leg-swing','arm-circle','ninety-ninety-hip-switch','thoracic-rotation','hamstring-stretch'] },
  { id:'neck-5', name:'Neck & Shoulders', focus:'neck', minutes:5, description:'Gentle relief for the neck and traps.', exerciseIds:['neck-side-bend','neck-rotation','shoulder-roll','doorway-chest-stretch'] },
  { id:'hips-5', name:'Hip Stretch', focus:'hips', minutes:5, description:'Targeted hip flexor and rotation work.', exerciseIds:['hip-flexor-stretch','ninety-ninety-hip-switch','frog-stretch','glute-bridge'] },
  { id:'knees-5', name:'Dynamic Knee Prep', focus:'knees', minutes:5, description:'Dynamic, low-impact prep for knees and ankles.', exerciseIds:['knee-circle','ankle-rock','leg-swing','bodyweight-squat','reverse-lunge'] },
];

export function generateMobilityRoutine(routineId: string): Workout {
  const routine = mobilityRoutines.find((item) => item.id === routineId) ?? mobilityRoutines[7];
  const rounds = routine.minutes === 15 ? 2 : 1;
  return { id: crypto.randomUUID(), name: routine.name, type:'mobility', status:'planned', exercises:routine.exerciseIds.map((id) => { const ex=exerciseById(id)!; return { exerciseId:id, sets:rounds, targetReps:ex.defaultReps, targetDurationSeconds:ex.defaultDurationSeconds, restSeconds:Math.min(ex.restSeconds,10) }; }) };
}
