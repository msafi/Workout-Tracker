import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'A', 'B', or 'C'
  durationSeconds: integer("duration_seconds").notNull().default(0),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  type: true,
  durationSeconds: true,
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;
