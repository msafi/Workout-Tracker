import { workouts, type Workout, type InsertWorkout } from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getWorkouts(): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  deleteWorkout(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getWorkouts(): Promise<Workout[]> {
    return await db.select().from(workouts).orderBy(desc(workouts.completedAt));
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const [workout] = await db
      .insert(workouts)
      .values(insertWorkout)
      .returning();
    return workout;
  }

  async deleteWorkout(id: number): Promise<void> {
    await db.delete(workouts).where(eq(workouts.id, id));
  }
}

export const storage = new DatabaseStorage();