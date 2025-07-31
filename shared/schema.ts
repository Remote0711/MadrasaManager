import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum('role', ['ADMIN', 'TEACHER', 'PARENT']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['geldi', 'gelmedi', 'mazeretli', 'gec_geldi', 'erken_cikti']);
export const subjectTypeEnum = pgEnum('subject_type', ['temel_bilgiler', 'kuran', 'ezber']);
export const behaviorTypeEnum = pgEnum('behavior_type', ['cok_dikkatli', 'dikkatli', 'orta', 'dikkatsiz', 'cok_dikkatsiz']);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const programTypes = pgTable("program_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  level: integer("level").notNull(),
  programTypeId: varchar("program_type_id").references(() => programTypes.id).notNull(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth"),
  parentId: varchar("parent_id").references(() => users.id),
  classId: varchar("class_id").references(() => classes.id).notNull(),
  enrollmentDate: timestamp("enrollment_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const parents = pgTable("parents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
});

export const lessonPlans = pgTable("lesson_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  week: integer("week").notNull(),
  subject: text("subject").notNull(),
  pagesFrom: integer("pages_from").notNull(),
  pagesTo: integer("pages_to").notNull(),
  classLevel: integer("class_level").notNull(),
  programTypeId: varchar("program_type_id").references(() => programTypes.id).notNull(),
});

export const progress = pgTable("progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  week: integer("week").notNull(),
  pagesDone: integer("pages_done").notNull().default(0),
  pagesPlanned: integer("pages_planned").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  week: integer("week").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  arrivalTime: text("arrival_time"), // HH:MM format for late arrivals
  departureTime: text("departure_time"), // HH:MM format for early departures  
  notes: text("notes"), // Additional notes about attendance
  date: timestamp("date").defaultNow().notNull(),
});

export const behavior = pgTable("behavior", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  week: integer("week").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// New tables for enhanced subject tracking
export const weeklyLessonPlans = pgTable("weekly_lesson_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").references(() => classes.id).notNull(),
  subject: subjectTypeEnum("subject").notNull(),
  week: integer("week").notNull(),
  pagesFrom: integer("pages_from").notNull(),
  pagesTo: integer("pages_to").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjectProgress = pgTable("subject_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  week: integer("week").notNull(),
  subject: subjectTypeEnum("subject").notNull(),
  // For Temel Bilgiler - pages actually taught
  pagesCompleted: integer("pages_completed"),
  // For Kur'an - last page reached in Mushaf
  quranPageNumber: integer("quran_page_number"),
  // For Ezber - Surah and Ayah
  surahName: text("surah_name"),
  ayahNumber: integer("ayah_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studentEvaluations = pgTable("student_evaluations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  week: integer("week").notNull(),
  behaviorType: behaviorTypeEnum("behavior_type").notNull(),
  customNote: text("custom_note"),
  participation: integer("participation").default(5), // 1-10 scale
  attention: integer("attention").default(5), // 1-10 scale
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// New tables for enhanced functionality
export const teacherAttendance = pgTable("teacher_attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  arrivalTime: text("arrival_time"), // HH:MM format
  status: text("status").notNull().default('present'), // present, absent, late
  sessionId: varchar("session_id"), // Optional: link to specific lesson session
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teacherSubjectAssignments = pgTable("teacher_subject_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").references(() => users.id).notNull(),
  classId: varchar("class_id").references(() => classes.id).notNull(),
  subject: subjectTypeEnum("subject").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

export const curriculumItems = pgTable("curriculum_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programTypeId: varchar("program_type_id").references(() => programTypes.id).notNull(),
  subject: subjectTypeEnum("subject").notNull(),
  classLevel: integer("class_level").notNull(),
  title: text("title").notNull(), // e.g., "Abdest Alması", "Fatiha Suresi"
  description: text("description"),
  weekNumber: integer("week_number"),
  order: integer("order").notNull(), // For sequencing
  isOptional: boolean("is_optional").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentSubjectEnrollments = pgTable("student_subject_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  classId: varchar("class_id").references(() => classes.id).notNull(),
  subject: subjectTypeEnum("subject").notNull(),
  teacherId: varchar("teacher_id").references(() => users.id),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

// Enhanced memorization tracking
export const memorizationProgress = pgTable("memorization_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  surahName: text("surah_name").notNull(),
  ayahStart: integer("ayah_start").notNull(),
  ayahEnd: integer("ayah_end").notNull(),
  completionStatus: text("completion_status").notNull().default('in_progress'), // completed, in_progress, needs_review
  lastReviewDate: date("last_review_date"),
  qualityScore: integer("quality_score"), // 1-10 scale for memorization quality
  teacherNotes: text("teacher_notes"),
  week: integer("week").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  parents: many(parents),
  teacherAttendance: many(teacherAttendance),
  teacherSubjectAssignments: many(teacherSubjectAssignments),
  studentSubjectEnrollments: many(studentSubjectEnrollments),
}));

export const programTypesRelations = relations(programTypes, ({ many }) => ({
  classes: many(classes),
  lessonPlans: many(lessonPlans),
  curriculumItems: many(curriculumItems),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  programType: one(programTypes, {
    fields: [classes.programTypeId],
    references: [programTypes.id],
  }),
  students: many(students),
  weeklyLessonPlans: many(weeklyLessonPlans),
  teacherSubjectAssignments: many(teacherSubjectAssignments),
  studentSubjectEnrollments: many(studentSubjectEnrollments),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id],
  }),
  parents: many(parents),
  progress: many(progress),
  attendance: many(attendance),
  behavior: many(behavior),
  subjectProgress: many(subjectProgress),
  evaluations: many(studentEvaluations),
  subjectEnrollments: many(studentSubjectEnrollments),
  memorizationProgress: many(memorizationProgress),
}));

export const parentsRelations = relations(parents, ({ one }) => ({
  user: one(users, {
    fields: [parents.userId],
    references: [users.id],
  }),
  student: one(students, {
    fields: [parents.studentId],
    references: [students.id],
  }),
}));

export const lessonPlansRelations = relations(lessonPlans, ({ one }) => ({
  programType: one(programTypes, {
    fields: [lessonPlans.programTypeId],
    references: [programTypes.id],
  }),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  student: one(students, {
    fields: [progress.studentId],
    references: [students.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
}));

export const behaviorRelations = relations(behavior, ({ one }) => ({
  student: one(students, {
    fields: [behavior.studentId],
    references: [students.id],
  }),
}));

export const weeklyLessonPlansRelations = relations(weeklyLessonPlans, ({ one }) => ({
  class: one(classes, {
    fields: [weeklyLessonPlans.classId],
    references: [classes.id],
  }),
}));

export const subjectProgressRelations = relations(subjectProgress, ({ one }) => ({
  student: one(students, {
    fields: [subjectProgress.studentId],
    references: [students.id],
  }),
}));

export const studentEvaluationsRelations = relations(studentEvaluations, ({ one }) => ({
  student: one(students, {
    fields: [studentEvaluations.studentId],
    references: [students.id],
  }),
}));

// New relations
export const teacherAttendanceRelations = relations(teacherAttendance, ({ one }) => ({
  teacher: one(users, {
    fields: [teacherAttendance.teacherId],
    references: [users.id],
  }),
}));

export const teacherSubjectAssignmentsRelations = relations(teacherSubjectAssignments, ({ one }) => ({
  teacher: one(users, {
    fields: [teacherSubjectAssignments.teacherId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [teacherSubjectAssignments.classId],
    references: [classes.id],
  }),
}));

export const curriculumItemsRelations = relations(curriculumItems, ({ one }) => ({
  programType: one(programTypes, {
    fields: [curriculumItems.programTypeId],
    references: [programTypes.id],
  }),
}));

export const studentSubjectEnrollmentsRelations = relations(studentSubjectEnrollments, ({ one }) => ({
  student: one(students, {
    fields: [studentSubjectEnrollments.studentId],
    references: [students.id],
  }),
  class: one(classes, {
    fields: [studentSubjectEnrollments.classId],
    references: [classes.id],
  }),
  teacher: one(users, {
    fields: [studentSubjectEnrollments.teacherId],
    references: [users.id],
  }),
}));

export const memorizationProgressRelations = relations(memorizationProgress, ({ one }) => ({
  student: one(students, {
    fields: [memorizationProgress.studentId],
    references: [students.id],
  }),
}));



// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProgramTypeSchema = createInsertSchema(programTypes).omit({
  id: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  enrollmentDate: true,
});

export const insertParentSchema = createInsertSchema(parents).omit({
  id: true,
});

export const insertLessonPlanSchema = createInsertSchema(lessonPlans).omit({
  id: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  date: true,
});

export const insertBehaviorSchema = createInsertSchema(behavior).omit({
  id: true,
  createdAt: true,
});

export const insertWeeklyLessonPlanSchema = createInsertSchema(weeklyLessonPlans).omit({
  id: true,
  createdAt: true,
});

export const insertSubjectProgressSchema = createInsertSchema(subjectProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentEvaluationSchema = createInsertSchema(studentEvaluations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeacherAttendanceSchema = createInsertSchema(teacherAttendance).omit({
  id: true,
  createdAt: true,
});

export const insertTeacherSubjectAssignmentSchema = createInsertSchema(teacherSubjectAssignments).omit({
  id: true,
  assignedAt: true,
});

export const insertCurriculumItemSchema = createInsertSchema(curriculumItems).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSubjectEnrollmentSchema = createInsertSchema(studentSubjectEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertMemorizationProgressSchema = createInsertSchema(memorizationProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ProgramType = typeof programTypes.$inferSelect;
export type InsertProgramType = z.infer<typeof insertProgramTypeSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Parent = typeof parents.$inferSelect;
export type InsertParent = z.infer<typeof insertParentSchema>;
export type LessonPlan = typeof lessonPlans.$inferSelect;
export type InsertLessonPlan = z.infer<typeof insertLessonPlanSchema>;
export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Behavior = typeof behavior.$inferSelect;
export type InsertBehavior = z.infer<typeof insertBehaviorSchema>;

export type WeeklyLessonPlan = typeof weeklyLessonPlans.$inferSelect;
export type InsertWeeklyLessonPlan = z.infer<typeof insertWeeklyLessonPlanSchema>;

export type SubjectProgress = typeof subjectProgress.$inferSelect;
export type InsertSubjectProgress = z.infer<typeof insertSubjectProgressSchema>;

export type StudentEvaluation = typeof studentEvaluations.$inferSelect;
export type InsertStudentEvaluation = z.infer<typeof insertStudentEvaluationSchema>;

export type TeacherAttendance = typeof teacherAttendance.$inferSelect;
export type InsertTeacherAttendance = z.infer<typeof insertTeacherAttendanceSchema>;

export type TeacherSubjectAssignment = typeof teacherSubjectAssignments.$inferSelect;
export type InsertTeacherSubjectAssignment = z.infer<typeof insertTeacherSubjectAssignmentSchema>;

export type CurriculumItem = typeof curriculumItems.$inferSelect;
export type InsertCurriculumItem = z.infer<typeof insertCurriculumItemSchema>;

export type StudentSubjectEnrollment = typeof studentSubjectEnrollments.$inferSelect;
export type InsertStudentSubjectEnrollment = z.infer<typeof insertStudentSubjectEnrollmentSchema>;

export type MemorizationProgress = typeof memorizationProgress.$inferSelect;
export type InsertMemorizationProgress = z.infer<typeof insertMemorizationProgressSchema>;

// Extended types for UI
export type StudentWithClass = Student & {
  class: Class & {
    programType: ProgramType;
  };
};

export type StudentWithProgress = Student & {
  class: Class;
  progress: Progress[];
  attendance: Attendance[];
  behavior: Behavior[];
};

export type ParentWithStudent = Parent & {
  user: User;
  student: StudentWithClass;
};

// New extended types
export type TeacherWithAssignments = User & {
  teacherSubjectAssignments: (TeacherSubjectAssignment & {
    class: Class & { programType: ProgramType };
  })[];
  teacherAttendance: TeacherAttendance[];
};

export type StudentWithEnrollments = Student & {
  class: Class & { programType: ProgramType };
  subjectEnrollments: (StudentSubjectEnrollment & {
    teacher: User;
  })[];
  memorizationProgress: MemorizationProgress[];
};

export type CurriculumItemWithDetails = CurriculumItem & {
  programType: ProgramType;
};
