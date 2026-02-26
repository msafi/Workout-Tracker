import { useEffect, useState } from "react";
import { CheckCircle2, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WORKOUTS, type WorkoutType } from "@/lib/constants";
import { useCreateWorkout } from "@/hooks/use-workouts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NextWorkoutProps {
  type: WorkoutType;
}

export function NextWorkout({ type }: NextWorkoutProps) {
  const workout = WORKOUTS[type];
  const createMutation = useCreateWorkout();
  const [isHovered, setIsHovered] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const isRunning = startedAt !== null;

  useEffect(() => {
    if (!startedAt) {
      return;
    }

    const updateElapsed = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    };

    updateElapsed();
    const intervalId = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(intervalId);
  }, [startedAt]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleWorkoutButton = () => {
    if (!isRunning) {
      setStartedAt(Date.now());
      setElapsedSeconds(0);
      return;
    }

    if (!startedAt) {
      return;
    }

    const durationSeconds = Math.max(
      1,
      Math.floor((Date.now() - startedAt) / 1000),
    );

    createMutation.mutate(
      { type, durationSeconds },
      {
        onSuccess: () => {
          setStartedAt(null);
          setElapsedSeconds(0);
        },
      },
    );
  };

  return (
    <div className="relative">
      {/* Glow effect behind card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-xl transition-all duration-500 opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative bg-card rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/60"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
            <Dumbbell size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Up Next</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              {workout.title}
              <span className={cn(
                "text-sm px-3 py-1 rounded-full font-medium border",
                workout.theme.bg,
                workout.theme.text,
                workout.theme.border
              )}>
                {workout.focus}
              </span>
            </h2>
          </div>
        </div>

        <div className="space-y-3 mb-10">
          {workout.exercises.map((exercise, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + (idx * 0.05) }}
              key={idx} 
              className="group flex items-center gap-4 bg-muted/30 hover:bg-muted/60 border border-border/50 hover:border-border rounded-2xl p-4 transition-all duration-300"
            >
              <div className="h-8 w-8 rounded-full bg-background shadow-sm border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <span className="text-sm font-semibold">{idx + 1}</span>
              </div>
              <span className="text-foreground/90 font-medium">{exercise}</span>
            </motion.div>
          ))}
        </div>

        {isRunning ? (
          <div className="mb-4 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Workout Timer
            </p>
            <p className="text-4xl font-bold tracking-tight tabular-nums text-foreground mt-1">
              {formatDuration(elapsedSeconds)}
            </p>
          </div>
        ) : null}

        <button
          onClick={handleWorkoutButton}
          disabled={createMutation.isPending}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "w-full py-4 px-6 rounded-2xl font-bold text-lg",
            "bg-primary text-primary-foreground",
            "shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:shadow-md",
            "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
            "transition-all duration-300 flex items-center justify-center gap-3"
          )}
        >
          {createMutation.isPending ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              />
              Logging Workout...
            </span>
          ) : (
            <>
              {isRunning ? "Complete Workout" : "Start Workout"}
              <motion.div
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle2 size={24} />
              </motion.div>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
