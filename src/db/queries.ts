import { db } from './index.ts';
import { eq } from 'drizzle-orm';
import { exams, invigilationDuties, studentRegistrations, users } from './schema.ts';

export async function getExamAttendees(examId: number) {
  const [exam] = await db.select().from(exams).where(eq(exams.id, examId));
  if (!exam) throw new Error('Exam not found');

  const faculty = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      department: users.department,
      dutyType: invigilationDuties.dutyType,
    })
    .from(invigilationDuties)
    .leftJoin(users, eq(invigilationDuties.facultyId, users.id))
    .where(eq(invigilationDuties.examId, examId));

  const students = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      seatNumber: studentRegistrations.seatNumber,
    })
    .from(studentRegistrations)
    .leftJoin(users, eq(studentRegistrations.studentId, users.id))
    .where(eq(studentRegistrations.examId, examId));

  return { exam, faculty, students };
}
