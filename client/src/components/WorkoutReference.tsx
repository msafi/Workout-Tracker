import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WORKOUTS } from "@/lib/constants";
import { Dumbbell } from "lucide-react";

export function WorkoutReference() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Dumbbell className="text-primary" size={24} />
        <h2 className="text-2xl font-display font-bold tracking-tight">Workout Reference</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {(Object.values(WORKOUTS)).map((workout) => (
          <Card key={workout.id} className={`${workout.theme.bg} ${workout.theme.border} border shadow-none`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-lg font-display ${workout.theme.text}`}>
                {workout.title} ({workout.focus})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {workout.exercises.map((exercise, idx) => (
                  <li key={idx} className="text-sm font-medium text-foreground/80 flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-foreground/30 shrink-0" />
                    {exercise}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
