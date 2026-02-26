import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Workout, InsertWorkout } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useWorkouts() {
  return useQuery({
    queryKey: [api.workouts.list.path],
    queryFn: async () => {
      const res = await fetch(api.workouts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch workouts");
      const data = await res.json();
      return data as Workout[];
    },
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertWorkout) => {
      const res = await fetch(api.workouts.create.path, {
        method: api.workouts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log workout");
      return res.json() as Promise<Workout>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.workouts.list.path] });
      toast({
        title: "Workout Completed! 🎉",
        description: `Great job finishing ${data.type === 'A' ? 'Day A (Push)' : data.type === 'B' ? 'Day B (Pull)' : 'Day C (Legs)'}.`,
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
      const url = buildUrl(api.workouts.delete.path, { id });
      const res = await fetch(url, { 
        method: api.workouts.delete.method, 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete workout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.workouts.list.path] });
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
