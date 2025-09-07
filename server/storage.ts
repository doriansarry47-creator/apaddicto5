import {
  users,
  patientProfiles,
  exercises,
  meditations,
  educationModules,
  goals,
  userSessions,
  userGoalProgress,
  emergencyEvents,
  userBadges,
  type User,
  type UpsertUser,
  type PatientProfile,
  type InsertPatientProfile,
  type Exercise,
  type InsertExercise,
  type Meditation,
  type InsertMeditation,
  type EducationModule,
  type InsertEducationModule,
  type Goal,
  type InsertGoal,
  type UserSession,
  type InsertUserSession,
  type EmergencyEvent,
  type InsertEmergencyEvent,
  type UserGoalProgress,
  type UserBadge,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Patient profile operations
  getPatientProfile(userId: string): Promise<PatientProfile | undefined>;
  createPatientProfile(profile: InsertPatientProfile): Promise<PatientProfile>;
  updatePatientProfile(userId: string, updates: Partial<PatientProfile>): Promise<PatientProfile>;
  
  // Exercise operations
  getExercises(difficulty?: string): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: string, updates: Partial<Exercise>): Promise<Exercise>;
  deleteExercise(id: string): Promise<void>;
  
  // Meditation operations
  getMeditations(): Promise<Meditation[]>;
  getMeditation(id: string): Promise<Meditation | undefined>;
  createMeditation(meditation: InsertMeditation): Promise<Meditation>;
  updateMeditation(id: string, updates: Partial<Meditation>): Promise<Meditation>;
  deleteMeditation(id: string): Promise<void>;
  
  // Education module operations
  getEducationModules(): Promise<EducationModule[]>;
  getEducationModule(id: string): Promise<EducationModule | undefined>;
  createEducationModule(module: InsertEducationModule): Promise<EducationModule>;
  updateEducationModule(id: string, updates: Partial<EducationModule>): Promise<EducationModule>;
  deleteEducationModule(id: string): Promise<void>;
  
  // Goal operations
  getGoals(): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, updates: Partial<Goal>): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;
  
  // User session operations
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSessions(userId: string, limit?: number): Promise<UserSession[]>;
  
  // Emergency event operations
  createEmergencyEvent(event: InsertEmergencyEvent): Promise<EmergencyEvent>;
  getEmergencyEvents(userId?: string): Promise<EmergencyEvent[]>;
  updateEmergencyEvent(id: string, updates: Partial<EmergencyEvent>): Promise<EmergencyEvent>;
  
  // Goal progress operations
  getUserGoalProgress(userId: string): Promise<UserGoalProgress[]>;
  updateGoalProgress(userId: string, goalId: string, progress: number): Promise<UserGoalProgress>;
  completeGoal(userId: string, goalId: string): Promise<UserBadge>;
  
  // Statistics operations
  getPatientStats(): Promise<{
    totalPatients: number;
    activePatients: number;
    sessionsToday: number;
    emergenciesToday: number;
  }>;
  
  getUserStats(userId: string): Promise<{
    level: number;
    points: number;
    cleanDayStreak: number;
    totalSessions: number;
    weeklyProgress: {
      exercises: number;
      meditation: number;
      education: number;
    };
  }>;
  
  // Admin operations
  getActivePatients(): Promise<(User & { profile: PatientProfile | null })[]>;
  deletePatient(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Patient profile operations
  async getPatientProfile(userId: string): Promise<PatientProfile | undefined> {
    const [profile] = await db
      .select()
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, userId));
    return profile;
  }

  async createPatientProfile(profileData: InsertPatientProfile): Promise<PatientProfile> {
    const [profile] = await db
      .insert(patientProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async updatePatientProfile(userId: string, updates: Partial<PatientProfile>): Promise<PatientProfile> {
    const [profile] = await db
      .update(patientProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(patientProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Exercise operations
  async getExercises(difficulty?: string): Promise<Exercise[]> {
    let query = db.select().from(exercises).where(eq(exercises.isActive, true));
    
    if (difficulty) {
      query = query.where(eq(exercises.difficulty, difficulty as any));
    }
    
    return await query.orderBy(exercises.title);
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }

  async createExercise(exerciseData: InsertExercise): Promise<Exercise> {
    const [exercise] = await db.insert(exercises).values(exerciseData).returning();
    return exercise;
  }

  async updateExercise(id: string, updates: Partial<Exercise>): Promise<Exercise> {
    const [exercise] = await db
      .update(exercises)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(exercises.id, id))
      .returning();
    return exercise;
  }

  async deleteExercise(id: string): Promise<void> {
    await db.update(exercises).set({ isActive: false }).where(eq(exercises.id, id));
  }

  // Meditation operations
  async getMeditations(): Promise<Meditation[]> {
    return await db
      .select()
      .from(meditations)
      .where(eq(meditations.isActive, true))
      .orderBy(meditations.title);
  }

  async getMeditation(id: string): Promise<Meditation | undefined> {
    const [meditation] = await db.select().from(meditations).where(eq(meditations.id, id));
    return meditation;
  }

  async createMeditation(meditationData: InsertMeditation): Promise<Meditation> {
    const [meditation] = await db.insert(meditations).values(meditationData).returning();
    return meditation;
  }

  async updateMeditation(id: string, updates: Partial<Meditation>): Promise<Meditation> {
    const [meditation] = await db
      .update(meditations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(meditations.id, id))
      .returning();
    return meditation;
  }

  async deleteMeditation(id: string): Promise<void> {
    await db.update(meditations).set({ isActive: false }).where(eq(meditations.id, id));
  }

  // Education module operations
  async getEducationModules(): Promise<EducationModule[]> {
    return await db
      .select()
      .from(educationModules)
      .where(eq(educationModules.isActive, true))
      .orderBy(educationModules.title);
  }

  async getEducationModule(id: string): Promise<EducationModule | undefined> {
    const [module] = await db.select().from(educationModules).where(eq(educationModules.id, id));
    return module;
  }

  async createEducationModule(moduleData: InsertEducationModule): Promise<EducationModule> {
    const [module] = await db.insert(educationModules).values(moduleData).returning();
    return module;
  }

  async updateEducationModule(id: string, updates: Partial<EducationModule>): Promise<EducationModule> {
    const [module] = await db
      .update(educationModules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(educationModules.id, id))
      .returning();
    return module;
  }

  async deleteEducationModule(id: string): Promise<void> {
    await db.update(educationModules).set({ isActive: false }).where(eq(educationModules.id, id));
  }

  // Goal operations
  async getGoals(): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.isActive, true))
      .orderBy(goals.title);
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal;
  }

  async createGoal(goalData: InsertGoal): Promise<Goal> {
    const [goal] = await db.insert(goals).values(goalData).returning();
    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const [goal] = await db
      .update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();
    return goal;
  }

  async deleteGoal(id: string): Promise<void> {
    await db.update(goals).set({ isActive: false }).where(eq(goals.id, id));
  }

  // User session operations
  async createUserSession(sessionData: InsertUserSession): Promise<UserSession> {
    const [session] = await db.insert(userSessions).values(sessionData).returning();
    
    // Update user's total sessions and points
    const profile = await this.getPatientProfile(sessionData.userId);
    if (profile) {
      await this.updatePatientProfile(sessionData.userId, {
        totalSessions: profile.totalSessions + 1,
        points: profile.points + (sessionData.pointsEarned || 0),
        lastActivity: new Date(),
      });
    }
    
    return session;
  }

  async getUserSessions(userId: string, limit = 10): Promise<UserSession[]> {
    return await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, userId))
      .orderBy(desc(userSessions.createdAt))
      .limit(limit);
  }

  // Emergency event operations
  async createEmergencyEvent(eventData: InsertEmergencyEvent): Promise<EmergencyEvent> {
    const [event] = await db.insert(emergencyEvents).values(eventData).returning();
    return event;
  }

  async getEmergencyEvents(userId?: string): Promise<EmergencyEvent[]> {
    let query = db.select().from(emergencyEvents);
    
    if (userId) {
      query = query.where(eq(emergencyEvents.userId, userId));
    }
    
    return await query.orderBy(desc(emergencyEvents.createdAt));
  }

  async updateEmergencyEvent(id: string, updates: Partial<EmergencyEvent>): Promise<EmergencyEvent> {
    const [event] = await db
      .update(emergencyEvents)
      .set(updates)
      .where(eq(emergencyEvents.id, id))
      .returning();
    return event;
  }

  // Goal progress operations
  async getUserGoalProgress(userId: string): Promise<UserGoalProgress[]> {
    return await db
      .select()
      .from(userGoalProgress)
      .where(eq(userGoalProgress.userId, userId))
      .orderBy(desc(userGoalProgress.createdAt));
  }

  async updateGoalProgress(userId: string, goalId: string, progress: number): Promise<UserGoalProgress> {
    const [existing] = await db
      .select()
      .from(userGoalProgress)
      .where(and(
        eq(userGoalProgress.userId, userId),
        eq(userGoalProgress.goalId, goalId)
      ));

    if (existing) {
      const [updated] = await db
        .update(userGoalProgress)
        .set({ 
          currentProgress: progress,
          updatedAt: new Date() 
        })
        .where(eq(userGoalProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userGoalProgress)
        .values({
          userId,
          goalId,
          currentProgress: progress,
        })
        .returning();
      return created;
    }
  }

  async completeGoal(userId: string, goalId: string): Promise<UserBadge> {
    // Mark goal as completed
    await db
      .update(userGoalProgress)
      .set({ 
        completed: true,
        completedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(and(
        eq(userGoalProgress.userId, userId),
        eq(userGoalProgress.goalId, goalId)
      ));

    // Award badge
    const [badge] = await db
      .insert(userBadges)
      .values({
        userId,
        goalId,
      })
      .returning();

    // Award points from goal
    const goal = await this.getGoal(goalId);
    if (goal) {
      const profile = await this.getPatientProfile(userId);
      if (profile) {
        await this.updatePatientProfile(userId, {
          points: profile.points + goal.pointsReward,
        });
      }
    }

    return badge;
  }

  // Statistics operations
  async getPatientStats(): Promise<{
    totalPatients: number;
    activePatients: number;
    sessionsToday: number;
    emergenciesToday: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalPatients] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'patient'));

    const [activePatients] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        eq(users.role, 'patient'),
        eq(users.isActive, true)
      ));

    const [sessionsToday] = await db
      .select({ count: count() })
      .from(userSessions)
      .where(gte(userSessions.createdAt, today));

    const [emergenciesToday] = await db
      .select({ count: count() })
      .from(emergencyEvents)
      .where(gte(emergencyEvents.createdAt, today));

    return {
      totalPatients: totalPatients.count,
      activePatients: activePatients.count,
      sessionsToday: sessionsToday.count,
      emergenciesToday: emergenciesToday.count,
    };
  }

  async getUserStats(userId: string): Promise<{
    level: number;
    points: number;
    cleanDayStreak: number;
    totalSessions: number;
    weeklyProgress: {
      exercises: number;
      meditation: number;
      education: number;
    };
  }> {
    const profile = await this.getPatientProfile(userId);
    
    if (!profile) {
      throw new Error('Patient profile not found');
    }

    // Calculate weekly progress
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklySessions = await db
      .select({
        contentType: userSessions.contentType,
        count: count(),
      })
      .from(userSessions)
      .where(and(
        eq(userSessions.userId, userId),
        gte(userSessions.createdAt, weekAgo)
      ))
      .groupBy(userSessions.contentType);

    const weeklyProgress = {
      exercises: 0,
      meditation: 0,
      education: 0,
    };

    weeklySessions.forEach(session => {
      if (session.contentType === 'exercise') {
        weeklyProgress.exercises = session.count;
      } else if (session.contentType === 'meditation') {
        weeklyProgress.meditation = session.count;
      } else if (session.contentType === 'education') {
        weeklyProgress.education = session.count;
      }
    });

    return {
      level: profile.level,
      points: profile.points,
      cleanDayStreak: profile.cleanDayStreak,
      totalSessions: profile.totalSessions,
      weeklyProgress,
    };
  }

  // Admin operations
  async getActivePatients(): Promise<(User & { profile: PatientProfile | null })[]> {
    const result = await db
      .select()
      .from(users)
      .leftJoin(patientProfiles, eq(users.id, patientProfiles.userId))
      .where(eq(users.role, 'patient'))
      .orderBy(desc(users.createdAt));

    return result.map(row => ({
      ...row.users,
      profile: row.patient_profiles,
    }));
  }

  async deletePatient(userId: string): Promise<void> {
    await db.update(users).set({ isActive: false }).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
