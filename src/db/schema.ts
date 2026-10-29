import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').notNull(), // 'admin' | 'staff'
  department: text('department'),
  designation: text('designation'),
  avatar: text('avatar'),
  status: text('status'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  courseCode: text('course_code').notNull(),
  courseName: text('course_name').notNull(),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  venue: text('venue').notNull(),
  totalStudents: integer('total_students').notNull(),
  chiefInvigilatorId: integer('chief_invigilator_id').references(() => users.id),
  status: text('status').notNull(), // 'Ongoing' | 'Upcoming' | 'Completed'
  department: text('department'),
});

export const invigilationDuties = pgTable('invigilation_duties', {
  id: serial('id').primaryKey(),
  examId: integer('exam_id').references(() => exams.id),
  facultyId: integer('faculty_id').references(() => users.id),
  venue: text('venue').notNull(),
  dutyType: text('duty_type').notNull(),
  checkInStatus: text('check_in_status').notNull(),
  checkInTime: text('check_in_time'),
});

export const sosAlerts = pgTable('sos_alerts', {
  id: serial('id').primaryKey(),
  venue: text('venue').notNull(),
  reportedById: integer('reported_by_id').references(() => users.id),
  alertType: text('alert_type').notNull(),
  description: text('description'),
  timestamp: timestamp('timestamp').defaultNow(),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
});

export const studentRegistrations = pgTable('student_registrations', {
  id: serial('id').primaryKey(),
  examId: integer('exam_id').references(() => exams.id),
  studentId: integer('student_id').references(() => users.id),
  seatNumber: text('seat_number'),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  invigilationDuties: many(invigilationDuties),
  reportedSosAlerts: many(sosAlerts),
  studentRegistrations: many(studentRegistrations),
}));

export const examsRelations = relations(exams, ({ many }) => ({
  invigilationDuties: many(invigilationDuties),
  studentRegistrations: many(studentRegistrations),
}));

export const invigilationDutiesRelations = relations(invigilationDuties, ({ one }) => ({
  exam: one(exams, { fields: [invigilationDuties.examId], references: [exams.id] }),
  faculty: one(users, { fields: [invigilationDuties.facultyId], references: [users.id] }),
}));

export const studentRegistrationsRelations = relations(studentRegistrations, ({ one }) => ({
  exam: one(exams, { fields: [studentRegistrations.examId], references: [exams.id] }),
  student: one(users, { fields: [studentRegistrations.studentId], references: [users.id] }),
}));

export const sosAlertsRelations = relations(sosAlerts, ({ one }) => ({
  reporter: one(users, { fields: [sosAlerts.reportedById], references: [users.id] }),
}));
