export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MovementPattern = 'push' | 'pull' | 'squat' | 'hinge' | 'lunge' | 'core' | 'carry' | 'mobility';

export interface Exercise {
  id: string; name: string; description?: string; muscleGroups: string[]; equipment: string[];
  difficulty: Difficulty; movementPattern: MovementPattern; defaultSets: number; defaultReps?: number;
  defaultDurationSeconds?: number; restSeconds: number; progressionIds?: string[]; regressionIds?: string[];
}
export interface WorkoutExercise { exerciseId: string; sets: number; targetReps?: number; targetDurationSeconds?: number; restSeconds: number; }
export interface Workout { id: string; name: string; type: 'quick' | 'full-body' | 'strength' | 'mobility' | 'custom'; exercises: WorkoutExercise[]; startedAt?: string; completedAt?: string; durationSeconds?: number; status: 'planned' | 'in-progress' | 'completed'; }
export interface CompletedSet { exerciseId: string; setNumber: number; reps?: number; durationSeconds?: number; completedAt: string; }
export type WorkoutPreferences = { durationMinutes: number; focus: 'full-body' | 'upper' | 'lower' | 'core' | 'mobility'; equipment: string[]; difficulty: Difficulty; };
export type WorkoutPhase = 'started' | 'exercise-active' | 'rest' | 'completed';
export interface ActiveWorkout { workout: Workout; phase: WorkoutPhase; exerciseIndex: number; setIndex: number; completedSets: CompletedSet[]; restEndsAt?: number; restRemaining?: number; restPaused?: boolean; }
