import type { Express } from "express";
import { createServer, type Server } from "http";
import session from 'express-session';
import { storage } from "./storage";
import { authenticateUser, hashPassword, requireAuth, requireRole, type AuthUser } from "./auth";
import { insertUserSchema, insertStudentSchema, insertProgressSchema, insertAttendanceSchema, insertBehaviorSchema, insertLessonPlanSchema } from "@shared/schema";

declare module 'express-session' {
  interface SessionData {
    user?: AuthUser;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'islamic-school-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await authenticateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
      }

      req.session.user = user;
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Çıkış yapılırken hata oluştu' });
      }
      res.json({ message: 'Başarıyla çıkış yapıldı' });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ message: 'Oturum açılmamış' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.post('/api/admin/users', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const userData = insertUserSchema.parse(req.body);
      userData.password = await hashPassword(userData.password);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.patch('/api/admin/users/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { id } = req.params;
      const updateData = insertUserSchema.omit({ id: true, password: true }).parse(req.body);
      const updatedUser = await storage.updateUser(id, updateData);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get('/api/admin/program-types', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const programTypes = await storage.getAllProgramTypes();
      res.json(programTypes);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.get('/api/admin/classes', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const classes = await storage.getAllClasses();
      res.json(classes);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.get('/api/admin/students', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.post('/api/admin/students', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN', 'TEACHER']);
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      res.json(student);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get('/api/admin/parents', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN', 'TEACHER']);
      const parents = await storage.getUsersByRole('PARENT');
      res.json(parents);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.get('/api/admin/lesson-plans', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN', 'TEACHER']);
      const { programTypeId } = req.query;
      if (programTypeId) {
        const lessonPlans = await storage.getLessonPlansByProgramType(programTypeId as string);
        res.json(lessonPlans);
      } else {
        // Return all lesson plans if no program type specified
        const lessonPlans = await storage.getLessonPlansByProgramType('');
        res.json(lessonPlans);
      }
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.post('/api/admin/lesson-plans', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN', 'TEACHER']);
      const lessonPlanData = insertLessonPlanSchema.parse(req.body);
      const lessonPlan = await storage.createLessonPlan(lessonPlanData);
      res.json(lessonPlan);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Teacher routes
  app.get('/api/teacher/students', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const { classId } = req.query;
      
      if (classId) {
        const students = await storage.getStudentsByClassId(classId as string);
        res.json(students);
      } else {
        const students = await storage.getAllStudents();
        res.json(students);
      }
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.post('/api/teacher/progress', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const progressData = insertProgressSchema.parse(req.body);
      const progress = await storage.createProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.post('/api/teacher/attendance', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(attendanceData);
      res.json(attendance);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.post('/api/teacher/behavior', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const behaviorData = insertBehaviorSchema.parse(req.body);
      const behavior = await storage.createBehavior(behaviorData);
      res.json(behavior);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Parent routes
  app.get('/api/parent/child', async (req, res) => {
    try {
      const user = requireRole(req.session.user || null, ['PARENT']);
      const parent = await storage.getParentByUserId(user.id);
      if (!parent) {
        return res.status(404).json({ message: 'Veli bilgisi bulunamadı' });
      }
      res.json(parent);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.get('/api/student/:id/progress', async (req, res) => {
    try {
      requireAuth(req.session.user || null);
      const { id } = req.params;
      const progress = await storage.getProgressByStudent(id);
      res.json(progress);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.get('/api/student/:id/attendance', async (req, res) => {
    try {
      requireAuth(req.session.user || null);
      const { id } = req.params;
      const attendance = await storage.getAttendanceByStudent(id);
      res.json(attendance);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.get('/api/student/:id/behavior', async (req, res) => {
    try {
      requireAuth(req.session.user || null);
      const { id } = req.params;
      const behavior = await storage.getBehaviorByStudent(id);
      res.json(behavior);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  // Stats routes
  app.get('/api/stats/overview', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const users = await storage.getAllUsers();
      const students = await storage.getAllStudents();
      const classes = await storage.getAllClasses();
      const programTypes = await storage.getAllProgramTypes();

      const stats = {
        totalUsers: users.length,
        totalStudents: students.length,
        totalClasses: classes.length,
        programTypes: programTypes.map(pt => ({
          name: pt.name,
          studentCount: students.filter(s => s.class.programType.id === pt.id).length
        }))
      };

      res.json(stats);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
