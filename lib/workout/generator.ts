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

export type TrainingRoutine = { id:string; name:string; category:'quick'|'cardio'|'hiit'|'upper body'|'lower body'|'back'|'core'|'abs'; minutes:5|8|10|12|15|20|25|30; description:string; type:'quick'|'strength'; exerciseIds:string[]; sets:number };

export const quickRoutines: TrainingRoutine[] = [
  { id:'quick-reset',name:'Quick Reset',category:'quick',minutes:10,description:'The original balanced full-body session.',type:'quick',sets:2,exerciseIds:['bodyweight-squat','push-up','reverse-lunge','plank'] },
  { id:'five-minute-primer',name:'5-Minute Primer',category:'quick',minutes:5,description:'Wake up the whole body with no fuss.',type:'quick',sets:1,exerciseIds:['bodyweight-squat','push-up','glute-bridge','dead-bug'] },
  { id:'express-strength',name:'Express Strength',category:'quick',minutes:12,description:'A compact strength circuit for busy days.',type:'quick',sets:2,exerciseIds:['reverse-lunge','push-up','pike-push-up','plank'] },
  { id:'cardio-starter',name:'Cardio Starter',category:'cardio',minutes:8,description:'Simple low-equipment conditioning.',type:'quick',sets:2,exerciseIds:['jumping-jack','high-knees','mountain-climber','skater-hop'] },
  { id:'cardio-flow',name:'Cardio Flow',category:'cardio',minutes:15,description:'Steady full-body movement and rhythm.',type:'quick',sets:3,exerciseIds:['jumping-jack','skater-hop','high-knees','mountain-climber'] },
  { id:'hiit-express',name:'HIIT Express',category:'hiit',minutes:8,description:'Short, sharp intervals with simple moves.',type:'quick',sets:2,exerciseIds:['high-knees','squat-thrust','mountain-climber','jumping-jack'] },
  { id:'full-body-hiit',name:'Full Body HIIT',category:'hiit',minutes:15,description:'Harder intervals for a fast conditioning hit.',type:'quick',sets:3,exerciseIds:['burpee','skater-hop','squat-thrust','mountain-climber'] },
];

export const strengthRoutines: TrainingRoutine[] = [
  { id:'upper-foundations',name:'Upper Foundations',category:'upper body',minutes:20,description:'Push-up strength with shoulder stability.',type:'strength',sets:3,exerciseIds:['push-up','pike-push-up','scapular-pull-up','plank'] },
  { id:'upper-push',name:'Upper Push',category:'upper body',minutes:25,description:'Chest, shoulders, and triceps focus.',type:'strength',sets:3,exerciseIds:['push-up','pike-push-up','diamond-push-up','decline-push-up'] },
  { id:'upper-pull-push',name:'Upper Pull + Push',category:'upper body',minutes:30,description:'Balanced upper work when a pull-up bar is available.',type:'strength',sets:3,exerciseIds:['pull-up','push-up','chin-up','pike-push-up','negative-pull-up'] },
  { id:'lower-foundations',name:'Lower Foundations',category:'lower body',minutes:20,description:'Squat, lunge, glute, and calf strength.',type:'strength',sets:3,exerciseIds:['bodyweight-squat','reverse-lunge','glute-bridge','calf-raise'] },
  { id:'single-leg-strength',name:'Single-Leg Strength',category:'lower body',minutes:25,description:'Build balance and unilateral leg strength.',type:'strength',sets:3,exerciseIds:['bulgarian-split-squat','single-leg-glute-bridge','forward-lunge','calf-raise'] },
  { id:'back-basics',name:'Back Basics',category:'back',minutes:15,description:'No-bar posterior strength and posture work.',type:'strength',sets:3,exerciseIds:['superman','reverse-snow-angel','bird-dog','prone-y-t-raise'] },
  { id:'pull-up-builder',name:'Pull-up Builder',category:'back',minutes:25,description:'A structured path toward stronger pull-ups.',type:'strength',sets:3,exerciseIds:['scapular-pull-up','negative-pull-up','pull-up','superman'] },
  { id:'core-stability',name:'Core Stability',category:'core',minutes:15,description:'Controlled trunk strength without rushing.',type:'strength',sets:3,exerciseIds:['dead-bug','bird-dog','plank','side-plank'] },
  { id:'core-advanced',name:'Advanced Core',category:'core',minutes:20,description:'Harder bracing and total-core control.',type:'strength',sets:3,exerciseIds:['hollow-body-hold','mountain-climber','side-plank','lying-leg-raise'] },
  { id:'abs-quick',name:'Quick Abs',category:'abs',minutes:10,description:'A direct, approachable abdominal circuit.',type:'strength',sets:2,exerciseIds:['crunch','heel-tap','dead-bug','plank'] },
  { id:'abs-strength',name:'Abs Strength',category:'abs',minutes:15,description:'Upper, lower, and rotational abdominal work.',type:'strength',sets:3,exerciseIds:['bicycle-crunch','lying-leg-raise','hollow-body-hold','heel-tap'] },
];

export function generateTrainingRoutine(routineId:string):Workout {
  const routine=[...quickRoutines,...strengthRoutines].find(item=>item.id===routineId) ?? quickRoutines[0];
  return { id:crypto.randomUUID(),name:routine.name,type:routine.type,status:'planned',exercises:routine.exerciseIds.map(id=>{const ex=exerciseById(id)!;return {exerciseId:id,sets:routine.sets,targetReps:ex.defaultReps,targetDurationSeconds:ex.defaultDurationSeconds,restSeconds:routine.type==='quick'?Math.min(ex.restSeconds,30):ex.restSeconds};}) };
}
