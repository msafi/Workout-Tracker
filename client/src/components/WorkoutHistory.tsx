import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, History, CalendarDays, Share2 } from "lucide-react";
import type { Workout } from "@shared/schema";
import { WORKOUTS, type WorkoutType } from "@/lib/constants";
import { useDeleteWorkout } from "@/hooks/use-workouts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "./NextWorkout";

interface WorkoutHistoryProps {
  workouts: Workout[];
}

function formatDuration(seconds: number | undefined) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) {
    return "Not tracked (legacy entry)";
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

function buildHistoryExportText(workouts: Workout[]) {
  const lines = workouts.map((workout, index) => {
    const def = WORKOUTS[workout.type as WorkoutType] || WORKOUTS.A;
    const completedAt = new Date(workout.completedAt);
    return [
      `${index + 1}. ${def.title} (${def.focus})`,
      `   Date: ${format(completedAt, "EEEE, MMM d, yyyy")}`,
      `   Time: ${format(completedAt, "h:mm a")}`,
      `   Duration: ${formatDuration(workout.durationSeconds)}`,
    ].join("\n");
  });

  return `\n${lines.join("\n\n")}`;
}

export function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  const deleteMutation = useDeleteWorkout();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this workout log?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleShare = async () => {
    const exportText = buildHistoryExportText(workouts);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Workout Activity History",
          text: exportText,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(exportText);
        toast({
          title: "Copied to clipboard",
          description: "Paste it into Notes to save your activity history.",
        });
        return;
      }

      toast({
        title: "Share unavailable",
        description: "Your browser does not support sharing from this page.",
        variant: "destructive",
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      toast({
        title: "Could not share history",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (workouts.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center opacity-60 border border-dashed border-border/80 rounded-3xl bg-muted/20">
        <History size={48} className="text-muted-foreground mb-4 opacity-50" strokeWidth={1} />
        <h3 className="text-lg font-semibold text-foreground">No history yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
          Your completed workouts will appear here. Start your first session above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2 text-foreground/80 font-display">
          <CalendarDays size={20} />
          <h3 className="text-xl font-semibold tracking-tight">Recent Activity</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleShare} className="shrink-0">
          <Share2 size={16} />
          Share
        </Button>
      </div>
      
      <div className="bg-card border border-border/50 rounded-3xl p-2 sm:p-4 shadow-sm overflow-hidden">
        <AnimatePresence initial={false}>
          {workouts.map((workout) => {
            const def = WORKOUTS[workout.type as WorkoutType] || WORKOUTS.A;
            return (
              <motion.div
                key={workout.id}
                layout
                initial={{ opacity: 0, height: 0, mb: 0 }}
                animate={{ opacity: 1, height: 'auto', mb: 8 }}
                exit={{ opacity: 0, height: 0, mb: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative"
              >
                <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center font-display font-bold text-lg border shadow-sm",
                      def.theme.bg, def.theme.text, def.theme.border
                    )}>
                      {def.id}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground tracking-tight text-base sm:text-lg">
                        {def.title} <span className="text-muted-foreground font-normal ml-1">· {def.focus}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                        {format(new Date(workout.completedAt), "EEEE, MMM d, yyyy")} 
                        <span className="opacity-50 mx-2">•</span> 
                        {format(new Date(workout.completedAt), "h:mm a")}
                        <span className="opacity-50 mx-2">•</span>
                        {formatDuration(workout.durationSeconds)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(workout.id)}
                    disabled={deleteMutation.isPending}
                    className="h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    aria-label="Delete workout"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
