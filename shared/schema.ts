import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'A', 'B', or 'C'
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  type: true,
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;