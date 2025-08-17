
import { pgTable, serial, varchar, text, integer, timestamp, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Enums ---
export const roleEnum = pgEnum("role", ["ADMIN", "TEACHER", "PARENT"]);
export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);

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
