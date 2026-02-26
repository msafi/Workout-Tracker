export type WorkoutType = 'A' | 'B' | 'C';

export interface WorkoutDefinition {
  id: WorkoutType;
  title: string;
  focus: string;
  exercises: string[];
  theme: {
    bg: string;
    text: string;
    border: string;
  };
}

export const WORKOUTS: Record<WorkoutType, WorkoutDefinition> = {
  A: {
    id: 'A',
    title: 'Day A',
    focus: 'Push',
    exercises: [
      'Push-ups',
      'Overhead Press',
      'Band Lateral Raise',
      'Bicep curls'
    ],
    theme: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500/20 dark:border-blue-500/30'
    }
  },
  B: {
    id: 'B',
    title: 'Day B',
    focus: 'Pull',
    exercises: [
      'Pull-ups or Lat Pulldown',
      'Band Row (single-arm or two-arm)',
      'Face Pulls'
    ],
    theme: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/20 dark:border-emerald-500/30'
    }
  },
  C: {
    id: 'C',
    title: 'Day C',
    focus: 'Legs',
    exercises: [
      'Squat',
      'Reverse Lunge',
      'Band Romanian Deadlift (keep clean, slightly easier)'
    ],
    theme: {
      bg: 'bg-violet-500/10 dark:bg-violet-500/20',
      text: 'text-violet-700 dark:text-violet-300',
      border: 'border-violet-500/20 dark:border-violet-500/30'
    }
  }
};
