import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertExerciseSchema,
  insertMeditationSchema,
  insertEducationModuleSchema,
  insertGoalSchema,
  insertUserSessionSchema,
  insertEmergencyEventSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get or create patient profile for patients
      if (user.role === 'patient') {
        let profile = await storage.getPatientProfile(userId);
        if (!profile) {
          profile = await storage.createPatientProfile({ userId });
        }
        return res.json({ ...user, profile });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Exercise routes
  app.get('/api/exercises', async (req, res) => {
    try {
      const { difficulty } = req.query;
      const exercises = await storage.getExercises(difficulty as string);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get('/api/exercises/:id', async (req, res) => {
    try {
      const exercise = await storage.getExercise(req.params.id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      console.error("Error fetching exercise:", error);
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  app.post('/api/exercises', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      console.error("Error creating exercise:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid exercise data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });

  app.put('/api/exercises/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const updates = req.body;
      const exercise = await storage.updateExercise(req.params.id, updates);
      res.json(exercise);
    } catch (error) {
      console.error("Error updating exercise:", error);
      res.status(500).json({ message: "Failed to update exercise" });
    }
  });

  app.delete('/api/exercises/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteExercise(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting exercise:", error);
      res.status(500).json({ message: "Failed to delete exercise" });
    }
  });

  // Meditation routes
  app.get('/api/meditations', async (req, res) => {
    try {
      const meditations = await storage.getMeditations();
      res.json(meditations);
    } catch (error) {
      console.error("Error fetching meditations:", error);
      res.status(500).json({ message: "Failed to fetch meditations" });
    }
  });

  app.post('/api/meditations', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const meditationData = insertMeditationSchema.parse(req.body);
      const meditation = await storage.createMeditation(meditationData);
      res.status(201).json(meditation);
    } catch (error) {
      console.error("Error creating meditation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid meditation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create meditation" });
    }
  });

  // Education module routes
  app.get('/api/education-modules', async (req, res) => {
    try {
      const modules = await storage.getEducationModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching education modules:", error);
      res.status(500).json({ message: "Failed to fetch education modules" });
    }
  });

  app.post('/api/education-modules', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const moduleData = insertEducationModuleSchema.parse(req.body);
      const module = await storage.createEducationModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      console.error("Error creating education module:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create education module" });
    }
  });

  // Goal routes
  app.get('/api/goals', async (req, res) => {
    try {
      const goals = await storage.getGoals();
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const goalData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(goalData);
      res.status(201).json(goal);
    } catch (error) {
      console.error("Error creating goal:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  // User session routes
  app.post('/api/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertUserSessionSchema.parse({ ...req.body, userId });
      const session = await storage.createUserSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating user session:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.get('/api/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Emergency event routes
  app.post('/api/emergency', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventData = insertEmergencyEventSchema.parse({ ...req.body, userId });
      const event = await storage.createEmergencyEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating emergency event:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid emergency data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create emergency event" });
    }
  });

  app.put('/api/emergency/:id', isAuthenticated, async (req: any, res) => {
    try {
      const updates = req.body;
      const event = await storage.updateEmergencyEvent(req.params.id, updates);
      res.json(event);
    } catch (error) {
      console.error("Error updating emergency event:", error);
      res.status(500).json({ message: "Failed to update emergency event" });
    }
  });

  // Goal progress routes
  app.get('/api/goal-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserGoalProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching goal progress:", error);
      res.status(500).json({ message: "Failed to fetch goal progress" });
    }
  });

  app.put('/api/goal-progress/:goalId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { progress } = req.body;
      const updatedProgress = await storage.updateGoalProgress(userId, req.params.goalId, progress);
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error updating goal progress:", error);
      res.status(500).json({ message: "Failed to update goal progress" });
    }
  });

  app.post('/api/goal-progress/:goalId/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const badge = await storage.completeGoal(userId, req.params.goalId);
      res.json(badge);
    } catch (error) {
      console.error("Error completing goal:", error);
      res.status(500).json({ message: "Failed to complete goal" });
    }
  });

  // Statistics routes
  app.get('/api/stats/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getPatientStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get('/api/admin/patients', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const patients = await storage.getActivePatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.delete('/api/admin/patients/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deletePatient(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting patient:", error);
      res.status(500).json({ message: "Failed to delete patient" });
    }
  });

  app.get('/api/admin/emergency-events', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const events = await storage.getEmergencyEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching emergency events:", error);
      res.status(500).json({ message: "Failed to fetch emergency events" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
