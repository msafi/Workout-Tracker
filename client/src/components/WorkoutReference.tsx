import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WORKOUTS } from "@/lib/constants";
import { Dumbbell, Flame } from "lucide-react";

export function WorkoutReference() {
  const warmups = [
    "Arm circles",
    "Push-ups against a table or wall (easy)",
    "Body weight squats"
  ];

  return (
    <div className="space-y-8">
      {/* Warmups Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={20} />
          <h3 className="text-lg font-display font-bold tracking-tight">Warm-ups</h3>
        </div>
        <Card className="bg-orange-500/5 border-orange-500/10 shadow-none">
          <CardContent className="pt-6">
            <ul className="grid gap-2 sm:grid-cols-3">
              {warmups.map((warmup, idx) => (
                <li key={idx} className="text-sm font-medium text-foreground/80 flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-orange-500/40 shrink-0" />
                  {warmup}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Main Workouts Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-primary" size={20} />
          <h3 className="text-lg font-display font-bold tracking-tight">Workout Routines</h3>
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
    </div>
  );
}
