export type UserRole = 'admin' | 'staff';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  avatar: string;
  status: 'online' | 'on_duty' | 'offline';
  isRegistered?: boolean;
}

export interface FacultyMember {
  id: string;
  email: string;
  name: string;
  department: string;
  designation: string;
  role: UserRole;
  employeeId?: string;
  phone?: string;
  registeredBy: string;
  registeredAt: string;
  status: 'active' | 'suspended';
}

export interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  date: string; // YYYY-MM-DD
  timeSlot: 'Morning (09:30 AM - 12:30 PM)' | 'Afternoon (02:00 PM - 05:00 PM)' | 'Evening (06:00 PM - 09:00 PM)';
  durationMinutes: number;
  venue: string; // e.g. "Room 101", "Room 102", "Hall A", "Computer Lab 1"
  totalStudents: number;
  chiefInvigilatorId: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Rescheduled';
  department: string;
}

export interface StudentSeat {
  seatNumber: string; // e.g. "S-101"
  row: number;
  col: number;
  studentId: string;
  studentName: string;
  rollNumber: string;
  branch: string;
  status: 'seated' | 'absent' | 'flagged_malpractice' | 'relocated';
  remarks?: string;
}

export interface RoomLayout {
  venue: string;
  building: string;
  capacity: number;
  rows: number;
  cols: number;
  seats: StudentSeat[];
}

export interface InvigilationDuty {
  id: string;
  examId: string;
  courseCode: string;
  courseName: string;
  venue: string;
  date: string;
  timeSlot: string;
  facultyId: string;
  facultyName: string;
  department: string;
  dutyType: 'Chief Invigilator' | 'Invigilator' | 'Relieving Staff' | 'Flying Squad';
  checkInStatus: 'Pending' | 'Checked-In' | 'Completed' | 'Absent';
  checkInTime?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  timestamp: string;
  attachment?: {
    type: 'image' | 'file' | 'audio';
    url: string;
    name: string;
  };
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'broadcast' | 'room' | 'squad' | 'private';
  description: string;
  unreadCount?: number;
}

export interface SosAlert {
  id: string;
  venue: string;
  reportedBy: string;
  facultyId: string;
  alertType: 'Medical Emergency' | 'Question Paper Issue' | 'Disruptive Behavior' | 'Technical/Power Failure' | 'Other';
  description: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  priority: 'High' | 'Critical' | 'Medium';
}

export interface IncidentReport {
  id: string;
  examId: string;
  courseCode: string;
  venue: string;
  studentRollNumber: string;
  studentName: string;
  reportedBy: string;
  category: 'Malpractice' | 'Late Arrival' | 'Medical' | 'Dispute';
  details: string;
  timestamp: string;
  status: 'Pending Review' | 'Escalated' | 'Resolved';
}
