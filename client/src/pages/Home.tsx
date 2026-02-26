import { useWorkouts } from "@/hooks/use-workouts";
import { NextWorkout } from "@/components/NextWorkout";
import { WorkoutHistory } from "@/components/WorkoutHistory";
import { WorkoutReference } from "@/components/WorkoutReference";
import { Activity, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import type { WorkoutType } from "@/lib/constants";

export default function Home() {
  const { data: workouts, isLoading, isError } = useWorkouts();
  const [isRefOpen, setIsRefOpen] = useState(false);

  // Logic to determine next workout
  let nextType: WorkoutType = 'A';
  let sortedWorkouts = [];

  if (workouts && workouts.length > 0) {
    // Sort by newest first
    sortedWorkouts = [...workouts].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    const latestType = sortedWorkouts[0].type;
    
    if (latestType === 'A') nextType = 'B';
    else if (latestType === 'B') nextType = 'C';
    else if (latestType === 'C') nextType = 'A';
  }

  return (
    <div className="min-h-screen pb-24 selection:bg-primary selection:text-primary-foreground">
      {/* Minimalist Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-foreground">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Activity size={20} />
            </div>
            Circuit
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {sortedWorkouts.length} Sessions Logged
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        
        {/* Next Workout Section */}
        <section>
          {isLoading ? (
            <div className="h-[450px] w-full rounded-[2rem] bg-muted/40 animate-pulse border border-border/50" />
          ) : isError ? (
            <div className="h-[450px] w-full rounded-[2rem] bg-destructive/5 border border-destructive/20 flex flex-col items-center justify-center text-destructive">
              <p className="font-medium">Failed to load workouts.</p>
              <p className="text-sm opacity-80 mt-1">Please try refreshing the page.</p>
            </div>
          ) : (
            <NextWorkout type={nextType} />
          )}
        </section>

        {/* Workout Reference Section */}
        <section>
          <Collapsible open={isRefOpen} onOpenChange={setIsRefOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-8 rounded-3xl border border-dashed border-border/50"
              >
                <Info size={16} />
                {isRefOpen ? "Hide" : "Show"} Workout Reference
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-8">
              <WorkoutReference />
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* History Section */}
        <section>
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 w-48 bg-muted/50 rounded-lg animate-pulse" />
              <div className="h-[300px] w-full rounded-3xl bg-muted/30 animate-pulse border border-border/50" />
            </div>
          ) : (
            <WorkoutHistory workouts={sortedWorkouts} />
          )}
        </section>

      </main>
    </div>
  );
}
