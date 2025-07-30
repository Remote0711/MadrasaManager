import { 
  users, classes, students, parents, programTypes, lessonPlans,
  progress, attendance, behavior,
  type User, type InsertUser, type Class, type InsertClass,
  type Student, type InsertStudent, type Parent, type InsertParent,
  type ProgramType, type InsertProgramType, type LessonPlan, type InsertLessonPlan,
  type Progress, type InsertProgress, type Attendance, type InsertAttendance,
  type Behavior, type InsertBehavior, type StudentWithClass, type StudentWithProgress,
  type ParentWithStudent
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Program Type operations
  getAllProgramTypes(): Promise<ProgramType[]>;
  createProgramType(programType: InsertProgramType): Promise<ProgramType>;

  // Class operations
  getAllClasses(): Promise<Class[]>;
  getClassById(id: string): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;

  // Student operations
  getAllStudents(): Promise<StudentWithClass[]>;
  getStudentById(id: string): Promise<StudentWithProgress | undefined>;
  getStudentsByClassId(classId: string): Promise<StudentWithClass[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student>;

  // Parent operations
  getParentByUserId(userId: string): Promise<ParentWithStudent | undefined>;
  createParent(parent: InsertParent): Promise<Parent>;

  // Lesson Plan operations
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
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
  async getAllClasses(): Promise<Class[]> {
    return await db.select().from(classes);
  }

  async getClassById(id: string): Promise<Class | undefined> {
    const [classData] = await db.select().from(classes).where(eq(classes.id, id));
    return classData || undefined;
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
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
  async getLessonPlansByProgramType(programTypeId: string): Promise<LessonPlan[]> {
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
}

export const storage = new DatabaseStorage();
