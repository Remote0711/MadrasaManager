
import { pgTable, serial, varchar, text, integer, timestamp, pgEnum, primaryKey, boolean, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Enums ---
export const roleEnum = pgEnum("app_role", ["ADMIN", "TEACHER", "PARENT"]);
export const genderEnum = pgEnum("app_gender", ["MALE", "FEMALE"]);

// --- Users (Admins/Teachers/Parents share this) ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: roleEnum("role").notNull(),
  // Contacts (visible for all roles)
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
});

// --- Teacher & Parent profiles (1:1 with users) ---
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
});

export const parents = pgTable("parents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
});

// --- Students ---
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  gender: genderEnum("gender").notNull(),
  organization: varchar("organization", { length: 255 }), // Teşkilat
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  // classId will be added later with FK once classes table exists
  classId: integer("class_id"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
});

// --- Parent ↔ Student (many-to-many) ---
export const studentParents = pgTable(
  "student_parents",
  {
    studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
    parentId: integer("parent_id").notNull().references(() => parents.id, { onDelete: "cascade" }),
    relation: varchar("relation", { length: 50 }), // father, mother, guardian ...
  },
  (t) => ({
    pk: primaryKey({ columns: [t.studentId, t.parentId] }),
  })
);

// --- Optional relations (for type-safety in code) ---
export const usersRelations = relations(users, ({ one }) => ({
  teacher: one(teachers, { fields: [users.id], references: [teachers.userId] }),
  parent: one(parents, { fields: [users.id], references: [parents.userId] }),
}));

// --- Enums for schedule & attendance ---
export const sessionStatusEnum = pgEnum("session_status", ["PLANNED", "HELD", "CANCELLED", "SUBSTITUTED"]);
export const attendanceStatusEnum = pgEnum("attendance_status", ["PRESENT", "ABSENT", "EXCUSED", "LATE"]);

// --- Placeholder for missing tables (will be created later) ---
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const curriculumItems = pgTable("curriculum_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Schedule patterns (weekly templates) ---
export const schedulePatterns = pgTable("schedule_patterns", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  teacherId: integer("teacher_id").references(() => teachers.id, { onDelete: "set null" }),
  weekday: integer("weekday").notNull(),                 // 0..6 (Sun..Sat) or your local convention
  startTimeMin: integer("start_time_min").notNull(),     // minutes from midnight
  durationMin: integer("duration_min").notNull(),        // minutes
  location: varchar("location", { length: 255 }),
  rrule: text("rrule"),                                  // optional iCal rule
  exceptions: json("exceptions"),                        // optional JSON of excluded dates
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Planned sessions (materialized from patterns) ---
export const plannedSessions = pgTable("planned_sessions", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  teacherId: integer("teacher_id").references(() => teachers.id, { onDelete: "set null" }),
  startsAt: timestamp("starts_at", { withTimezone: false }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: false }).notNull(),
  curriculumItemId: integer("curriculum_item_id").references(() => curriculumItems.id, { onDelete: "set null" }),
  status: sessionStatusEnum("status").default("PLANNED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Realized sessions (what actually happened) ---
export const realizedSessions = pgTable("realized_sessions", {
  id: serial("id").primaryKey(),
  plannedId: integer("planned_id").references(() => plannedSessions.id, { onDelete: "set null" }),
  classId: integer("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  teacherId: integer("teacher_id").references(() => teachers.id, { onDelete: "set null" }),
  startsAt: timestamp("starts_at", { withTimezone: false }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: false }).notNull(),
  status: sessionStatusEnum("status").default("HELD").notNull(),
  progressPct: integer("progress_pct"),                  // 0..100
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Substitutions (teacher replacement) ---
export const substitutions = pgTable("substitutions", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => realizedSessions.id, { onDelete: "cascade" }),
  substituteTeacherId: integer("substitute_teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Attendance (unique per student per realized session) ---
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => realizedSessions.id, { onDelete: "cascade" }),
  studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  status: attendanceStatusEnum("status").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  uniq: primaryKey({ columns: [t.sessionId, t.studentId] }), // enforce one row per student+session
}));
