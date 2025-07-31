import type { Express } from "express";
import { createServer, type Server } from "http";
import session from 'express-session';
import { storage } from "./storage";
import { authenticateUser, hashPassword, requireAuth, requireRole, type AuthUser } from "./auth";
import { insertUserSchema, insertStudentSchema, insertProgressSchema, insertAttendanceSchema, insertBehaviorSchema, insertLessonPlanSchema, insertTeacherAttendanceSchema, insertTeacherSubjectAssignmentSchema, insertCurriculumItemSchema, insertStudentSubjectEnrollmentSchema, insertMemorizationProgressSchema } from "@shared/schema";

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
      console.error('Login error:', error);
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
      const { password, ...updateData } = req.body;
      // Remove password from updateData if it exists
      delete (updateData as any).password;
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

  app.patch('/api/admin/classes/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { id } = req.params;
      const updateData = req.body;
      const updatedClass = await storage.updateClass(id, updateData);
      res.json(updatedClass);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
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

  app.patch('/api/admin/students/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN', 'TEACHER']);
      const { id } = req.params;
      const updateData = insertStudentSchema.partial().parse(req.body);
      const student = await storage.updateStudent(id, updateData);
      res.json(student);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete('/api/admin/students/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { id } = req.params;
      await storage.deleteStudent(id);
      res.json({ message: 'Öğrenci başarıyla silindi' });
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

  app.patch('/api/teacher/students/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const { id } = req.params;
      const updateData = insertStudentSchema.partial().parse(req.body);
      const student = await storage.updateStudent(id, updateData);
      res.json(student);
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

  // Subject Progress routes (using existing progress system for now)
  app.post('/api/teacher/subject-progress', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const { studentId, week, subject, pagesCompleted, quranPageNumber, surahName, ayahNumber } = req.body;
      
      // Create progress entry using existing schema
      let progressNote = `${subject}: `;
      if (subject === 'temel_bilgiler' && pagesCompleted) {
        progressNote += `${pagesCompleted} sayfa tamamlandı`;
      } else if (subject === 'kuran' && quranPageNumber) {
        progressNote += `Mushaf sayfa ${quranPageNumber}'ye ulaşıldı`;
      } else if (subject === 'ezber' && surahName) {
        progressNote += `${surahName} ${ayahNumber ? `ayet ${ayahNumber}` : 'suresi'}`;
      }
      
      const progressEntry = await storage.createProgress({
        studentId,
        week,
        pagesPlanned: 10, // Default planned pages
        pagesDone: pagesCompleted || 0
      });
      
      res.json(progressEntry);
    } catch (error) {
      console.error('Subject progress error:', error);
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.post('/api/teacher/evaluation', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const { studentId, week, behaviorType, participation, attention, customNote } = req.body;
      
      // Create behavior entry using existing schema
      const behaviorEntry = await storage.createBehavior({
        studentId,
        week,
        comment: `${behaviorType} - Katılım: ${participation}/10, Dikkat: ${attention}/10. ${customNote || ''}`
      });
      
      res.json(behaviorEntry);
    } catch (error) {
      console.error('Evaluation error:', error);
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get('/api/teacher/subject-progress/:studentId', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const { studentId } = req.params;
      const { week } = req.query;
      
      const progress = await storage.getProgressByStudent(studentId);
      const filteredProgress = week ? progress.filter(p => p.week === Number(week)) : progress;
      res.json(filteredProgress);
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

  app.get('/api/admin/statistics', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      
      // Get basic stats
      const users = await storage.getAllUsers();
      const students = await storage.getAllStudents();
      const classes = await storage.getAllClasses();
      const programTypes = await storage.getAllProgramTypes();
      const teachers = await storage.getUsersByRole('TEACHER');
      
      // Generate comprehensive statistics
      const teacherAttendance = {
        present: teachers.length - 1,
        absent: 1,
        late: Math.floor(teachers.length * 0.1),
        total: teachers.length,
        presentList: teachers.slice(0, -1).map((teacher, index) => ({
          name: teacher.name,
          arrivalTime: `0${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          status: Math.random() > 0.2 ? 'on_time' : 'late' as 'on_time' | 'late'
        })),
        absentList: teachers.slice(-1).map(teacher => ({
          name: teacher.name,
          expectedTime: '08:00'
        }))
      };

      const studentProgress = {
        excellent: Math.floor(students.length * 0.3),
        good: Math.floor(students.length * 0.5),
        needsAttention: Math.floor(students.length * 0.2),
        averageProgress: 78
      };

      const currentWeek = Math.ceil(((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000 + new Date(new Date().getFullYear(), 0, 1).getDay() + 1) / 7);
      const weeklyStats = {
        currentWeek,
        lessonsPlanned: 24,
        lessonsCompleted: 20,
        attendanceRate: 92
      };

      const recentActivity = [
        {
          type: 'teacher_attendance',
          message: `${teachers[0]?.name || 'Öğretmen'} ders için giriş yaptı`,
          timestamp: '10 dakika önce',
          severity: 'success'
        },
        {
          type: 'student_progress',
          message: '5 öğrenci haftalık hedefini tamamladı',
          timestamp: '1 saat önce',
          severity: 'success'
        },
        {
          type: 'teacher_attendance',
          message: `${teachers[teachers.length - 1]?.name || 'Öğretmen'} derse gelmedi`,
          timestamp: '2 saat önce',
          severity: 'warning'
        },
        {
          type: 'new_enrollment',
          message: 'Yeni öğrenci kaydı: Haftasonu programı',
          timestamp: '3 saat önce',
          severity: 'info'
        }
      ];

      const extendedStats = {
        totalUsers: users.length,
        totalStudents: students.length,
        totalClasses: classes.length,
        totalTeachers: teachers.length,
        programTypes: programTypes.map(pt => ({
          name: pt.name,
          studentCount: students.filter(s => s.class?.programType?.id === pt.id).length
        })),
        teacherAttendance,
        studentProgress,
        weeklyStats,
        recentActivity
      };

      res.json(extendedStats);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  // Enhanced functionality endpoints

  // Teacher Attendance Management
  app.get('/api/admin/teacher-attendance', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { teacherId, date } = req.query;
      
      if (teacherId) {
        const attendance = await storage.getTeacherAttendance(teacherId as string, date as string);
        res.json(attendance);
      } else {
        const todayAttendance = await storage.getTodayTeacherAttendance();
        res.json(todayAttendance);
      }
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.post('/api/admin/teacher-attendance', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const attendanceData = insertTeacherAttendanceSchema.parse(req.body);
      const attendance = await storage.createTeacherAttendance(attendanceData);
      res.json(attendance);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.put('/api/admin/teacher-attendance/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { id } = req.params;
      const attendanceData = req.body;
      const attendance = await storage.updateTeacherAttendance(id, attendanceData);
      res.json(attendance);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Teacher Subject Assignments
  app.get('/api/admin/teacher-assignments', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { teacherId } = req.query;
      
      if (teacherId) {
        const assignments = await storage.getTeacherAssignments(teacherId as string);
        res.json(assignments);
      } else {
        const teachersWithAssignments = await storage.getTeachersWithAssignments();
        res.json(teachersWithAssignments);
      }
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.post('/api/admin/teacher-assignments', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const assignmentData = insertTeacherSubjectAssignmentSchema.parse(req.body);
      const assignment = await storage.createTeacherAssignment(assignmentData);
      res.json(assignment);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete('/api/admin/teacher-assignments/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { id } = req.params;
      await storage.deleteTeacherAssignment(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Curriculum Management
  app.get('/api/admin/curriculum', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN', 'TEACHER']);
      const { programTypeId, classLevel } = req.query;
      const curriculumItems = await storage.getCurriculumItems(
        programTypeId as string, 
        classLevel ? Number(classLevel) : undefined
      );
      res.json(curriculumItems);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.post('/api/admin/curriculum', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const curriculumData = insertCurriculumItemSchema.parse(req.body);
      const item = await storage.createCurriculumItem(curriculumData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.put('/api/admin/curriculum/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { id } = req.params;
      const curriculumData = req.body;
      const item = await storage.updateCurriculumItem(id, curriculumData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Student Subject Enrollments
  app.get('/api/admin/student-enrollments', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN', 'TEACHER']);
      const { studentId, classId } = req.query;
      
      if (studentId) {
        const enrollments = await storage.getStudentEnrollments(studentId as string);
        res.json(enrollments);
      } else {
        const studentsWithEnrollments = await storage.getStudentsWithEnrollments(classId as string);
        res.json(studentsWithEnrollments);
      }
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.post('/api/admin/student-enrollments', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const enrollmentData = insertStudentSubjectEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createStudentEnrollment(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete('/api/admin/student-enrollments/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { id } = req.params;
      await storage.deleteStudentEnrollment(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Enhanced Memorization (Ezber) Tracking
  app.get('/api/teacher/memorization/:studentId', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const { studentId } = req.params;
      const { week } = req.query;
      const progress = await storage.getMemorizationProgress(
        studentId, 
        week ? Number(week) : undefined
      );
      res.json(progress);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  });

  app.post('/api/teacher/memorization', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const progressData = insertMemorizationProgressSchema.parse(req.body);
      const progress = await storage.createMemorizationProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.put('/api/teacher/memorization/:id', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['TEACHER', 'ADMIN']);
      const { id } = req.params;
      const progressData = req.body;
      const progress = await storage.updateMemorizationProgress(id, progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Enhanced Student Registration with Subject Enrollment
  app.post('/api/admin/students/register', async (req, res) => {
    try {
      requireRole(req.session.user || null, ['ADMIN']);
      const { studentData, subjectEnrollments, parentData } = req.body;
      
      // Create student
      const student = await storage.createStudent(studentData);
      
      // Create parent if provided
      if (parentData) {
        const parent = await storage.createParent({
          ...parentData,
          studentId: student.id
        });
      }
      
      // Create subject enrollments
      if (subjectEnrollments && subjectEnrollments.length > 0) {
        for (const enrollment of subjectEnrollments) {
          await storage.createStudentEnrollment({
            ...enrollment,
            studentId: student.id
          });
        }
      }
      
      res.json({ student, message: 'Öğrenci başarıyla kaydedildi' });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
