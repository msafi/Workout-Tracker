import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Workout, InsertWorkout } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "workout_history";

function getStoredWorkouts(): Workout[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function setStoredWorkouts(workouts: Workout[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

export function useWorkouts() {
  return useQuery({
    queryKey: [STORAGE_KEY],
    queryFn: async () => {
      return getStoredWorkouts();
    },
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertWorkout) => {
      const workouts = getStoredWorkouts();
      const newWorkout: Workout = {
        id: Math.floor(Math.random() * 1000000),
        type: data.type,
        durationSeconds: data.durationSeconds,
        completedAt: new Date()
      };
      setStoredWorkouts([newWorkout, ...workouts]);
      return newWorkout;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_KEY] });
      toast({
        title: "Workout Completed! 🎉",
        description: `Great job finishing ${data.type === 'A' ? 'Day A (Push)' : data.type === 'B' ? 'Day B (Pull)' : 'Day C (Legs)'} in ${formatDuration(data.durationSeconds)}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log workout. Please try again.",
        variant: "destructive",
      });
    }
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const workouts = getStoredWorkouts();
      setStoredWorkouts(workouts.filter(w => w.id !== id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_KEY] });
      toast({
        title: "Workout removed",
        description: "History has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete workout.",
        variant: "destructive",
      });
    }
  });
}
