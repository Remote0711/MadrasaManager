import { 
  users, classes, students, parents, programTypes, lessonPlans,
  progress, attendance, behavior, teacherAttendance, teacherSubjectAssignments,
  curriculumItems, studentSubjectEnrollments, memorizationProgress,
  type User, type InsertUser, type Class, type InsertClass,
  type Student, type InsertStudent, type Parent, type InsertParent,
  type ProgramType, type InsertProgramType, type LessonPlan, type InsertLessonPlan,
  type Progress, type InsertProgress, type Attendance, type InsertAttendance,
  type Behavior, type InsertBehavior, type StudentWithClass, type StudentWithProgress,
  type ParentWithStudent, type TeacherAttendance, type InsertTeacherAttendance,
  type TeacherSubjectAssignment, type InsertTeacherSubjectAssignment,
  type CurriculumItem, type InsertCurriculumItem, type StudentSubjectEnrollment,
  type InsertStudentSubjectEnrollment, type MemorizationProgress, type InsertMemorizationProgress,
  type TeacherWithAssignments, type StudentWithEnrollments
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  // Program Type operations
  getAllProgramTypes(): Promise<ProgramType[]>;
  createProgramType(programType: InsertProgramType): Promise<ProgramType>;

  // Class operations
  getAllClasses(): Promise<Class[]>;
  getClassById(id: string): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: string, classData: Partial<InsertClass>): Promise<Class>;

  // Student operations
  getAllStudents(): Promise<StudentWithClass[]>;
  getStudentById(id: string): Promise<StudentWithProgress | undefined>;
  getStudentsByClassId(classId: string): Promise<StudentWithClass[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(id: string): Promise<void>;

  // Parent operations
  getParentByUserId(userId: string): Promise<ParentWithStudent | undefined>;
  createParent(parent: InsertParent): Promise<Parent>;

  // Lesson Plan operations
  getAllLessonPlans(): Promise<LessonPlan[]>;
  getLessonPlansByProgramType(programTypeId: string): Promise<LessonPlan[]>;
  createLessonPlan(lessonPlan: InsertLessonPlan): Promise<LessonPlan>;

  // Progress operations
  getProgressByStudent(studentId: string): Promise<Progress[]>;
  createProgress(progressData: InsertProgress): Promise<Progress>;
  updateProgress(studentId: string, week: number, progressData: Partial<InsertProgress>): Promise<Progress>;

  // Attendance operations
  getAttendanceByStudent(studentId: string): Promise<Attendance[]>;
  createAttendance(attendanceData: InsertAttendance): Promise<Attendance>;
  updateAttendance(studentId: string, week: number, attendanceData: Partial<InsertAttendance>): Promise<Attendance>;

  // Behavior operations
  getBehaviorByStudent(studentId: string): Promise<Behavior[]>;
  createBehavior(behaviorData: InsertBehavior): Promise<Behavior>;
  updateBehavior(studentId: string, week: number, behaviorData: Partial<InsertBehavior>): Promise<Behavior>;

  // Teacher Attendance operations
  getTeacherAttendance(teacherId: string, date?: string): Promise<TeacherAttendance[]>;
  createTeacherAttendance(attendanceData: InsertTeacherAttendance): Promise<TeacherAttendance>;
  updateTeacherAttendance(id: string, attendanceData: Partial<InsertTeacherAttendance>): Promise<TeacherAttendance>;
  getTodayTeacherAttendance(): Promise<TeacherAttendance[]>;

  // Teacher Subject Assignment operations
  getTeacherAssignments(teacherId: string): Promise<TeacherSubjectAssignment[]>;
  createTeacherAssignment(assignmentData: InsertTeacherSubjectAssignment): Promise<TeacherSubjectAssignment>;
  deleteTeacherAssignment(id: string): Promise<void>;
  getTeachersWithAssignments(): Promise<TeacherWithAssignments[]>;

  // Curriculum operations
  getCurriculumItems(programTypeId?: string, classLevel?: number): Promise<CurriculumItem[]>;
  createCurriculumItem(curriculumData: InsertCurriculumItem): Promise<CurriculumItem>;
  updateCurriculumItem(id: string, curriculumData: Partial<InsertCurriculumItem>): Promise<CurriculumItem>;

  // Student Subject Enrollment operations
  getStudentEnrollments(studentId: string): Promise<StudentSubjectEnrollment[]>;
  createStudentEnrollment(enrollmentData: InsertStudentSubjectEnrollment): Promise<StudentSubjectEnrollment>;
  deleteStudentEnrollment(id: string): Promise<void>;
  getStudentsWithEnrollments(classId?: string): Promise<StudentWithEnrollments[]>;

  // Memorization Progress operations
  getMemorizationProgress(studentId: string, week?: number): Promise<MemorizationProgress[]>;
  createMemorizationProgress(progressData: InsertMemorizationProgress): Promise<MemorizationProgress>;
  updateMemorizationProgress(id: string, progressData: Partial<InsertMemorizationProgress>): Promise<MemorizationProgress>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  // Program Type operations
  async getAllProgramTypes(): Promise<ProgramType[]> {
    return await db.select().from(programTypes);
  }

  async createProgramType(programType: InsertProgramType): Promise<ProgramType> {
    const [newProgramType] = await db.insert(programTypes).values(programType).returning();
    return newProgramType;
  }

  // Class operations
  async getAllClasses(): Promise<any[]> {
    // Get classes with program types and student counts
    const classesWithProgramTypes = await db.select()
      .from(classes)
      .leftJoin(programTypes, eq(classes.programTypeId, programTypes.id));

    // Get student counts for each class
    const classStudentCounts = await db.select({
      classId: students.classId,
      count: sql<number>`count(*)::int`
    })
    .from(students)
    .groupBy(students.classId);

    // Get some sample students for each class
    const studentsData = await db.select({
      id: students.id,
      firstName: students.firstName,
      lastName: students.lastName,
      classId: students.classId
    }).from(students);

    return classesWithProgramTypes.map(result => {
      const classId = result.classes.id;
      const studentCount = classStudentCounts.find(sc => sc.classId === classId)?.count || 0;
      const classStudents = studentsData.filter(s => s.classId === classId).slice(0, 5); // Sample of 5 students

      return {
        ...result.classes,
        programType: result.program_types,
        students: classStudents,
        studentCount
      };
    });
  }

  async getClassById(id: string): Promise<Class | undefined> {
    const [classData] = await db.select().from(classes).where(eq(classes.id, id));
    return classData || undefined;
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
  }

  async updateClass(id: string, classData: Partial<InsertClass>): Promise<Class> {
    const [updatedClass] = await db.update(classes).set(classData).where(eq(classes.id, id)).returning();
    return updatedClass;
  }

  // Student operations
  async getAllStudents(): Promise<StudentWithClass[]> {
    return await db.select()
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(programTypes, eq(classes.programTypeId, programTypes.id))
      .then(results => results.map(result => ({
        ...result.students,
        class: {
          ...result.classes!,
          programType: result.program_types!
        }
      })));
  }

  async getStudentById(id: string): Promise<StudentWithProgress | undefined> {
    const [student] = await db.select()
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .where(eq(students.id, id));
    
    if (!student.students) return undefined;

    const studentProgress = await db.select().from(progress).where(eq(progress.studentId, id));
    const studentAttendance = await db.select().from(attendance).where(eq(attendance.studentId, id));
    const studentBehavior = await db.select().from(behavior).where(eq(behavior.studentId, id));

    return {
      ...student.students,
      class: student.classes!,
      progress: studentProgress,
      attendance: studentAttendance,
      behavior: studentBehavior
    };
  }

  async getStudentsByClassId(classId: string): Promise<StudentWithClass[]> {
    return await db.select()
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(programTypes, eq(classes.programTypeId, programTypes.id))
      .where(eq(students.classId, classId))
      .then(results => results.map(result => ({
        ...result.students,
        class: {
          ...result.classes!,
          programType: result.program_types!
        }
      })));
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student> {
    const [updatedStudent] = await db.update(students).set(student).where(eq(students.id, id)).returning();
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<void> {
    // Delete related records first to avoid foreign key constraints
    await db.delete(progress).where(eq(progress.studentId, id));
    await db.delete(attendance).where(eq(attendance.studentId, id));
    await db.delete(behavior).where(eq(behavior.studentId, id));
    await db.delete(parents).where(eq(parents.studentId, id));
    
    // Finally delete the student
    await db.delete(students).where(eq(students.id, id));
  }

  // Parent operations
  async getParentByUserId(userId: string): Promise<ParentWithStudent | undefined> {
    const [parent] = await db.select()
      .from(parents)
      .leftJoin(users, eq(parents.userId, users.id))
      .leftJoin(students, eq(parents.studentId, students.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(programTypes, eq(classes.programTypeId, programTypes.id))
      .where(eq(parents.userId, userId));

    if (!parent.parents) return undefined;

    return {
      ...parent.parents,
      user: parent.users!,
      student: {
        ...parent.students!,
        class: {
          ...parent.classes!,
          programType: parent.program_types!
        }
      }
    };
  }

  async createParent(parent: InsertParent): Promise<Parent> {
    const [newParent] = await db.insert(parents).values(parent).returning();
    return newParent;
  }

  // Lesson Plan operations
  async getAllLessonPlans(): Promise<LessonPlan[]> {
    return await db.select().from(lessonPlans);
  }

  async getLessonPlansByProgramType(programTypeId: string): Promise<LessonPlan[]> {
    if (!programTypeId) {
      return this.getAllLessonPlans();
    }
    return await db.select().from(lessonPlans).where(eq(lessonPlans.programTypeId, programTypeId));
  }

  async createLessonPlan(lessonPlan: InsertLessonPlan): Promise<LessonPlan> {
    const [newLessonPlan] = await db.insert(lessonPlans).values(lessonPlan).returning();
    return newLessonPlan;
  }

  // Progress operations
  async getProgressByStudent(studentId: string): Promise<Progress[]> {
    return await db.select().from(progress).where(eq(progress.studentId, studentId)).orderBy(desc(progress.week));
  }

  async createProgress(progressData: InsertProgress): Promise<Progress> {
    const [newProgress] = await db.insert(progress).values(progressData).returning();
    return newProgress;
  }

  async updateProgress(studentId: string, week: number, progressData: Partial<InsertProgress>): Promise<Progress> {
    const [updatedProgress] = await db.update(progress)
      .set(progressData)
      .where(and(eq(progress.studentId, studentId), eq(progress.week, week)))
      .returning();
    return updatedProgress;
  }

  // Attendance operations
  async getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
    return await db.select().from(attendance).where(eq(attendance.studentId, studentId)).orderBy(desc(attendance.week));
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }

  async updateAttendance(studentId: string, week: number, attendanceData: Partial<InsertAttendance>): Promise<Attendance> {
    const [updatedAttendance] = await db.update(attendance)
      .set(attendanceData)
      .where(and(eq(attendance.studentId, studentId), eq(attendance.week, week)))
      .returning();
    return updatedAttendance;
  }

  // Behavior operations
  async getBehaviorByStudent(studentId: string): Promise<Behavior[]> {
    return await db.select().from(behavior).where(eq(behavior.studentId, studentId)).orderBy(desc(behavior.week));
  }

  async createBehavior(behaviorData: InsertBehavior): Promise<Behavior> {
    const [newBehavior] = await db.insert(behavior).values(behaviorData).returning();
    return newBehavior;
  }

  async updateBehavior(studentId: string, week: number, behaviorData: Partial<InsertBehavior>): Promise<Behavior> {
    const [updatedBehavior] = await db.update(behavior)
      .set(behaviorData)
      .where(and(eq(behavior.studentId, studentId), eq(behavior.week, week)))
      .returning();
    return updatedBehavior;
  }

  // Teacher Attendance operations
  async getTeacherAttendance(teacherId: string, date?: string): Promise<TeacherAttendance[]> {
    let query = db.select().from(teacherAttendance).where(eq(teacherAttendance.teacherId, teacherId));
    
    if (date) {
      query = query.where(eq(teacherAttendance.date, date));
    }
    
    return await query.orderBy(desc(teacherAttendance.date));
  }

  async createTeacherAttendance(attendanceData: InsertTeacherAttendance): Promise<TeacherAttendance> {
    const [attendanceRecord] = await db.insert(teacherAttendance).values(attendanceData).returning();
    return attendanceRecord;
  }

  async updateTeacherAttendance(id: string, attendanceData: Partial<InsertTeacherAttendance>): Promise<TeacherAttendance> {
    const [updated] = await db
      .update(teacherAttendance)
      .set(attendanceData)
      .where(eq(teacherAttendance.id, id))
      .returning();
    return updated;
  }

  async getTodayTeacherAttendance(): Promise<TeacherAttendance[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select()
      .from(teacherAttendance)
      .where(eq(teacherAttendance.date, today));
  }

  // Teacher Subject Assignment operations
  async getTeacherAssignments(teacherId: string): Promise<TeacherSubjectAssignment[]> {
    return await db
      .select()
      .from(teacherSubjectAssignments)
      .where(eq(teacherSubjectAssignments.teacherId, teacherId));
  }

  async createTeacherAssignment(assignmentData: InsertTeacherSubjectAssignment): Promise<TeacherSubjectAssignment> {
    const [assignment] = await db.insert(teacherSubjectAssignments).values(assignmentData).returning();
    return assignment;
  }

  async deleteTeacherAssignment(id: string): Promise<void> {
    await db.delete(teacherSubjectAssignments).where(eq(teacherSubjectAssignments.id, id));
  }

  async getTeachersWithAssignments(): Promise<TeacherWithAssignments[]> {
    const teachersData = await db
      .select()
      .from(users)
      .leftJoin(teacherSubjectAssignments, eq(users.id, teacherSubjectAssignments.teacherId))
      .leftJoin(classes, eq(teacherSubjectAssignments.classId, classes.id))
      .leftJoin(programTypes, eq(classes.programTypeId, programTypes.id))
      .leftJoin(teacherAttendance, eq(users.id, teacherAttendance.teacherId))
      .where(eq(users.role, 'TEACHER'));

    // Group by teacher
    const teacherMap = new Map<string, TeacherWithAssignments>();
    
    for (const row of teachersData) {
      if (!teacherMap.has(row.users.id)) {
        teacherMap.set(row.users.id, {
          ...row.users,
          teacherSubjectAssignments: [],
          teacherAttendance: []
        });
      }
      
      const teacher = teacherMap.get(row.users.id)!;
      
      if (row.teacher_subject_assignments && row.classes && row.program_types) {
        const existingAssignment = teacher.teacherSubjectAssignments.find(
          a => a.id === row.teacher_subject_assignments.id
        );
        if (!existingAssignment) {
          teacher.teacherSubjectAssignments.push({
            ...row.teacher_subject_assignments,
            class: {
              ...row.classes,
              programType: row.program_types
            }
          });
        }
      }
      
      if (row.teacher_attendance) {
        const existingAttendance = teacher.teacherAttendance.find(
          a => a.id === row.teacher_attendance.id
        );
        if (!existingAttendance) {
          teacher.teacherAttendance.push(row.teacher_attendance);
        }
      }
    }

    return Array.from(teacherMap.values());
  }

  // Curriculum operations
  async getCurriculumItems(programTypeId?: string, classLevel?: number): Promise<CurriculumItem[]> {
    let query = db.select().from(curriculumItems);
    
    if (programTypeId) {
      query = query.where(eq(curriculumItems.programTypeId, programTypeId));
    }
    
    if (classLevel) {
      query = query.where(eq(curriculumItems.classLevel, classLevel));
    }
    
    return await query.orderBy(curriculumItems.order);
  }

  async createCurriculumItem(curriculumData: InsertCurriculumItem): Promise<CurriculumItem> {
    const [item] = await db.insert(curriculumItems).values(curriculumData).returning();
    return item;
  }

  async updateCurriculumItem(id: string, curriculumData: Partial<InsertCurriculumItem>): Promise<CurriculumItem> {
    const [updated] = await db
      .update(curriculumItems)
      .set(curriculumData)
      .where(eq(curriculumItems.id, id))
      .returning();
    return updated;
  }

  // Student Subject Enrollment operations
  async getStudentEnrollments(studentId: string): Promise<StudentSubjectEnrollment[]> {
    return await db
      .select()
      .from(studentSubjectEnrollments)
      .where(eq(studentSubjectEnrollments.studentId, studentId));
  }

  async createStudentEnrollment(enrollmentData: InsertStudentSubjectEnrollment): Promise<StudentSubjectEnrollment> {
    const [enrollment] = await db.insert(studentSubjectEnrollments).values(enrollmentData).returning();
    return enrollment;
  }

  async deleteStudentEnrollment(id: string): Promise<void> {
    await db.delete(studentSubjectEnrollments).where(eq(studentSubjectEnrollments.id, id));
  }

  async getStudentsWithEnrollments(classId?: string): Promise<StudentWithEnrollments[]> {
    let query = db
      .select()
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(programTypes, eq(classes.programTypeId, programTypes.id))
      .leftJoin(studentSubjectEnrollments, eq(students.id, studentSubjectEnrollments.studentId))
      .leftJoin(users, eq(studentSubjectEnrollments.teacherId, users.id))
      .leftJoin(memorizationProgress, eq(students.id, memorizationProgress.studentId));

    if (classId) {
      query = query.where(eq(students.classId, classId));
    }

    const studentsData = await query;

    // Group by student
    const studentMap = new Map<string, StudentWithEnrollments>();
    
    for (const row of studentsData) {
      if (!studentMap.has(row.students.id)) {
        studentMap.set(row.students.id, {
          ...row.students,
          class: {
            ...row.classes!,
            programType: row.program_types!
          },
          subjectEnrollments: [],
          memorizationProgress: []
        });
      }
      
      const student = studentMap.get(row.students.id)!;
      
      if (row.student_subject_enrollments && row.users) {
        const existingEnrollment = student.subjectEnrollments.find(
          e => e.id === row.student_subject_enrollments.id
        );
        if (!existingEnrollment) {
          student.subjectEnrollments.push({
            ...row.student_subject_enrollments,
            teacher: row.users
          });
        }
      }
      
      if (row.memorization_progress) {
        const existing = student.memorizationProgress.find(
          m => m.id === row.memorization_progress.id
        );
        if (!existing) {
          student.memorizationProgress.push(row.memorization_progress);
        }
      }
    }

    return Array.from(studentMap.values());
  }

  // Memorization Progress operations
  async getMemorizationProgress(studentId: string, week?: number): Promise<MemorizationProgress[]> {
    let query = db
      .select()
      .from(memorizationProgress)
      .where(eq(memorizationProgress.studentId, studentId));
    
    if (week) {
      query = query.where(eq(memorizationProgress.week, week));
    }
    
    return await query.orderBy(desc(memorizationProgress.week));
  }

  async createMemorizationProgress(progressData: InsertMemorizationProgress): Promise<MemorizationProgress> {
    const [progressRecord] = await db.insert(memorizationProgress).values(progressData).returning();
    return progressRecord;
  }

  async updateMemorizationProgress(id: string, progressData: Partial<InsertMemorizationProgress>): Promise<MemorizationProgress> {
    const [updated] = await db
      .update(memorizationProgress)
      .set(progressData)
      .where(eq(memorizationProgress.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
