import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum('user_role', ['patient', 'admin']);

// Exercise difficulty enum
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced']);

// Content type enum
export const contentTypeEnum = pgEnum('content_type', ['exercise', 'meditation', 'education']);

// User storage table for Replit Auth + app roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('patient'),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patient profiles with addiction-specific data
export const patientProfiles = pgTable("patient_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  level: integer("level").default(1),
  points: integer("points").default(0),
  cleanDayStreak: integer("clean_day_streak").default(0),
  totalSessions: integer("total_sessions").default(0),
  lastActivity: timestamp("last_activity").defaultNow(),
  preferences: jsonb("preferences").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Physical exercises
export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  duration: integer("duration").notNull(), // in minutes
  difficulty: difficultyEnum("difficulty").notNull(),
  imageUrl: varchar("image_url"),
  category: varchar("category").notNull(),
  isActive: boolean("is_active").default(true),
  rating: integer("rating").default(0),
  completionCount: integer("completion_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Meditation/relaxation content
export const meditations = pgTable("meditations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  audioUrl: varchar("audio_url"),
  duration: integer("duration").notNull(), // in minutes
  type: varchar("type").notNull(), // breathing, mindfulness, visualization
  isActive: boolean("is_active").default(true),
  rating: integer("rating").default(0),
  completionCount: integer("completion_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Psychoeducation modules
export const educationModules = pgTable("education_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  duration: integer("duration").notNull(), // in minutes
  chapters: integer("chapters").notNull(),
  isEssential: boolean("is_essential").default(false),
  prerequisiteModuleId: varchar("prerequisite_module_id").references(() => educationModules.id),
  isActive: boolean("is_active").default(true),
  completionCount: integer("completion_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Goals/achievements
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // daily, weekly, milestone
  target: integer("target").notNull(),
  pointsReward: integer("points_reward").notNull(),
  badgeIcon: varchar("badge_icon"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User sessions (exercise/meditation/education completions)
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  contentType: contentTypeEnum("content_type").notNull(),
  contentId: varchar("content_id").notNull(),
  duration: integer("duration"), // actual time spent
  completed: boolean("completed").default(false),
  pointsEarned: integer("points_earned").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User goal progress
export const userGoalProgress = pgTable("user_goal_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  goalId: varchar("goal_id").notNull().references(() => goals.id, { onDelete: 'cascade' }),
  currentProgress: integer("current_progress").default(0),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency events tracking
export const emergencyEvents = pgTable("emergency_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  triggerReason: text("trigger_reason"),
  actionTaken: varchar("action_taken"), // breathing, exercise, support_call
  resolved: boolean("resolved").default(false),
  duration: integer("duration"), // time until resolved
  createdAt: timestamp("created_at").defaultNow(),
});

// User badges/achievements earned
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  goalId: varchar("goal_id").notNull().references(() => goals.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(patientProfiles, {
    fields: [users.id],
    references: [patientProfiles.userId],
  }),
  sessions: many(userSessions),
  goalProgress: many(userGoalProgress),
  emergencyEvents: many(emergencyEvents),
  badges: many(userBadges),
}));

export const patientProfilesRelations = relations(patientProfiles, ({ one }) => ({
  user: one(users, {
    fields: [patientProfiles.userId],
    references: [users.id],
  }),
}));

export const educationModulesRelations = relations(educationModules, ({ one }) => ({
  prerequisite: one(educationModules, {
    fields: [educationModules.prerequisiteModuleId],
    references: [educationModules.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const userGoalProgressRelations = relations(userGoalProgress, ({ one }) => ({
  user: one(users, {
    fields: [userGoalProgress.userId],
    references: [users.id],
  }),
  goal: one(goals, {
    fields: [userGoalProgress.goalId],
    references: [goals.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPatientProfileSchema = createInsertSchema(patientProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completionCount: true,
});

export const insertMeditationSchema = createInsertSchema(meditations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completionCount: true,
});

export const insertEducationModuleSchema = createInsertSchema(educationModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completionCount: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
});

export const insertEmergencyEventSchema = createInsertSchema(emergencyEvents).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type PatientProfile = typeof patientProfiles.$inferSelect;
export type InsertPatientProfile = z.infer<typeof insertPatientProfileSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Meditation = typeof meditations.$inferSelect;
export type InsertMeditation = z.infer<typeof insertMeditationSchema>;
export type EducationModule = typeof educationModules.$inferSelect;
export type InsertEducationModule = z.infer<typeof insertEducationModuleSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type EmergencyEvent = typeof emergencyEvents.$inferSelect;
export type InsertEmergencyEvent = z.infer<typeof insertEmergencyEventSchema>;
export type UserGoalProgress = typeof userGoalProgress.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
